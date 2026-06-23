"use client";

import {
    Component,
    type ReactNode,
} from "react";
import type { GuiAppId } from "@/features/gui-v2/apps/appTypes";

const buildId =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "local";

export function isChunkLoadFailure(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    return /chunk|dynamically imported module|loading css/i.test(
        `${error.name} ${error.message}`,
    );
}

export function getChunkRetryKey(
    appId: GuiAppId,
    canonicalUrl: string,
): string {
    return `gui-v2:chunk-retry:${buildId}:${appId}:${canonicalUrl}`;
}

type WindowErrorBoundaryProps = {
    appId: GuiAppId;
    children: ReactNode;
};

type WindowErrorBoundaryState = {
    error: Error | null;
    retrySequence: number;
};

export class WindowErrorBoundary extends Component<
    WindowErrorBoundaryProps,
    WindowErrorBoundaryState
> {
    state: WindowErrorBoundaryState = {
        error: null,
        retrySequence: 0,
    };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error) {
        if (!isChunkLoadFailure(error)) {
            return;
        }

        const canonicalUrl = `${window.location.pathname}${window.location.search}`;
        const retryKey = getChunkRetryKey(
            this.props.appId,
            canonicalUrl,
        );

        if (window.sessionStorage.getItem(retryKey) === null) {
            window.sessionStorage.setItem(retryKey, "1");
            window.location.reload();
        }
    }

    componentDidMount() {
        window.setTimeout(() => {
            const canonicalUrl = `${window.location.pathname}${window.location.search}`;
            window.sessionStorage.removeItem(
                getChunkRetryKey(this.props.appId, canonicalUrl),
            );
        }, 10_000);
    }

    private retry = () => {
        this.setState((state) => ({
            error: null,
            retrySequence: state.retrySequence + 1,
        }));
    };

    render() {
        if (this.state.error !== null) {
            return (
                <div role="alert" className="gui-v2-window-error">
                    <strong>Unable to open this window.</strong>
                    <p>{this.state.error.message}</p>
                    <div>
                        <button type="button" onClick={this.retry}>
                            Retry
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div key={this.state.retrySequence}>
                {this.props.children}
            </div>
        );
    }
}
