import { useEffect, useRef, useState } from "react";
import bgmUrl from "../../assets/music/fish-in-the-pool・花屋敷-_池鱼·花园_-ヘクとパスカル.mp3?url";
import { LanguageText } from "../ui/LanguageText";

const TRACK_NAME = "Fish in the Pool";

export function BgmPlayer() {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncPlaying = () => setPlaying(!audio.paused);
    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("pause", syncPlaying);
    audio.addEventListener("ended", syncPlaying);
    return () => {
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("pause", syncPlaying);
      audio.removeEventListener("ended", syncPlaying);
    };
  }, []);

  const togglePlayer = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.38;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    audio.pause();
    setPlaying(false);
  };

  return (
    <div className={`bgm-player ${expanded ? "is-expanded" : ""}`}>
      <audio ref={audioRef} src={bgmUrl} loop preload="metadata" />
      <button
        className={`bgm-player__toggle ${playing ? "is-playing" : ""}`}
        type="button"
        aria-expanded={expanded}
        aria-pressed={playing}
        onClick={() => setExpanded((value) => !value)}
        aria-label={playing ? "音乐已开启" : "音乐已关闭"}
      >
        <span aria-hidden="true">♫</span>
        <small className="english">{playing ? "ON" : "OFF"}</small>
      </button>
      <div className="bgm-player__panel">
        <span className="bgm-player__eyebrow english">NOW PLAYING</span>
        <strong><LanguageText text={`花与爱丽丝 / ${TRACK_NAME}`} /></strong>
        <small><LanguageText text={`01 — ${TRACK_NAME}`} /></small>
        <button className="bgm-player__action" type="button" onClick={() => void togglePlayer()}>
          {playing ? "暂停音乐" : "播放音乐"}
        </button>
      </div>
    </div>
  );
}
