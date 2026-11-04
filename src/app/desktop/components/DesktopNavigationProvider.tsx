"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import {
    getDesktopLanguageFromPathname,
    parseDesktopUrl,
    serializeDesktopUrl,
} from "@/app/desktop/lib/parseDesktopAppTarget";
import { readDesktopHistoryState } from "@/app/desktop/lib/desktopHistoryState";
import {
    enqueuePendingNavigationEvent,
    hasPendingNavigationTimedOut,
    HISTORY_TRAVERSAL_TIMEOUT_MS,
} from "@/app/desktop/lib/pendingNavigation";
import { syncDesktopMetadata } from "@/app/desktop/lib/syncDesktopMetadata";
import { planNavigation } from "@/app/desktop/lib/planNavigation";
import type {
    DesktopHistoryState,
    PendingNavigation,
    QueuedNavigationEvent,
    StoreCommand,
} from "@/app/desktop/types/navigationTypes";
import {
    selectWorkspaceState,
} from "@/app/desktop/store/desktopStore";
import { useDesktopStoreApi, useDesktopStore, useDesktopInitialView } from "@/app/desktop/store/DesktopStoreProvider";
import {
    patchUiPreferencesCookie,
    readUiPreferencesCookie,
    subscribeUiPreferences,
} from "@/lib/preferences/uiPreferences.client";
import { DesktopNavigationContext } from "@/app/desktop/hooks/useDesktopNavigation";
import { useLanguageStore } from "@/lib/i18n/useLanguageStore";
import type { Language } from "@/lib/i18n/language";

type ExpiredTraversalGuard = {
    entry: DesktopHistoryState;
    expiresAt: number;
};

function mergeHistoryState(entry: DesktopHistoryState): object {
    const currentState =
        typeof window.history.state === "object" &&
        window.history.state !== null
            ? window.history.state
            : {};

    return { ...currentState, ...entry };
}

