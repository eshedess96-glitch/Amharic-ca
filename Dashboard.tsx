import { useState, useEffect } from 'react';
import {
  gregorianToEthiopian,
  ethiopianToGregorian,
  getHolyDay,
  getMonthDays,
  getFirstDayOfEthMonth,
  ETH_MONTHS,
  GEEZ_NUMBERS,
  AMHARIC_DAYS,
  HOLY_DAYS,
} from '../utils/ethiopianCalendar';
import { getTodayEOTCEvents, computeFasika } from '../utils/eotcCalendar';
import {
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Sun,
  CloudRain,
  Snowflake,
  Flower2,
  Crown,
} from 'lucide-react';

function getSeasonInfo(ethMonth: number) {
  if (ethMonth >= 1 && ethMonth <= 3) return { label: 'Tseday (Spring)', icon: Flower2, color: 'text-pink-400', emoji: '🌸' };
  if (ethMonth >= 4 && ethMonth <= 6) return { label: 'Bega (Harvest)', icon: Snowflake, color: 'text-blue-300', emoji: '❄️' };
  if (ethMonth >= 7 && ethMonth <= 9) return { label: 'Belg (Autumn)', icon: Sun, color: 'text-yellow-400', emoji: '🌞' };
  return { label: 'Kiremt (Rainy)', icon: CloudRain, color: 'text-cyan-400', emoji: '🌧️' };
}

