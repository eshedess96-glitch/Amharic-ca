import { useState } from 'react';
import { FORMULAS, MONTH_CROSSOVER, ETH_MONTHS } from '../utils/ethiopianCalendar';
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  Columns3,
  Calculator,
  Zap,
  Table,
  FileSpreadsheet,
  Link,
  Smartphone,
} from 'lucide-react';

function FormulaBlock({ label, formula, description }: { label: string; formula: string; description: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formula.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            copied
              ? 'bg-eth-green/20 text-eth-green-light'
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-white/40 text-xs">{description}</p>
      <div className="formula-box p-4 mt-1">
        <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
          {formula.trim()}
        </pre>
      </div>
    </div>
  );
}

function AccordionSection({ title, icon: Icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
      >
        <Icon className="w-5 h-5 text-eth-gold flex-shrink-0" />
        <span className="text-white font-semibold text-left flex-1">{title}</span>
        {open ? <ChevronDown className="w-5 h-5 text-white/40" /> : <ChevronRight className="w-5 h-5 text-white/40" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-5 fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Guide() {
  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-eth-gold flex items-center justify-center gap-2">
          <FileSpreadsheet className="w-6 h-6" />
          Google Sheets Formula Lab
        </h2>
        <p className="text-white/50 mt-1">Copy-paste formulas for your Glide + Google Sheets setup</p>
      </div>

      {/* Quick overview */}
      <div className="bg-gradient-to-br from-eth-red-dark/20 to-eth-red/10 border border-eth-red/20 rounded-2xl p-5">
        <h3 className="text-eth-gold font-bold mb-2">📋 Sheet Structure Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="sheet-header text-left">Column</th>
                <th className="sheet-header text-left">Header</th>
                <th className="sheet-header text-left">Type</th>
                <th className="sheet-header text-left">Source</th>
              </tr>
            </thead>
            <tbody className="text-white/70">
              <tr><td className="sheet-cell font-mono text-eth-gold">A</td><td className="sheet-cell">Gregorian_Date</td><td className="sheet-cell">Date</td><td className="sheet-cell">SEQUENCE formula</td></tr>
              <tr><td className="sheet-cell font-mono text-eth-gold">B</td><td className="sheet-cell">Eth_Day</td><td className="sheet-cell">Number (1-30)</td><td className="sheet-cell">Formula</td></tr>
              <tr><td className="sheet-cell font-mono text-eth-gold">C</td><td className="sheet-cell">Eth_Month</td><td className="sheet-cell">Text</td><td className="sheet-cell">IFS formula</td></tr>
              <tr><td className="sheet-cell font-mono text-eth-gold">D</td><td className="sheet-cell">Eth_Year</td><td className="sheet-cell">Number</td><td className="sheet-cell">Year Correction formula</td></tr>
              <tr><td className="sheet-cell font-mono text-eth-gold">E</td><td className="sheet-cell">Full_Eth_Date</td><td className="sheet-cell">Text</td><td className="sheet-cell">Concatenation</td></tr>
              <tr><td className="sheet-cell font-mono text-eth-gold">F</td><td className="sheet-cell">Eth_Day_Geez</td><td className="sheet-cell">Text (Geez)</td><td className="sheet-cell">VLOOKUP</td></tr>
              <tr><td className="sheet-cell font-mono text-eth-gold">G</td><td className="sheet-cell">Special_Event</td><td className="sheet-cell">Text</td><td className="sheet-cell">IFS formula</td></tr>
              <tr><td className="sheet-cell font-mono text-eth-gold">H</td><td className="sheet-cell">Season_Image</td><td className="sheet-cell">Text/URL</td><td className="sheet-cell">IFS formula</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PART 1: Date Sequence */}
      <AccordionSection title="PART 1: Generate Date Sequence (2024-2030)" icon={Database} defaultOpen={true}>
        <div className="text-sm text-white/60 space-y-2">
          <p>Create a sheet called <code className="bg-white/10 px-1.5 rounded text-eth-gold">Date_Engine</code>. In cell <strong className="text-white">A1</strong>, type the header <code className="bg-white/10 px-1.5 rounded">Gregorian_Date</code>.</p>
          <p>In cell <strong className="text-white">A2</strong>, paste this formula to generate 2,557 dates (Jan 1, 2024 → Dec 31, 2030):</p>
        </div>

        <FormulaBlock
          label="Cell A2 — Date Sequence Generator"
          formula={FORMULAS.dateSequence}
          description="Generates every date from Jan 1, 2024 to Dec 31, 2030 automatically. No manual typing needed."
        />

        <div className="bg-eth-gold/5 border border-eth-gold/10 rounded-lg p-3 text-xs text-white/50">
          💡 <strong className="text-white/70">Tip:</strong> Format Column A as <code className="bg-white/10 px-1 rounded">Date</code> in Google Sheets (Format → Number → Date) so it displays properly.
        </div>
      </AccordionSection>

      {/* PART 2: Year Correction */}
      <AccordionSection title="PART 2: The Year Correction Formula (Critical!)" icon={Calculator} defaultOpen={true}>
        <div className="bg-eth-red/10 border border-eth-red/20 rounded-xl p-4 mb-2">
          <h4 className="text-eth-gold font-bold mb-2">⚡ The Sept 11 Rule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white font-semibold">Jan 1 → Sep 10</p>
              <p className="text-white/60 mt-1">Eth Year = <span className="text-eth-gold font-mono">YEAR(date) − 8</span></p>
              <p className="text-white/40 text-xs mt-1">Example: Sep 10, 2025 → 2017 E.C.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white font-semibold">Sep 11 → Dec 31</p>
              <p className="text-white/60 mt-1">Eth Year = <span className="text-eth-gold font-mono">YEAR(date) − 7</span></p>
              <p className="text-white/40 text-xs mt-1">Example: Sep 11, 2025 → 2018 E.C.</p>
            </div>
          </div>
        </div>

        <FormulaBlock
          label="Cell D2 — Ethiopian Year (ARRAYFORMULA)"
          formula={FORMULAS.yearCorrection}
          description="Paste in D2. Checks if the Gregorian date is before or after Sep 11 and applies the correct year offset. Works dynamically for all rows."
        />

        <div className="bg-eth-green/10 border border-eth-green/20 rounded-lg p-3 text-xs text-white/50">
          ✅ <strong className="text-white/70">How it works:</strong> <code className="bg-white/10 px-1 rounded">DATE(YEAR(A2), 9, 11)</code> constructs "Sep 11" of the same year. If the date comes before Sep 11, we subtract 8 years. After Sep 11, we subtract 7 years.
        </div>
      </AccordionSection>

      {/* PART 3: Month Mapping */}
      <AccordionSection title="PART 3: Month Mapping (Meskerem → Pagume)" icon={Columns3}>
        <div className="text-sm text-white/60 mb-3">
          <p>Each Ethiopian month starts on a specific Gregorian date. The crossover pattern:</p>
        </div>

        {/* Reference table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="sheet-header text-left">#</th>
                <th className="sheet-header text-left">Eth Month</th>
                <th className="sheet-header text-center">Amharic</th>
                <th className="sheet-header text-center">From (Greg)</th>
                <th className="sheet-header text-center">To (Greg)</th>
                <th className="sheet-header text-center">Days</th>
              </tr>
            </thead>
            <tbody className="text-white/70">
              {MONTH_CROSSOVER.map((row, i) => (
                <tr key={row.ethMonth} className={i % 2 === 0 ? 'bg-white/3' : ''}>
                  <td className="sheet-cell text-eth-gold">{i + 1}</td>
                  <td className="sheet-cell font-medium">{row.ethMonth}</td>
                  <td className="sheet-cell text-center geez-num">{ETH_MONTHS[i].amharic}</td>
                  <td className="sheet-cell text-center">{row.from}</td>
                  <td className="sheet-cell text-center">{row.to}</td>
                  <td className="sheet-cell text-center">{row.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <FormulaBlock
          label="Cell C2 — Ethiopian Month Name (Simplified VLOOKUP)"
          formula={FORMULAS.ethMonthSimplified}
          description="Uses a VLOOKUP with threshold matching. Maps the month+day combination to the correct Ethiopian month name."
        />

        <FormulaBlock
          label="Cell B2 — Ethiopian Day Number (1-30)"
          formula={FORMULAS.ethDayPrecise}
          description="Calculates the day within the Ethiopian month (1-30) based on the offset from the Ethiopian New Year (Sep 11)."
        />

        <FormulaBlock
          label="Cell F2 — Geez Numerals (፩ ፪ ፫ ...)"
          formula={FORMULAS.geezDay}
          description="Converts the numeric day (Column B) to its Ge'ez numeral equivalent using VLOOKUP."
        />
      </AccordionSection>

      {/* PART 4: Concatenation & Special Events */}
      <AccordionSection title="PART 4: Full Date String & Special Events" icon={Table}>
        <FormulaBlock
          label="Cell E2 — Full Ethiopian Date String"
          formula={FORMULAS.fullEthDate}
          description="Concatenates Month + Day + Year into a readable string like 'Meskerem 1, 2018'."
        />

        <FormulaBlock
          label="Cell G2 — Special Events / Holidays"
          formula={FORMULAS.specialEvent}
          description="Marks known Ethiopian holidays. Add more conditions for additional holidays."
        />

        <FormulaBlock
          label="Cell H2 — Season / Image Category"
          formula={FORMULAS.seasonImage}
          description="Maps each month to its Ethiopian season. Replace with image URLs for dynamic headers in Glide."
        />
      </AccordionSection>

      {/* PART 5: Glide Integration */}
      <AccordionSection title="PART 5: Glide Integration — Display Today's Date" icon={Link}>
        <div className="space-y-4 text-sm text-white/60">
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold flex items-center gap-2">
              <span className="bg-eth-gold text-eth-coffee-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</span>
              Create a "Now" Column in Glide
            </h4>
            <p>In the Glide Data Editor, go to your <code className="bg-white/10 px-1.5 rounded">Date_Engine</code> table.</p>
            <p>Add a <strong className="text-white">Computed Column</strong> → Choose <strong className="text-white">"Now"</strong> type.</p>
            <p>This creates a column that always equals the current date/time. Call it <code className="bg-white/10 px-1.5 rounded">Current_Date</code>.</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold flex items-center gap-2">
              <span className="bg-eth-gold text-eth-coffee-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">2</span>
              Create a Date-Only Column
            </h4>
            <p>Add a <strong className="text-white">Math Column</strong> that truncates time:</p>
            <div className="formula-box p-3 text-xs text-green-400">
              <pre>INT(Current_Date)</pre>
            </div>
            <p>Call this <code className="bg-white/10 px-1.5 rounded">Today_Date_Only</code>. This strips the time portion.</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold flex items-center gap-2">
              <span className="bg-eth-gold text-eth-coffee-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">3</span>
              Create a Relation Column
            </h4>
            <p>In the <code className="bg-white/10 px-1.5 rounded">Date_Engine</code> table:</p>
            <p>Add a <strong className="text-white">Relation</strong> column → Match <code className="bg-white/10 px-1.5 rounded">Today_Date_Only</code> to <code className="bg-white/10 px-1.5 rounded">Gregorian_Date</code> (same table, self-relation).</p>
            <p>Call it <code className="bg-white/10 px-1.5 rounded">Today_Row</code>.</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold flex items-center gap-2">
              <span className="bg-eth-gold text-eth-coffee-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">4</span>
              Create Lookup Columns
            </h4>
            <p>Add <strong className="text-white">Lookup</strong> columns through the <code className="bg-white/10 px-1.5 rounded">Today_Row</code> relation:</p>
            <ul className="space-y-1 ml-4">
              <li>• <code className="bg-white/10 px-1 rounded">Today_Eth_Month</code> → Looks up <code className="bg-white/10 px-1 rounded">Eth_Month</code></li>
              <li>• <code className="bg-white/10 px-1 rounded">Today_Eth_Day</code> → Looks up <code className="bg-white/10 px-1 rounded">Eth_Day</code></li>
              <li>• <code className="bg-white/10 px-1 rounded">Today_Eth_Year</code> → Looks up <code className="bg-white/10 px-1 rounded">Eth_Year</code></li>
              <li>• <code className="bg-white/10 px-1 rounded">Today_Full_Eth</code> → Looks up <code className="bg-white/10 px-1 rounded">Full_Eth_Date</code></li>
              <li>• <code className="bg-white/10 px-1 rounded">Today_Holy_Day</code> → Looks up <code className="bg-white/10 px-1 rounded">Special_Event</code></li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold flex items-center gap-2">
              <span className="bg-eth-gold text-eth-coffee-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">5</span>
              Display in the App
            </h4>
            <p>On your Home Screen, add a <strong className="text-white">Title Component</strong> bound to:</p>
            <div className="bg-eth-coffee/50 rounded-xl p-4 text-center">
              <p className="text-white/40 text-xs">Today is:</p>
              <p className="text-2xl font-bold text-eth-gold glow-gold geez-num">መስከረም ፩</p>
              <p className="text-lg text-eth-gold-light">Meskerem 1, 2018</p>
            </div>
            <p className="text-xs text-white/40 mt-2">Bind the title to <code className="bg-white/10 px-1 rounded">Today_Full_Eth</code> and use a Rich Text component for the Amharic display.</p>
          </div>
        </div>
      </AccordionSection>

      {/* PART 6: Events Relation */}
      <AccordionSection title="PART 6: Events → Ethiopian Date Lookup" icon={Smartphone}>
        <div className="space-y-4 text-sm text-white/60">
          <p>When a user schedules an event for "Sep 11, 2025", you want the app to show "Meskerem 1, 2018" automatically.</p>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold">Events Sheet Structure</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="sheet-header text-left">Column</th>
                    <th className="sheet-header text-left">Header</th>
                    <th className="sheet-header text-left">Source</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr><td className="sheet-cell font-mono text-eth-gold">A</td><td className="sheet-cell">Event_Name</td><td className="sheet-cell">User input</td></tr>
                  <tr><td className="sheet-cell font-mono text-eth-gold">B</td><td className="sheet-cell">Event_Description</td><td className="sheet-cell">User input</td></tr>
                  <tr><td className="sheet-cell font-mono text-eth-gold">C</td><td className="sheet-cell">Date_Time</td><td className="sheet-cell">Date picker (Gregorian)</td></tr>
                  <tr><td className="sheet-cell font-mono text-eth-gold">D</td><td className="sheet-cell">User_Email</td><td className="sheet-cell">Auto (signed-in user)</td></tr>
                  <tr><td className="sheet-cell font-mono text-eth-gold">E</td><td className="sheet-cell">Row_ID</td><td className="sheet-cell">Auto (Glide Row ID)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold">Glide Relation + Lookup</h4>
            <p>In the Events table in Glide Data Editor:</p>
            <ol className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-eth-gold font-bold">1.</span>
                <span>Add a <strong className="text-white">Date-Only</strong> computed column: <code className="bg-white/10 px-1 rounded">Event_Date_Only = INT(Date_Time)</code></span>
              </li>
              <li className="flex gap-2">
                <span className="text-eth-gold font-bold">2.</span>
                <span>Add a <strong className="text-white">Relation</strong>: Match <code className="bg-white/10 px-1 rounded">Event_Date_Only</code> → <code className="bg-white/10 px-1 rounded">Date_Engine.Gregorian_Date</code></span>
              </li>
              <li className="flex gap-2">
                <span className="text-eth-gold font-bold">3.</span>
                <span>Add <strong className="text-white">Lookup</strong> columns through this relation:
                  <br /><code className="bg-white/10 px-1 rounded">Event_Eth_Date</code> → Full_Eth_Date
                  <br /><code className="bg-white/10 px-1 rounded">Event_Holy_Day</code> → Special_Event
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-eth-gold/5 border border-eth-gold/10 rounded-lg p-3 text-xs text-white/50">
            🎯 <strong className="text-white/70">Result:</strong> When user picks "Sep 11, 2025", the event list automatically shows "Meskerem 1, 2018" next to it — zero code needed!
          </div>
        </div>
      </AccordionSection>

      {/* Zapier Setup */}
      <AccordionSection title="PART 7: Zapier Alarm Integration" icon={Zap}>
        <div className="space-y-4 text-sm text-white/60">
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold">Zapier Setup (Free Tier)</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-eth-gold text-eth-coffee-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">T</div>
                <div>
                  <p className="text-white font-semibold">Trigger: New Row in Google Sheets</p>
                  <p className="text-white/50">Spreadsheet: Ethio-Life DB → Sheet: Events</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-eth-red text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">F</div>
                <div>
                  <p className="text-white font-semibold">Filter: Only if Premium</p>
                  <p className="text-white/50">Add a Filter step: <code className="bg-white/10 px-1 rounded">User_Is_VIP</code> (Text) Contains <code className="bg-white/10 px-1 rounded">TRUE</code></p>
                  <p className="text-white/40 text-xs mt-1">This ensures free users don't get email reminders.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-eth-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">A</div>
                <div>
                  <p className="text-white font-semibold">Action Option A: Send Email</p>
                  <p className="text-white/50">Use Zapier Email → Send Outbound Email</p>
                  <p className="text-white/50">To: <code className="bg-white/10 px-1 rounded">User_Email</code></p>
                  <p className="text-white/50">Subject: "Reminder: {'{{Event_Name}}'} today!"</p>
                  <p className="text-white/50">Body: Include both Gregorian & Ethiopian dates</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-eth-blue text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">A</div>
                <div>
                  <p className="text-white font-semibold">Action Option B: Google Calendar Event</p>
                  <p className="text-white/50">Create Quick Add Event in user's Google Calendar</p>
                  <p className="text-white/50">This triggers native phone alarm/push notification!</p>
                  <p className="text-white/50">Set reminder: 15 minutes before</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-eth-gold/5 border border-eth-gold/10 rounded-lg p-3 text-xs text-white/50">
            📱 <strong className="text-white/70">Why Google Calendar?</strong> Glide PWA can't ring a phone alarm. But Google Calendar can! By pushing to GCal, the user's phone handles the notification natively.
          </div>
        </div>
      </AccordionSection>

      {/* Telebirr Payment Info */}
      <AccordionSection title="PART 8: Monetization — Telebirr Payment Setup" icon={Smartphone}>
        <div className="space-y-4 text-sm text-white/60">
          <div className="bg-gradient-to-r from-eth-green-dark/30 to-eth-green/15 border border-eth-green/20 rounded-xl p-5 text-center">
            <p className="text-white/50 text-xs mb-1">Official Telebirr Payment Number</p>
            <p className="text-4xl font-bold text-white tracking-widest">0963068310</p>
            <p className="text-eth-gold text-lg font-semibold mt-2">99 ETB / month</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold">Verification Workflow</h4>
            <div className="space-y-2">
              <p><strong className="text-white">Step 1:</strong> User opens <strong className="text-white">Telebirr</strong> app and sends <strong className="text-eth-gold">99 ETB</strong> to <code className="bg-eth-gold/20 text-eth-gold px-2 py-0.5 rounded font-bold tracking-wider">0963068310</code></p>
              <p><strong className="text-white">Step 2:</strong> User takes a <strong className="text-white">screenshot</strong> of the payment confirmation</p>
              <p><strong className="text-white">Step 3:</strong> User uploads the screenshot via the app's <strong className="text-white">"Pro"</strong> tab</p>
              <p><strong className="text-white">Step 4:</strong> Admin reviews and sets <code className="bg-white/10 px-1.5 rounded">User_Is_VIP = TRUE</code> in Glide</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-eth-gold font-bold">Glide Implementation</h4>
            <div className="space-y-2">
              <p>• In the <strong className="text-white">Users</strong> sheet, create <code className="bg-white/10 px-1.5 rounded">Is_VIP</code> (Boolean, default FALSE)</p>
              <p>• Set <strong className="text-white">Visibility Condition</strong> on "Add Event" button: <code className="bg-white/10 px-1.5 rounded">Is_VIP = TRUE OR Events_Count &lt; 5</code></p>
              <p>• Show "Subscribe" banner when <code className="bg-white/10 px-1.5 rounded">Is_VIP = FALSE AND Events_Count ≥ 5</code></p>
              <p>• Create a <strong className="text-white">Rollup</strong> on Events filtered by <code className="bg-white/10 px-1.5 rounded">User_Email</code> → Count for tracking</p>
            </div>
          </div>

          <div className="bg-eth-gold/5 border border-eth-gold/10 rounded-lg p-3 text-xs text-white/50">
            💰 <strong className="text-white/70">Revenue Note:</strong> At 99 ETB/month, 100 active Pro users = 9,900 ETB monthly recurring revenue. Scale by adding premium features like custom holiday alerts and family calendar sharing.
          </div>
        </div>
      </AccordionSection>

      {/* Data Flow Diagram */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-eth-gold font-bold text-lg mb-4">🔄 Complete Data Flow</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="bg-eth-gold/20 rounded-lg px-3 py-2 text-eth-gold font-mono text-xs min-w-[140px] text-center">Google Sheets</div>
            <span className="text-white/30">→</span>
            <div className="text-white/60 flex-1">Date_Engine (2,557 rows) + Users + Events</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-eth-green/20 rounded-lg px-3 py-2 text-eth-green-light font-mono text-xs min-w-[140px] text-center">Glide App</div>
            <span className="text-white/30">→</span>
            <div className="text-white/60 flex-1">Relations + Lookups connect Events → Date_Engine</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-eth-red/20 rounded-lg px-3 py-2 text-eth-red-light font-mono text-xs min-w-[140px] text-center">Zapier</div>
            <span className="text-white/30">→</span>
            <div className="text-white/60 flex-1">Watches Events sheet → Filters VIP → Sends Email/GCal</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-eth-blue/20 rounded-lg px-3 py-2 text-blue-300 font-mono text-xs min-w-[140px] text-center">User's Phone</div>
            <span className="text-white/30">→</span>
            <div className="text-white/60 flex-1">Google Calendar triggers native alarm notification</div>
          </div>
        </div>
      </div>
    </div>
  );
}
