// ===================================================================
// ETHIO-LIFE: Perfect Ethiopian Calendar Engine
// Handles the Sept 11 year crossover correctly
// ===================================================================

export const ETH_MONTHS = [
  { name: 'Meskerem', amharic: 'መስከረም', days: 30 },
  { name: 'Tikimt', amharic: 'ጥቅምት', days: 30 },
  { name: 'Hidar', amharic: 'ኅዳር', days: 30 },
  { name: 'Tahsas', amharic: 'ታኅሣሥ', days: 30 },
  { name: 'Tir', amharic: 'ጥር', days: 30 },
  { name: 'Yekatit', amharic: 'የካቲት', days: 30 },
  { name: 'Megabit', amharic: 'መጋቢት', days: 30 },
  { name: 'Miyazia', amharic: 'ሚያዝያ', days: 30 },
  { name: 'Ginbot', amharic: 'ግንቦት', days: 30 },
  { name: 'Sene', amharic: 'ሰኔ', days: 30 },
  { name: 'Hamle', amharic: 'ሐምሌ', days: 30 },
  { name: 'Nehase', amharic: 'ነሐሴ', days: 30 },
  { name: 'Pagume', amharic: 'ጳጉሜ', days: 5 },
] as const;

export const GEEZ_NUMBERS: Record<number, string> = {
  1: '፩', 2: '፪', 3: '፫', 4: '፬', 5: '፭',
  6: '፮', 7: '፯', 8: '፰', 9: '፱', 10: '፲',
  11: '፲፩', 12: '፲፪', 13: '፲፫', 14: '፲፬', 15: '፲፭',
  16: '፲፮', 17: '፲፯', 18: '፲፰', 19: '፲፱', 20: '፳',
  21: '፳፩', 22: '፳፪', 23: '፳፫', 24: '፳፬', 25: '፳፭',
  26: '፳፮', 27: '፳፯', 28: '፳፰', 29: '፳፱', 30: '፴',
};

export const AMHARIC_DAYS = [
  { name: 'Ehud', amharic: 'እሑድ' },      // Sunday
  { name: 'Segno', amharic: 'ሰኞ' },       // Monday
  { name: 'Maksegno', amharic: 'ማክሰኞ' },  // Tuesday
  { name: 'Rob', amharic: 'ሮብ' },         // Wednesday
  { name: 'Hamus', amharic: 'ሐሙስ' },     // Thursday
  { name: 'Arb', amharic: 'ዓርብ' },       // Friday
  { name: 'Kidame', amharic: 'ቅዳሜ' },    // Saturday
];

export interface EthiopianDate {
  year: number;
  month: number; // 1-13
  day: number;   // 1-30 (or 1-6 for Pagume)
  monthName: string;
  monthAmharic: string;
  dayGeez: string;
  dayName: string;
  dayAmharic: string;
  fullString: string;
  fullAmharic: string;
}

export interface HolyDay {
  name: string;
  amharic: string;
  ethMonth: number;
  ethDay: number;
  description: string;
}

export const HOLY_DAYS: HolyDay[] = [
  { name: 'Enkutatash', amharic: 'እንቁጣጣሽ', ethMonth: 1, ethDay: 1, description: 'Ethiopian New Year' },
  { name: 'Meskel', amharic: 'መስቀል', ethMonth: 1, ethDay: 17, description: 'Finding of the True Cross' },
  { name: 'Genna', amharic: 'ገና', ethMonth: 4, ethDay: 29, description: 'Ethiopian Christmas' },
  { name: 'Timket', amharic: 'ጥምቀት', ethMonth: 5, ethDay: 11, description: 'Ethiopian Epiphany' },
  { name: 'Adwa Victory', amharic: 'የአድዋ ድል', ethMonth: 6, ethDay: 23, description: 'Battle of Adwa' },
  { name: 'Fasika', amharic: 'ፋሲካ', ethMonth: 8, ethDay: 27, description: 'Ethiopian Easter (varies)' },
  { name: 'May Day', amharic: 'የሰራተኛ ቀን', ethMonth: 8, ethDay: 23, description: 'Workers Day' },
  { name: 'Patriots Day', amharic: 'የአርበኞች ቀን', ethMonth: 8, ethDay: 27, description: 'Victory over Fascism' },
  { name: 'Downfall of Derg', amharic: 'ደርግ የወደቀበት', ethMonth: 9, ethDay: 20, description: 'End of Derg Regime' },
  { name: 'Kidus Giorgis', amharic: 'ቅዱስ ጊዮርጊስ', ethMonth: 1, ethDay: 23, description: 'St. George Day (monthly)' },
];

// Core JDN-based conversion — handles leap years and crossover perfectly
function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToEthiopian(jdn: number): { year: number; month: number; day: number } {
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;
  return { year, month, day };
}

