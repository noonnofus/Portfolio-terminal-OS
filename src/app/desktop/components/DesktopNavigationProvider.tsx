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
import { useDesktopStoreApi } from "@/app/desktop/store/DesktopStoreProvider";
import {
    readDesktopPreferences,
    writeDesktopPreferences,
} from "@/app/desktop/store/desktopPreferences";
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

    const executeStoreCommands = useCallback(
        (commands: readonly StoreCommand[]) => {
            for (const command of commands) {
                store.getState().dispatch(command);
            }
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

            executeStoreCommands(plan.storeCommands);
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
                        executeStoreCommands([
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
            executeStoreCommands,
            replayQueuedEvents,
            setGlobalLanguage,
            store,
        ],
    );

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    useEffect(() => {
        const preferences = readDesktopPreferences(window.localStorage);
        if (preferences !== null) {
            store.getState().dispatch({
                type: "change-wallpaper",
                wallpaper: preferences.wallpaper,
            });
            store.getState().dispatch({
                type: "change-dock-auto-hide",
                enabled: preferences.dockAutoHide,
            });
        }

        const searchParams = new URLSearchParams(window.location.search);
        if (
            defaultLanguage === "ko" &&
            !searchParams.has("lang") &&
            preferences !== null
        ) {
            searchParams.set("lang", preferences.language);
        }
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
        executeStoreCommands([{ type: "apply-url-state", view }]);
        setGlobalLanguage(view.lang);
        store.getState().setUrlReady(true);

        const persistPreferences = () => {
            const state = store.getState();
            writeDesktopPreferences(window.localStorage, {
                language: useLanguageStore.getState().currentLanguage,
                wallpaper: state.wallpaper,
                dockAutoHide: state.dockAutoHide,
            });
        };
        persistPreferences();
        const unsubscribePreferences = store.subscribe(persistPreferences);
        const unsubscribeLanguage = useLanguageStore.subscribe(
            persistPreferences,
        );

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
                executeStoreCommands([
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

            executeStoreCommands(plan.storeCommands);
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

            executeStoreCommands([
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

        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("pageshow", handlePageShow);
            unsubscribePreferences();
            unsubscribeLanguage();
            clearPending();
            clearExpiredGuard();
        };
    }, [
        clearPending,
        clearExpiredGuard,
        executeStoreCommands,
        replayQueuedEvents,
        setGlobalLanguage,
        store,
        defaultLanguage,
    ]);

    return (
        <DesktopNavigationContext.Provider
            value={{ navigate, navigationBusy }}
        >
            {children}
        </DesktopNavigationContext.Provider>
    );
}
