import React from "react";
import { Language, NavTab } from "../types";
import { translations } from "../i18n/translations";

interface TopHeaderProps {
  currentTab: NavTab;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  coins: number;
  xp: number;
  streak: number;
  level: number;
  onOpenSettings?: () => void;
  onNavigateTab?: (tab: NavTab) => void;
  onOpenDailyBonus?: () => void;
  canClaimDaily?: boolean;
  hasGoldAvatar?: boolean;
  hasDoubleXp?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  language,
  onLanguageChange,
  coins,
  xp,
  level,
  onNavigateTab,
  onOpenDailyBonus,
  canClaimDaily,
  hasGoldAvatar,
  hasDoubleXp,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e2e7ff]/70 bg-[#faf8ff]/95 px-3.5 py-2 backdrop-blur-md transition-all shadow-xs">
      <div className="flex items-center gap-2">
        {/* App Logo / Tutor Icon with Gold Avatar Perk support */}
        <div
          className={`relative flex size-9 shrink-0 items-center justify-center rounded-xl text-white font-extrabold text-sm tracking-tight transition-all shadow-sm ${
            hasGoldAvatar
              ? "bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 ring-2 ring-amber-300 ring-offset-1 shadow-amber-200"
              : "bg-[#004ac6]"
          }`}
        >
          {hasGoldAvatar ? "👑" : "AI"}
          {hasDoubleXp && (
            <span
              className="absolute -bottom-1 -right-1 size-4 rounded-full bg-amber-400 text-[#410002] text-[9px] font-black flex items-center justify-center border border-white"
              title="2x XP активен"
            >
              2x
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-extrabold text-[#131b2e] tracking-tight leading-none">
              AI Tutor Pro
            </h1>
            <span
              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                hasGoldAvatar
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-[#dbe1ff] text-[#004ac6]"
              }`}
            >
              LVL {level}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#004ac6] uppercase tracking-wider mt-0.5">
            {t.home.systemBadge}
          </span>
        </div>
      </div>

      {/* Right Controls: Daily Gift, Currency Pill, Quick Language */}
      <div className="flex items-center gap-1.5">
        {/* Daily Bonus Quick Gift Button */}
        {onOpenDailyBonus && (
          <button
            onClick={onOpenDailyBonus}
            title={canClaimDaily ? "Забрать ежедневный бонус!" : "Календарь ежедневных бонусов"}
            className={`relative size-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              canClaimDaily
                ? "bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 shadow-xs animate-bounce"
                : "bg-[#eaedff] text-[#004ac6] hover:bg-[#dbe1ff]"
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">redeem</span>
            {canClaimDaily && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-600 animate-ping" />
            )}
          </button>
        )}

        {/* Currency Pill - Always Visible & Clickable to go to Store */}
        <button
          onClick={() => onNavigateTab && onNavigateTab("rewards")}
          title="Newton Coins (NC) — Нажми, чтобы открыть магазин"
          className="flex items-center gap-1 bg-gradient-to-r from-[#eaedff] to-[#e1e7ff] hover:from-[#dbe1ff] hover:to-[#d0dbff] px-2 py-1 rounded-xl border border-[#004ac6]/20 text-xs font-extrabold text-[#004ac6] shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[15px] text-amber-500"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            token
          </span>
          <span className="tracking-tight">{coins}</span>
          <span className="text-[9px] text-[#737686] font-bold">NC</span>
        </button>

        {/* Quick Language Toggle */}
        <div className="flex items-center bg-[#eaedff] p-0.5 rounded-lg border border-[#c3c6d7]/30">
          {(["kz", "ru", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                language === lang
                  ? "bg-[#004ac6] text-white shadow-2xs"
                  : "text-[#434655] hover:text-[#131b2e]"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
