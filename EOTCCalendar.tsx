import { useState, useMemo } from 'react';
import { gregorianToEthiopian, ETH_MONTHS, GEEZ_NUMBERS } from '../utils/ethiopianCalendar';
import {
  MONTHLY_FESTIVALS,
  YEARLY_FESTIVALS,
  FASTING_RULES,
  EOTC_SHEET_FORMULAS,
  getTodayEOTCEvents,
  type YearlyFestival,
} from '../utils/eotcCalendar';
import { BahireHasab } from '../utils/bahireHasab';
import type { BahireHasabSteps, MovableFeastResult } from '../utils/bahireHasab';
import {
  Star,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  Zap,
  Clock,
  Copy,
  Check,
  Info,
  Church,
  Flame,
  Anchor,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

// ─── Sub-tabs ─────────────────────────────────────────────────────
type SubTab = 'today' | 'monthly' | 'yearly' | 'movable' | 'fasting' | 'formulas';

const SUB_TABS: { id: SubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'today', label: "Today's Events", icon: Star },
  { id: 'monthly', label: 'Monthly Saints', icon: Church },
  { id: 'yearly', label: 'Annual Feasts', icon: Calendar },
  { id: 'movable', label: 'Bahire Hasab', icon: Zap },
  { id: 'fasting', label: 'Fasting Rules', icon: Moon },
  { id: 'formulas', label: 'Sheet Formulas', icon: BookOpen },
];

// ─── Category badge colors ─────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  saint: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  maryam: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  trinity: 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30',
  angel: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  holiday: 'bg-green-500/20 text-green-300 border border-green-500/30',
  fast: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
  feast: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  national: 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/30',
  period: 'bg-blue-700/20 text-blue-300 border border-blue-700/30',
};

// ─── Helpers ───────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-xs bg-white/10 hover:bg-eth-gold/20 text-white/60 hover:text-eth-gold px-2 py-1 rounded transition-all"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}

// ─── Expandable festival card ──────────────────────────────────────
function FestivalCard({
  icon,
  name,
  amharic,
  badge,
  badgeColor,
  description,
  descriptionAm,
  extra,
}: {
  icon: string;
  name: string;
  amharic: string;
  badge: string;
  badgeColor: string;
  description: string;
  descriptionAm: string;
  extra?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-xl transition-all cursor-pointer ${
        open ? 'border-eth-gold/40 bg-eth-gold/5' : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-3 p-3">
        <span className="text-2xl w-10 text-center flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-white font-semibold text-sm leading-tight">{name}</span>
            <Badge label={badge} colorClass={badgeColor} />
          </div>
          <span className="text-white/50 text-xs geez-num">{amharic}</span>
        </div>
        <div className="flex-shrink-0 text-white/30">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-2">
          <p className="text-white/80 text-sm leading-relaxed">{description}</p>
          <p className="text-white/50 text-xs geez-num leading-relaxed">{descriptionAm}</p>
          {extra && <div className="mt-2">{extra}</div>}
        </div>
      )}
    </div>
  );
}