export default function Dashboard() {
  const [now, setNow] = useState(new Date());
  const today = gregorianToEthiopian(now);
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const season = getSeasonInfo(today.month);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const holyDay = getHolyDay(today.month, today.day);
  const eotcToday = getTodayEOTCEvents(today.month, today.day, today.year);
  const fasikaThisYear = computeFasika(today.year);
  const monthDays = getMonthDays(viewMonth, viewYear);
  const firstDay = getFirstDayOfEthMonth(viewYear, viewMonth);
  const viewMonthInfo = ETH_MONTHS[viewMonth - 1];

  const isToday = (d: number) =>
    viewYear === today.year && viewMonth === today.month && d === today.day;

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= monthDays; d++) calendarCells.push(d);

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(13); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 13) { setViewMonth(1); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const goToday = () => {
    setViewYear(today.year);
    setViewMonth(today.month);
  };

  const gregFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="fade-in space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-eth-coffee-dark via-eth-coffee to-eth-coffee-light p-6 md:p-8 glow-card">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-8xl opacity-20">✦</div>
          <div className="absolute bottom-4 left-4 text-6xl opacity-15">✦</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-[0.03]">☥</div>
        </div>

        <div className="relative z-10">
          {/* Season badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <span>{season.emoji}</span>
            <span className="text-eth-gold text-sm font-medium">{season.label}</span>
          </div>

          {/* Ethiopian Date - Large */}
          <div className="mb-2">
            <h1 className="text-4xl md:text-6xl font-bold text-eth-gold glow-gold geez-num">
              {today.monthAmharic} {today.dayGeez}
            </h1>
            <p className="text-2xl md:text-3xl text-eth-gold-light mt-1">
              {today.fullString}
            </p>
          </div>

          {/* Gregorian Date */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="text-white/60 text-sm">Gregorian Calendar</p>
                <p className="text-white text-lg">{gregFormatted}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">Time</p>
                <p className="text-white text-2xl font-mono">{timeFormatted}</p>
              </div>
            </div>
          </div>

          {/* Day name */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-white/50 text-sm">Today is</span>
            <span className="text-eth-gold font-semibold">{today.dayAmharic} ({today.dayName})</span>
          </div>

          {/* Holy Day banner — EOTC monthly saints */}
          {eotcToday.monthlyFestivals.length > 0 && (
            <div className="mt-4 space-y-2">
              {eotcToday.monthlyFestivals.map(f => (
                <div key={f.saint} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-purple-200 font-bold text-sm">{f.saint}</p>
                    <p className="text-purple-300/60 text-xs geez-num">{f.amharic}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {eotcToday.yearlyFestivals.length > 0 && (
            <div className="mt-2 space-y-2">
              {eotcToday.yearlyFestivals.map(f => (
                <div key={f.id} className="bg-eth-gold/20 border border-eth-gold/30 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-eth-gold font-bold text-sm">{f.name}</p>
                    <p className="text-white/60 text-xs">{f.description.substring(0, 80)}…</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {holyDay && eotcToday.monthlyFestivals.length === 0 && eotcToday.yearlyFestivals.length === 0 && (
            <div className="mt-4 bg-eth-gold/20 border border-eth-gold/30 rounded-xl p-3 flex items-center gap-3">
              <Star className="w-5 h-5 text-eth-gold flex-shrink-0" fill="currentColor" />
              <div>
                <p className="text-eth-gold font-bold">{holyDay.name} — {holyDay.amharic}</p>
                <p className="text-white/70 text-sm">{holyDay.description}</p>
              </div>
            </div>
          )}
          {/* Fasika countdown */}
          {(() => {
            const today2 = new Date();
            const fasikaDate = new Date(fasikaThisYear.gregDate);
            const diff = Math.ceil((fasikaDate.getTime() - today2.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > 0 && diff <= 60) {
              return (
                <div className="mt-3 bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl">🌅</span>
                  <div>
                    <p className="text-yellow-300 font-bold text-sm">Fasika in {diff} days!</p>
                    <p className="text-yellow-400/60 text-xs">
                      {ETH_MONTHS[fasikaThisYear.ethMonth - 1].name} {fasikaThisYear.ethDay} E.C.
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Calendar header */}
        <div className="bg-eth-red/80 px-4 py-3 flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-white font-bold text-lg geez-num">
              {viewMonthInfo.amharic} — {viewMonthInfo.name}
            </h2>
            <p className="text-white/70 text-sm">{viewYear} E.C.</p>
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Today button */}
        {(viewYear !== today.year || viewMonth !== today.month) && (
          <div className="px-4 py-2 bg-eth-gold/10 border-b border-white/5">
            <button onClick={goToday} className="text-eth-gold text-sm flex items-center gap-1 hover:underline">
              <Calendar className="w-4 h-4" /> Back to Today
            </button>
          </div>
        )}

        {/* Day headers */}
        <div className="grid grid-cols-7 bg-white/5">
          {AMHARIC_DAYS.map(d => (
            <div key={d.name} className="text-center py-2 text-xs text-white/50 font-medium">
              <span className="hidden md:inline">{d.amharic}</span>
              <span className="md:hidden">{d.name.substring(0, 2)}</span>
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-px bg-white/5 p-1">
          {calendarCells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;
            const holy = getHolyDay(viewMonth, day);
            const todayCell = isToday(day);
            const gDate = ethiopianToGregorian(viewYear, viewMonth, day);
            const gDay = gDate.getDate();
            const gMonth = gDate.toLocaleDateString('en', { month: 'short' });

            return (
              <div
                key={`day-${day}`}
                className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center transition-all cursor-default
                  ${todayCell
                    ? 'bg-eth-gold text-eth-coffee-dark ring-2 ring-eth-gold shadow-lg shadow-eth-gold/30'
                    : 'parchment-tile hover:scale-[1.02]'
                  }
                  ${holy ? 'ring-1 ring-eth-red/50' : ''}
                `}
              >
                <span className={`text-sm md:text-base font-bold geez-num ${todayCell ? 'text-eth-coffee-dark' : 'text-eth-coffee'}`}>
                  {GEEZ_NUMBERS[day] || day}
                </span>
                <span className={`text-[10px] ${todayCell ? 'text-eth-coffee/70' : 'text-gray-500'}`}>
                  {gMonth} {gDay}
                </span>
                {holy && (
                  <Star className={`w-3 h-3 mt-0.5 ${todayCell ? 'text-eth-red-dark' : 'text-eth-red'}`} fill="currentColor" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Banner for Free Users */}
      <div className="relative overflow-hidden bg-gradient-to-r from-eth-gold/10 via-eth-coffee to-eth-gold/10 border border-eth-gold/30 rounded-2xl p-5">
        <div className="absolute top-0 right-0 bg-eth-gold text-eth-coffee-dark text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
          Go Pro
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-eth-gold font-bold text-lg flex items-center justify-center md:justify-start gap-2">
              <Crown className="w-5 h-5" fill="currentColor" />
              Unlock Ethio-Life Pro
            </h3>
            <p className="text-white/50 text-sm mt-1">
              Get unlimited events, email reminders, Google Calendar sync & holiday alerts.
            </p>
          </div>
          <div className="bg-eth-coffee-dark/60 border border-eth-gold/20 rounded-xl p-4 text-center min-w-[200px]">
            <p className="text-white/40 text-xs">Pay via Telebirr</p>
            <p className="text-2xl font-bold text-eth-gold tracking-wider mt-1">0963068310</p>
            <p className="text-eth-gold-light text-sm font-semibold mt-0.5">99 ETB / month</p>
            <p className="text-white/30 text-[10px] mt-1">Upload screenshot in Pro tab</p>
          </div>
        </div>
      </div>

      {/* EOTC Monthly Saints This Month */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
        <h3 className="text-eth-gold font-bold text-lg mb-1 flex items-center gap-2">
          <Star className="w-5 h-5" fill="currentColor" />
          EOTC Saints This Month
        </h3>
        <p className="text-white/30 text-xs mb-3 geez-num">
          {ETH_MONTHS[today.month - 1].amharic} — {ETH_MONTHS[today.month - 1].name} {today.year} E.C.
        </p>

        {/* Key saints with icons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { day: 12, icon: '⚔️', name: 'Mikael', color: 'bg-sky-900/30 border-sky-700/30 text-sky-300' },
            { day: 19, icon: '🌟', name: 'Gabriel', color: 'bg-indigo-900/30 border-indigo-700/30 text-indigo-300' },
            { day: 23, icon: '🐉', name: 'Giorgis', color: 'bg-red-900/30 border-red-700/30 text-red-300' },
            { day: 27, icon: '✨', name: 'Medhane Alem', color: 'bg-yellow-900/30 border-yellow-700/30 text-yellow-300' },
          ].map(s => (
            <div key={s.day} className={`flex items-center gap-2 p-2 rounded-xl border ${s.color}`}>
              <span className="text-lg">{s.icon}</span>
              <div>
                <p className={`text-xs font-bold`}>{s.name}</p>
                <p className="text-white/30 text-[10px]">Day {s.day} · {GEEZ_NUMBERS[s.day]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* All annual holy days */}
        <div className="grid gap-1.5">
          {HOLY_DAYS.slice(0, 6).map(h => (
            <div key={h.name} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="text-eth-gold geez-num text-sm font-bold">{GEEZ_NUMBERS[h.ethDay]}</span>
                <div>
                  <span className="text-white text-sm font-medium">{h.name}</span>
                  <span className="text-white/40 text-xs ml-2">{h.amharic}</span>
                </div>
              </div>
              <span className="text-white/50 text-xs">
                {ETH_MONTHS[h.ethMonth - 1].name} {h.ethDay}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <p className="text-white/30 text-xs">
            ⛪ Open the <strong className="text-purple-400">EOTC tab</strong> for all feasts,
            fasts & Bahire Hasab Easter calculator
          </p>
        </div>
      </div>
    </div>
  );
}
