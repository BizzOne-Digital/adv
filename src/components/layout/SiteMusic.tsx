"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Zen Rhythms — Bamboo water fountain and relaxing piano (YouTube Shorts) */
const VIDEO_ID = "7An_TOv1R_0";
const STORAGE_KEY = "cafbex-site-music-muted";

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (e: { target: YtPlayer }) => void;
            onStateChange?: (e: { data: number; target: YtPlayer }) => void;
          };
        },
      ) => YtPlayer;
      PlayerState: { ENDED: number; PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YtPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
  destroy: () => void;
};

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

export function SiteMusic() {
  const playerRef = useRef<YtPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const startMuted = saved === "1";

    void loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player("cafbex-site-music", {
        videoId: VIDEO_ID,
        width: 1,
        height: 1,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: VIDEO_ID,
          mute: startMuted ? 1 : 0,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            setReady(true);
            setMuted(startMuted);
            try {
              if (startMuted) e.target.mute();
              else e.target.unMute();
              e.target.playVideo();
              // Browsers often block unmuted autoplay — detect shortly after
              window.setTimeout(() => {
                if (cancelled) return;
                const state = e.target.getPlayerState();
                if (state !== 1) {
                  setNeedsGesture(true);
                  setPlaying(false);
                } else {
                  setPlaying(true);
                  setNeedsGesture(false);
                }
              }, 800);
            } catch {
              setNeedsGesture(true);
            }
          },
          onStateChange: (e) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (e.data === 1) {
              setPlaying(true);
              setNeedsGesture(false);
            } else if (e.data === 2) {
              setPlaying(false);
            } else if (e.data === 0) {
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, []);

  const ensurePlaying = () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      player.playVideo();
      setPlaying(true);
      setNeedsGesture(false);
    } catch {
      setNeedsGesture(true);
    }
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    ensurePlaying();
    if (player.isMuted() || muted) {
      player.unMute();
      setMuted(false);
      sessionStorage.setItem(STORAGE_KEY, "0");
    } else {
      player.mute();
      setMuted(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  };

  // First tap anywhere unlocks autoplay when browser blocked it
  useEffect(() => {
    if (!needsGesture || !ready) return;
    const unlock = () => {
      ensurePlaying();
      if (!muted) {
        try {
          playerRef.current?.unMute();
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [needsGesture, ready, muted]);

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden opacity-0" aria-hidden>
        <div id="cafbex-site-music" />
      </div>

      <button
        type="button"
        onClick={toggleMute}
        className={cn(
          "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-[60]",
          "inline-flex h-11 items-center gap-2 rounded-full border border-forest/15 bg-white/95 px-3.5 text-xs font-semibold uppercase tracking-wider text-forest shadow-lg shadow-forest/10 backdrop-blur-md transition",
          "hover:border-agri/40 hover:bg-white touch-manipulation",
        )}
        aria-label={muted || needsGesture ? "Play site music" : "Mute site music"}
        title={needsGesture ? "Tap to play music" : muted ? "Unmute music" : "Mute music"}
      >
        {muted || needsGesture ? (
          <VolumeX className="h-4 w-4 text-agri" aria-hidden />
        ) : (
          <Volume2 className="h-4 w-4 text-agri" aria-hidden />
        )}
        <span className="hidden sm:inline">
          {needsGesture ? "Play music" : muted ? "Music off" : "Music on"}
        </span>
      </button>
    </>
  );
}

export default SiteMusic;
