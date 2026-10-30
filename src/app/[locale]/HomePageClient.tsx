"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Boxes,
  Car,
  Check,
  ChevronDown,
  CircleAlert,
  Gauge,
  Map,
  Megaphone,
  MousePointerClick,
  Package,
  RotateCw,
  Route,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// 模块标题头部（eyebrow + H2 + subtitle + intro）
function ModuleHeader({
  moduleKey,
  eyebrow,
  title,
  subtitle,
  intro,
  moduleLinkMap,
  locale,
}: {
  moduleKey: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <span
        className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-medium tracking-wide uppercase
                       bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                       text-[hsl(var(--nav-theme-light))]"
      >
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <LinkedTitle
          linkData={moduleLinkMap[moduleKey]}
          locale={locale}
        >
          {title}
        </LinkedTitle>
      </h2>
      <p className="text-base md:text-lg font-medium text-foreground/80 max-w-3xl mx-auto mb-3">
        {subtitle}
      </p>
      <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mechanic-legends.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Mechanic Legends Wiki",
        description:
          "Complete Mechanic Legends Wiki covering cars, tuning, repairs, parts, races, jobs, updates, and codes for the Roblox car repair and tuning simulator.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Mechanic Legends - Roblox Car Repair & Tuning Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Mechanic Legends Wiki",
        alternateName: "Mechanic Legends",
        url: siteUrl,
        description:
          "Complete Mechanic Legends Wiki resource hub for cars, tuning, repairs, parts, races, jobs, updates, and codes",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Mechanic Legends Wiki - Roblox Car Repair & Tuning Simulator",
        },
        sameAs: [
          "https://www.roblox.com/games/9265443535/Car-Mechanic-Simulator",
          "https://www.roblox.com/groups/14496678/Mechanic-Devs",
          "https://discord.gg/mecanicaarg",
          "https://www.youtube.com/results?search_query=Mechanic+Legends+Roblox",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Mechanic Legends",
        gamePlatform: ["PC", "iOS", "Android", "Xbox One", "PlayStation"],
        applicationCategory: "Game",
        genre: ["Racing", "Simulation", "Car Tuning", "Sandbox"],
        playMode: "MultiPlayer",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/9265443535/Car-Mechanic-Simulator",
        },
      },
      {
        "@type": "VideoObject",
        name: "ROBLOX MECHANIC LEGENDS !",
        description:
          "Mechanic Legends gameplay showcase video featuring car repairs, tuning, and garage builds in Roblox.",
        uploadDate: "2024-03-30",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/bRQ0RrcFhcw",
        url: "https://www.youtube.com/watch?v=bRQ0RrcFhcw",
      },
    ],
  };

  // Accordion states
  const [jobsExpanded, setJobsExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // 模块子项图标（代码内数组，不进 en.json / iconRegistry）
  const codeCardIcons = [Ticket, MousePointerClick, CircleAlert];
  const carCardIcons = [Car, Truck, Trophy, Boxes];
  const jobCardIcons = [Wrench, Package, Map, Route];
  const raceCardIcons = [Gauge, RotateCw, Star, Users];

  // Tools Grid 卡片 → 模块锚点映射（与 Tools Grid 8 卡顺序一一对应）
  const sectionIds = [
    "codes",
    "beginner-guide",
    "money-making",
    "cars-dealership",
    "tuning-engine-parts",
    "jobs-repair",
    "drag-race-drift",
    "updates-features",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </aside> */}

      {/* 右侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Ticket className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/9265443535/Car-Mechanic-Simulator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section (Hero 之后) */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="bRQ0RrcFhcw"
              title="ROBLOX MECHANIC LEGENDS !"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（与 8 个模块锚点一一对应） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（紧接 Tools Grid 之下） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsCodes"
            eyebrow={t.modules.mechanicLegendsCodes.eyebrow}
            title={t.modules.mechanicLegendsCodes.title}
            subtitle={t.modules.mechanicLegendsCodes.subtitle}
            intro={t.modules.mechanicLegendsCodes.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.mechanicLegendsCodes.items.map(
              (item: any, index: number) => {
                const IconComponent = codeCardIcons[index];
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                        )}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`mechanicLegendsCodes::items::${index}`]
                        }
                        locale={locale}
                      >
                        {item.code}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-2">
                      {item.reward}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.details}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsBeginnerGuide"
            eyebrow={t.modules.mechanicLegendsBeginnerGuide.eyebrow}
            title={t.modules.mechanicLegendsBeginnerGuide.title}
            subtitle={t.modules.mechanicLegendsBeginnerGuide.subtitle}
            intro={t.modules.mechanicLegendsBeginnerGuide.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.mechanicLegendsBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `mechanicLegendsBeginnerGuide::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.focus.map((f: string, fi: number) => (
                        <span
                          key={fi}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                        >
                          <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Money Making */}
      <section id="money-making" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsMoneyMaking"
            eyebrow={t.modules.mechanicLegendsMoneyMaking.eyebrow}
            title={t.modules.mechanicLegendsMoneyMaking.title}
            subtitle={t.modules.mechanicLegendsMoneyMaking.subtitle}
            intro={t.modules.mechanicLegendsMoneyMaking.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border text-left">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Activity
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Startup Cost
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Income Speed
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Stage
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[16rem]">
                    Strategy
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.mechanicLegendsMoneyMaking.items.map(
                  (item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 align-top hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `mechanicLegendsMoneyMaking::items::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {item.activity}
                        </LinkedTitle>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {item.startupCost}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {item.difficulty}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.incomeSpeed}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {item.stage}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.strategy}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 4: Cars and Dealership */}
      <section
        id="cars-dealership"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsCarsDealership"
            eyebrow={t.modules.mechanicLegendsCarsDealership.eyebrow}
            title={t.modules.mechanicLegendsCarsDealership.title}
            subtitle={t.modules.mechanicLegendsCarsDealership.subtitle}
            intro={t.modules.mechanicLegendsCarsDealership.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.mechanicLegendsCarsDealership.items.map(
              (item: any, index: number) => {
                const IconComponent = carCardIcons[index];
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `mechanicLegendsCarsDealership::items::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {item.category}
                          </LinkedTitle>
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {item.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.bestFor.map((b: string, bi: number) => (
                        <span
                          key={bi}
                          className="px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.buyingGuidance}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Upgrade priority:
                      </span>
                      {item.upgradePriority.map((u: string, ui: number) => (
                        <span
                          key={ui}
                          className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--nav-theme-light))]"
                        >
                          <Check className="w-3 h-3" />
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Tuning and Engine Parts */}
      <section
        id="tuning-engine-parts"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsTuningEngine"
            eyebrow={t.modules.mechanicLegendsTuningEngine.eyebrow}
            title={t.modules.mechanicLegendsTuningEngine.title}
            subtitle={t.modules.mechanicLegendsTuningEngine.subtitle}
            intro={t.modules.mechanicLegendsTuningEngine.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.mechanicLegendsTuningEngine.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `mechanicLegendsTuningEngine::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <ul className="space-y-2 mb-3">
                    {step.actions.map((action: string, ai: number) => (
                      <li key={ai} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {action}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-2 pt-3 border-t border-border">
                    <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <p className="text-xs md:text-sm text-muted-foreground italic">
                      {step.performanceFocus}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Jobs and Repair */}
      <section
        id="jobs-repair"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsJobsRepair"
            eyebrow={t.modules.mechanicLegendsJobsRepair.eyebrow}
            title={t.modules.mechanicLegendsJobsRepair.title}
            subtitle={t.modules.mechanicLegendsJobsRepair.subtitle}
            intro={t.modules.mechanicLegendsJobsRepair.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal space-y-3">
            {t.modules.mechanicLegendsJobsRepair.items.map(
              (item: any, index: number) => {
                const IconComponent = jobCardIcons[index];
                const isExpanded = jobsExpanded === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-xl overflow-hidden bg-white/5 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <button
                      onClick={() =>
                        setJobsExpanded(isExpanded ? null : index)
                      }
                      className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                        )}
                        <span className="font-bold text-base md:text-lg">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `mechanicLegendsJobsRepair::items::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {item.title}
                          </LinkedTitle>
                        </span>
                        <span className="hidden sm:inline-flex text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {item.rating}
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {item.summary}
                        </p>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            Workflow
                          </h4>
                          <ol className="space-y-2">
                            {item.workflow.map((w: string, wi: number) => (
                              <li
                                key={wi}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-[0.65rem] font-bold text-[hsl(var(--nav-theme-light))]">
                                  {wi + 1}
                                </span>
                                {w}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Tips</h4>
                          <ul className="space-y-2">
                            {item.tips.map((tip: string, ti: number) => (
                              <li
                                key={ti}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-white/5 border border-border rounded-lg">
                          <CircleAlert className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {item.risk}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Drag Race and Drift */}
      <section id="drag-race-drift" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsDragRaceDrift"
            eyebrow={t.modules.mechanicLegendsDragRaceDrift.eyebrow}
            title={t.modules.mechanicLegendsDragRaceDrift.title}
            subtitle={t.modules.mechanicLegendsDragRaceDrift.subtitle}
            intro={t.modules.mechanicLegendsDragRaceDrift.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.mechanicLegendsDragRaceDrift.items.map(
              (item: any, index: number) => {
                const IconComponent = raceCardIcons[index];
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `mechanicLegendsDragRaceDrift::items::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {item.title}
                        </LinkedTitle>
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Best Setup
                        </h4>
                        <ul className="space-y-2">
                          {item.bestSetup.map((s: string, si: number) => (
                            <li
                              key={si}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Driving Tips
                        </h4>
                        <ul className="space-y-2">
                          {item.drivingTips.map((tip: string, di: number) => (
                            <li
                              key={di}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground italic pt-3 border-t border-border">
                        {item.idealFor}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Updates and Features */}
      <section
        id="updates-features"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            moduleKey="mechanicLegendsUpdatesFeatures"
            eyebrow={t.modules.mechanicLegendsUpdatesFeatures.eyebrow}
            title={t.modules.mechanicLegendsUpdatesFeatures.title}
            subtitle={t.modules.mechanicLegendsUpdatesFeatures.subtitle}
            intro={t.modules.mechanicLegendsUpdatesFeatures.intro}
            moduleLinkMap={moduleLinkMap}
            locale={locale}
          />

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border text-left">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      Category
                    </span>
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[14rem]">
                    What to Check
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[14rem]">
                    Player Impact
                  </th>
                  <th className="px-4 py-3 font-semibold min-w-[14rem]">
                    Action
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.mechanicLegendsUpdatesFeatures.items.map(
                  (item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0 align-top hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `mechanicLegendsUpdatesFeatures::items::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {item.category}
                        </LinkedTitle>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.whatToCheck}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.playerImpact}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.action}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex text-xs px-2 py-1 rounded-full border whitespace-nowrap ${item.priority === "High" ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]" : "bg-white/5 border-border text-muted-foreground"}`}
                        >
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/mecanicaarg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/9265443535/Car-Mechanic-Simulator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/groups/14496678/Mechanic-Devs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGroup}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/results?search_query=Mechanic+Legends+Roblox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
