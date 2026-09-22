import React, { useState } from "react";
import { Language, NavTab } from "../types";
import { translations } from "../i18n/translations";

interface KnowledgeMapScreenProps {
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const KnowledgeMapScreen: React.FC<KnowledgeMapScreenProps> = ({
  language,
  onNavigate,
}) => {
  const t = translations[language].knowledge;
  const [activeFilter, setActiveFilter] = useState<"all" | "gaps" | "inProgress" | "mastered">("all");

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Category Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-extrabold text-[#004ac6] uppercase tracking-wider">
          {t.category}
        </span>
        <h2 className="text-xl font-extrabold text-[#131b2e] tracking-tight">
          {t.screenTitle}
        </h2>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === "all"
              ? "bg-[#004ac6] text-white shadow-xs"
              : "bg-white text-[#434655] border border-[#c3c6d7]/40"
          }`}
        >
          {t.filters.all}
        </button>
        <button
          onClick={() => setActiveFilter("gaps")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === "gaps"
              ? "bg-[#ba1a1a] text-white shadow-xs"
              : "bg-[#fff0ee] text-[#ba1a1a] border border-[#ffdad6]"
          }`}
        >
          {t.filters.gaps}
        </button>
        <button
          onClick={() => setActiveFilter("inProgress")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === "inProgress"
              ? "bg-[#004ac6] text-white shadow-xs"
              : "bg-white text-[#434655] border border-[#c3c6d7]/40"
          }`}
        >
          {t.filters.inProgress}
        </button>
        <button
          onClick={() => setActiveFilter("mastered")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === "mastered"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-[#434655] border border-[#c3c6d7]/40"
          }`}
        >
          {t.filters.mastered}
        </button>
      </div>

      {/* Course Mastery Gauge Card (74%) */}
      <section className="rounded-2xl bg-white border border-[#c3c6d7]/30 p-4 shadow-xs flex items-center justify-between gap-4">
        {/* SVG Circular Progress Ring */}
        <div className="relative size-20 shrink-0 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#e2e7ff]"
              strokeWidth="3.8"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#004ac6]"
              strokeDasharray="74, 100"
              strokeWidth="3.8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-[#131b2e] leading-none">74%</span>
            <span className="text-[8px] uppercase font-bold text-[#737686] mt-0.5">SCORE</span>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-[#131b2e] leading-snug">
            {t.masteryGaugeTitle}
          </h3>
          <p className="text-xs text-[#737686] mt-0.5 leading-tight">
            {t.masteryGaugeSubtitle}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#ba1a1a]">
            <span className="size-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
            <span>{t.masteryGaugeBlockers}</span>
          </div>
        </div>
      </section>

      {/* Dependency & Prerequisite Tree */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">
              {t.treeTitle}
            </h3>
            <p className="text-[11px] text-[#737686]">
              {t.treeSubtitle}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#eaedff] text-[#004ac6]">
            {t.chainBadge}
          </span>
        </div>

        {/* Node 1: Mastered */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {t.nodes.node1Prereq}
                </span>
                <span className="text-xs font-bold text-[#131b2e]">{t.nodes.node1Title}</span>
              </div>
              <p className="text-[11px] text-[#737686] mt-0.5">{t.nodes.node1Desc}</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-emerald-600">100%</span>
        </div>

        {/* Tree Connector Arrow */}
        <div className="flex justify-center -my-1">
          <span className="material-symbols-outlined text-[#737686] text-[18px]">
            arrow_downward
          </span>
        </div>

        {/* Node 2: Critical Gap (Highlighted) */}
        <div className="p-4 rounded-2xl border-2 border-[#ba1a1a] bg-[#fff8f7] shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#ba1a1a] text-white uppercase tracking-wider">
              {t.nodes.node2GapBadge}
            </span>
            <span className="text-xs font-extrabold text-[#ba1a1a]">{t.nodes.node2Accuracy}</span>
          </div>

          <h4 className="text-sm font-bold text-[#410002]">{t.nodes.node2Title}</h4>
          <p className="text-xs text-[#737686] mt-0.5">{t.nodes.node2Desc}</p>

          <div className="mt-2.5 pt-2 border-t border-[#ffdad6] flex items-center justify-between text-[11px]">
            <span className="text-[#ba1a1a] font-semibold">{t.nodes.node2Blocks}</span>
            <button
              onClick={() => onNavigate("practice")}
              className="px-2.5 py-1 rounded-lg bg-[#ba1a1a] text-white font-bold text-[11px] shadow-xs hover:bg-[#93000a] transition-colors"
            >
              {language === "kz" ? "Жою" : language === "en" ? "Fix" : "Закрыть"} →
            </button>
          </div>
        </div>

        {/* Tree Connector Arrow */}
        <div className="flex justify-center -my-1">
          <span className="material-symbols-outlined text-[#737686] text-[18px]">
            arrow_downward
          </span>
        </div>

        {/* Node 3: Partially Mastered */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#131b2e]">{t.nodes.node3Title}</h5>
              <p className="text-[11px] text-[#737686] mt-0.5">{t.nodes.node3Desc}</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-amber-600">65%</span>
        </div>

        {/* Tree Connector Arrow */}
        <div className="flex justify-center -my-1">
          <span className="material-symbols-outlined text-[#737686] text-[18px]">
            arrow_downward
          </span>
        </div>

        {/* Node 4: Locked */}
        <div className="p-3.5 rounded-2xl bg-[#eaedff]/40 border border-[#c3c6d7]/30 opacity-70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#c3c6d7] text-[#434655]">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#434655]">{t.nodes.node4Title}</h5>
              <p className="text-[11px] text-[#737686] mt-0.5">{t.nodes.node4Desc}</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-[#737686]">0%</span>
        </div>
      </section>

      {/* AI Diagnostic Root-Cause Card (Exact Match to Image 5) */}
      <section className="rounded-2xl border border-[#c3c6d7]/40 bg-white p-4 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#004ac6] text-[18px]">psychology</span>
            <h4 className="text-xs font-bold text-[#131b2e]">{t.diagnosticCard.title}</h4>
          </div>
          <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-[#dbe1ff] text-[#004ac6] rounded">
            {t.diagnosticCard.badge}
          </span>
        </div>

        <p className="text-xs text-[#434655] leading-relaxed">
          {t.diagnosticCard.errorObservation}
        </p>

        <div className="rounded-xl bg-[#f2f3ff] p-2.5 border border-[#c3c6d7]/30">
          <span className="text-[10px] font-extrabold text-[#004ac6] block">
            {t.diagnosticCard.missedBaseTitle}
          </span>
          <span className="text-xs font-semibold text-[#131b2e] block mt-0.5">
            {t.diagnosticCard.missedBaseConcept}
          </span>
        </div>

        <div className="text-[11px] text-[#737686] leading-snug">
          <span className="font-bold text-[#131b2e]">{t.diagnosticCard.impactTitle} </span>
          {t.diagnosticCard.impactDesc}
        </div>

        {/* Start Sprint CTA Button */}
        <button
          onClick={() => onNavigate("practice")}
          className="mt-1 w-full rounded-xl bg-[#004ac6] hover:bg-[#2563eb] text-white p-3 text-xs font-bold flex flex-col items-center justify-center gap-0.5 shadow-md shadow-[#004ac6]/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>{t.diagnosticCard.startSprintBtn}</span>
          <span className="text-[10px] font-normal text-white/80">{t.diagnosticCard.sprintSubtitle}</span>
        </button>
      </section>
    </div>
  );
};
