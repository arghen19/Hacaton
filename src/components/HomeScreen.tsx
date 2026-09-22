import React from "react";
import { Language, NavTab } from "../types";
import { translations } from "../i18n/translations";

interface HomeScreenProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
  coins: number;
  xp: number;
  streak: number;
  level: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onNavigate,
  coins,
  xp,
  streak,
  level,
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* User Greeting & Stats Hero */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#004ac6] uppercase tracking-wide">
                {t.home.courseTrack}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#131b2e] tracking-tight">
              {t.home.greeting}
            </h2>
          </div>
          <button
            onClick={() => onNavigate("agent")}
            className="flex items-center gap-1.5 rounded-full bg-[#eaedff] px-2.5 py-1 text-xs font-bold text-[#004ac6] border border-[#c3c6d7]/30 hover:bg-[#dbe1ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>{level} LVL</span>
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-[#c3c6d7]/30 shadow-xs">
            <div className="flex size-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#737686] font-medium leading-none">Стрик</span>
              <span className="text-xs font-bold text-[#131b2e] leading-tight truncate">
                {streak} {language === "kz" ? "күн" : language === "ru" ? "дней" : "days"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-[#c3c6d7]/30 shadow-xs">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#737686] font-medium leading-none">Опыт</span>
              <span className="text-xs font-bold text-[#131b2e] leading-tight truncate">
                {xp} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-[#c3c6d7]/30 shadow-xs">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <span className="material-symbols-outlined text-[18px]">ads_click</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#737686] font-medium leading-none">Цель</span>
              <span className="text-xs font-bold text-[#131b2e] leading-tight truncate">85%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Gap Detected Card (Exact Match to Design) */}
      <section className="rounded-2xl border-2 border-[#ffdad6] bg-gradient-to-br from-[#fff8f7] to-[#ffffff] p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/40 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-extrabold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>{t.home.gapBadge}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
            {t.home.gapRisk}
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#410002] leading-snug">
          {t.home.gapTitle}
        </h3>
        <p className="text-xs text-[#737686] mt-1 leading-relaxed">
          {t.home.gapDesc}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            onClick={() => onNavigate("chat")}
            className="flex-1 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>{t.home.gapAction}</span>
          </button>
          <button
            onClick={() => onNavigate("knowledge")}
            className="rounded-xl border border-[#ffdad6] bg-white text-[#410002] p-2 hover:bg-[#fff0ee] transition-colors"
            title="Посмотреть на карте знаний"
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </button>
        </div>
      </section>

      {/* AI Tutor Newton Quick Promo Box */}
      <section className="rounded-2xl bg-gradient-to-r from-[#004ac6] to-[#2563eb] p-4 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          </div>
          <div>
            <h4 className="text-sm font-bold leading-tight">
              {t.home.tutorPromoTitle}
            </h4>
            <p className="text-[11px] text-white/80 mt-0.5 leading-snug">
              {t.home.tutorPromoSubtitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("chat")}
          className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white text-[#004ac6] text-xs font-bold shadow-sm hover:bg-white/90 active:scale-95 transition-all"
        >
          {t.home.askBtn}
        </button>
      </section>

      {/* Personalized Route (Персональный маршрут) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              {t.home.routeTitle}
            </h3>
            <p className="text-[11px] text-[#737686]">
              {t.home.routeSubtitle}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#eaedff] text-[#004ac6]">
            {t.home.routeStepsBadge}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Step 1 */}
          <div
            onClick={() => onNavigate("practice")}
            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs hover:border-[#004ac6]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#dbe1ff] text-[#004ac6] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#131b2e] group-hover:text-[#004ac6] transition-colors">
                  {t.home.routeStep1Title}
                </h5>
                <p className="text-[11px] text-[#737686]">
                  {t.home.routeStep1Desc}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[18px]">
              chevron_right
            </span>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigate("chat")}
            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs hover:border-[#004ac6]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#131b2e] group-hover:text-[#004ac6] transition-colors">
                  {t.home.routeStep2Title}
                </h5>
                <p className="text-[11px] text-[#737686]">
                  {t.home.routeStep2Desc}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[18px]">
              chevron_right
            </span>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigate("practice")}
            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs hover:border-[#004ac6]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">translate</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#131b2e] group-hover:text-[#004ac6] transition-colors">
                  {t.home.routeStep3Title}
                </h5>
                <p className="text-[11px] text-[#737686]">
                  {t.home.routeStep3Desc}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[18px]">
              chevron_right
            </span>
          </div>
        </div>
      </section>

      {/* Subject Mastery Grid */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              {t.home.masteryTitle}
            </h3>
            <p className="text-[11px] text-[#737686]">
              {t.home.masterySubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate("knowledge")}
            className="text-xs font-bold text-[#004ac6] hover:underline"
          >
            {t.home.detailsBtn} →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Algebra */}
          <div
            onClick={() => onNavigate("knowledge")}
            className="p-3 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs cursor-pointer hover:border-[#004ac6]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#131b2e]">{t.home.subjects.algebra}</span>
              <span className="text-xs font-extrabold text-[#004ac6]">74%</span>
            </div>
            <div className="w-full bg-[#e2e7ff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#004ac6] h-full rounded-full" style={{ width: "74%" }}></div>
            </div>
          </div>

          {/* Physics */}
          <div
            onClick={() => onNavigate("practice")}
            className="p-3 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs cursor-pointer hover:border-[#004ac6]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#131b2e]">{t.home.subjects.physics}</span>
              <span className="text-xs font-extrabold text-purple-600">62%</span>
            </div>
            <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: "62%" }}></div>
            </div>
          </div>

          {/* Geometry */}
          <div
            onClick={() => onNavigate("practice")}
            className="p-3 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs cursor-pointer hover:border-[#004ac6]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#131b2e]">{t.home.subjects.geometry}</span>
              <span className="text-xs font-extrabold text-amber-600">48%</span>
            </div>
            <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full" style={{ width: "48%" }}></div>
            </div>
          </div>

          {/* English */}
          <div
            onClick={() => onNavigate("chat")}
            className="p-3 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs cursor-pointer hover:border-[#004ac6]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#131b2e]">{t.home.subjects.english}</span>
              <span className="text-xs font-extrabold text-emerald-600">81%</span>
            </div>
            <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: "81%" }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