function ethiopianToJDN(year: number, month: number, day: number): number {
  return 1723856 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

export function gregorianToEthiopian(gDate: Date): EthiopianDate {
  const jdn = gregorianToJDN(gDate.getFullYear(), gDate.getMonth() + 1, gDate.getDate());
  const eth = jdnToEthiopian(jdn);

  const monthInfo = ETH_MONTHS[eth.month - 1];
  const dayOfWeek = gDate.getDay(); // 0=Sun
  const dayInfo = AMHARIC_DAYS[dayOfWeek];
  const geez = GEEZ_NUMBERS[eth.day] || String(eth.day);

  return {
    year: eth.year,
    month: eth.month,
    day: eth.day,
    monthName: monthInfo.name,
    monthAmharic: monthInfo.amharic,
    dayGeez: geez,
    dayName: dayInfo.name,
    dayAmharic: dayInfo.amharic,
    fullString: `${monthInfo.name} ${eth.day}, ${eth.year}`,
    fullAmharic: `${monthInfo.amharic} ${geez}፣ ${eth.year}`,
  };
}

export function ethiopianToGregorian(ethYear: number, ethMonth: number, ethDay: number): Date {
  const jdn = ethiopianToJDN(ethYear, ethMonth, ethDay);
  const g = jdnToGregorian(jdn);
  return new Date(g.year, g.month - 1, g.day);
}

export function getHolyDay(ethMonth: number, ethDay: number): HolyDay | undefined {
  return HOLY_DAYS.find(h => h.ethMonth === ethMonth && h.ethDay === ethDay);
}

export function isEthiopianLeapYear(ethYear: number): boolean {
  return ethYear % 4 === 3;
}

export function getMonthDays(ethMonth: number, ethYear: number): number {
  if (ethMonth === 13) return isEthiopianLeapYear(ethYear) ? 6 : 5;
  return 30;
}

// Get the Gregorian weekday of the 1st day of an Ethiopian month
export function getFirstDayOfEthMonth(ethYear: number, ethMonth: number): number {
  const gDate = ethiopianToGregorian(ethYear, ethMonth, 1);
  return gDate.getDay(); // 0=Sun
}

// GOOGLE SHEETS FORMULAS — the exact formulas users need
export const FORMULAS = {
  dateSequence: `=SEQUENCE(2557, 1, DATE(2024,1,1), 1)`,

  yearCorrection: `=ARRAYFORMULA(
  IF(A2:A="", "",
    IF(
      DATE(YEAR(A2:A), 9, 11) > A2:A,
      YEAR(A2:A) - 8,
      YEAR(A2:A) - 7
    )
  )
)`,

  ethMonth: `=ARRAYFORMULA(
  IF(A2:A="", "",
    IFS(
      AND(MONTH(A2:A)=9, DAY(A2:A)>=11, OR(MONTH(A2:A)<10, AND(MONTH(A2:A)=10, DAY(A2:A)<=10))),  "Meskerem",
      (MONTH(A2:A)=9)*( DAY(A2:A)>=11) + (MONTH(A2:A)=10)*(DAY(A2:A)<=10) > 0,                      "Meskerem",
      (MONTH(A2:A)=10)*(DAY(A2:A)>=11) + (MONTH(A2:A)=11)*(DAY(A2:A)<=9) > 0,                       "Tikimt",
      (MONTH(A2:A)=11)*(DAY(A2:A)>=10) + (MONTH(A2:A)=12)*(DAY(A2:A)<=9) > 0,                       "Hidar",
      (MONTH(A2:A)=12)*(DAY(A2:A)>=10) + (MONTH(A2:A)=1)*(DAY(A2:A)<=8) > 0,                        "Tahsas",
      (MONTH(A2:A)=1)*(DAY(A2:A)>=9) + (MONTH(A2:A)=2)*(DAY(A2:A)<=7) > 0,                          "Tir",
      (MONTH(A2:A)=2)*(DAY(A2:A)>=8) + (MONTH(A2:A)=3)*(DAY(A2:A)<=9) > 0,                          "Yekatit",
      (MONTH(A2:A)=3)*(DAY(A2:A)>=10) + (MONTH(A2:A)=4)*(DAY(A2:A)<=8) > 0,                         "Megabit",
      (MONTH(A2:A)=4)*(DAY(A2:A)>=9) + (MONTH(A2:A)=5)*(DAY(A2:A)<=8) > 0,                          "Miyazia",
      (MONTH(A2:A)=5)*(DAY(A2:A)>=9) + (MONTH(A2:A)=6)*(DAY(A2:A)<=7) > 0,                          "Ginbot",
      (MONTH(A2:A)=6)*(DAY(A2:A)>=8) + (MONTH(A2:A)=7)*(DAY(A2:A)<=7) > 0,                          "Sene",
      (MONTH(A2:A)=7)*(DAY(A2:A)>=8) + (MONTH(A2:A)=8)*(DAY(A2:A)<=6) > 0,                          "Hamle",
      (MONTH(A2:A)=8)*(DAY(A2:A)>=7) + (MONTH(A2:A)=9)*(DAY(A2:A)<=5) > 0,                          "Nehase",
      (MONTH(A2:A)=9)*(DAY(A2:A)>=6)*(DAY(A2:A)<=10) > 0,                                           "Pagume",
      TRUE, "Check"
    )
  )
)`,

  ethMonthSimplified: `=ARRAYFORMULA(
  IF(A2:A="", "",
    VLOOKUP(
      MONTH(A2:A)*100 + DAY(A2:A),
      {
        901, "Pagume";
        906, "Pagume";
        910, "Pagume";
        911, "Meskerem";
        1011, "Tikimt";
        1110, "Hidar";
        1210, "Tahsas";
        109, "Tir";
        208, "Yekatit";
        310, "Megabit";
        409, "Miyazia";
        509, "Ginbot";
        608, "Sene";
        708, "Hamle";
        807, "Nehase"
      },
      2,
      TRUE
    )
  )
)`,

  ethDay: `=ARRAYFORMULA(
  IF(A2:A="","",
    IF(
      DATE(YEAR(A2:A),9,11) > A2:A,
      MOD(A2:A - DATE(YEAR(A2:A)-1,9,10) - 1, 30) + 1,
      MOD(A2:A - DATE(YEAR(A2:A),9,10) - 1, 30) + 1
    )
  )
)`,

  ethDayPrecise: `=ARRAYFORMULA(
  IF(A2:A="", "",
    IF(
      A2:A >= DATE(YEAR(A2:A), 9, 11),
      A2:A - DATE(YEAR(A2:A), 9, 10) - 30*INT((A2:A - DATE(YEAR(A2:A), 9, 11))/30),
      A2:A - DATE(YEAR(A2:A)-1, 9, 10) - 30*INT((A2:A - DATE(YEAR(A2:A)-1, 9, 11))/30)
    )
  )
)`,

  geezDay: `=ARRAYFORMULA(
  IF(B2:B="", "",
    VLOOKUP(B2:B,
      {1,"፩";2,"፪";3,"፫";4,"፬";5,"፭";6,"፮";7,"፯";8,"፰";9,"፱";10,"፲";
       11,"፲፩";12,"፲፪";13,"፲፫";14,"፲፬";15,"፲፭";16,"፲፮";17,"፲፯";18,"፲፰";
       19,"፲፱";20,"፳";21,"፳፩";22,"፳፪";23,"፳፫";24,"፳፬";25,"፳፭";26,"፳፮";
       27,"፳፯";28,"፳፰";29,"፳፱";30,"፴"},
      2, FALSE)
  )
)`,

  fullEthDate: `=ARRAYFORMULA(
  IF(A2:A="", "",
    C2:C & " " & B2:B & ", " & D2:D
  )
)`,

  specialEvent: `=ARRAYFORMULA(
  IF(A2:A="","",
    IFS(
      AND(C2:C="Meskerem", B2:B=1), "🎉 Enkutatash",
      AND(C2:C="Meskerem", B2:B=17), "✝️ Meskel",
      AND(C2:C="Tahsas", B2:B=29), "🎄 Genna",
      AND(C2:C="Tir", B2:B=11), "💧 Timket",
      AND(C2:C="Yekatit", B2:B=23), "⚔️ Adwa Victory",
      TRUE, ""
    )
  )
)`,

  seasonImage: `=ARRAYFORMULA(
  IF(A2:A="","",
    IFS(
      OR(C2:C="Meskerem", C2:C="Tikimt", C2:C="Hidar"), "🌸 Tseday (Spring)",
      OR(C2:C="Tahsas", C2:C="Tir", C2:C="Yekatit"), "❄️ Bega (Harvest)",
      OR(C2:C="Megabit", C2:C="Miyazia", C2:C="Ginbot"), "🌞 Belg (Small Rains)",
      OR(C2:C="Sene", C2:C="Hamle", C2:C="Nehase", C2:C="Pagume"), "🌧️ Kiremt (Rainy)",
      TRUE, ""
    )
  )
)`,
};

// Month crossover reference data for the guide
export const MONTH_CROSSOVER = [
  { ethMonth: 'Meskerem', from: 'Sep 11', to: 'Oct 10', days: 30 },
  { ethMonth: 'Tikimt', from: 'Oct 11', to: 'Nov 9', days: 30 },
  { ethMonth: 'Hidar', from: 'Nov 10', to: 'Dec 9', days: 30 },
  { ethMonth: 'Tahsas', from: 'Dec 10', to: 'Jan 8', days: 30 },
  { ethMonth: 'Tir', from: 'Jan 9', to: 'Feb 7', days: 30 },
  { ethMonth: 'Yekatit', from: 'Feb 8', to: 'Mar 9', days: 30 },
  { ethMonth: 'Megabit', from: 'Mar 10', to: 'Apr 8', days: 30 },
  { ethMonth: 'Miyazia', from: 'Apr 9', to: 'May 8', days: 30 },
  { ethMonth: 'Ginbot', from: 'May 9', to: 'Jun 7', days: 30 },
  { ethMonth: 'Sene', from: 'Jun 8', to: 'Jul 7', days: 30 },
  { ethMonth: 'Hamle', from: 'Jul 8', to: 'Aug 6', days: 30 },
  { ethMonth: 'Nehase', from: 'Aug 7', to: 'Sep 5', days: 30 },
  { ethMonth: 'Pagume', from: 'Sep 6', to: 'Sep 10', days: '5/6' },
];
