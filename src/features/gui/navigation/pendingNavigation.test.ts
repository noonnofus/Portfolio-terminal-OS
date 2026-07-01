import { describe, expect, it } from "vitest";
import {
    enqueuePendingNavigationEvent,
    hasPendingNavigationTimedOut,
    HISTORY_TRAVERSAL_TIMEOUT_MS,
    MAX_PENDING_NAVIGATION_EVENTS,
} from "@/features/gui/navigation/pendingNavigation";
import type { PendingNavigation } from "@/features/gui/navigation/navigationTypes";

function createPending(): PendingNavigation {
    return {
        sequence: 1,
        expectedEntryId: "gui-0",
        startedAt: 100,
        queuedEvents: [],
    };
}

describe("pending navigation protocol", () => {
    it("keeps only the latest user-selected view and language", () => {
        let result = enqueuePendingNavigationEvent(createPending(), {
            type: "open-app",
            appId: "about",
            params: {},
        });
        result = enqueuePendingNavigationEvent(result.pending, {
            type: "open-app",
            appId: "projects",
            params: {},
        });
        result = enqueuePendingNavigationEvent(result.pending, {
            type: "change-language",
            language: "ko",
        });
        result = enqueuePendingNavigationEvent(result.pending, {
            type: "change-language",
            language: "en",
        });

        expect(result.pending.queuedEvents).toEqual([
            { type: "open-app", appId: "projects", params: {} },
            { type: "change-language", language: "en" },
        ]);
    });

    it("coalesces close and minimize for the same window", () => {
        const minimized = enqueuePendingNavigationEvent(createPending(), {
            type: "minimize-window",
            windowId: "terminal",
        });
        const closed = enqueuePendingNavigationEvent(minimized.pending, {
            type: "close-window",
            windowId: "terminal",
        });

        expect(closed.pending.queuedEvents).toEqual([
            { type: "close-window", windowId: "terminal" },
        ]);
    });

    it("signals saturation at the bounded queue size", () => {
        const pending: PendingNavigation = {
            ...createPending(),
            queuedEvents: Array.from(
                { length: MAX_PENDING_NAVIGATION_EVENTS },
                () => ({ type: "show-desktop" }) as const,
            ),
        };
        const result = enqueuePendingNavigationEvent(pending, {
            type: "change-language",
            language: "en",
        });

        expect(result.saturated).toBe(true);
        expect(result.pending).toBe(pending);
    });

    it("uses the explicit traversal timeout", () => {
        const pending = createPending();

        expect(
            hasPendingNavigationTimedOut(
                pending,
                pending.startedAt + HISTORY_TRAVERSAL_TIMEOUT_MS - 1,
            ),
        ).toBe(false);
        expect(
            hasPendingNavigationTimedOut(
                pending,
                pending.startedAt + HISTORY_TRAVERSAL_TIMEOUT_MS,
            ),
        ).toBe(true);
    });
});
