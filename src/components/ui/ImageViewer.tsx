"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";
import type { Language } from "@/lib/i18n/language";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export type ViewerImage = {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  description?: string;
};

function ImageElement({ image, className }: { image: ViewerImage; className: string }) {
  if (image.width && image.height) {
    return <Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized draggable={false} className={className} />;
  }
  // Markdown images may omit dimensions; the browser uses their intrinsic size.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image.src} alt={image.alt} draggable={false} className={className} />;
}

export type OpenImageViewer = (image: ViewerImage, opener: HTMLButtonElement) => void;

export function ImagePreview({ image, openImage, language, className = "" }: {
  image: ViewerImage;
  openImage: OpenImageViewer;
  language: Language;
  className?: string;
}) {
  const descriptionId = useId();
  const label = language === "ko" ? "이미지 크게 보기" : "View larger image";
  const title = image.title || image.alt;

  return (
    <>
      <button
        type="button"
        aria-label={title ? `${label}: ${title}` : label}
        aria-haspopup="dialog"
        aria-describedby={image.description ? descriptionId : undefined}
        onClick={(event) => openImage(image, event.currentTarget)}
        className={`block w-full cursor-zoom-in overflow-hidden rounded-xl border border-[var(--application-border)] bg-[#fff] p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--application-accent)] ${className}`}
      >
        <ImageElement image={image} className="h-auto w-full" />
      </button>
      {image.description ? <span id={descriptionId} className="sr-only top-0">{image.description}</span> : null}
    </>
  );
}

export function ImageViewer({ language, children }: {
  language: Language;
  children: (openImage: OpenImageViewer) => ReactNode;
}) {
  const [preview, setPreview] = useState<(ViewerImage & { opener: HTMLButtonElement }) | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageId = useId();
  const labels = language === "ko"
    ? { close: "확대 이미지 닫기", zoomIn: "확대", zoomOut: "축소" }
    : { close: "Close enlarged image", zoomIn: "Zoom in", zoomOut: "Zoom out" };
  const isPreviewOpen = preview !== null;
  const openImage = useCallback<OpenImageViewer>((image, opener) => {
    setPreview({ ...image, opener });
  }, []);

  useEffect(() => {
    if (!preview) return;

    const opener = preview.opener;
    closeButtonRef.current?.focus();
    return () => opener?.focus({ preventScroll: true });
  }, [preview]);

  return (
    <div className="relative h-full w-full">
      <div className="h-full" inert={isPreviewOpen || undefined}>
        {children(openImage)}
      </div>
      {preview ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={preview.title ?? preview.alt}
          aria-describedby={preview.description ? `${imageId}-preview-description` : undefined}
          className="absolute inset-0 z-10 flex flex-col gap-3 overflow-hidden bg-black/85 p-4 text-white [&_button]:flex [&_button]:size-12 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-md [&_button]:bg-black/70 [&_button:hover]:bg-white/20 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-white"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPreview(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              setPreview(null);
            } else if (event.key === "Tab") {
              const controls = Array.from(
                event.currentTarget.querySelectorAll<HTMLElement>("button, [tabindex='0']"),
              );
              const first = controls[0];
              const last = controls[controls.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }
          }}
        >
          <TransformWrapper minScale={1} maxScale={6} keyboard={{ disabled: false }}>
            {({ zoomIn, zoomOut }) => (
              <>
                <div className="flex shrink-0 justify-end gap-1">
                  <button
                    type="button"
                    aria-label={labels.zoomOut}
                    onClick={() => zoomOut(1)}
                  >
                    <Minus size={22} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={labels.zoomIn}
                    onClick={() => zoomIn(1)}
                  >
                    <Plus size={22} aria-hidden="true" />
                  </button>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label={labels.close}
                    onClick={() => setPreview(null)}
                  >
                    <X size={22} aria-hidden="true" />
                  </button>
                </div>
                <div className="min-h-0 flex-1">
                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    wrapperClass="cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
                    wrapperProps={{ role: "group", "aria-label": preview.alt }}
                  >
                    <ImageElement
                      image={preview}
                      className="h-auto max-h-full w-auto max-w-full select-none bg-[#fff]"
                    />
                  </TransformComponent>
                </div>
              </>
            )}
          </TransformWrapper>
          <p id={`${imageId}-preview-description`} className="sr-only top-0">
            {preview.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}