export function DesktopNavigationProvider({
    children,
    defaultLanguage = "ko",
}: {
    children: ReactNode;
    defaultLanguage?: Language;
}) {
    const store = useDesktopStoreApi();
    const initialView = useDesktopInitialView();
    const urlReady = useDesktopStore((state) => state.urlReady);
    const setGlobalLanguage = useLanguageStore(
        (state) => state.setLanguage,
    );
    const pendingRef = useRef<PendingNavigation | null>(null);
    const expiredIntentRef = useRef<ExpiredTraversalGuard | null>(null);
    const latestEntryRef = useRef<DesktopHistoryState | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const expiredGuardTimerRef = useRef<ReturnType<
        typeof setTimeout
    > | null>(null);
    const sequenceRef = useRef(0);
    const navigateRef = useRef<(event: QueuedNavigationEvent) => void>(
        () => undefined,
    );
    const [navigationBusy, setNavigationBusy] = useState(false);

    const clearPending = useCallback((): PendingNavigation | null => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const pending = pendingRef.current;
        pendingRef.current = null;
        setNavigationBusy(false);
        return pending;
    }, []);

    const clearExpiredGuard = useCallback(() => {
        if (expiredGuardTimerRef.current !== null) {
            clearTimeout(expiredGuardTimerRef.current);
            expiredGuardTimerRef.current = null;
        }

        expiredIntentRef.current = null;
        setNavigationBusy(false);
    }, []);

    const applyNavigationCommands = useCallback(
        (commands: readonly StoreCommand[]) => {
            for (const command of commands) {
                store.getState().dispatch(command);
            }
            queueMicrotask(syncDesktopMetadata);
        },
        [store],
    );

    const replayQueuedEvents = useCallback(
        (events: readonly QueuedNavigationEvent[]) => {
            for (const event of events) {
                navigateRef.current(event);
            }
        },
        [],
    );

    const navigate = useCallback(
        (event: QueuedNavigationEvent) => {
            if (!store.getState().urlReady) return;
            const pending = pendingRef.current;
            if (pending !== null) {
                const result = enqueuePendingNavigationEvent(
                    pending,
                    event,
                );
                pendingRef.current = result.pending;
                setNavigationBusy(result.saturated);
                return;
            }

            const currentStore = store.getState();
            const historyState =
                readDesktopHistoryState(window.history.state) ??
                latestEntryRef.current;
            const plan = planNavigation(
                selectWorkspaceState(currentStore),
                useLanguageStore.getState().currentLanguage,
                event,
                historyState,
            );

            applyNavigationCommands(plan.storeCommands);
            if (plan.languageEffect !== null) {
                setGlobalLanguage(plan.languageEffect);
            }

            switch (plan.historyEffect.type) {
                case "none":
                    return;
                case "push":
                    window.history.pushState(
                        mergeHistoryState(plan.historyEffect.entry),
                        "",
                        plan.historyEffect.url,
                    );
                    latestEntryRef.current = plan.historyEffect.entry;
                    if (expiredIntentRef.current !== null) {
                        expiredIntentRef.current = {
                            ...expiredIntentRef.current,
                            entry: plan.historyEffect.entry,
                        };
                    }
                    return;
                case "replace":
                    window.history.replaceState(
                        mergeHistoryState(plan.historyEffect.entry),
                        "",
                        plan.historyEffect.url,
                    );
                    latestEntryRef.current = plan.historyEffect.entry;
                    if (expiredIntentRef.current !== null) {
                        expiredIntentRef.current = {
                            ...expiredIntentRef.current,
                            entry: plan.historyEffect.entry,
                        };
                    }
                    return;
                case "back": {
                    const backEffect = plan.historyEffect;
                    const sequence = sequenceRef.current + 1;
                    sequenceRef.current = sequence;
                    const pendingNavigation: PendingNavigation = {
                        sequence,
                        expectedEntryId:
                            backEffect.expectedEntryId,
                        startedAt: performance.now(),
                        queuedEvents: [],
                    };
                    pendingRef.current = pendingNavigation;
                    latestEntryRef.current =
                        backEffect.fallbackEntry;

                    timeoutRef.current = setTimeout(() => {
                        const currentPending = pendingRef.current;
                        if (
                            currentPending === null ||
                            currentPending.sequence !== sequence ||
                            !hasPendingNavigationTimedOut(
                                currentPending,
                                performance.now(),
                            )
                        ) {
                            return;
                        }

                        const queuedEvents =
                            clearPending()?.queuedEvents ?? [];
                        window.history.replaceState(
                            mergeHistoryState(
                                backEffect.fallbackEntry,
                            ),
                            "",
                            backEffect.fallbackUrl,
                        );
                        applyNavigationCommands([
                            {
                                type: "apply-url-state",
                                view: backEffect.fallbackEntry.desktop.view,
                            },
                        ]);
                        setGlobalLanguage(backEffect.fallbackEntry.desktop.view.lang);
                        const expiresAt =
                            performance.now() +
                            HISTORY_TRAVERSAL_TIMEOUT_MS;
                        expiredIntentRef.current = {
                            entry: backEffect.fallbackEntry,
                            expiresAt,
                        };
                        setNavigationBusy(true);
                        replayQueuedEvents(queuedEvents);
                        if (latestEntryRef.current !== null) {
                            expiredIntentRef.current = {
                                entry: latestEntryRef.current,
                                expiresAt,
                            };
                        }
                        expiredGuardTimerRef.current = setTimeout(
                            clearExpiredGuard,
                            HISTORY_TRAVERSAL_TIMEOUT_MS,
                        );
                    }, HISTORY_TRAVERSAL_TIMEOUT_MS);

                    window.history.back();
                    return;
                }
            }
        },
        [
            clearPending,
            clearExpiredGuard,
            applyNavigationCommands,
            replayQueuedEvents,
            setGlobalLanguage,
            store,
        ],
    );

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const view = parseDesktopUrl(
            searchParams,
            getDesktopLanguageFromPathname(
                window.location.pathname,
                defaultLanguage,
            ),
        );
        const existingEntry = readDesktopHistoryState(window.history.state);
        const entry: DesktopHistoryState = {
            desktop: {
                entryId: existingEntry?.desktop.entryId ?? "desktop-0",
                view,
                from: existingEntry?.desktop.from ?? null,
            },
        };
        const canonicalUrl = serializeDesktopUrl(view);

        window.history.replaceState(
            mergeHistoryState(entry),
            "",
            canonicalUrl,
        );
        latestEntryRef.current = entry;
        const sameInitialWindow = (initialView.app === "project" &&
            view.app === "project" && initialView.slug === view.slug) ||
            (initialView.app === "projects" && view.app === "projects");
        applyNavigationCommands(sameInitialWindow ? [] : [{ type: "apply-url-state", view }]);
        setGlobalLanguage(view.lang);

        let applyingPreferences = false;
        const unsubscribePreferences = store.subscribe((state, previous) => {
            if (applyingPreferences || (state.wallpaper === previous.wallpaper && state.dockAutoHide === previous.dockAutoHide)) return;
            patchUiPreferencesCookie({
                ...(state.wallpaper !== previous.wallpaper ? { wallpaper: state.wallpaper } : {}),
                ...(state.dockAutoHide !== previous.dockAutoHide ? { dockAutoHide: state.dockAutoHide } : {}),
            });
        });
        const unsubscribeCookie = subscribeUiPreferences(() => {
            const preferences = readUiPreferencesCookie();
            if (!preferences) return;
            // Apply both fields without persisting an intermediate state over the cookie.
            applyingPreferences = true;
            if (store.getState().wallpaper !== preferences.wallpaper) store.getState().dispatch({ type: "change-wallpaper", wallpaper: preferences.wallpaper });
            if (store.getState().dockAutoHide !== preferences.dockAutoHide) store.getState().dispatch({ type: "change-dock-auto-hide", enabled: preferences.dockAutoHide });
            applyingPreferences = false;
        });

        const handlePopState = (popStateEvent: PopStateEvent) => {
            const expiredGuard = expiredIntentRef.current;
            if (
                expiredGuard !== null &&
                performance.now() <= expiredGuard.expiresAt
            ) {
                const expiredIntent = expiredGuard.entry;
                clearExpiredGuard();
                window.history.replaceState(
                    mergeHistoryState(expiredIntent),
                    "",
                    serializeDesktopUrl(expiredIntent.desktop.view),
                );
                applyNavigationCommands([
                    {
                        type: "apply-url-state",
                        view: expiredIntent.desktop.view,
                    },
                ]);
                setGlobalLanguage(expiredIntent.desktop.view.lang);
                latestEntryRef.current = expiredIntent;
                return;
            }

            if (expiredGuard !== null) {
                clearExpiredGuard();
            }

            const pending = clearPending();
            const nextView = parseDesktopUrl(
                new URLSearchParams(window.location.search),
                getDesktopLanguageFromPathname(
                    window.location.pathname,
                    defaultLanguage,
                ),
            );
            const nextEntry =
                readDesktopHistoryState(popStateEvent.state) ?? {
                    desktop: {
                        entryId: `desktop-pop-${sequenceRef.current}`,
                        view: nextView,
                        from: null,
                    },
                };
            const plan = planNavigation(
                selectWorkspaceState(store.getState()),
                useLanguageStore.getState().currentLanguage,
                {
                    type: "popstate",
                    entry: nextEntry,
                    view: nextView,
                },
                nextEntry,
            );

            applyNavigationCommands(plan.storeCommands);
            if (plan.languageEffect !== null) {
                setGlobalLanguage(plan.languageEffect);
            }
            latestEntryRef.current = nextEntry;
            replayQueuedEvents(pending?.queuedEvents ?? []);
        };

        const handlePageHide = () => {
            clearPending();
            clearExpiredGuard();
        };

        const handlePageShow = (event: PageTransitionEvent) => {
            if (!event.persisted) {
                return;
            }

            const restoredView = parseDesktopUrl(
                new URLSearchParams(window.location.search),
                getDesktopLanguageFromPathname(
                    window.location.pathname,
                    defaultLanguage,
                ),
            );
            const historyEntry = readDesktopHistoryState(
                window.history.state,
            );
            const restoredEntry: DesktopHistoryState = {
                desktop: {
                    entryId:
                        historyEntry?.desktop.entryId ??
                        `desktop-bfcache-${sequenceRef.current}`,
                    view: restoredView,
                    from: historyEntry?.desktop.from ?? null,
                },
            };
            const canonicalUrl = serializeDesktopUrl(restoredView);
            const currentUrl = `${window.location.pathname}${window.location.search}`;

            if (currentUrl !== canonicalUrl) {
                window.history.replaceState(
                    mergeHistoryState(restoredEntry),
                    "",
                    canonicalUrl,
                );
            }

            applyNavigationCommands([
                {
                    type: "apply-url-state",
                    view: restoredView,
                },
            ]);
            setGlobalLanguage(restoredView.lang);
            latestEntryRef.current = restoredEntry;
        };

        window.addEventListener("popstate", handlePopState);
        window.addEventListener("pagehide", handlePageHide);
        window.addEventListener("pageshow", handlePageShow);
        store.getState().setUrlReady(true);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("pageshow", handlePageShow);
            unsubscribePreferences();
            unsubscribeCookie();
            clearPending();
            clearExpiredGuard();
        };
    }, [
        clearPending,
        clearExpiredGuard,
        applyNavigationCommands,
        replayQueuedEvents,
        setGlobalLanguage,
        store,
        defaultLanguage,
        initialView,
    ]);

    return (
        <DesktopNavigationContext.Provider
            value={{ navigate, navigationBusy: navigationBusy || !urlReady }}
        >
            {children}
        </DesktopNavigationContext.Provider>
    );
}
