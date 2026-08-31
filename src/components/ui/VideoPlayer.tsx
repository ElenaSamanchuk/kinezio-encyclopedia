"use client";

import { useRef, useState } from "react";
import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";

type VideoPlayerProps = {
  src: string;
  poster: string;
  /** Box the video fills; carries the size and the corner radius. */
  className?: string;
  /** Play circle — size and blur differ between the artboards. */
  playClassName?: string;
  iconClassName?: string;
  label?: string;
};

/**
 * Poster + custom play button; the native controls appear only after the first
 * click. Play state lives in `data-kin-playing` so the Tilda JS runtime can
 * drive the same markup without React.
 */
export function VideoPlayer({
  src,
  poster,
  className = "",
  playClassName = "",
  iconClassName = "",
  label = "Смотреть видео",
}: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div data-kin-video data-kin-playing={playing} className={`relative overflow-hidden ${className}`}>
      <video
        ref={video}
        data-kin-video-el
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={playing}
        className="absolute inset-0 size-full max-w-none object-cover"
      />
      <button
        type="button"
        data-kin-video-play
        aria-label={label}
        onClick={() => {
          setPlaying(true);
          video.current?.play();
        }}
        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.4)] transition-opacity duration-200"
      >
        <span
          className={`flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.4)] transition-transform hover:scale-105 ${playClassName}`}
        >
          <Img src={A.iconPlay} alt="" aria-hidden className={iconClassName} />
        </span>
      </button>
    </div>
  );
}