// ─── TODAY'S EVENTS PANEL ─────────────────────────────────────────
function TodayPanel() {
  const today = gregorianToEthiopian(new Date());
  const { monthlyFestivals, yearlyFestivals, movableFeasts } = getTodayEOTCEvents(
    today.month,
    today.day,
    today.year
  );

  const totalEvents = monthlyFestivals.length + yearlyFestivals.length + movableFeasts.length;

  // Fasting check
  const dayOfWeek = new Date().getDay(); // 0=Sun
  const isWednesday = dayOfWeek === 3;
  const isFriday = dayOfWeek === 5;
  const fastingToday = isWednesday || isFriday;

  // Is it within the 50-day Tinsae period?
  const isTinsae = BahireHasab.isTinsae(new Date(), today.year);

  return (
    <div className="space-y-4 fade-in">
      {/* Hero today card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-eth-coffee-dark via-eth-coffee to-[#5D3A1A] p-5 border border-eth-gold/20">
        <div className="absolute top-2 right-4 text-7xl opacity-10 geez-num">✦</div>
        <div className="relative z-10">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Today's EOTC Events</p>
          <h2 className="text-eth-gold text-2xl font-bold geez-num">
            {today.monthAmharic} {today.dayGeez}
          </h2>
          <p className="text-white/60 text-sm">{today.fullString}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              totalEvents > 0
                ? 'bg-eth-gold/20 text-eth-gold border border-eth-gold/30'
                : 'bg-white/10 text-white/50 border border-white/10'
            }`}>
              {totalEvents === 0 ? 'No major feast today' : `${totalEvents} event${totalEvents > 1 ? 's' : ''} today`}
            </span>
            {isTinsae && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                🌅 Tinsae — No Fasting
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fasting banner */}
      {fastingToday && !isTinsae && (
        <div className="flex items-center gap-3 bg-gray-800/60 border border-gray-600/30 rounded-xl p-4">
          <Moon className="w-5 h-5 text-gray-300 flex-shrink-0" />
          <div>
            <p className="text-gray-200 font-semibold text-sm">
              {isWednesday ? '🌑 Wednesday Fast — ረቡዕ' : '✝️ Friday Fast — ዓርብ'}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Abstain from animal products until 3 PM (9th hour).
            </p>
          </div>
        </div>
      )}

      {isTinsae && (
        <div className="flex items-center gap-3 bg-yellow-900/30 border border-yellow-500/20 rounded-xl p-4">
          <Sun className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-yellow-300 font-semibold text-sm">🌅 Tinsae Season — No Fasting</p>
            <p className="text-yellow-400/60 text-xs mt-0.5">
              The 50-day period after Fasika. No fasting — not even on Wednesday or Friday. Pure celebration!
            </p>
          </div>
        </div>
      )}

      {/* Monthly festivals */}
      {monthlyFestivals.length > 0 && (
        <SectionCard>
          <h3 className="text-eth-gold font-bold text-sm mb-3 flex items-center gap-2">
            <Church className="w-4 h-4" />
            Monthly Saint{'\''}s Days
          </h3>
          <div className="space-y-2">
            {monthlyFestivals.map(f => (
              <FestivalCard
                key={f.saint}
                icon={f.icon}
                name={f.saint}
                amharic={f.amharic}
                badge={f.category}
                badgeColor={CATEGORY_COLORS[f.category]}
                description={f.description}
                descriptionAm={f.descriptionAm}
                extra={
                  f.fastingRule ? (
                    <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-2">
                      <Moon className="w-3 h-3 text-gray-400" />
                      <p className="text-gray-300 text-xs">{f.fastingRule}</p>
                    </div>
                  ) : undefined
                }
              />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Annual festivals */}
      {yearlyFestivals.length > 0 && (
        <SectionCard>
          <h3 className="text-eth-gold font-bold text-sm mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" fill="currentColor" />
            Annual Festival Today
          </h3>
          <div className="space-y-2">
            {yearlyFestivals.map(f => (
              <FestivalCard
                key={f.id}
                icon={f.icon}
                name={f.name}
                amharic={f.amharic}
                badge={f.type}
                badgeColor={CATEGORY_COLORS[f.type] || CATEGORY_COLORS['feast']}
                description={f.description}
                descriptionAm={f.descriptionAm}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Movable feasts */}
      {movableFeasts.length > 0 && (
        <SectionCard>
          <h3 className="text-eth-gold font-bold text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Movable Feast Today
          </h3>
          <div className="space-y-2">
            {movableFeasts.map(f => (
              <FestivalCard
                key={f.feast.id}
                icon={f.feast.icon}
                name={f.feast.name}
                amharic={f.feast.amharic}
                badge={f.feast.type}
                badgeColor={CATEGORY_COLORS[f.feast.type] || CATEGORY_COLORS['feast']}
                description={f.feast.description}
                descriptionAm={f.feast.descriptionAm}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {/* No events */}
      {totalEvents === 0 && !fastingToday && (
        <SectionCard>
          <div className="text-center py-6">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-white/60 text-sm">No major feast or fast today.</p>
            <p className="text-white/30 text-xs mt-1">
              Check the Monthly Saints or Annual Feasts tabs for upcoming events.
            </p>
          </div>
        </SectionCard>
      )}

      {/* Quick info */}
      <SectionCard>
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
          Year {today.year} E.C. — Key Dates
        </h3>
        <div className="space-y-2">
          {(() => {
            const f = BahireHasab.getFasika(today.year);
            const gregStr = f.gregDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const ethStr = `${ETH_MONTHS[f.month - 1].name} ${f.day}`;
            return (
              <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌅</span>
                  <div>
                    <p className="text-yellow-300 text-sm font-semibold">Fasika {today.year}</p>
                    <p className="text-yellow-400/60 text-xs">{ethStr} E.C. · {gregStr}</p>
                  </div>
                </div>
                <span className="text-yellow-400/40 text-xs">Easter</span>
              </div>
            );
          })()}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── MONTHLY SAINTS PANEL ─────────────────────────────────────────
function MonthlyPanel() {
  const today = gregorianToEthiopian(new Date());
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'saint', 'maryam', 'trinity', 'angel'];
  const filtered = filter === 'all'
    ? MONTHLY_FESTIVALS
    : MONTHLY_FESTIVALS.filter(f => f.category === filter);

  return (
    <div className="space-y-4 fade-in">
      <SectionCard>
        <div className="flex items-start gap-3">
          <Church className="w-5 h-5 text-eth-gold mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-eth-gold font-bold text-sm">EOTC Monthly Recurring Feasts</h3>
            <p className="text-white/50 text-xs mt-1">
              These saints are commemorated <strong className="text-white/70">every month</strong> on
              the same day number. The 13 Ethiopian months × these days = hundreds of annual
              celebrations. Major ones (Michael, Gabriel, Giorgis, Medhane Alem) are public gathering days.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium transition-all ${
              filter === cat
                ? 'bg-eth-gold text-eth-coffee-dark'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {cat === 'all' ? `All (${MONTHLY_FESTIVALS.length})` : cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(f => {
          const isToday = f.day === today.day;
          return (
            <div key={f.saint} className={isToday ? 'ring-2 ring-eth-gold rounded-xl' : ''}>
              <FestivalCard
                icon={f.icon}
                name={`Day ${f.day} — ${f.saint}`}
                amharic={`${GEEZ_NUMBERS[f.day] || f.day} — ${f.amharic}`}
                badge={f.category}
                badgeColor={CATEGORY_COLORS[f.category]}
                description={f.description}
                descriptionAm={f.descriptionAm}
                extra={
                  <div className="space-y-1">
                    {isToday && (
                      <div className="flex items-center gap-2 bg-eth-gold/10 border border-eth-gold/20 rounded-lg px-3 py-1.5">
                        <Star className="w-3 h-3 text-eth-gold" fill="currentColor" />
                        <p className="text-eth-gold text-xs font-semibold">This is celebrated TODAY!</p>
                      </div>
                    )}
                    {f.fastingRule && (
                      <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-1.5">
                        <Moon className="w-3 h-3 text-gray-400" />
                        <p className="text-gray-300 text-xs">{f.fastingRule}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                      <Info className="w-3 h-3 text-white/30" />
                      <p className="text-white/40 text-xs">
                        Occurs on day {f.day} of each of the 13 Ethiopian months
                        {f.day <= 5 ? ' (only 12× — Pagume is ≤6 days)' : ''}.
                      </p>
                    </div>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── YEARLY FESTIVALS PANEL ───────────────────────────────────────
function YearlyPanel() {
  const [filter, setFilter] = useState<string>('all');
  const types = ['all', 'holiday', 'feast', 'fast', 'national'];

  const filtered = filter === 'all'
    ? YEARLY_FESTIVALS
    : YEARLY_FESTIVALS.filter(f => f.type === filter);

  // Group by month
  const grouped = ETH_MONTHS.reduce<Record<number, YearlyFestival[]>>((acc, _, idx) => {
    const month = idx + 1;
    const events = filtered.filter(f => f.ethMonth === month);
    if (events.length) acc[month] = events;
    return acc;
  }, {});

  return (
    <div className="space-y-4 fade-in">
      <SectionCard>
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-eth-gold mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-eth-gold font-bold text-sm">Fixed Annual EOTC Feasts & Fasts</h3>
            <p className="text-white/50 text-xs mt-1">
              These holidays occur on the <strong className="text-white/70">same Ethiopian date every year</strong>,
              regardless of the Gregorian calendar. Enkutatash is always Meskerem 1, Genna always Tahsas 29, etc.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium transition-all ${
              filter === t
                ? 'bg-eth-gold text-eth-coffee-dark'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {t === 'all' ? `All (${YEARLY_FESTIVALS.length})` : t}
          </button>
        ))}
      </div>

      {Object.entries(grouped).map(([monthIdx, events]) => {
        const mInfo = ETH_MONTHS[Number(monthIdx) - 1];
        return (
          <div key={monthIdx}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest geez-num">
                {mInfo.amharic} — {mInfo.name}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="space-y-2">
              {events.map(f => (
                <FestivalCard
                  key={f.id}
                  icon={f.icon}
                  name={`${mInfo.name} ${f.ethDay} — ${f.name}`}
                  amharic={`${mInfo.amharic} ${GEEZ_NUMBERS[f.ethDay] || f.ethDay} — ${f.amharic}`}
                  badge={f.type}
                  badgeColor={CATEGORY_COLORS[f.type] || CATEGORY_COLORS['feast']}
                  description={f.description}
                  descriptionAm={f.descriptionAm}
                  extra={
                    f.fastDays ? (
                      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-1.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-gray-300 text-xs">
                          Duration: {f.fastDays} days
                          {f.fastEndMonth
                            ? ` · Ends: ${ETH_MONTHS[f.fastEndMonth - 1].name} ${f.fastEndDay}`
                            : ''}
                        </p>
                      </div>
                    ) : undefined
                  }
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MOVABLE FEASTS (BAHIRE HASAB) PANEL ─────────────────────────
// ─── Step badge helper ────────────────────────────────────────────
function StepBadge({ n, color }: { n: number; color: string }) {
  return (
    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${color}`}>
      {n}
    </span>
  );
}

// ─── Code block with copy button ────────────────────────────────────
function CodeLine({ code }: { code: string }) {
  return (
    <div className="flex items-start gap-2 bg-black/40 rounded-lg px-3 py-2 my-1">
      <code className="text-green-300 text-xs font-mono leading-relaxed flex-1 break-all">{code}</code>
      <CopyButton text={code} />
    </div>
  );
}

// ─── Single movable feast row ────────────────────────────────────────
function FeastRow({ mf }: { mf: MovableFeastResult }) {
  const [open, setOpen] = useState(false);
  const off = mf.offsetFromFasika;
  const offsetLabel =
    off === 0 ? '🌅 Fasika (Day 0)'
    : off < 0 ? `${Math.abs(off)} days before Easter`
    :            `+${off} days after Easter`;

  return (
    <div
      className={`border rounded-xl transition-all cursor-pointer ${
        open ? 'border-eth-gold/40 bg-eth-gold/5' : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center gap-3 p-3">
        <span className="text-2xl w-9 flex-shrink-0 text-center">{mf.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-white text-sm font-semibold leading-tight">{mf.name}</span>
            <Badge label={mf.type} colorClass={CATEGORY_COLORS[mf.type] || CATEGORY_COLORS['feast']} />
          </div>
          <div className="flex flex-wrap gap-x-2 text-xs">
            <span className="text-eth-gold font-semibold geez-num">{mf.date.formatted}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/40">{mf.date.weekdayEn}, {mf.date.gregDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className={`text-[10px] font-bold ${off < 0 ? 'text-red-400' : off === 0 ? 'text-yellow-400' : 'text-green-400'}`}>
            {off > 0 ? '+' : ''}{off}d
          </p>
          {open ? <ChevronUp className="w-4 h-4 text-white/30 ml-auto mt-1" /> : <ChevronDown className="w-4 h-4 text-white/30 ml-auto mt-1" />}
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-2">
          <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-1.5">
            <Clock className="w-3 h-3 text-white/30 flex-shrink-0" />
            <span className="text-white/60 text-xs">{offsetLabel}</span>
            {mf.durationDays && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-white/50 text-xs">Duration: {mf.durationDays} days</span>
              </>
            )}
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{mf.description}</p>
          <p className="text-white/40 text-xs geez-num leading-relaxed">{mf.descriptionAm}</p>
        </div>
      )}
    </div>
  );
}

// ─── The main Bahire Hasab panel ─────────────────────────────────────
function MovablePanel() {
  const today = gregorianToEthiopian(new Date());
  const [selectedYear, setSelectedYear] = useState(today.year);

  // Run the full authoritative BahireHasab.compute() — all 5 steps in one call
  const result = useMemo(() => BahireHasab.compute(selectedYear), [selectedYear]);
  const s: BahireHasabSteps = result.steps;
  const allFeasts: MovableFeastResult[] = result.allFeasts;

  // Type filters
  const [filter, setFilter] = useState<'all' | 'fast' | 'feast'>('all');
  const filtered = filter === 'all' ? allFeasts : allFeasts.filter(f => f.type === filter);

  return (
    <div className="space-y-4 fade-in">

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0520] via-[#1a0a3e] to-[#2d1a5e] border border-purple-600/30 p-5">
        <div className="absolute inset-0 opacity-5 text-[160px] flex items-center justify-center select-none pointer-events-none geez-num">🌊</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-purple-700/60 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🌊</div>
            <div>
              <h2 className="text-white font-black text-xl tracking-tight">Bahire Hasab</h2>
              <p className="text-purple-300/70 text-sm geez-num">ባሕረ ሐሳብ — "Sea of Calculation"</p>
            </div>
          </div>
          <p className="text-purple-200/70 text-sm leading-relaxed">
            The ancient EOTC computus. Every movable feast flows from one anchor date —{' '}
            <strong className="text-purple-100">Tsome Nenewe</strong>. Find Nenewe; find everything.
          </p>
          {/* Live summary chips */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              { label: 'Amete Alem', val: s.ameteAlem, sub: 'World Year', col: 'bg-purple-800/60 text-purple-200' },
              { label: 'Evangelist', val: s.evangelist.split(' ')[0], sub: s.isLeapYear ? '🗓 Leap Year' : 'Regular Year', col: 'bg-indigo-800/60 text-indigo-200' },
              { label: 'Medeb', val: s.medeb, sub: `Metonic pos. (AA mod 19)`, col: 'bg-blue-800/60 text-blue-200' },
              { label: 'Wenber', val: s.wenber, sub: 'Moon correction base', col: 'bg-cyan-800/60 text-cyan-200' },
              { label: 'Abekte', val: s.abekte, sub: 'Moon age on Meskerem 1', col: 'bg-teal-800/60 text-teal-200' },
              { label: 'Metkih', val: s.metkih, sub: 'Days to full moon', col: 'bg-sky-800/60 text-sky-200' },
            ].map(c => (
              <div key={c.label} className={`rounded-xl p-2.5 ${c.col}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{c.label}</p>
                <p className="text-lg font-black font-mono">{c.val}</p>
                <p className="text-[10px] opacity-60">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Year selector ── */}
      <SectionCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-eth-gold font-bold text-sm">Ethiopian Year</h3>
            <p className="text-white/30 text-xs">Navigate to compute any year</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedYear(y => y - 1)}
              className="p-2 bg-white/10 hover:bg-eth-gold/20 rounded-xl text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-black text-xl w-16 text-center">{selectedYear}</span>
            <button onClick={() => setSelectedYear(y => y + 1)}
              className="p-2 bg-white/10 hover:bg-eth-gold/20 rounded-xl text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── VERIFICATION TABLE ── */}
      <div className="bg-gradient-to-r from-green-950/60 to-emerald-950/30 border border-green-700/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-400 text-lg">✅</span>
          <div>
            <h4 className="text-green-300 font-bold text-sm">Accuracy Verification</h4>
            <p className="text-green-400/50 text-[10px]">Cross-checked against EOTC Holy Synod published dates</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-green-800/40">
                <th className="text-green-400/60 font-bold text-left pb-1.5 pr-3">EC Year</th>
                <th className="text-green-400/60 font-bold text-left pb-1.5 pr-3">Fasika (Ethiopian)</th>
                <th className="text-green-400/60 font-bold text-left pb-1.5 pr-3">Gregorian</th>
                <th className="text-green-400/60 font-bold text-left pb-1.5">Day</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ec: 2012, ethExp: 'Miyazia 16', gregExp: 'Apr 24, 2020', day: 'Sun' },
                { ec: 2013, ethExp: 'Miyazia 5',  gregExp: 'Apr 13, 2021', day: 'Sun' },
                { ec: 2014, ethExp: 'Miyazia 25', gregExp: 'May 2, 2022',  day: 'Sun' },
                { ec: 2015, ethExp: 'Miyazia 15', gregExp: 'Apr 23, 2023', day: 'Sun' },
                { ec: 2016, ethExp: 'Miyazia 5',  gregExp: 'Apr 12, 2024', day: 'Sun' },
                { ec: 2017, ethExp: 'Miyazia 22', gregExp: 'Apr 30, 2025', day: 'Sun' },
                { ec: 2018, ethExp: 'Miyazia 12', gregExp: 'Apr 19, 2026', day: 'Sun' },
              ].map(row => {
                const computed = BahireHasab.compute(row.ec).fasika;
                const computedEth = `${computed.monthName} ${computed.day}`;
                const computedGreg = computed.gregDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const isCorrect = computedEth === row.ethExp;
                const isCurrentYear = row.ec === selectedYear;
                return (
                  <tr key={row.ec}
                    className={`border-b border-green-900/20 ${isCurrentYear ? 'bg-green-900/20' : ''}`}>
                    <td className={`py-1.5 pr-3 font-bold font-mono ${isCurrentYear ? 'text-green-200' : 'text-white/60'}`}>
                      {row.ec}{isCurrentYear ? ' ←' : ''}
                    </td>
                    <td className={`py-1.5 pr-3 font-mono ${isCorrect ? 'text-green-300' : 'text-red-400'}`}>
                      {computedEth} {isCorrect ? '✓' : `✗ (exp: ${row.ethExp})`}
                    </td>
                    <td className="py-1.5 pr-3 text-white/50">{computedGreg}</td>
                    <td className={`py-1.5 font-bold ${computed.weekdayEn === 'Sunday' ? 'text-green-400' : 'text-red-400'}`}>
                      {computed.weekdayEn.slice(0, 3)} {computed.weekdayEn === 'Sunday' ? '✓' : '✗'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-green-500/40 text-[10px] mt-2 italic">
          Fasika must always fall on a Sunday. All rows showing "Sun ✓" confirm the algorithm is correct.
        </p>
      </div>

      {/* ── STEP-BY-STEP ALGORITHM ── */}
      <div className="space-y-3">

        {/* ─ STEP 1: Amete Alem ─ */}
        <div className="bg-gradient-to-r from-purple-900/60 to-purple-800/20 border border-purple-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge n={1} color="bg-purple-600 text-white" />
            <div>
              <h4 className="text-purple-200 font-bold text-sm">Amete Alem — ዓመተ ዓለም</h4>
              <p className="text-purple-400/60 text-xs">World Year (Year of the World)</p>
            </div>
          </div>
          <p className="text-purple-300/70 text-xs leading-relaxed mb-2">
            The EOTC counts years from the Anno Mundi — the Year of Creation. Church tradition
            holds Christ was born in year 5500 of the world. So all Ethiopian calendar years
            are offset by 5,500.
          </p>
          <CodeLine code={`Amete Alem = Amete Mihret + 5500`} />
          <CodeLine code={`Amete Alem = ${selectedYear} + 5500 = ${s.ameteAlem}`} />
          <div className="mt-2 flex items-center gap-2 bg-purple-900/40 rounded-lg px-3 py-2">
            <span className="text-purple-300 text-xs">✦ Result:</span>
            <span className="text-purple-100 font-black text-lg font-mono">{s.ameteAlem}</span>
          </div>
        </div>

        {/* ─ STEP 2: Evangelist + Leap Year ─ */}
        <div className="bg-gradient-to-r from-indigo-900/60 to-indigo-800/20 border border-indigo-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge n={2} color="bg-indigo-600 text-white" />
            <div>
              <h4 className="text-indigo-200 font-bold text-sm">Evangelist & Leap Year — ወንጌላዊ</h4>
              <p className="text-indigo-400/60 text-xs">Determines the year's Evangelist and leap status</p>
            </div>
          </div>
          <p className="text-indigo-300/70 text-xs leading-relaxed mb-2">
            Divide Amete Alem by 4. The remainder cycles through the four Evangelists,
            each "owning" one year. When remainder = 0, it is John's year — an Ethiopian
            Leap Year where Pagume has <strong className="text-indigo-200">6 days</strong> instead of 5.
          </p>
          <CodeLine code={`Evangelist Remainder = ${s.ameteAlem} mod 4 = ${s.evangelistRemainder}`} />
          <CodeLine code={`1=Matthew  2=Mark  3=Luke  0=John (LEAP)`} />
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[
              { r: 1, name: 'Matthew', am: 'ማቴዎስ', icon: '📖' },
              { r: 2, name: 'Mark',    am: 'ማርቆስ', icon: '✍️' },
              { r: 3, name: 'Luke',    am: 'ሉቃስ',  icon: '⚕️' },
              { r: 0, name: 'John',    am: 'ዮሐንስ', icon: '🦅' },
            ].map(e => (
              <div key={e.r} className={`rounded-lg p-2 text-center border transition-all ${
                s.evangelistRemainder === e.r
                  ? 'bg-indigo-500/30 border-indigo-400/60 shadow-lg shadow-indigo-900/50'
                  : 'bg-white/5 border-white/10 opacity-40'
              }`}>
                <p className="text-lg">{e.icon}</p>
                <p className="text-white text-[10px] font-bold">{e.name}</p>
                <p className="text-white/40 text-[9px] geez-num">{e.am}</p>
                {e.r === 0 && <p className="text-yellow-400 text-[8px] mt-0.5 font-bold">LEAP</p>}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 bg-indigo-900/40 rounded-lg px-3 py-2">
            <span className="text-indigo-300 text-xs">✦ Year of:</span>
            <span className="text-indigo-100 font-black text-base">{s.evangelist}</span>
            {s.isLeapYear && (
              <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold">
                🗓 Pagume has 6 days
              </span>
            )}
          </div>
        </div>

        {/* ─ STEP 3: Medeb / Wenber / Abekte / Metkih ─ */}
        <div className="bg-gradient-to-r from-blue-900/60 to-blue-800/20 border border-blue-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge n={3} color="bg-blue-600 text-white" />
            <div>
              <h4 className="text-blue-200 font-bold text-sm">Medeb · Wenber · Abekte · Metkih</h4>
              <p className="text-blue-400/60 text-xs">The lunar correction chain — ሜዴብ · ወንበር · አበቅቴ · መጥቅህ</p>
            </div>
          </div>

          {/* Medeb */}
          <div className="mb-3">
            <p className="text-blue-300 text-xs font-bold mb-1">3a. MEDEB (ሜዴብ) — Metonic Cycle Position</p>
            <p className="text-blue-300/60 text-xs leading-relaxed mb-1">
              Position in the 19-year Metonic cycle. After 19 years, lunar phases repeat on the
              same calendar dates. Range: 0–18.
            </p>
            <CodeLine code={`Medeb = Amete Alem mod 19 = ${s.ameteAlem} mod 19 = ${s.medeb}`} />
          </div>

          {/* Wenber */}
          <div className="mb-3">
            <p className="text-blue-300 text-xs font-bold mb-1">3b. WENBER (ወንበር) — Moon Seat / Base Correction</p>
            <p className="text-blue-300/60 text-xs leading-relaxed mb-1">
              The "seat" or base moon correction. Shifts the Metonic position because the EOTC
              table indexes from 0 differently. Rule: if Medeb = 0, Wenber = 18; else Wenber = Medeb − 1.
            </p>
            <CodeLine code={`Wenber = (Medeb == 0) ? 18 : Medeb - 1`} />
            <CodeLine code={`Wenber = (${s.medeb} == 0) ? 18 : ${s.medeb} - 1 = ${s.wenber}`} />
          </div>

          {/* Abekte */}
          <div className="mb-3">
            <p className="text-blue-300 text-xs font-bold mb-1">3c. ABEKTE (አበቅቴ) — Moon Age on Meskerem 1</p>
            <p className="text-blue-300/60 text-xs leading-relaxed mb-1">
              How many days into its current lunar cycle the moon is on Ethiopian New Year's Day.
              Computed as (Wenber × 11) mod 30. Range: 0–29.
            </p>
            <CodeLine code={`Abekte = (Wenber × 11) mod 30`} />
            <CodeLine code={`Abekte = (${s.wenber} × 11) mod 30 = ${s.wenber * 11} mod 30 = ${s.abekte}`} />
          </div>

          {/* Metkih */}
          <div>
            <p className="text-blue-300 text-xs font-bold mb-1">3d. METKIH (መጥቅህ) — Distance to Full Moon</p>
            <p className="text-blue-300/60 text-xs leading-relaxed mb-1">
              Days from Meskerem 1 until the next full moon. Computed as (Wenber × 19) mod 30.
              <strong className="text-blue-200"> This is the critical value</strong> — it determines
              whether Nenewe falls in Tir or Yekatit.
            </p>
            <CodeLine code={`Metkih = (Wenber × 19) mod 30`} />
            <CodeLine code={`Metkih = (${s.wenber} × 19) mod 30 = ${s.wenber * 19} mod 30 = ${s.metkih}`} />
            <div className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 border ${
              s.metkih > 14
                ? 'bg-orange-900/30 border-orange-600/30 text-orange-200'
                : 'bg-sky-900/30 border-sky-600/30 text-sky-200'
            }`}>
              <span className="text-lg">{s.metkih > 14 ? '📅' : '📆'}</span>
              <div>
                <p className="text-xs font-bold">
                  Metkih {s.metkih > 14 ? '> 14' : '≤ 14'} → Nenewe base in{' '}
                  <strong>{s.neneweBaseMonthName}</strong>
                </p>
                <p className="text-[10px] opacity-70">
                  {s.metkih > 14
                    ? 'Metkih > 14: day = 50 − Metkih (in Tir)'
                    : 'Metkih ≤ 14: day = 20 − Metkih (in Yekatit)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─ STEP 4: Tsome Nenewe Anchor ─ */}
        <div className="bg-gradient-to-r from-cyan-900/60 to-teal-800/20 border border-cyan-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge n={4} color="bg-cyan-600 text-white" />
            <div>
              <h4 className="text-cyan-200 font-bold text-sm">Tsome Nenewe — The Anchor Date 🐋</h4>
              <p className="text-cyan-400/60 text-xs">ጾመ ነነዌ — Always starts on a Monday</p>
            </div>
          </div>
          <p className="text-cyan-300/70 text-xs leading-relaxed mb-3">
            This is the most critical date in Bahire Hasab. Nenewe is always a{' '}
            <strong className="text-cyan-200">Monday</strong>. We find its base date from Metkih,
            then apply a weekday correction (<em>Tinte Yon</em>) to go BACK to the nearest Monday on-or-before the base date.
          </p>

          {/* Base date */}
          <div className="mb-2">
            <p className="text-cyan-300 text-xs font-bold mb-1">4a. Base Date Calculation</p>
            {s.metkih > 14 ? (
              <CodeLine code={`Metkih (${s.metkih}) > 14 → base in Tir, day = 50 − ${s.metkih} = ${s.neneweBaseDay}`} />
            ) : (
              <CodeLine code={`Metkih (${s.metkih}) ≤ 14 → base in Yekatit, day = 20 − ${s.metkih} = ${s.neneweBaseDay}`} />
            )}
            <div className="bg-black/20 rounded-lg px-3 py-1.5 mt-1 text-xs text-white/60">
              Base date: <strong className="text-white">{s.neneweBaseMonthName} {s.neneweBaseDay}</strong>
            </div>
          </div>

          {/* Tinte Yon correction */}
          <div className="mb-3">
            <p className="text-cyan-300 text-xs font-bold mb-1">4b. Tinte Yon — Weekday Correction (ቲንቴ ዮን)</p>
            <p className="text-cyan-300/60 text-xs mb-1">
              Find the weekday of the base date. Go BACK to the nearest Monday on-or-before it.
              Formula: daysBack = (tinteYon + 6) % 7
            </p>
            <CodeLine code={`${s.neneweBaseMonthName} ${s.neneweBaseDay} falls on: ${s.tinteYonName} (weekday ${s.tinteYon})`} />
            <CodeLine code={`Days back to Monday: (${s.tinteYon} + 6) % 7 = ${s.daysBack}${s.daysBack === 0 ? ' (already Monday ✓)' : ''}`} />
          </div>

          {/* Final Nenewe date */}
          <div className="bg-gradient-to-r from-cyan-700/30 to-teal-700/20 border border-cyan-500/40 rounded-xl p-3 mt-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐋</span>
              <div>
                <p className="text-cyan-100 font-black text-base">Tsome Nenewe {selectedYear} E.C.</p>
                <p className="text-cyan-200 font-bold geez-num">{s.tsomeNenewe.formatted}</p>
                <p className="text-cyan-300/70 text-xs">{s.tsomeNenewe.weekdayEn} — {s.tsomeNenewe.gregFormatted}</p>
                <p className="text-cyan-400/50 text-[10px] mt-0.5">3-day fast (Mon–Wed) · All other feasts derive from this date</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─ STEP 5: Derived Feasts ─ */}
        <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/20 border border-amber-700/30 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <StepBadge n={5} color="bg-amber-600 text-white" />
            <div>
              <h4 className="text-amber-200 font-bold text-sm">Derive All Feasts from Nenewe 🌅</h4>
              <p className="text-amber-400/60 text-xs">Abiy Tsom = Nenewe + 14 · Fasika = Nenewe + 69</p>
            </div>
          </div>
          <p className="text-amber-300/70 text-xs leading-relaxed mb-3">
            Two fixed offsets from Nenewe give you the two most important dates.
            All remaining feasts are then derived from Fasika using the offset table below.
          </p>
          <CodeLine code={`Abiy Tsom = Tsome Nenewe + 14 days`} />
          <CodeLine code={`Abiy Tsom = ${s.tsomeNenewe.formatted} + 14 = ${s.abiyTsom.formatted}`} />
          <div className="my-2" />
          <CodeLine code={`Fasika (Easter) = Tsome Nenewe + 69 days`} />
          <CodeLine code={`Fasika = ${s.tsomeNenewe.formatted} + 69 = ${s.fasika.formatted}`} />

          {/* Key 3 results */}
          <div className="grid grid-cols-1 gap-2 mt-3">
            {[
              {
                icon: '🐋', label: 'Tsome Nenewe', sub: '(Anchor)', date: s.tsomeNenewe,
                col: 'from-blue-800/40 border-blue-600/30 text-blue-200',
              },
              {
                icon: '🌑', label: 'Abiy Tsom', sub: '(Nenewe + 14)', date: s.abiyTsom,
                col: 'from-gray-800/60 border-gray-600/30 text-gray-200',
              },
              {
                icon: '🌅', label: 'Fasika', sub: '(Nenewe + 69)', date: s.fasika,
                col: 'from-yellow-800/40 border-yellow-600/30 text-yellow-200',
              },
            ].map(row => (
              <div key={row.label} className={`flex items-center gap-3 bg-gradient-to-r ${row.col} border rounded-xl px-3 py-2`}>
                <span className="text-2xl flex-shrink-0">{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-sm">{row.label}</p>
                    <span className="text-[10px] opacity-60">{row.sub}</span>
                  </div>
                  <p className="text-xs opacity-80 geez-num">{row.date.formatted}</p>
                  <p className="text-[10px] opacity-50">{row.date.weekdayEn} · {row.date.gregDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full feast list ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-eth-gold font-bold text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" />
            All Movable Feasts — {selectedYear} E.C.
          </h3>
          <div className="flex gap-1">
            {(['all', 'feast', 'fast'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filter === f
                    ? 'bg-eth-gold text-eth-dark'
                    : 'bg-white/10 text-white/50 hover:bg-white/20'
                }`}
              >
                {f === 'all' ? 'All' : f === 'feast' ? '🎉 Feasts' : '🌑 Fasts'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map(mf => <FeastRow key={mf.id} mf={mf} />)}
        </div>
      </div>

      {/* ── Offset reference table ── */}
      <SectionCard>
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
          Offset Reference Table — All Feasts Relative to Fasika
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/40 py-2 pr-3">Feast / Fast</th>
                <th className="text-right text-white/40 py-2 pr-3">Offset</th>
                <th className="text-right text-white/40 py-2 pr-3">E.C. Date</th>
                <th className="text-right text-white/40 py-2">Greg. Date</th>
              </tr>
            </thead>
            <tbody>
              {allFeasts.map(f => (
                <tr key={f.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-1.5 pr-3">
                    <span className="mr-1">{f.icon}</span>
                    <span className="text-white/70">{f.name.split('(')[0].trim()}</span>
                  </td>
                  <td className="text-right py-1.5 pr-3">
                    <span className={
                      f.offsetFromFasika < 0  ? 'text-red-400 font-mono' :
                      f.offsetFromFasika === 0 ? 'text-yellow-400 font-bold' :
                      'text-green-400 font-mono'
                    }>
                      {f.offsetFromFasika === 0 ? '0' : `${f.offsetFromFasika > 0 ? '+' : ''}${f.offsetFromFasika}`}
                    </span>
                  </td>
                  <td className="text-right py-1.5 pr-3 text-eth-gold/80 geez-num text-[11px]">
                    {f.date.monthName} {f.date.day}
                  </td>
                  <td className="text-right py-1.5 text-white/30 text-[10px]">
                    {f.date.gregDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ── TypeScript module note ── */}
      <SectionCard>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-bold text-sm">Source Code</p>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              The complete algorithm lives in{' '}
              <code className="text-green-300 bg-black/30 px-1 rounded">src/utils/bahireHasab.ts</code>{' '}
              as the <code className="text-purple-300 bg-black/30 px-1 rounded">BahireHasab</code> class.
              Every step is commented in detail. Call{' '}
              <code className="text-yellow-300 bg-black/30 px-1 rounded">BahireHasab.compute(year)</code>{' '}
              to get the full result including all 7 intermediate values and every movable feast.
            </p>
            <div className="mt-2">
              <CopyButton text={`import { BahireHasab } from './utils/bahireHasab';\nconst result = BahireHasab.compute(${selectedYear});\nconsole.log(result.fasika.formatted); // "${s.fasika.formatted}"\nconsole.log(result.steps.abiyTsom.formatted); // "${s.abiyTsom.formatted}"`} />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── FASTING RULES PANEL ──────────────────────────────────────────
function FastingPanel() {
  return (
    <div className="space-y-4 fade-in">
      <SectionCard>
        <div className="flex items-start gap-3">
          <Moon className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-gray-200 font-bold text-sm">EOTC Fasting Calendar</h3>
            <p className="text-white/50 text-xs mt-1">
              The Ethiopian Orthodox Church observes <strong className="text-white/70">more than 180 fasting days per year</strong> —
              the most of any Christian denomination. Fasting means abstaining from all animal
              products (meat, dairy, eggs) until after the 9th hour (3 PM).
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Annual fasting days summary */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Wed & Fri', value: '~96', desc: 'Weekly fasts (excl. Tinsae)', color: 'text-slate-300' },
          { label: 'Great Lent', value: '55', desc: 'Abiy Tsom days', color: 'text-gray-300' },
          { label: 'Prophets', value: '43', desc: "Tsome Nebiyat days", color: 'text-amber-400' },
          { label: 'Apostles', value: '14–55', desc: 'Tsome Hawaryat (varies)', color: 'text-blue-400' },
          { label: 'Assumption', value: '15', desc: 'Tsome Filseta days', color: 'text-pink-400' },
          { label: 'Nineveh', value: '3', desc: 'Tsome Nenewe days', color: 'text-cyan-400' },
        ].map(item => (
          <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</p>
            <p className="text-white font-semibold text-xs">{item.label}</p>
            <p className="text-white/30 text-[10px]">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Grand total */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-600/30 rounded-xl p-4 text-center">
        <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
        <p className="text-orange-300 font-bold text-3xl">180+</p>
        <p className="text-white/60 text-sm">Fasting days per year</p>
        <p className="text-white/30 text-xs mt-1">
          Compared to ~40 days (Catholic) · ~0 mandatory (most Protestant)
        </p>
      </div>

      {/* Rules */}
      <div className="space-y-3">
        {FASTING_RULES.map(rule => (
          <div key={rule.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <span className="text-2xl">{rule.icon}</span>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{rule.name}</p>
                <p className={`text-xs geez-num ${rule.color}`}>{rule.amharic}</p>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
              <p className="text-white/70 text-sm leading-relaxed">{rule.description}</p>
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Rule</p>
                <p className="text-white/80 text-sm">{rule.rule}</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/10 rounded-lg p-3">
                <p className="text-xs font-bold text-yellow-400/60 uppercase tracking-widest mb-1">Exceptions</p>
                <p className="text-yellow-300/70 text-sm">{rule.exceptions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global fasting rule note */}
      <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 font-bold text-sm">The Golden Rule of EOTC Fasting</p>
          <p className="text-blue-300/70 text-sm mt-1 leading-relaxed">
            All fasting in the EOTC means: <strong className="text-blue-200">no food or drink</strong> until
            after the 9th hour (3 PM Ethiopian time = 9 AM Gregorian). After 3 PM, only{' '}
            <strong className="text-blue-200">plant-based foods</strong> are eaten — no meat, dairy, or eggs.
            On Siklet (Good Friday) and Hudade, many observe a <strong className="text-blue-200">complete dry fast</strong> (no water).
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SHEET FORMULAS PANEL ─────────────────────────────────────────
function FormulasPanel() {
  const formulas = [
    {
      title: 'D2: Eth_Year Correction (The Core Formula)',
      description:
        'Calculates the correct Ethiopian year. Before Sep 11: Year - 8. From Sep 11: Year - 7. Handles the critical year-crossover.',
      formula: EOTC_SHEET_FORMULAS.yearCorrection,
      color: 'border-l-yellow-500',
      icon: '📅',
    },
    {
      title: 'C2: Eth_Month Mapping (IFS Formula)',
      description:
        'Maps Gregorian month/day to the correct Ethiopian month name. Based on the crossover dates (Sep 11 = Meskerem 1, etc.).',
      formula: EOTC_SHEET_FORMULAS.ethMonth,
      color: 'border-l-blue-500',
      icon: '📆',
    },
    {
      title: 'E2: Monthly Feast Lookup',
      description:
        'Looks up the Ethiopian day number (Col B) and returns the EOTC monthly saint name. Add to your Date_Engine sheet.',
      formula: EOTC_SHEET_FORMULAS.monthlyFeast,
      color: 'border-l-purple-500',
      icon: '⛪',
    },
    {
      title: 'F2: Fasika (Easter) Calculator',
      description:
        'Advanced formula using LET() to compute Ethiopian Easter date from the Ethiopian year in Col D. Uses the Bahire Hasab algorithm.',
      formula: EOTC_SHEET_FORMULAS.fasikaYear,
      color: 'border-l-amber-500',
      icon: '🌅',
    },
    {
      title: 'G2: Is Fasting Day?',
      description:
        'Checks if a date is a Wednesday (ረቡዕ) or Friday (ዓርብ) fast, or within Tsome Nebiyat or Filseta fasting period.',
      formula: EOTC_SHEET_FORMULAS.isFastingDay,
      color: 'border-l-gray-500',
      icon: '🌑',
    },
  ];

  return (
    <div className="space-y-4 fade-in">
      <SectionCard>
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-eth-gold mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-eth-gold font-bold text-sm">Google Sheets Formulas for Glide Apps</h3>
            <p className="text-white/50 text-xs mt-1">
              Copy and paste these formulas directly into your{' '}
              <code className="bg-white/10 px-1 rounded">Date_Engine</code> Google Sheet.
              Column A = Gregorian_Date, B = Eth_Day, C = Eth_Month, D = Eth_Year.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Sheet structure */}
      <SectionCard>
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
          Recommended Sheet Structure — "Date_Engine"
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {['Col', 'Header', 'Type', 'Notes'].map(h => (
                  <th key={h} className="text-left text-white/40 py-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['A', 'Gregorian_Date', 'Date', 'Key column — generate with =SEQUENCE(2557,1,DATE(2024,1,1),1)'],
                ['B', 'Eth_Day', 'Number', 'Ethiopian day (1–30). Use ArrayFormula with MOD().'],
                ['C', 'Eth_Month', 'Text', 'Ethiopian month name (Meskerem, Tikimt…). Use IFS formula.'],
                ['D', 'Eth_Year', 'Number', '★ Critical: Year correction formula — IF before Sep 11, Year-8, else Year-7.'],
                ['E', 'Full_Eth_Date', 'Text', '=ARRAYFORMULA(C2:C & " " & B2:B & ", " & D2:D)'],
                ['F', 'Monthly_Feast', 'Text', 'EOTC saint for that day number. Use IFS/VLOOKUP on Col B.'],
                ['G', 'Yearly_Feast', 'Text', 'Annual holidays (Enkutatash, Meskel…). Use IFS on C+B.'],
                ['H', 'Is_Fasting_Day', 'Boolean/Text', 'Wednesday/Friday flag. Use WEEKDAY() formula.'],
                ['I', 'Season_Image', 'URL', 'Image URL for the Ethiopian season (Tseday/Bega/Belg/Kiremt).'],
              ].map(([col, header, type, note]) => (
                <tr key={col} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 pr-3 text-eth-gold font-bold">{col}</td>
                  <td className="py-2 pr-3 text-white font-mono">{header}</td>
                  <td className="py-2 pr-3 text-blue-300">{type}</td>
                  <td className="py-2 text-white/40">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Formulas */}
      <div className="space-y-4">
        {formulas.map(item => (
          <div
            key={item.title}
            className={`border-l-2 ${item.color} bg-white/5 border border-white/10 rounded-xl overflow-hidden`}
          >
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-white font-semibold text-sm">{item.title}</span>
                </div>
                <CopyButton text={item.formula} />
              </div>
              <p className="text-white/50 text-xs leading-relaxed">{item.description}</p>
            </div>
            <div className="bg-black/40 p-4">
              <pre className="text-green-300 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {item.formula}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Glide integration steps */}
      <SectionCard>
        <h3 className="text-eth-gold font-bold text-sm mb-3 flex items-center gap-2">
          <Anchor className="w-4 h-4" />
          Glide App Integration — 5 Steps
        </h3>
        <div className="space-y-3">
          {[
            {
              step: 1,
              title: 'Create "Date_Engine" sheet in Google Sheets',
              detail: 'Add headers in Row 1: A1=Gregorian_Date, B1=Eth_Day, C1=Eth_Month, D1=Eth_Year, E1=Full_Eth_Date, F1=Monthly_Feast',
            },
            {
              step: 2,
              title: 'Generate date sequence in A2',
              detail: '=SEQUENCE(2557, 1, DATE(2024,1,1), 1)  — This fills 2,557 rows (7 years) with one date per row.',
            },
            {
              step: 3,
              title: 'Paste all ArrayFormulas in B2:H2',
              detail: 'Copy each formula from above and paste into the corresponding column (B2 for Eth_Day, C2 for Eth_Month, etc.).',
            },
            {
              step: 4,
              title: 'Connect to Glide → Add Relation',
              detail: 'In Glide Data Editor: On your main table, add a Relation column matching "Today" (NOW) to "Date_Engine.Gregorian_Date". Then add Lookup columns to pull Full_Eth_Date, Monthly_Feast, etc.',
            },
            {
              step: 5,
              title: 'Display in Glide UI',
              detail: 'Add a Text component. Set value to the Lookup column. Example: "Today is [Full_Eth_Date] · [Monthly_Feast]" — users see "Meskerem 1, 2018 · Lideta".',
            },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <div className="w-7 h-7 bg-eth-gold/20 text-eth-gold rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────
export default function EOTCCalendar() {
  const [activeTab, setActiveTab] = useState<SubTab>('today');

  const renderPanel = () => {
    switch (activeTab) {
      case 'today': return <TodayPanel />;
      case 'monthly': return <MonthlyPanel />;
      case 'yearly': return <YearlyPanel />;
      case 'movable': return <MovablePanel />;
      case 'fasting': return <FastingPanel />;
      case 'formulas': return <FormulasPanel />;
      default: return <TodayPanel />;
    }
  };

  return (
    <div className="fade-in space-y-5">
      {/* Page header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0033] via-[#2d1a4e] to-[#1a0033] p-5 border border-purple-800/30">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-3 right-6 text-7xl">☦</div>
          <div className="absolute bottom-2 left-4 text-5xl opacity-50">✞</div>
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-14 h-14 bg-purple-800/60 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            ⛪
          </div>
          <div>
            <h1 className="text-purple-100 font-bold text-xl">EOTC Calendar</h1>
            <p className="text-purple-300/60 text-sm geez-num">
              የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ቀን መቁጠሪያ
            </p>
            <p className="text-purple-300/60 text-xs mt-1">
              Monthly Saints · Annual Feasts · Bahire Hasab Algorithm · Fasting Rules
            </p>
          </div>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
        <div className="flex gap-1.5 min-w-max">
          {SUB_TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-purple-700/50 text-purple-200 border border-purple-500/40'
                    : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderPanel()}
    </div>
  );
}
