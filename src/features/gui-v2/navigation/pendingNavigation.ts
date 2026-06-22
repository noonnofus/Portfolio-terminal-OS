import type {
    PendingNavigation,
    QueuedNavigationEvent,
} from "@/features/gui-v2/navigation/navigationTypes";

export const HISTORY_TRAVERSAL_TIMEOUT_MS = 1_000;
export const MAX_PENDING_NAVIGATION_EVENTS = 16;

export type EnqueuePendingResult = {
    pending: PendingNavigation;
    saturated: boolean;
};

function isViewSelectionEvent(event: QueuedNavigationEvent): boolean {
    return event.type === "open-app" || event.type === "show-desktop";
}

function coalesceEvents(
    events: readonly QueuedNavigationEvent[],
    nextEvent: QueuedNavigationEvent,
): QueuedNavigationEvent[] {
    if (isViewSelectionEvent(nextEvent)) {
        return [
            ...events.filter((event) => !isViewSelectionEvent(event)),
            nextEvent,
        ];
    }

    if (nextEvent.type === "change-language") {
        return [
            ...events.filter((event) => event.type !== "change-language"),
            nextEvent,
        ];
    }

    if (
        nextEvent.type === "close-window" ||
        nextEvent.type === "minimize-window"
    ) {
        return [
            ...events.filter(
                (event) =>
                    !(
                        (event.type === "close-window" ||
                            event.type === "minimize-window") &&
                        event.windowId === nextEvent.windowId
                    ),
            ),
            nextEvent,
        ];
    }

    return [...events, nextEvent];
}

export function enqueuePendingNavigationEvent(
    pending: PendingNavigation,
    event: QueuedNavigationEvent,
): EnqueuePendingResult {
    const queuedEvents = coalesceEvents(pending.queuedEvents, event);

    if (queuedEvents.length > MAX_PENDING_NAVIGATION_EVENTS) {
        return { pending, saturated: true };
    }

    return {
        pending: {
            ...pending,
            queuedEvents,
        },
        saturated:
            queuedEvents.length === MAX_PENDING_NAVIGATION_EVENTS,
    };
}

export function hasPendingNavigationTimedOut(
    pending: PendingNavigation,
    now: number,
): boolean {
    return now - pending.startedAt >= HISTORY_TRAVERSAL_TIMEOUT_MS;
}
