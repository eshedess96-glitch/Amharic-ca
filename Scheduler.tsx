import { useState } from 'react';
import {
  gregorianToEthiopian,
  GEEZ_NUMBERS,
} from '../utils/ethiopianCalendar';
import type { UserEvent } from '../store/useStore';
import {
  Plus,
  Trash2,
  Clock,
  CalendarPlus,
  Lock,
  AlertTriangle,
  Bell,
  Smartphone,
} from 'lucide-react';

const FREE_LIMIT = 5;

interface SchedulerProps {
  events: UserEvent[];
  isPremium: boolean;
  onAdd: (event: Omit<UserEvent, 'id'>) => void;
  onRemove: (id: string) => void;
  userEmail: string;
}

export default function Scheduler({ events, isPremium, onAdd, onRemove, userEmail }: SchedulerProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [showForm, setShowForm] = useState(false);

  const canAdd = isPremium || events.length < FREE_LIMIT;
  const used = events.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dateTime) return;
    onAdd({ name: name.trim(), description: desc.trim(), dateTime, userEmail });
    setName('');
    setDesc('');
    setDateTime('');
    setShowForm(false);
  };

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-eth-gold flex items-center justify-center gap-2">
          <CalendarPlus className="w-6 h-6" />
          Event Scheduler
        </h2>
        <p className="text-white/50 mt-1">Schedule events with dual-calendar display</p>
      </div>

      {/* Usage bar */}
      {!isPremium && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Events Used</span>
            <span className={`text-sm font-bold ${used >= FREE_LIMIT ? 'text-eth-red-light' : 'text-eth-gold'}`}>
              {used} / {FREE_LIMIT}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${used >= FREE_LIMIT ? 'bg-eth-red' : 'bg-eth-gold'}`}
              style={{ width: `${Math.min((used / FREE_LIMIT) * 100, 100)}%` }}
            />
          </div>
          {used >= FREE_LIMIT && (
            <div className="mt-2 space-y-1">
              <p className="text-eth-red-light text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Free limit reached. Upgrade to Pro for unlimited events.
              </p>
              <p className="text-white/40 text-xs">
                💳 Pay <strong className="text-eth-gold">99 ETB</strong> via Telebirr to <code className="bg-white/10 px-1.5 py-0.5 rounded text-eth-gold font-bold">0963068310</code> to unlock Pro.
              </p>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      <div className="bg-gradient-to-br from-eth-green-dark/20 to-eth-green/10 border border-eth-green/20 rounded-2xl p-5">
        <h3 className="text-eth-gold font-bold mb-3 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          How "Add to Calendar" Works
        </h3>
        <div className="space-y-2 text-sm text-white/70">
          <p>1️⃣ You input the date using the standard <strong className="text-white">Gregorian date picker</strong> (system default).</p>
          <p>2️⃣ The app automatically <strong className="text-white">displays the Ethiopian equivalent</strong> next to it.</p>
          <p>3️⃣ When saved, the event pushes to your <strong className="text-white">phone's native calendar</strong> (Google/Apple).</p>
          <p>4️⃣ Your phone handles the <strong className="text-white">actual alarm/notification</strong> — no extra setup needed!</p>
        </div>
        <div className="mt-3 bg-white/5 rounded-lg p-3 text-xs text-white/40 flex items-center gap-2">
          <Bell className="w-4 h-4 text-eth-gold flex-shrink-0" />
          <span>In Glide: Use the <code className="bg-white/10 px-1 rounded">Add to Device Calendar</code> action to push events with native alarms.</span>
        </div>
      </div>

      {/* Add event button / form */}
      {!showForm ? (
        <div className="space-y-3">
          <button
            onClick={() => canAdd && setShowForm(true)}
            disabled={!canAdd}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
              ${canAdd
                ? 'bg-eth-gold text-eth-coffee-dark hover:bg-eth-gold-light active:scale-[0.98]'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
          >
            {canAdd ? (
              <>
                <Plus className="w-5 h-5" /> Add New Event
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" /> Upgrade to Add More Events
              </>
            )}
          </button>
          {!canAdd && (
            <div className="bg-gradient-to-r from-eth-green-dark/30 to-eth-green/15 border border-eth-green/20 rounded-xl p-4 text-center">
              <p className="text-white/60 text-sm">Pay <strong className="text-eth-gold">99 ETB/month</strong> via Telebirr to unlock Pro</p>
              <p className="text-white text-2xl font-bold tracking-widest mt-1">📱 0963068310</p>
              <p className="text-white/40 text-xs mt-1">Upload payment screenshot in the Pro tab</p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Event Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Meeting with client"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-eth-gold"
              required
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Description</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-eth-gold resize-none"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Date & Time (Gregorian) *</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-eth-gold"
              required
            />
            {dateTime && (() => {
              const d = new Date(dateTime);
              if (!isNaN(d.getTime())) {
                const eth = gregorianToEthiopian(d);
                return (
                  <div className="mt-2 bg-eth-gold/10 border border-eth-gold/20 rounded-lg p-2.5 flex items-center gap-2">
                    <span className="text-eth-gold text-sm geez-num">{eth.monthAmharic} {eth.dayGeez}</span>
                    <span className="text-white/50 text-sm">— {eth.fullString}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-eth-gold text-eth-coffee-dark py-3 rounded-xl font-bold hover:bg-eth-gold-light transition-colors"
            >
              Save Event
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 bg-white/10 text-white/60 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Event list */}
      <div className="space-y-3">
        <h3 className="text-white/80 font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Your Events ({events.length})
        </h3>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
            <CalendarPlus className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/30">No events yet. Add your first event!</p>
          </div>
        ) : (
          events.map(event => {
            const d = new Date(event.dateTime);
            const eth = gregorianToEthiopian(d);
            const gregStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const isPast = d < new Date();

            return (
              <div
                key={event.id}
                className={`bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4 transition-all hover:bg-white/8 ${
                  isPast ? 'opacity-50' : ''
                }`}
              >
                {/* Date badge */}
                <div className="parchment-tile rounded-xl p-3 text-center min-w-[70px] flex-shrink-0">
                  <p className="text-eth-coffee text-xs">{eth.monthName}</p>
                  <p className="text-eth-coffee-dark text-2xl font-bold geez-num">{GEEZ_NUMBERS[eth.day] || eth.day}</p>
                  <p className="text-eth-coffee/60 text-[10px]">{gregStr}</p>
                </div>

                {/* Event details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold truncate">{event.name}</h4>
                  {event.description && (
                    <p className="text-white/50 text-sm mt-0.5 truncate">{event.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {timeStr}
                    </span>
                    <span className="text-eth-gold geez-num">{eth.fullAmharic}</span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => onRemove(event.id)}
                  className="p-2 text-white/30 hover:text-eth-red hover:bg-eth-red/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Glide + Zapier Integration Note */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-eth-gold font-bold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Zapier Integration (For Glide Build)
        </h3>
        <div className="text-sm text-white/60 space-y-2">
          <p><strong className="text-white">Trigger:</strong> New Row in <code className="bg-white/10 px-1.5 rounded">Events</code> Google Sheet</p>
          <p><strong className="text-white">Filter:</strong> Only if <code className="bg-white/10 px-1.5 rounded">User_Is_VIP = TRUE</code></p>
          <p><strong className="text-white">Action:</strong> Send email reminder to <code className="bg-white/10 px-1.5 rounded">User_Email</code> 15 min before event</p>
          <p><strong className="text-white">Alt Action:</strong> Add event to user's Google Calendar (handles push notifications automatically)</p>
        </div>
      </div>
    </div>
  );
}
