"use client";

// FvP VSL oynatıcı — kendi arayüzümüz (markasız) + time-on-brand ölçümü.
// Mert /kocluk LiteYouTube deseninin FvP'ye uyarlaması, ama amaç TERS:
// hızlı dönüşüm değil, videoda MÜMKÜN OLDUĞUNCA UZUN tutmak.
//
// - Facade: açılışta YouTube'dan hiçbir şey inmez → LCP korunur (poster LCP elemanı).
// - Autoplay sessiz (tarayıcı zorunluluğu) → ortada "Sesi Aç" katmanı.
// - controls=0 + kendi çubuğumuz → YouTube markası mümkün olduğunca gizli.
// - Milestone'lar bir kez tetiklenir (dakika + yüzde) → track() ile GA4/dataLayer.

import { useCallback, useEffect, useRef, useState } from "react";
import { track, trackServer } from "@/lib/tracking";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  seekTo: (s: number, allow: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: unknown) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YouTube IFrame API'yi bir kez yükle (birden çok oynatıcı olsa da tek istek)
let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

// Dakika taşları — 26:57'lik video için. Yüzdeler ayrı hesaplanır.
const MINUTE_MARKS = [1, 3, 5, 10, 15, 20] as const;
const PERCENT_MARKS = [25, 50, 75, 100] as const;

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function VslPlayer({
  videoId,
  poster,
  autoplay = true,
  onMilestone,
}: {
  videoId: string;
  poster?: string;
  autoplay?: boolean;
  /** Her milestone tetiklendiğinde çağrılır (ör. "vsl_min5" → CTA aç). Bir kez/olay. */
  onMilestone?: (name: string) => void;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const pollRef = useRef<number | null>(null);

  const [started, setStarted] = useState(false); // facade açıldı mı
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const posterUrl = poster || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  // Her milestone bir kez → hem reklam pixel'i (GA4/Meta) hem first-party (Supabase)
  const fire = useCallback((name: string, extra?: Record<string, unknown>) => {
    if (firedRef.current.has(name)) return;
    firedRef.current.add(name);
    track(name, { location: "vsl", video: videoId, ...extra });
    trackServer(name, { video: videoId, meta: extra });
    onMilestone?.(name);
  }, [videoId, onMilestone]);

  // İzleme ilerlemesini yokla → progress bar + milestone
  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const t = p.getCurrentTime?.() || 0;
      const d = p.getDuration?.() || 0;
      setCur(t);
      if (d && d !== dur) setDur(d);
      MINUTE_MARKS.forEach((m) => {
        if (t >= m * 60) fire(`vsl_min${m}`);
      });
      if (d > 0) {
        PERCENT_MARKS.forEach((m) => {
          if ((t / d) * 100 >= m) fire(`vsl_${m}`);
        });
      }
    }, 1000);
  }, [dur, fire]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // Oynatıcıyı kur
  const boot = useCallback(async () => {
    setStarted(true);
    await loadYouTubeApi();
    if (!holderRef.current || !window.YT) return;
    const el = document.createElement("div");
    holderRef.current.appendChild(el);
    playerRef.current = new window.YT.Player(el, {
      videoId,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        mute: autoplay ? 1 : 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        playsinline: 1,
        cc_load_policy: 0,
      },
      events: {
        onReady: (e: { target: YTPlayer }) => {
          const p = e.target;
          setDur(p.getDuration?.() || 0);
          if (autoplay) {
            p.mute();
            setMuted(true);
            fire("vsl_autoplay");
          }
          p.playVideo();
          startPolling();
        },
        onStateChange: (e: { data: number }) => {
          const YT = window.YT!;
          if (e.data === YT.PlayerState.PLAYING) {
            setPlaying(true);
            fire("vsl_play");
            startPolling();
          } else if (e.data === YT.PlayerState.PAUSED) {
            setPlaying(false);
          } else if (e.data === YT.PlayerState.ENDED) {
            setPlaying(false);
            fire("vsl_100");
          }
        },
      },
    });
  }, [autoplay, fire, startPolling, videoId]);

  // autoplay modunda mount'ta boş zamanda yükle (poster LCP kalsın)
  useEffect(() => {
    if (!autoplay) return;
    fire("vsl_view");
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    const idle = w.requestIdleCallback;
    if (idle) idle(() => boot());
    else setTimeout(() => boot(), 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  function togglePlay() {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  }

  function unmute() {
    const p = playerRef.current;
    if (!p) return;
    p.unMute();
    setMuted(false);
    fire("vsl_unmute");
  }

  function toggleMute() {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
      fire("vsl_unmute");
    } else {
      p.mute();
      setMuted(true);
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const p = playerRef.current;
    if (!p || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    p.seekTo(ratio * dur, true);
    setCur(ratio * dur);
  }

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      {/* Oynatıcı iframe buraya girer */}
      <div ref={holderRef} className="absolute inset-0 h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />

      {/* Poster — video gerçekten oynayana kadar görünür (yükleme boşluğunu + duraklamayı örter) */}
      {!playing && (
        <button
          type="button"
          onClick={() => (started ? togglePlay() : boot())}
          className="group absolute inset-0 z-20 flex items-center justify-center"
          aria-label="Videoyu oynat"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={posterUrl} alt="Video kapağı" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />
          {/* Büyük oynat düğmesi yalnızca manuel girişte (autoplay booted değilken) */}
          {!started && (
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-xl transition group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 fill-[#0d204d]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}
        </button>
      )}

      {/* "Sesi Aç" katmanı — autoplay sessiz başladığında */}
      {started && playing && muted && (
        <button
          type="button"
          onClick={unmute}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/30 text-white transition hover:bg-black/40"
          aria-label="Sesi aç"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#0d204d]">
              <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
            </svg>
          </span>
          <span className="rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-[#0d204d]">
            🔊 Sesi açmak için dokun
          </span>
        </button>
      )}

      {/* Kendi kontrol çubuğumuz — video başladıktan sonra */}
      {started && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
          <button onClick={togglePlay} aria-label={playing ? "Duraklat" : "Oynat"} className="shrink-0 text-white">
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button onClick={toggleMute} aria-label={muted ? "Sesi aç" : "Sesi kapat"} className="shrink-0 text-white">
            {muted ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white"><path d="M3 10v4h4l5 5V5L7 10H3zm13 2 3 3 1.4-1.4L17.4 12l3-3L19 7.6l-3 3-3-3L11.6 9l3 3-3 3L13 16.4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" /></svg>
            )}
          </button>
          <div onClick={seek} className="group relative h-2 flex-1 cursor-pointer rounded-full bg-white/25" role="slider" aria-label="İlerleme" aria-valuenow={Math.round(pct)}>
            <div className="absolute inset-y-0 left-0 rounded-full bg-[#22d3ee]" style={{ width: `${pct}%` }} />
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums text-white/90">
            {fmt(cur)} / {fmt(dur)}
          </span>
        </div>
      )}
    </div>
  );
}
