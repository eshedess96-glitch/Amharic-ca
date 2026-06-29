import { useState, useMemo } from 'react';
import {
  gregorianToEthiopian,
  ethiopianToGregorian,
  getHolyDay,
  getMonthDays,
  ETH_MONTHS,
  GEEZ_NUMBERS,
  MONTH_CROSSOVER,
} from '../utils/ethiopianCalendar';
import { ArrowRightLeft, CalendarDays, Star, Table } from 'lucide-react';

export default function Converter() {
  const [mode, setMode] = useState<'g2e' | 'e2g'>('g2e');
  const [gregInput, setGregInput] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [ethYear, setEthYear] = useState(() => gregorianToEthiopian(new Date()).year);
  const [ethMonth, setEthMonth] = useState(1);
  const [ethDay, setEthDay] = useState(1);

  const g2eResult = useMemo(() => {
    if (!gregInput) return null;
    const d = new Date(gregInput + 'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return gregorianToEthiopian(d);
  }, [gregInput]);

  const e2gResult = useMemo(() => {
    try {
      const d = ethiopianToGregorian(ethYear, ethMonth, ethDay);
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return null;
    }
  }, [ethYear, ethMonth, ethDay]);

  const g2eHoly = g2eResult ? getHolyDay(g2eResult.month, g2eResult.day) : null;
  const e2gHoly = getHolyDay(ethMonth, ethDay);
  const maxDay = getMonthDays(ethMonth, ethYear);

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-eth-gold flex items-center justify-center gap-2">
          <ArrowRightLeft className="w-6 h-6" />
          Date Converter
        </h2>
        <p className="text-white/50 mt-1">Convert between Gregorian and Ethiopian calendars</p>
      </div>

      {/* Mode toggle */}
      <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
        <button
          onClick={() => setMode('g2e')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'g2e' ? 'bg-eth-gold text-eth-coffee-dark' : 'text-white/60 hover:text-white'
          }`}
        >
          Gregorian → Ethiopian
        </button>
        <button
          onClick={() => setMode('e2g')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'e2g' ? 'bg-eth-gold text-eth-coffee-dark' : 'text-white/60 hover:text-white'
          }`}
        >
          Ethiopian → Gregorian
        </button>
      </div>

      {/* Converter Card */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {mode === 'g2e' ? (
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2">Select Gregorian Date</label>
              <input
                type="date"
                value={gregInput}
                onChange={e => setGregInput(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-eth-gold"
              />
            </div>

            {g2eResult && (
              <div className="bg-eth-coffee/50 border border-eth-gold/20 rounded-xl p-5 space-y-3">
                <p className="text-white/50 text-xs uppercase tracking-wider">Ethiopian Date</p>
                <p className="text-3xl font-bold text-eth-gold glow-gold geez-num">
                  {g2eResult.monthAmharic} {g2eResult.dayGeez}
                </p>
                <p className="text-xl text-eth-gold-light">{g2eResult.fullString}</p>
                <div className="flex gap-4 text-sm text-white/60">
                  <span>📅 {g2eResult.dayAmharic} ({g2eResult.dayName})</span>
                  <span>📆 Year {g2eResult.year} E.C.</span>
                </div>
                {g2eHoly && (
                  <div className="bg-eth-gold/10 rounded-lg p-3 flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-eth-gold" fill="currentColor" />
                    <span className="text-eth-gold text-sm font-medium">{g2eHoly.name} — {g2eHoly.amharic}</span>
                    <span className="text-white/40 text-xs ml-auto">{g2eHoly.description}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-white/60 text-xs mb-1.5">Year (E.C.)</label>
                <input
                  type="number"
                  value={ethYear}
                  onChange={e => setEthYear(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-center focus:outline-none focus:ring-2 focus:ring-eth-gold"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1.5">Month</label>
                <select
                  value={ethMonth}
                  onChange={e => { setEthMonth(Number(e.target.value)); setEthDay(1); }}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-eth-gold"
                >
                  {ETH_MONTHS.map((m, i) => (
                    <option key={m.name} value={i + 1} className="bg-gray-800">{m.name} ({m.amharic})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1.5">Day</label>
                <select
                  value={ethDay}
                  onChange={e => setEthDay(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-eth-gold"
                >
                  {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d} className="bg-gray-800">{GEEZ_NUMBERS[d] || d} ({d})</option>
                  ))}
                </select>
              </div>
            </div>

            {e2gResult && (
              <div className="bg-eth-coffee/50 border border-eth-gold/20 rounded-xl p-5 space-y-3">
                <p className="text-white/50 text-xs uppercase tracking-wider">Gregorian Date</p>
                <p className="text-2xl font-bold text-white">{e2gResult}</p>
                <div className="text-sm text-white/60 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>From: {ETH_MONTHS[ethMonth - 1].amharic} {GEEZ_NUMBERS[ethDay] || ethDay}, {ethYear}</span>
                </div>
                {e2gHoly && (
                  <div className="bg-eth-gold/10 rounded-lg p-3 flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-eth-gold" fill="currentColor" />
                    <span className="text-eth-gold text-sm font-medium">{e2gHoly.name} — {e2gHoly.amharic}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Year Correction Explanation */}
      <div className="bg-gradient-to-br from-eth-red-dark/30 to-eth-red/10 border border-eth-red/20 rounded-2xl p-5">
        <h3 className="text-eth-gold font-bold text-lg mb-3">⚡ The Sept 11 Year-Lag Rule</h3>
        <div className="space-y-2 text-sm text-white/70">
          <p>The Ethiopian calendar is <strong className="text-white">7-8 years behind</strong> the Gregorian calendar. The exact lag depends on the date:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-eth-gold font-semibold">Jan 1 → Sep 10 (Gregorian)</p>
              <p className="text-white/60 mt-1">Ethiopian Year = <code className="bg-white/10 px-1.5 py-0.5 rounded text-eth-gold-light">Greg Year − 8</code></p>
              <p className="text-white/40 text-xs mt-1">Example: Sep 10, 2025 → Still 2017 E.C.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-eth-gold font-semibold">Sep 11 → Dec 31 (Gregorian)</p>
              <p className="text-white/60 mt-1">Ethiopian Year = <code className="bg-white/10 px-1.5 py-0.5 rounded text-eth-gold-light">Greg Year − 7</code></p>
              <p className="text-white/40 text-xs mt-1">Example: Sep 11, 2025 → Becomes 2018 E.C.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Upgrade CTA */}
      <div className="bg-gradient-to-r from-eth-gold/5 via-eth-coffee to-eth-gold/5 border border-eth-gold/20 rounded-2xl p-5 text-center">
        <p className="text-white/60 text-sm">🔓 Want <strong className="text-white">event scheduling</strong> with automatic Ethiopian dates?</p>
        <p className="text-white/50 text-sm mt-1">
          Upgrade to Pro — Pay <strong className="text-eth-gold">99 ETB</strong> via Telebirr to{' '}
          <code className="bg-eth-gold/20 text-eth-gold px-2 py-0.5 rounded font-bold text-base tracking-wider">0963068310</code>
        </p>
      </div>

      {/* Month Crossover Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
        <h3 className="text-eth-gold font-bold text-lg mb-3 flex items-center gap-2">
          <Table className="w-5 h-5" />
          Ethiopian Month → Gregorian Mapping
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="sheet-header text-left text-eth-coffee">Eth. Month</th>
                <th className="sheet-header text-center text-eth-coffee">Amharic</th>
                <th className="sheet-header text-center text-eth-coffee">From (Greg)</th>
                <th className="sheet-header text-center text-eth-coffee">To (Greg)</th>
                <th className="sheet-header text-center text-eth-coffee">Days</th>
              </tr>
            </thead>
            <tbody>
              {MONTH_CROSSOVER.map((row, i) => (
                <tr key={row.ethMonth} className={i % 2 === 0 ? 'bg-white/3' : ''}>
                  <td className="sheet-cell text-white font-medium">{row.ethMonth}</td>
                  <td className="sheet-cell text-center text-eth-gold geez-num">{ETH_MONTHS[i].amharic}</td>
                  <td className="sheet-cell text-center text-white/70">{row.from}</td>
                  <td className="sheet-cell text-center text-white/70">{row.to}</td>
                  <td className="sheet-cell text-center text-white/50">{row.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
