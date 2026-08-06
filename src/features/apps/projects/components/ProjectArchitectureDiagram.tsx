"use client";

import { useEffect, useId, useRef, useState } from "react";

type ProjectArchitectureDiagramProps = {
  chart: string;
  label: string;
  loadingLabel: string;
  errorLabel: string;
};

let isMermaidInitialized = false;

export function escapeMermaidLabel(label: string) {
  return label.replaceAll('"', "&quot;");
}

export function ProjectArchitectureDiagram({
  chart,
  label,
  loadingLabel,
  errorLabel,
}: ProjectArchitectureDiagramProps) {
  const generatedId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isCancelled = false;
    const container = containerRef.current;

    async function renderDiagram() {
      if (!container) return;

      setStatus("loading");

      try {
        const { default: mermaid } = await import("mermaid");

        if (!isMermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "base",
            themeVariables: {
              background: "#ffffff",
              primaryColor: "#e8f1ff",
              primaryTextColor: "#111827",
              primaryBorderColor: "#2563eb",
              secondaryColor: "#f3f4f6",
              secondaryTextColor: "#374151",
              secondaryBorderColor: "#9ca3af",
              lineColor: "#4b5563",
              fontFamily: "Pretendard, system-ui, sans-serif",
            },
            flowchart: {
              curve: "basis",
              htmlLabels: false,
              useMaxWidth: true,
            },
          });
          isMermaidInitialized = true;
        }

        const renderId = `project-architecture-${generatedId.replaceAll(":", "")}`;
        const { svg, bindFunctions } = await mermaid.render(renderId, chart);

        if (isCancelled) return;

        container.innerHTML = svg;
        bindFunctions?.(container);
        setStatus("ready");
      } catch {
        if (isCancelled) return;
        container.replaceChildren();
        setStatus("error");
      }
    }

    void renderDiagram();

    return () => {
      isCancelled = true;
      container?.replaceChildren();
    };
  }, [chart, generatedId]);

  return (
    <div
      className="overflow-x-auto rounded-xl border border-[var(--application-border)] bg-white p-3 sm:p-5 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:min-w-[42rem]"
    >
      <div
        ref={containerRef}
        role={status === "ready" ? "img" : undefined}
        aria-label={status === "ready" ? label : undefined}
        aria-hidden={status === "ready" ? undefined : "true"}
      />
      {status === "loading" ? (
        <p role="status" className="py-28 text-center text-sm text-slate-600">
          {loadingLabel}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="py-28 text-center text-sm text-slate-600">
          {errorLabel}
        </p>
      ) : null}
    </div>
  );
}
