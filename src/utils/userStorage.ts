import { Language } from "../types";

export interface ActivePerks {
  theme: "default" | "dark" | "cosmic";
  goldAvatar: boolean;
  doubleXpUntil: number; // timestamp
  streakFreezes: number;
  formulaSheetUnlocked: boolean;
  mentorPersona: "standard" | "einstein";
  geniusBadge: boolean;
}

export interface DailyCheckInState {
  lastDate: string; // YYYY-MM-DD
  dayNumber: number; // 1 - 7
  claimedToday: boolean;
}

export const DAILY_REWARDS = [
  { day: 1, coins: 50, xp: 50, icon: "token", badge: "Старт" },
  { day: 2, coins: 75, xp: 75, icon: "stars", badge: "Темп" },
  { day: 3, coins: 100, xp: 100, icon: "local_fire_department", badge: "Огонь" },
  { day: 4, coins: 125, xp: 125, icon: "bolt", badge: "Энергия" },
  { day: 5, coins: 150, xp: 150, icon: "diamond", badge: "Кристалл" },
  { day: 6, coins: 200, xp: 200, icon: "military_tech", badge: "Мастер" },
  { day: 7, coins: 300, xp: 300, icon: "workspace_premium", badge: "Двойной Джекпот 🔥" },
];

const KEYS = {
  COINS: "ai_tutor_coins",
  XP: "ai_tutor_xp",
  STREAK: "ai_tutor_streak",
  LEVEL: "ai_tutor_level",
  PURCHASED: "ai_tutor_purchased_items",
  CLAIMED_CHALLENGES: "ai_tutor_claimed_challenges",
  ACTIVE_PERKS: "ai_tutor_active_perks",
  DAILY_CHECKIN: "ai_tutor_daily_checkin",
};

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getStoredCoins(): number {
  try {
    const val = localStorage.getItem(KEYS.COINS);
    return val !== null ? Math.max(0, parseInt(val, 10) || 0) : 420;
  } catch {
    return 420;
  }
}

export function setStoredCoins(val: number): void {
  try {
    localStorage.setItem(KEYS.COINS, Math.max(0, val).toString());
  } catch (e) {
    console.error(e);
  }
}

export function getStoredXP(): number {
  try {
    const val = localStorage.getItem(KEYS.XP);
    return val !== null ? Math.max(0, parseInt(val, 10) || 0) : 1420;
  } catch {
    return 1420;
  }
}

export function setStoredXP(val: number): void {
  try {
    localStorage.setItem(KEYS.XP, Math.max(0, val).toString());
  } catch (e) {
    console.error(e);
  }
}

export function getStoredStreak(): number {
  try {
    const val = localStorage.getItem(KEYS.STREAK);
    return val !== null ? Math.max(1, parseInt(val, 10) || 1) : 7;
  } catch {
    return 7;
  }
}

export function setStoredStreak(val: number): void {
  try {
    localStorage.setItem(KEYS.STREAK, Math.max(1, val).toString());
  } catch (e) {
    console.error(e);
  }
}

export function getStoredLevel(): number {
  try {
    const val = localStorage.getItem(KEYS.LEVEL);
    return val !== null ? Math.max(1, parseInt(val, 10) || 1) : 14;
  } catch {
    return 14;
  }
}

export function setStoredLevel(val: number): void {
  try {
    localStorage.setItem(KEYS.LEVEL, Math.max(1, val).toString());
  } catch (e) {
    console.error(e);
  }
}

export function getStoredPurchased(): string[] {
  try {
    const val = localStorage.getItem(KEYS.PURCHASED);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function setStoredPurchased(items: string[]): void {
  try {
    localStorage.setItem(KEYS.PURCHASED, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredClaimedChallenges(): string[] {
  try {
    const val = localStorage.getItem(KEYS.CLAIMED_CHALLENGES);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function setStoredClaimedChallenges(challenges: string[]): void {
  try {
    localStorage.setItem(KEYS.CLAIMED_CHALLENGES, JSON.stringify(challenges));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredActivePerks(): ActivePerks {
  const defaultPerks: ActivePerks = {
    theme: "default",
    goldAvatar: false,
    doubleXpUntil: 0,
    streakFreezes: 0,
    formulaSheetUnlocked: false,
    mentorPersona: "standard",
    geniusBadge: false,
  };
  try {
    const val = localStorage.getItem(KEYS.ACTIVE_PERKS);
    if (!val) return defaultPerks;
    return { ...defaultPerks, ...JSON.parse(val) };
  } catch {
    return defaultPerks;
  }
}

export function setStoredActivePerks(perks: ActivePerks): void {
  try {
    localStorage.setItem(KEYS.ACTIVE_PERKS, JSON.stringify(perks));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredDailyCheckIn(): DailyCheckInState {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  const defaultState: DailyCheckInState = {
    lastDate: "",
    dayNumber: 1,
    claimedToday: false,
  };

  try {
    const val = localStorage.getItem(KEYS.DAILY_CHECKIN);
    if (!val) return defaultState;
    const parsed: DailyCheckInState = JSON.parse(val);

    if (parsed.lastDate === today) {
      return { ...parsed, claimedToday: true };
    }

    if (parsed.lastDate === yesterday) {
      // Continuing consecutive streak
      const nextDay = parsed.dayNumber >= 7 ? 1 : parsed.dayNumber + 1;
      return {
        lastDate: parsed.lastDate,
        dayNumber: nextDay,
        claimedToday: false,
      };
    }

    // Missed a day or first time
    return {
      lastDate: parsed.lastDate || "",
      dayNumber: 1,
      claimedToday: false,
    };
  } catch {
    return defaultState;
  }
}

export function setStoredDailyCheckIn(state: DailyCheckInState): void {
  try {
    localStorage.setItem(KEYS.DAILY_CHECKIN, JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}
