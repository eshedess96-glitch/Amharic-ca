import { useState } from 'react';
import { useAppStore } from './store/useStore';
import { gregorianToEthiopian } from './utils/ethiopianCalendar';
import Dashboard from './components/Dashboard';
import Converter from './components/Converter';
import Scheduler from './components/Scheduler';
import ProGate from './components/ProGate';
import Guide from './components/Guide';
import EOTCCalendar from './components/EOTCCalendar';
import {
  Calendar,
  ArrowRightLeft,
  CalendarPlus,
  Crown,
  FileSpreadsheet,
  Menu,
  X,
  Phone,
  Church,
} from 'lucide-react';

type Tab = 'dashboard' | 'converter' | 'scheduler' | 'eotc' | 'pro' | 'guide';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Today', icon: Calendar },
  { id: 'converter', label: 'Convert', icon: ArrowRightLeft },
  { id: 'scheduler', label: 'Events', icon: CalendarPlus },
  { id: 'eotc', label: 'EOTC', icon: Church },
  { id: 'guide', label: 'Formulas', icon: FileSpreadsheet },
  { id: 'pro', label: 'Pro', icon: Crown },
];

export default function App() {
  const store = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const today = gregorianToEthiopian(new Date());

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'converter':
        return <Converter />;
      case 'scheduler':
        return (
          <Scheduler
            events={store.events}
            isPremium={store.isPremium}
            onAdd={store.addEvent}
            onRemove={store.removeEvent}
            userEmail={store.userEmail || 'user@example.com'}
          />
        );
      case 'pro':
        return (
          <ProGate
            isPremium={store.isPremium}
            onUpgrade={store.togglePremium}
          />
        );
      case 'eotc':
        return <EOTCCalendar />;
      case 'guide':
        return <Guide />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen eth-pattern">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-eth-coffee-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-eth-gold rounded-xl flex items-center justify-center text-eth-coffee-dark font-bold text-lg">
              ✦
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Ethio-Life</h1>
              <p className="text-white/40 text-xs leading-tight">
                {today.monthAmharic} {today.dayGeez} — {today.fullString}
              </p>
            </div>
          </div>

          {/* Premium badge */}
          <div className="flex items-center gap-3">
            {store.isPremium && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-eth-gold/20 text-eth-gold text-xs font-bold px-3 py-1 rounded-full">
                <Crown className="w-3 h-3" fill="currentColor" />
                PRO
              </span>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/60 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block max-w-5xl mx-auto px-4">
          <div className="flex gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
                    isActive
                      ? 'border-eth-gold text-eth-gold'
                      : 'border-transparent text-white/50 hover:text-white/80 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'pro' && !store.isPremium && (
                    <span className="w-2 h-2 bg-eth-red rounded-full pulse-dot" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden px-4 pb-3 space-y-1 fade-in">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-eth-gold/10 text-eth-gold'
                      : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'pro' && !store.isPremium && (
                    <span className="w-2 h-2 bg-eth-red rounded-full pulse-dot ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Telebirr Sticky Banner for Free Users */}
      {!store.isPremium && (
        <div className="bg-gradient-to-r from-eth-green-dark via-eth-green to-eth-green-dark border-b border-eth-green-light/20">
          <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white/80">
              Upgrade to <strong className="text-white">Pro</strong> — Send <strong className="text-eth-gold">99 ETB</strong> via Telebirr to
            </span>
            <code className="bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-lg tracking-wider text-base">
              0963068310
            </code>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-eth-coffee-dark/95 backdrop-blur-md border-t border-white/10 z-50">
        <div className="flex">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-all ${
                  isActive ? 'text-eth-gold' : 'text-white/40'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {tab.id === 'pro' && !store.isPremium && (
                  <span className="absolute top-1 right-1/2 translate-x-4 w-1.5 h-1.5 bg-eth-red rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* Safe area padding for notched phones */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-20" />
    </div>
  );
}
