import React, { useState } from "react";
import { Language } from "../types";
import { DAILY_REWARDS } from "../utils/userStorage";

interface DailyRewardModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  claimedToday: boolean;
  streak: number;
  onClaimReward: (coins: number, xp: number) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  language,
  isOpen,
  onClose,
  dayNumber,
  claimedToday,
  streak,
  onClaimReward,
}) => {
  const [justClaimed, setJustClaimed] = useState(false);

  if (!isOpen) return null;

  const currentReward = DAILY_REWARDS.find((r) => r.day === dayNumber) || DAILY_REWARDS[0];

  const handleClaim = () => {
    if (claimedToday || justClaimed) return;
    setJustClaimed(true);
    onClaimReward(currentReward.coins, currentReward.xp);
  };

  const texts = {
    kz: {
      title: "Күнделікті кіру бонусы 🎁",
      subtitle: "Күн сайын кіріп, тегін токендер мен тәжірибе ұпайларын жинаңыз!",
      streakLabel: "Үздіксіз кіру стригі:",
      daysUnit: "күн",
      dayTitle: (d: number) => `${d}-күн`,
      claimBtn: `Бонусты алу (+${currentReward.coins} NC, +${currentReward.xp} XP)`,
      alreadyClaimed: "Бүгінгі бонус алынды! Келесісі ертең ашылады ✨",
      claimedTag: "Алынды ✓",
      todayTag: "Бүгін",
      close: "Жабу",
      jackpotNote: "7-ші күн: Үлкен Супер Бонус + Стрик қорғанысы!",
    },
    ru: {
      title: "Ежедневный бонус за вход 🎁",
      subtitle: "Заходи каждый день, чтобы забирать бесплатные токены NC и опыт!",
      streakLabel: "Серия входов (стрик):",
      daysUnit: "дней",
      dayTitle: (d: number) => `День ${d}`,
      claimBtn: `Забрать награду (+${currentReward.coins} NC, +${currentReward.xp} XP)`,
      alreadyClaimed: "Бонус на сегодня уже получен! Заходи завтра за новым ✨",
      claimedTag: "Получено ✓",
      todayTag: "Сегодня",
      close: "Закрыть",
      jackpotNote: "7-й день: Двойной Джекпот токенов + Огненный стрик!",
    },
    en: {
      title: "Daily Login Bonus 🎁",
      subtitle: "Check in every day to claim free Newton Coins (NC) and XP!",
      streakLabel: "Current login streak:",
      daysUnit: "days",
      dayTitle: (d: number) => `Day ${d}`,
      claimBtn: `Claim Reward (+${currentReward.coins} NC, +${currentReward.xp} XP)`,
      alreadyClaimed: "Today's reward is already claimed! Come back tomorrow ✨",
      claimedTag: "Claimed ✓",
      todayTag: "Today",
      close: "Close",
      jackpotNote: "Day 7: Double Jackpot of tokens + Fire streak!",
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#ffffff] via-[#faf8ff] to-[#f0f3ff] rounded-3xl p-5 border border-[#004ac6]/20 shadow-2xl flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-8 rounded-full bg-[#eaedff] text-[#434655] hover:text-[#131b2e] flex items-center justify-center cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mt-1">
          <div className="size-14 rounded-2xl bg-gradient-to-tr from-[#004ac6] to-[#3b82f6] text-white flex items-center justify-center shadow-md mb-2">
            <span className="material-symbols-outlined text-[32px] animate-bounce">
              redeem
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-[#131b2e] tracking-tight">
            {texts.title}
          </h3>
          <p className="text-xs text-[#737686] mt-1 px-2 leading-relaxed">
            {texts.subtitle}
          </p>

          {/* Streak Badge */}
          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span>
              {texts.streakLabel} {streak} {texts.daysUnit}
            </span>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {DAILY_REWARDS.map((item) => {
            const isToday = item.day === dayNumber;
            const isPast = item.day < dayNumber || (isToday && (claimedToday || justClaimed));
            const isFuture = item.day > dayNumber;
            const isFinal = item.day === 7;

            return (
              <div
                key={item.day}
                className={`relative rounded-2xl p-2 flex flex-col items-center justify-between border transition-all text-center ${
                  isFinal ? "col-span-2 bg-gradient-to-br from-amber-50 to-amber-100/70 border-amber-300" : ""
                } ${
                  isToday && !claimedToday && !justClaimed
                    ? "bg-white border-[#004ac6] ring-2 ring-[#004ac6]/30 shadow-md scale-102"
                    : isPast
                    ? "bg-[#eaf5ea] border-emerald-300 opacity-90"
                    : "bg-white/80 border-[#c3c6d7]/30 opacity-70"
                }`}
              >
                {/* Day Label */}
                <span
                  className={`text-[10px] font-bold ${
                    isToday ? "text-[#004ac6]" : isPast ? "text-emerald-700" : "text-[#737686]"
                  }`}
                >
                  {texts.dayTitle(item.day)}
                </span>

                {/* Icon */}
                <div
                  className={`size-8 rounded-xl flex items-center justify-center my-1 ${
                    isPast
                      ? "bg-emerald-100 text-emerald-700"
                      : isToday
                      ? "bg-[#eaedff] text-[#004ac6]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPast ? "check" : item.icon}
                  </span>
                </div>

                {/* Amount */}
                <div className="flex flex-col">
                  <span
                    className={`text-[11px] font-extrabold leading-none ${
                      isPast ? "text-emerald-700" : isToday ? "text-[#004ac6]" : "text-[#131b2e]"
                    }`}
                  >
                    +{item.coins} NC
                  </span>
                  <span className="text-[9px] text-[#737686] leading-tight">+{item.xp} XP</span>
                </div>

                {/* Status tag */}
                {isToday && !claimedToday && !justClaimed && (
                  <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full bg-[#004ac6] text-white text-[8px] font-extrabold uppercase">
                    {texts.todayTag}
                  </span>
                )}
                {isPast && (
                  <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[8px] font-extrabold">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-center text-amber-700 font-semibold mt-3">
          {texts.jackpotNote}
        </p>

        {/* Claim / Action Button */}
        <div className="mt-4 flex flex-col gap-2">
          {!claimedToday && !justClaimed ? (
            <button
              onClick={handleClaim}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#004ac6] via-[#2563eb] to-[#3b82f6] text-white text-xs font-extrabold shadow-lg hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">token</span>
              <span>{texts.claimBtn}</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{texts.alreadyClaimed}</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-[#737686] hover:text-[#131b2e] transition-colors"
          >
            {texts.close}
          </button>
        </div>
      </div>
    </div>
  );
};
