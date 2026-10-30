"use client";

import { useEffect, useId, useState } from "react";
import { ImagePreview, type OpenImageViewer } from "@/components/ui/ImageViewer";
import type { Language } from "@/lib/i18n/language";

type ProjectArchitectureDiagramProps = {
  chart: string;
  label: string;
  loadingLabel: string;
  errorLabel: string;
  wide?: boolean;
  scrollable?: boolean;
  scrollLabel?: string;
  openImage: OpenImageViewer;
  language: Language;
};

let isMermaidInitialized = false;

export function ProjectArchitectureDiagram({
  chart,
  label,
  loadingLabel,
  errorLabel,
  wide = false,
  scrollable = false,
  scrollLabel,
  openImage,
  language,
}: ProjectArchitectureDiagramProps) {
  const generatedId = useId();
  const [imageSrc, setImageSrc] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isCancelled = false;
    async function renderDiagram() {
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
              useMaxWidth: false,
            },
          });
          isMermaidInitialized = true;
        }

        const renderId = `project-architecture-${generatedId.replaceAll(":", "")}`;
        const { svg } = await mermaid.render(renderId, chart);

        if (isCancelled) return;

        setImageSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
        setStatus("ready");
      } catch {
        if (isCancelled) return;
        setStatus("error");
      }
    }

    void renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [chart, generatedId]);

  return (
    <div
      role={scrollable ? "region" : undefined}
      aria-label={scrollable ? scrollLabel : undefined}
      tabIndex={scrollable ? 0 : undefined}
      className={`mx-auto overflow-x-auto p-1 ${wide ? "max-w-none" : "max-w-[30rem]"}`}
    >
      {status === "ready" ? (
        <ImagePreview
          image={{ src: imageSrc, alt: label }}
          openImage={openImage}
          language={language}
          className={wide ? "min-w-[58rem]" : "min-w-[26rem]"}
        />
      ) : null}
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
