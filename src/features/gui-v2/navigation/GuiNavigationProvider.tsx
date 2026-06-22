"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import {
    isProjectSlug,
    type GuiUrlState,
} from "@/features/gui-v2/apps/appTypes";
import {
    parseGuiUrl,
    serializeGuiUrl,
} from "@/features/gui-v2/apps/parseGuiAppTarget";
import {
    enqueuePendingNavigationEvent,
    hasPendingNavigationTimedOut,
    HISTORY_TRAVERSAL_TIMEOUT_MS,
} from "@/features/gui-v2/navigation/pendingNavigation";
import { planNavigation } from "@/features/gui-v2/navigation/planNavigation";
import type {
    GuiHistoryState,
    PendingNavigation,
    QueuedNavigationEvent,
    StoreCommand,
} from "@/features/gui-v2/navigation/navigationTypes";
import {
    selectWorkspaceState,
} from "@/features/gui-v2/store/guiV2Store";
import { useGuiV2StoreApi } from "@/features/gui-v2/store/GuiV2StoreProvider";
import { useLanguageStore } from "@/shared/lib/i18n/useLanguageStore";

type GuiNavigationContextValue = {
    navigate: (event: QueuedNavigationEvent) => void;
    navigationBusy: boolean;
};

type ExpiredTraversalGuard = {
    entry: GuiHistoryState;
    expiresAt: number;
};

const GuiNavigationContext =
    createContext<GuiNavigationContextValue | null>(null);

function isGuiUrlState(value: unknown): value is GuiUrlState {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const app = Reflect.get(value, "app");
    const lang = Reflect.get(value, "lang");

    if (lang !== "ko" && lang !== "en") {
        return false;
    }

    if (app === "project") {
        const slug = Reflect.get(value, "slug");
        return typeof slug === "string" && isProjectSlug(slug);
    }

    return (
        app === "about" ||
        app === "projects" ||
        app === "resume" ||
        app === "terminal" ||
        app === "contact" ||
        app === "desktop"
    );
}

function readGuiHistoryState(value: unknown): GuiHistoryState | null {
    if (typeof value !== "object" || value === null) {
        return null;
    }

    const gui = Reflect.get(value, "gui");
    if (typeof gui !== "object" || gui === null) {
        return null;
    }

    const entryId = Reflect.get(gui, "entryId");
    const view = Reflect.get(gui, "view");
    const from = Reflect.get(gui, "from");

    if (
        typeof entryId !== "string" ||
        !isGuiUrlState(view) ||
        (from !== null && !isGuiUrlState(from))
    ) {
        return null;
    }

    return {
        gui: {
            entryId,
            view,
            from,
        },
    };
}

function mergeHistoryState(entry: GuiHistoryState): object {
    const currentState =
        typeof window.history.state === "object" &&
        window.history.state !== null
            ? window.history.state
            : {};

    return { ...currentState, ...entry };
}

export function GuiNavigationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const store = useGuiV2StoreApi();
    const setGlobalLanguage = useLanguageStore(
        (state) => state.setLanguage,
    );
    const pendingRef = useRef<PendingNavigation | null>(null);
    const expiredIntentRef = useRef<ExpiredTraversalGuard | null>(null);
    const latestEntryRef = useRef<GuiHistoryState | null>(null);
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

                if (command.type === "change-language") {
                    setGlobalLanguage(command.language);
                }

                if (command.type === "apply-url-state") {
                    setGlobalLanguage(command.view.lang);
                }
            }
        },
        [setGlobalLanguage, store],
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
                readGuiHistoryState(window.history.state) ??
                latestEntryRef.current;
            const plan = planNavigation(
                selectWorkspaceState(currentStore),
                event,
                historyState,
            );

            executeStoreCommands(plan.storeCommands);

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
                                view: backEffect.fallbackEntry.gui.view,
                            },
                        ]);
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
            store,
        ],
    );

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    useEffect(() => {
        const urlBasePath = store.getState().urlBasePath;
        const view = parseGuiUrl(
            new URLSearchParams(window.location.search),
        );
        const existingEntry = readGuiHistoryState(window.history.state);
        const entry: GuiHistoryState = {
            gui: {
                entryId: existingEntry?.gui.entryId ?? "gui-0",
                view,
                from: existingEntry?.gui.from ?? null,
            },
        };
        const canonicalUrl = serializeGuiUrl(view, urlBasePath);

        window.history.replaceState(
            mergeHistoryState(entry),
            "",
            canonicalUrl,
        );
        latestEntryRef.current = entry;
        executeStoreCommands([{ type: "apply-url-state", view }]);
        store.getState().setUrlReady(true);

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
                    serializeGuiUrl(
                        expiredIntent.gui.view,
                        store.getState().urlBasePath,
                    ),
                );
                executeStoreCommands([
                    {
                        type: "apply-url-state",
                        view: expiredIntent.gui.view,
                    },
                ]);
                latestEntryRef.current = expiredIntent;
                return;
            }

            if (expiredGuard !== null) {
                clearExpiredGuard();
            }

            const pending = clearPending();
            const nextView = parseGuiUrl(
                new URLSearchParams(window.location.search),
            );
            const nextEntry =
                readGuiHistoryState(popStateEvent.state) ?? {
                    gui: {
                        entryId: `gui-pop-${sequenceRef.current}`,
                        view: nextView,
                        from: null,
                    },
                };
            const plan = planNavigation(
                selectWorkspaceState(store.getState()),
                {
                    type: "popstate",
                    entry: nextEntry,
                    view: nextView,
                },
                nextEntry,
            );

            executeStoreCommands(plan.storeCommands);
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

            const restoredView = parseGuiUrl(
                new URLSearchParams(window.location.search),
            );
            const historyEntry = readGuiHistoryState(
                window.history.state,
            );
            const restoredEntry: GuiHistoryState = {
                gui: {
                    entryId:
                        historyEntry?.gui.entryId ??
                        `gui-bfcache-${sequenceRef.current}`,
                    view: restoredView,
                    from: historyEntry?.gui.from ?? null,
                },
            };
            const canonicalUrl = serializeGuiUrl(
                restoredView,
                store.getState().urlBasePath,
            );
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
            latestEntryRef.current = restoredEntry;
        };

        window.addEventListener("popstate", handlePopState);
        window.addEventListener("pagehide", handlePageHide);
        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("pageshow", handlePageShow);
            clearPending();
            clearExpiredGuard();
        };
    }, [
        clearPending,
        clearExpiredGuard,
        executeStoreCommands,
        replayQueuedEvents,
        store,
    ]);

    return (
        <GuiNavigationContext.Provider
            value={{ navigate, navigationBusy }}
        >
            {children}
        </GuiNavigationContext.Provider>
    );
}

export function useGuiNavigation(): GuiNavigationContextValue {
    const value = useContext(GuiNavigationContext);

    if (value === null) {
        throw new Error("GuiNavigationProvider is missing.");
    }

    return value;
}
