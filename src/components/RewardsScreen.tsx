import React, { useState } from "react";
import { Language, NavTab, ShopItem } from "../types";
import { translations } from "../i18n/translations";
import { ActivePerks } from "../utils/userStorage";
import { FormulaSheetModal } from "./FormulaSheetModal";

interface RewardsScreenProps {
  language: Language;
  coins: number;
  streak: number;
  purchasedItems: string[];
  activePerks: ActivePerks;
  claimedChallenges: string[];
  onNavigate: (tab: NavTab) => void;
  onClaimChallenge: (challengeId: string, ncReward: number, xpReward?: number) => void;
  onBuyItem: (item: ShopItem) => boolean;
  onTogglePerk: (perkKey: keyof ActivePerks, value: any) => void;
  onOpenDailyBonus: () => void;
  canClaimDaily: boolean;
  dailyDayNumber: number;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  language,
  coins,
  streak,
  purchasedItems,
  activePerks,
  claimedChallenges,
  onNavigate,
  onClaimChallenge,
  onBuyItem,
  onTogglePerk,
  onOpenDailyBonus,
  canClaimDaily,
  dailyDayNumber,
}) => {
  const t = translations[language].rewards;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "boost" | "theme" | "perks">("all");
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 12 Exciting and Functional Shop Items
  const shopCatalog: ShopItem[] = [
    {
      id: "item_double_xp",
      name:
        language === "kz"
          ? "Double XP (2x Тәжірибе)"
          : language === "en"
          ? "Double XP Booster (24h)"
          : "Double XP (2x Опыт на 24ч)",
      desc:
        language === "kz"
          ? "24 сағат бойы тапсырмалар мен чатта 2 есе көп XP береді"
          : language === "en"
          ? "Doubles all XP earned in practice, chat, and trainer for 24 hours"
          : "Удваивает весь получаемый опыт в тренажёре, чате и уроках на 24 часа",
      category: "boost",
      price: 200,
      icon: "bolt",
      badge: language === "kz" ? "2x Бустер" : language === "en" ? "2x Booster" : "2x Бустер",
      purchased: purchasedItems.includes("item_double_xp"),
      isEquipped: activePerks.doubleXpUntil > Date.now(),
    },
    {
      id: "item_streak_freeze",
      name:
        language === "kz"
          ? "Стрик Қорғанысы (Freeze)"
          : language === "en"
          ? "Streak Freeze"
          : "Заморозка Стрика (Streak Freeze)",
      desc:
        language === "kz"
          ? "Егер бір күн кіруді өткізіп алсаңыз, күнделікті от стригін сақтайды"
          : language === "en"
          ? "Preserves your daily streak flame even if you miss a practice day"
          : "Защищает твой стрик (огонь), если пропустишь 1 день занятий",
      category: "protection",
      price: 150,
      icon: "ac_unit",
      badge: language === "kz" ? "Қорғаныс" : language === "en" ? "Protection" : "Защита",
      purchased: purchasedItems.includes("item_streak_freeze"),
      inventoryCount: activePerks.streakFreezes,
    },
    {
      id: "item_formula_sheet",
      name:
        language === "kz"
          ? "VIP Формулалар Справочнигі"
          : language === "en"
          ? "VIP Formula Cheat Sheet"
          : "VIP Справочник Формул",
      desc:
        language === "kz"
          ? "Алгебра, геометрия және физиканың барлық маңызды формулалары бір жерде"
          : language === "en"
          ? "Interactive formula handbook covering Algebra, Geometry, and Physics"
          : "Интерактивная шпаргалка всех формул по алгебре, геометрии и физике",
      category: "power",
      price: 180,
      icon: "menu_book",
      badge: language === "kz" ? "VIP Білім" : language === "en" ? "VIP Access" : "VIP Знания",
      purchased: purchasedItems.includes("item_formula_sheet"),
    },
    {
      id: "item_hint_lens",
      name:
        language === "kz"
          ? "Рентген-Көмекші (Hint Lens)"
          : language === "en"
          ? "Hint X-Ray Lens"
          : "Рентген Подсказок (Hint Lens)",
      desc:
        language === "kz"
          ? "Тренажердағы ең қиын есептердің шешу кілтін көруге көмектеседі"
          : language === "en"
          ? "Reveals instant smart hints in hard trainer problems without penalties"
          : "Мгновенно открывает ключевую подсказку к сложным задачам без штрафов",
      category: "power",
      price: 120,
      icon: "visibility",
      badge: language === "kz" ? "Суперкүш" : language === "en" ? "Superpower" : "Суперсила",
      purchased: purchasedItems.includes("item_hint_lens"),
    },
    {
      id: "item_second_chance",
      name:
        language === "kz"
          ? "Екінші мүмкіндік (Second Chance)"
          : language === "en"
          ? "Quiz Second Chance"
          : "Второй шанс в тестах",
      desc:
        language === "kz"
          ? "Тестте қателескенде ұпай жоғалтпай қайта таңдау мүмкіндігі"
          : language === "en"
          ? "Allows one redo on incorrect quiz answers without losing XP"
          : "Позволяет перевыбрать ответ в квизе тренажёра без потери очков",
      category: "boost",
      price: 100,
      icon: "replay",
      badge: language === "kz" ? "Қайтару" : language === "en" ? "Redo Pass" : "Спасение",
      purchased: purchasedItems.includes("item_second_chance"),
    },
    {
      id: "item_dark_theme",
      name:
        language === "kz"
          ? "Cyber Dark (Түнгі стиль)"
          : language === "en"
          ? "Cyber Dark Theme"
          : "Cyber Dark (Тёмная тема)",
      desc:
        language === "kz"
          ? "Кешкі уақытта көзді шаршатпай оқуға арналған стильді қараңғы тема"
          : language === "en"
          ? "Premium neon dark mode designed for eye comfort during night studies"
          : "Стильная неоновая тёмная тема для комфортной учёбы вечером",
      category: "theme",
      price: 350,
      icon: "dark_mode",
      badge: language === "kz" ? "Дизайн" : language === "en" ? "Theme" : "Тема",
      purchased: purchasedItems.includes("item_dark_theme"),
      isEquipped: activePerks.theme === "dark",
    },
    {
      id: "item_gold_avatar",
      name:
        language === "kz"
          ? "Newton Pro Алтын Рамкасы"
          : language === "en"
          ? "Newton Pro Golden Frame"
          : "Золотая рамка Newton Pro",
      desc:
        language === "kz"
          ? "Профиль мен негізгі шапкада алтын жарқыраған статус бейнесі"
          : language === "en"
          ? "Exclusive glowing gold crest around your avatar and level in the header"
          : "Эксклюзивная сияющая золотая рамка вокруг аватара и уровня в шапке",
      category: "skin",
      price: 300,
      icon: "military_tech",
      badge: language === "kz" ? "Статус" : language === "en" ? "Status" : "Статус",
      purchased: purchasedItems.includes("item_gold_avatar"),
      isEquipped: activePerks.goldAvatar,
    },
    {
      id: "item_cosmic_theme",
      name:
        language === "kz"
          ? "Ғарыштық Дизайн (Space)"
          : language === "en"
          ? "Deep Cosmic Skin"
          : "Космический стиль (Space)",
      desc:
        language === "kz"
          ? "Формулалар мен карта үшін футуристік ғарыш эффектілері"
          : language === "en"
          ? "Deep space nebula visual styling for formulas and knowledge map"
          : "Глубокий звёздный градиент для карточек формул и карты знаний",
      category: "theme",
      price: 280,
      icon: "auto_awesome",
      badge: language === "kz" ? "Ғарыш" : language === "en" ? "Cosmic" : "Скин",
      purchased: purchasedItems.includes("item_cosmic_theme"),
      isEquipped: activePerks.theme === "cosmic",
    },
    {
      id: "item_mentor_einstein",
      name:
        language === "kz"
          ? "Кейіпкер: Альберт ғалым"
          : language === "en"
          ? "Persona: Albert Mentor"
          : "Персонаж: Альберт",
      desc:
        language === "kz"
          ? "ИИ-тьютор жауаптарын Эйнштейн стиліндегі қызықты мысалдармен береді"
          : language === "en"
          ? "AI tutor explains with witty analogies and scientific humor like Einstein"
          : "ИИ-репетитор объясняет с весёлым научным юмором в стиле Эйнштейна",
      category: "skin",
      price: 250,
      icon: "psychology",
      badge: language === "kz" ? "Тұлға" : language === "en" ? "Persona" : "Персона",
      purchased: purchasedItems.includes("item_mentor_einstein"),
      isEquipped: activePerks.mentorPersona === "einstein",
    },
    {
      id: "item_raffle_ticket",
      name:
        language === "kz"
          ? "Мерч ұтыс билеті"
          : language === "en"
          ? "Weekly Raffle Ticket"
          : "Лотерейный билет на мерч",
      desc:
        language === "kz"
          ? "Newton брендтік худилері мен стикерпактарын ұтып алу мүмкіндігі"
          : language === "en"
          ? "Entry for the weekly draw of branded Newton hoodies and stickers"
          : "Билет для участия в еженедельном розыгрыше фирменных худи и подарков",
      category: "raffle",
      price: 80,
      icon: "confirmation_number",
      badge: language === "kz" ? "Ұтыс" : language === "en" ? "Raffle" : "Розыгрыш",
      purchased: purchasedItems.includes("item_raffle_ticket"),
    },
    {
      id: "item_genius_badge",
      name:
        language === "kz"
          ? "«STEM Шебері» Титулы"
          : language === "en"
          ? "«STEM Master» Title"
          : "Титул «Магистр STEM»",
      desc:
        language === "kz"
          ? "Профильде көрсетілетін құрметті академиялық мәртебе белгісі"
          : language === "en"
          ? "Prestigious master badge in profile honoring mastery of exact sciences"
          : "Почётный бейдж в профиле, подтверждающий глубокое понимание наук",
      category: "real_perk",
      price: 220,
      icon: "workspace_premium",
      badge: language === "kz" ? "Титул" : language === "en" ? "Mastery" : "Титул",
      purchased: purchasedItems.includes("item_genius_badge"),
      isEquipped: activePerks.geniusBadge,
    },
    {
      id: "item_coffee_break",
      name:
        language === "kz"
          ? "Ньютонмен кофе-брейк ☕"
          : language === "en"
          ? "Coffee Break with Newton ☕"
          : "Кофе-брейк с Ньютоном ☕",
      desc:
        language === "kz"
          ? "Миды демалтуға арналған күлкілі ғылыми комикстер мен мотивациялық әңгімелер"
          : language === "en"
          ? "Entertaining science comics and brain-relaxing fun facts from Newton"
          : "Забавные научные комиксы, парадоксы и мотивация для отдыха мозга",
      category: "real_perk",
      price: 90,
      icon: "coffee",
      badge: language === "kz" ? "Релакс" : language === "en" ? "Relax" : "Релакс",
      purchased: purchasedItems.includes("item_coffee_break"),
    },
  ];

  // Category filtering
  const filteredItems = shopCatalog.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "boost") return item.category === "boost" || item.category === "protection" || item.category === "power";
    if (activeCategory === "theme") return item.category === "theme" || item.category === "skin";
    if (activeCategory === "perks") return item.category === "raffle" || item.category === "real_perk";
    return true;
  });

  const handleClaim = (id: string, rewardNC: number, rewardXP: number = 0) => {
    if (claimedChallenges.includes(id)) return;
    onClaimChallenge(id, rewardNC, rewardXP);
    showToast(`🎉 +${rewardNC} NC ${rewardXP ? `и +${rewardXP} XP ` : ""}получено!`);
  };

  const handleBuy = (item: ShopItem) => {
    // If it's already purchased, check if it has an interactive action
    if (item.purchased) {
      if (item.id === "item_formula_sheet") {
        setFormulaModalOpen(true);
        return;
      }
      if (item.id === "item_coffee_break") {
        setCoffeeModalOpen(true);
        return;
      }
      if (item.id === "item_dark_theme") {
        const nextTheme = activePerks.theme === "dark" ? "default" : "dark";
        onTogglePerk("theme", nextTheme);
        showToast(nextTheme === "dark" ? "🌙 Cyber Dark тема включена!" : "☀️ Стандартная тема");
        return;
      }
      if (item.id === "item_cosmic_theme") {
        const nextTheme = activePerks.theme === "cosmic" ? "default" : "cosmic";
        onTogglePerk("theme", nextTheme);
        showToast(nextTheme === "cosmic" ? "🌌 Космический стиль включен!" : "☀️ Стандартная тема");
        return;
      }
      if (item.id === "item_gold_avatar") {
        const nextGold = !activePerks.goldAvatar;
        onTogglePerk("goldAvatar", nextGold);
        showToast(nextGold ? "👑 Золотая рамка Newton Pro активна!" : "Рамка снята");
        return;
      }
      if (item.id === "item_mentor_einstein") {
        const nextPersona = activePerks.mentorPersona === "einstein" ? "standard" : "einstein";
        onTogglePerk("mentorPersona", nextPersona);
        showToast(nextPersona === "einstein" ? "🧠 Профессор Альберт на связи!" : "Стандартный Ньютон");
        return;
      }
      if (item.id === "item_genius_badge") {
        const nextBadge = !activePerks.geniusBadge;
        onTogglePerk("geniusBadge", nextBadge);
        showToast(nextBadge ? "🏆 Титул Магистра STEM отображается!" : "Титул скрыт");
        return;
      }
      if (item.id === "item_streak_freeze") {
        // Can buy additional freeze protection
        if (coins < item.price) {
          showToast(t.notEnoughCoins);
          return;
        }
        const success = onBuyItem(item);
        if (success) {
          onTogglePerk("streakFreezes", (activePerks.streakFreezes || 0) + 1);
          showToast(`🛡️ Заморозка куплена! В запасе: ${(activePerks.streakFreezes || 0) + 1} шт.`);
        }
        return;
      }
      showToast("Уже в твоем инвентаре!");
      return;
    }

    if (coins < item.price) {
      showToast(t.notEnoughCoins);
      return;
    }

    const success = onBuyItem(item);
    if (success) {
      if (item.id === "item_double_xp") {
        onTogglePerk("doubleXpUntil", Date.now() + 24 * 3600 * 1000);
      } else if (item.id === "item_streak_freeze") {
        onTogglePerk("streakFreezes", (activePerks.streakFreezes || 0) + 1);
      } else if (item.id === "item_formula_sheet") {
        onTogglePerk("formulaSheetUnlocked", true);
      } else if (item.id === "item_dark_theme") {
        onTogglePerk("theme", "dark");
      } else if (item.id === "item_gold_avatar") {
        onTogglePerk("goldAvatar", true);
      } else if (item.id === "item_cosmic_theme") {
        onTogglePerk("theme", "cosmic");
      } else if (item.id === "item_mentor_einstein") {
        onTogglePerk("mentorPersona", "einstein");
      } else if (item.id === "item_genius_badge") {
        onTogglePerk("geniusBadge", true);
      }
      showToast(`🎉 ${item.name} куплен!`);
    }
  };

  const challenge1Claimed = claimedChallenges.includes("ch1");
  const challenge2Claimed = claimedChallenges.includes("ch2");
  const challenge3Claimed = claimedChallenges.includes("ch3");

  return (
    <div className="flex flex-col gap-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Top Profile Header */}
      <section className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wide">
            {t.studentTrack}
          </span>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-extrabold text-[#131b2e] tracking-tight">
              {t.studentTitle}
            </h2>
            {activePerks.goldAvatar && (
              <span className="text-amber-500 material-symbols-outlined text-[18px]" title="Newton Pro VIP">
                military_tech
              </span>
            )}
            {activePerks.geniusBadge && (
              <span className="text-purple-600 material-symbols-outlined text-[18px]" title="Магистр STEM">
                workspace_premium
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Daily Streak Flame */}
          <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700 border border-orange-200 shadow-2xs">
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span>
              {streak} {language === "kz" ? "күн" : language === "en" ? "days" : "дней"}
            </span>
          </div>

          {/* Persistent NC Tokens Pill */}
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#eaedff] to-[#dbe1ff] px-3 py-1 text-xs font-extrabold text-[#004ac6] border border-[#004ac6]/30 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">token</span>
            <span>{coins} NC</span>
          </div>
        </div>
      </section>

      {/* Daily Reward Banner (Clickable to open 7-day bonus tracker) */}
      <section
        onClick={onOpenDailyBonus}
        className="rounded-2xl p-3.5 bg-gradient-to-r from-[#eff4ff] via-[#eaedff] to-[#fbf7ee] border border-[#004ac6]/25 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#004ac6]/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#004ac6] to-[#3b82f6] text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">redeem</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-extrabold text-[#131b2e]">
                {language === "kz"
                  ? "Күнделікті бонус 🎁"
                  : language === "en"
                  ? "Daily Login Bonus 🎁"
                  : "Ежедневный бонус за вход 🎁"}
              </h4>
              {canClaimDaily ? (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold animate-pulse">
                  NEW
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#737686] mt-0.5 leading-snug">
              {canClaimDaily
                ? language === "kz"
                  ? `${dailyDayNumber}-күн сыйлығын алуға болады (+NC & XP)!`
                  : language === "en"
                  ? `Day ${dailyDayNumber} reward ready to claim (+NC & XP)!`
                  : `Бонус ${dailyDayNumber} дня ждёт тебя (+NC & XP)!`
                : language === "kz"
                ? "Бүгін алынды. 7 күндік бонустар күнтізбесі"
                : language === "en"
                ? "Claimed today. View 7-day reward streak"
                : "Сегодня получен. Открой календарь бонусов"}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#c3c6d7]/40 text-[#004ac6] text-xs font-bold shadow-2xs">
          <span>{canClaimDaily ? "Забрать" : "Смотреть"}</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </div>
      </section>

      {/* Critical Gap Milestone Hero Banner */}
      <section className="rounded-2xl bg-gradient-to-br from-[#004ac6] to-[#3b82f6] p-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider text-white">
            {t.heroBannerBadge}
          </span>
          <span className="text-[10px] font-bold bg-amber-400 text-[#410002] px-2 py-0.5 rounded-full shadow-2xs">
            {t.heroMultiplier}
          </span>
        </div>

        <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wide block">
          {t.heroCategory}
        </span>
        <h3 className="text-base font-extrabold leading-snug mt-0.5">
          {t.heroTitle}
        </h3>
        <p className="text-xs text-white/85 mt-1 leading-relaxed">
          {t.heroDesc}
        </p>

        <div className="mt-3 pt-2.5 border-t border-white/20 flex flex-col gap-1 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{t.rewardAccrued}</span>
          </div>
          <span className="text-white/70 text-[10px]">{t.guideUpdated}</span>
        </div>
      </section>

      {/* Active Boosters Info Bar */}
      {(activePerks.doubleXpUntil > Date.now() || (activePerks.streakFreezes || 0) > 0) && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {activePerks.doubleXpUntil > Date.now() && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shrink-0">
              <span className="material-symbols-outlined text-[16px] text-amber-600">bolt</span>
              <span>2X XP Активен (24ч)</span>
            </div>
          )}
          {(activePerks.streakFreezes || 0) > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold shrink-0">
              <span className="material-symbols-outlined text-[16px] text-[#004ac6]">ac_unit</span>
              <span>Защит стрика: {activePerks.streakFreezes} шт.</span>
            </div>
          )}
        </div>
      )}

      {/* Route Challenges (Saved Permanently) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#131b2e]">{t.challengesTitle}</h4>
            <p className="text-[10px] text-[#737686]">{t.challengesSubtitle}</p>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#eaedff] text-[#004ac6]">
            {t.activeCount}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Challenge 1: Fractions Master */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-bold text-[#131b2e]">
                    {t.challenges.challenge1Title}
                  </h5>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    +100 NC
                  </span>
                </div>
                <p className="text-[10px] text-[#737686] mt-0.5 leading-snug">
                  {t.challenges.challenge1Desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleClaim("ch1", 100, 100)}
              disabled={challenge1Claimed}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                challenge1Claimed
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-95"
              }`}
            >
              {challenge1Claimed ? "✓" : t.challenges.claimBtn}
            </button>
          </div>

          {/* Challenge 2: Trainer Sprint */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-blue-100 text-[#004ac6] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-bold text-[#131b2e]">
                    {t.challenges.challenge2Title}
                  </h5>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                    +150 NC
                  </span>
                </div>
                <p className="text-[10px] text-[#737686] mt-0.5 leading-snug">
                  {t.challenges.challenge2Desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleClaim("ch2", 150, 120)}
              disabled={challenge2Claimed}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                challenge2Claimed
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#004ac6] hover:bg-[#2563eb] text-white shadow-xs cursor-pointer active:scale-95"
              }`}
            >
              {challenge2Claimed ? "✓" : t.challenges.claimBtn}
            </button>
          </div>

          {/* Challenge 3: Weekly Epic */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#c3c6d7]/30 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">track_changes</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-bold text-[#131b2e]">
                    {t.challenges.challenge3Title}
                  </h5>
                  <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                    +250 NC
                  </span>
                </div>
                <p className="text-[10px] text-[#737686] mt-0.5 leading-snug">
                  {t.challenges.challenge3Desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleClaim("ch3", 250, 200)}
              disabled={challenge3Claimed}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                challenge3Claimed
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer active:scale-95"
              }`}
            >
              {challenge3Claimed ? "✓" : t.challenges.claimBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Expanded Rewards Store with Categories */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-[#131b2e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#004ac6]">storefront</span>
              <span>{t.storeTitle}</span>
            </h4>
            <p className="text-[10px] text-[#737686]">{t.storeSubtitle}</p>
          </div>
          <span className="text-xs font-extrabold text-[#004ac6] bg-[#eaedff] px-2.5 py-1 rounded-xl border border-[#004ac6]/20">
            {coins} NC
          </span>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-xl bg-[#eaedff]">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "text-[#434655] hover:text-[#131b2e]"
            }`}
          >
            {language === "kz" ? "Барлығы (12)" : language === "en" ? "All (12)" : "Все плюшки (12)"}
          </button>
          <button
            onClick={() => setActiveCategory("boost")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === "boost"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "text-[#434655] hover:text-[#131b2e]"
            }`}
          >
            ⚡ {language === "kz" ? "Бустерлер" : language === "en" ? "Boosts" : "Бустеры"}
          </button>
          <button
            onClick={() => setActiveCategory("theme")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === "theme"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "text-[#434655] hover:text-[#131b2e]"
            }`}
          >
            🎨 {language === "kz" ? "Скиндер" : language === "en" ? "Themes" : "Скины и Темы"}
          </button>
          <button
            onClick={() => setActiveCategory("perks")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === "perks"
                ? "bg-[#004ac6] text-white shadow-xs"
                : "text-[#434655] hover:text-[#131b2e]"
            }`}
          >
            🏆 {language === "kz" ? "Жүлделер" : language === "en" ? "Perks" : "Призы & VIP"}
          </button>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredItems.map((item) => {
            const isPurchased = item.purchased;
            const isEquipped = item.isEquipped;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-xs ${
                  isEquipped
                    ? "border-[#004ac6] ring-2 ring-[#004ac6]/20 bg-gradient-to-b from-[#faf8ff] to-[#f0f3ff]"
                    : "border-[#c3c6d7]/30 hover:border-[#004ac6]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`size-8 rounded-xl flex items-center justify-center ${
                        isPurchased
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#eaedff] text-[#004ac6]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#f2f3ff] text-[#434655]">
                      {item.badge}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-[#131b2e] leading-snug">
                    {item.name}
                  </h5>
                  <p className="text-[10px] text-[#737686] mt-1 leading-snug line-clamp-2">
                    {item.desc}
                  </p>

                  {/* Additional info badge */}
                  {item.inventoryCount !== undefined && item.inventoryCount > 0 && (
                    <span className="inline-block mt-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                      В запасе: {item.inventoryCount} шт.
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-[#c3c6d7]/20 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#004ac6]">
                    {item.price} NC
                  </span>

                  <button
                    onClick={() => handleBuy(item)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isEquipped
                        ? "bg-emerald-600 text-white"
                        : isPurchased
                        ? item.id === "item_formula_sheet"
                          ? "bg-[#004ac6] text-white hover:bg-[#2563eb]"
                          : item.id === "item_streak_freeze"
                          ? "bg-[#eaedff] text-[#004ac6] hover:bg-[#dbe1ff]"
                          : "bg-gray-100 text-[#131b2e] hover:bg-[#eaedff]"
                        : "bg-[#004ac6] text-white hover:bg-[#2563eb]"
                    }`}
                  >
                    {isEquipped
                      ? "Активно ✓"
                      : isPurchased
                      ? item.id === "item_formula_sheet"
                        ? "Открыть 📖"
                        : item.id === "item_coffee_break"
                        ? "Читать ☕"
                        : item.id === "item_streak_freeze"
                        ? "+1 Еще"
                        : "Включить"
                      : t.buyBtn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Mega Prize Item */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#fbfaff] via-[#f5f7ff] to-[#eff4ff] border border-[#004ac6]/30 shadow-xs flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 material-symbols-outlined text-[18px]">workspace_premium</span>
              <span className="text-xs font-bold text-[#131b2e]">{t.items.featuredTitle}</span>
            </div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {t.items.featuredBadge}
            </span>
          </div>
          <p className="text-[11px] text-[#737686] leading-snug">
            {t.items.featuredDesc}
          </p>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-[10px] font-semibold text-[#434655]">
              <span>{t.items.featuredProgress}</span>
              <span className="text-[#004ac6] font-extrabold">{coins} / 1200 NC</span>
            </div>
            <div className="w-full bg-[#e2e7ff] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#004ac6] to-[#2563eb] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (coins / 1200) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Formula Sheet Modal */}
      <FormulaSheetModal
        language={language}
        isOpen={formulaModalOpen}
        onClose={() => setFormulaModalOpen(false)}
      />

      {/* Coffee Break Motivation Modal */}
      {coffeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 border border-[#004ac6]/20 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/30">
              <h3 className="text-sm font-extrabold text-[#131b2e] flex items-center gap-1.5">
                <span>☕ Кофе-брейк с Ньютоном</span>
              </h3>
              <button
                onClick={() => setCoffeeModalOpen(false)}
                className="size-7 rounded-full bg-[#eaedff] text-[#434655] hover:text-[#131b2e] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs text-[#131b2e] leading-relaxed">
              <p className="font-semibold text-[#004ac6]">
                «Если я видел дальше других, то потому, что стоял на плечах гигантов!» — Исаак Ньютон
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                💡 <strong>Научный факт дня:</strong> Если бы яблоко падало в вакууме рядом с пером, они упали бы с абсолютно одинаковой скоростью!
              </div>
              <p className="text-[#737686] text-[11px]">
                Сделай 2 глубоких вдоха, выпей воды и продолжай путь к своим целям!
              </p>
            </div>
            <button
              onClick={() => setCoffeeModalOpen(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#004ac6] text-white text-xs font-bold cursor-pointer hover:bg-[#2563eb]"
            >
              Отдохнул, возвращаюсь к задачам! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#131b2e] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
