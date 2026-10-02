import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { AssetImage } from "../components/AssetImage/AssetImage";
import { FadeIn } from "../components/FadeIn/FadeIn";
import { HoverImage } from "../components/HoverImage/HoverImage";
import { ImageReveal } from "../components/ImageReveal/ImageReveal";
import { MemberCard } from "../components/MemberCard/MemberCard";
import { MemoryStack } from "../components/MemoryStack/MemoryStack";
import { MomentFolderStack } from "../components/MomentFolderStack/MomentFolderStack";
import { RandomMomentButton } from "../components/RandomMomentButton/RandomMomentButton";
import { SectionHeader } from "../components/SectionHeader/SectionHeader";
import { VideoCard } from "../components/VideoCard/VideoCard";
import { LanguageText } from "../components/ui/LanguageText";
import { InfiniteMomentsGrid } from "../components/ui/infinite-moments-grid";
import { members } from "../data/members";
import {
  MOMENT_CATEGORY_META,
  MOMENT_CATEGORY_ORDER,
  getMomentsByCategory,
  moments
} from "../data/moments";
import { duoVideos } from "../data/videos";
import { usePageMeta } from "../hooks/usePageMeta";
import type { MomentCategory } from "../types/content";
import { ARCHIVE_IMAGES } from "../lib/media";

export function Home() {
  const [randomCategory] = useState<MomentCategory>(() => (
    MOMENT_CATEGORY_ORDER[Math.floor(Math.random() * MOMENT_CATEGORY_ORDER.length)] ?? "daily"
  ));
  const [randomVideo] = useState(() => (
    duoVideos.length ? duoVideos[Math.floor(Math.random() * duoVideos.length)] : null
  ));

  const randomCategoryMeta = MOMENT_CATEGORY_META[randomCategory];
  const randomCategoryMoments = getMomentsByCategory(randomCategory);
  const randomCategoryCover = randomCategoryMoments[0]?.image;

  usePageMeta(
    "花与爱丽丝｜WONI × MINAMI",
    "一个记录 WONI 与 MINAMI 青春瞬间的视觉相册。"
  );

  return (
    <>
      <section className="hero hero--editorial">
        <div className="hero__ambient" aria-hidden="true" />
        <div className="hero__top shell">
          <div className="hero__identity hero-enter" style={{ "--enter-delay": "80ms" } as CSSProperties}>
            <strong><LanguageText text="W×M / 001" /></strong>
            <span className="english">HANA &amp; ALICE · W×M MOMENTS</span>
          </div>
          <div className="hero__years hero-enter english" style={{ "--enter-delay": "180ms" } as CSSProperties}>
            2025 — 2026
          </div>
        </div>

        <div className="hero__stage shell">
          <ImageReveal className="hero__main-photo" delay={250}>
            <HoverImage>
              <AssetImage image={ARCHIVE_IMAGES.hero} aspectRatio="4 / 5" eager />
              <span className="hero__photo-index english">PHOTO 024</span>
            </HoverImage>
          </ImageReveal>

          <div className="hero__copy">
            <p className="hero__japanese japanese hero-enter" style={{ "--enter-delay": "420ms" } as CSSProperties} aria-hidden="true">
              あの日のふたり。
            </p>
            <h1 className="hero-enter" style={{ "--enter-delay": "500ms" } as CSSProperties}>
              花与爱丽丝
            </h1>
            <p className="hero__pair hero-enter english" style={{ "--enter-delay": "600ms" } as CSSProperties}>WONI × MINAMI</p>

            <Link className="button hero-enter" style={{ "--enter-delay": "790ms" } as CSSProperties} to="/archive">
              翻开这一页 <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ImageReveal className="hero__small-photo" delay={560}>
            <HoverImage>
              <AssetImage image={ARCHIVE_IMAGES.duo} aspectRatio="4 / 3" eager />
            </HoverImage>
            <span className="hero__hand-note" aria-hidden="true">“刚好被看见的那一刻。”</span>
          </ImageReveal>
        </div>

        <div className="hero__bottom shell hero-enter" style={{ "--enter-delay": "900ms" } as CSSProperties}>
          <span className="english">SCROLL TO EXPLORE</span>
          <i aria-hidden="true" />
          <span>慢慢往下翻阅</span>
        </div>
      </section>

      <section className="section section--paper" id="who-are-they">
        <div className="shell">
          <SectionHeader
            index="01"
            eyebrow="SCENE 01 · 她们是谁"
            title="她们是谁"
          />
          <div className="member-grid">
            <FadeIn className="member-grid__item" delay={0}>
              <MemberCard member={members[0]} />
            </FadeIn>
            <span className="member-grid__cross english" aria-hidden="true">and</span>
            <FadeIn className="member-grid__item" delay={140}>
              <MemberCard member={members[1]} />
            </FadeIn>
          </div>
        </div>
      </section>

      <MemoryStack />

      <section className="section section--paper scene-infinite">
        <div className="shell">
          <SectionHeader
            index="02"
            eyebrow="SCENE 02 · 她们之间的一些小事"
            title="她们之间"
          />
        </div>
        <InfiniteMomentsGrid moments={moments} />
      </section>

      <section className="section section--paper scene-03">
        <div className="shell">
          <SectionHeader
            index="03"
            eyebrow="SCENE 03 · 看见所有发生"
            title="看见所有发生"
            description="每次刷新随机翻开日常、舞台或幕后中的一本，再随机遇见一段被留下来的双人片段。"
          />

          {randomCategoryCover && (
            <div className="scene03-folder-spotlight">
              <MomentFolderStack
                category={randomCategory}
                title={randomCategoryMeta.label}
                english={randomCategoryMeta.english}
                cover={randomCategoryCover}
                count={randomCategoryMoments.length}
                to={`/moments/category/${randomCategory}`}
              />
            </div>
          )}

          {randomVideo && (
            <div className="scene03-video-feature">
              <div className="scene03-video-feature__heading">
                <p className="eyebrow"><LanguageText text="RANDOM CLIP · 随机片段" /></p>
                <p><LanguageText text="每次刷新，都会随机遇见一段新的影像记录。" /></p>
              </div>
              <div className="scene03-video-feature__card">
                <VideoCard video={randomVideo} />
              </div>
            </div>
          )}
        </div>
      </section>


      <section className="random-section">
        <div className="shell random-section__inner">
          <div>
            <p className="eyebrow">SCENE 04 · 下一页</p>
            <h2>今天想翻到哪一页？</h2>
            <p>不按顺序，也不做攻略。随机翻开相册里的其中一页。</p>
          </div>
          <RandomMomentButton className="random-section__button" label="随便翻一页" />
          <span className="random-section__stamp" aria-hidden="true">MEMORY<br />FOUND</span>
        </div>
      </section>


      <section className="closing-section">
        <div className="closing-section__orb" aria-hidden="true" />
        <div className="shell closing-section__content">
          <p className="eyebrow">PAGE AFTER PAGE · 下一页</p>
          <h2>
            下一页，
            <br />
            也许还会遇见她们。
          </h2>
          <Link className="button button--light" to="/moments">
            继续往下看看 <span aria-hidden="true">→</span>
          </Link>
          <div className="closing-section__signature">
            <span><LanguageText text="花与爱丽丝 · 视觉相册" /></span>
            <span className="english">WONI × MINAMI</span>
          </div>
        </div>
      </section>
    </>
  );
}

