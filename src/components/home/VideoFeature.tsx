"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

type ActivationState = "idle" | "auto" | "manual";

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const autoPlayUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;

  // IO 门控：视频区域进入视口时自动挂载播放 iframe；activated 为单向锁，触发后不再回退
  const [activated, setActivated] = useState<ActivationState>("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activated !== "idle") return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivated((prev) => (prev === "idle" ? "auto" : prev));
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [activated]);

  return (
    <div className="space-y-4" data-video-activated={activated}>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg"
        style={{ paddingBottom: "56.25%" }}
      >
        {activated === "idle" ? (
          <>
            <img
              src={posterUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[hsl(var(--nav-background)/0.35)]" />
            {/* 点击播放按钮（IO 自动播放的后备入口） */}
            <button
              type="button"
              onClick={() => setActivated("manual")}
              aria-label={`Play ${title}`}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center
                         rounded-full bg-[hsl(var(--nav-theme))] shadow-lg shadow-[hsl(var(--nav-theme)/0.4)]
                         transition-transform hover:scale-105 hover:bg-[hsl(var(--nav-theme)/0.9)] md:h-20 md:w-20"
            >
              <Play className="ml-1 h-7 w-7 text-white md:h-8 md:w-8" fill="currentColor" />
            </button>
          </>
        ) : (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={autoPlayUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
