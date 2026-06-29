import { useState } from 'react';
import {
  Crown,
  Lock,
  Unlock,
  Check,
  Upload,
  Phone,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react';

interface ProGateProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function ProGate({ isPremium, onUpgrade }: ProGateProps) {
  const [uploaded, setUploaded] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setVerifying(true);
    // Simulate admin verification
    setTimeout(() => {
      setVerifying(false);
      onUpgrade();
    }, 3000);
  };

  const features = [
    { name: 'View Calendar & Today\'s Date', free: true, pro: true },
    { name: 'Date Converter', free: true, pro: true },
    { name: 'Ethiopian Month Names', free: true, pro: true },
    { name: 'Add Events (up to 5)', free: true, pro: true },
    { name: 'Unlimited Events', free: false, pro: true },
    { name: 'Email Reminders (via Zapier)', free: false, pro: true },
    { name: 'Google Calendar Sync', free: false, pro: true },
    { name: 'Holiday Push Notifications', free: false, pro: true },
    { name: 'Priority Support', free: false, pro: true },
  ];

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-eth-gold flex items-center justify-center gap-2">
          <Crown className="w-6 h-6" />
          Ethio-Life Pro
        </h2>
        <p className="text-white/50 mt-1">Unlock the full Ethiopian calendar experience</p>
      </div>

      {/* Status Badge */}
      <div className={`text-center py-4 rounded-2xl border ${isPremium
        ? 'bg-eth-gold/10 border-eth-gold/30'
        : 'bg-white/5 border-white/10'
      }`}>
        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full ${
          isPremium ? 'bg-eth-gold text-eth-coffee-dark' : 'bg-white/10 text-white/60'
        }`}>
          {isPremium ? (
            <>
              <Crown className="w-5 h-5" fill="currentColor" />
              <span className="font-bold">PRO Member</span>
              <Sparkles className="w-4 h-4" />
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span className="font-medium">Free Plan</span>
            </>
          )}
        </div>
      </div>

      {/* Pricing Card */}
      {!isPremium && (
        <div className="relative overflow-hidden bg-gradient-to-br from-eth-coffee-dark via-eth-coffee to-eth-coffee-light border border-eth-gold/30 rounded-2xl p-6 glow-card">
          <div className="absolute top-0 right-0 bg-eth-gold text-eth-coffee-dark text-xs font-bold px-4 py-1 rounded-bl-xl">
            POPULAR
          </div>
          <div className="text-center mb-6">
            <p className="text-white/50 text-sm">Ethio-Life Pro</p>
            <div className="flex items-baseline justify-center gap-1 mt-2">
              <span className="text-5xl font-bold text-eth-gold">99</span>
              <span className="text-eth-gold-light text-lg">ETB</span>
            </div>
            <p className="text-white/40 text-sm mt-1">per month</p>
          </div>

          <ul className="space-y-3 mb-6">
            {['Unlimited Events', 'Email Reminders', 'Google Calendar Sync', 'Holiday Alerts', 'Priority Support'].map(f => (
              <li key={f} className="flex items-center gap-3 text-white/80">
                <Check className="w-4 h-4 text-eth-gold flex-shrink-0" />
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>

          {/* Telebirr Payment Section */}
          <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
            <h4 className="text-eth-gold font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Pay via Telebirr
            </h4>

            {/* Prominent Phone Number Box */}
            <div className="bg-gradient-to-r from-eth-green-dark/40 to-eth-green/20 border border-eth-green/30 rounded-xl p-4 text-center">
              <p className="text-white/50 text-xs mb-1">Send payment to this number</p>
              <p className="text-3xl font-bold text-white tracking-widest">0963068310</p>
              <p className="text-eth-gold text-sm font-semibold mt-1">Amount: 99 ETB / month</p>
            </div>

            <div className="text-sm text-white/60 space-y-2">
              <p>1️⃣ Open <strong className="text-white">Telebirr</strong> app on your phone</p>
              <p>2️⃣ Send <strong className="text-eth-gold">99 ETB</strong> to <code className="bg-eth-gold/20 text-eth-gold px-2 py-0.5 rounded font-bold tracking-wider">0963068310</code></p>
              <p>3️⃣ Take a <strong className="text-white">screenshot</strong> of the payment confirmation</p>
              <p>4️⃣ Upload below for <strong className="text-white">instant verification</strong></p>
            </div>

            {!uploaded ? (
              <button
                onClick={handleUpload}
                className="w-full bg-eth-green hover:bg-eth-green-light text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Telebirr Screenshot
              </button>
            ) : verifying ? (
              <div className="text-center py-3">
                <div className="inline-flex items-center gap-2 text-eth-gold">
                  <div className="w-4 h-4 border-2 border-eth-gold border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Verifying payment...</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-eth-green-light flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span className="font-bold">Payment Verified!</span>
              </div>
            )}
          </div>

          {/* Admin workflow note */}
          <div className="mt-4 bg-white/5 rounded-lg p-3 text-xs text-white/40">
            <p className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 flex-shrink-0" />
              <strong>Glide Logic:</strong> User uploads screenshot → Admin checks <code className="bg-white/10 px-1 rounded">User_Is_VIP</code> = TRUE → Pro features unlock
            </p>
          </div>
        </div>
      )}

      {/* Feature Comparison */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 text-eth-gold" />
            Feature Comparison
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {features.map(f => (
            <div key={f.name} className="flex items-center justify-between px-4 py-3">
              <span className="text-white/70 text-sm flex-1">{f.name}</span>
              <div className="flex items-center gap-6">
                <div className="w-16 text-center">
                  {f.free ? (
                    <Check className="w-4 h-4 text-eth-green mx-auto" />
                  ) : (
                    <Lock className="w-4 h-4 text-white/20 mx-auto" />
                  )}
                </div>
                <div className="w-16 text-center">
                  {f.pro ? (
                    <Check className="w-4 h-4 text-eth-gold mx-auto" />
                  ) : (
                    <Lock className="w-4 h-4 text-white/20 mx-auto" />
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Column labels */}
          <div className="flex items-center justify-end px-4 py-2 bg-white/5">
            <div className="flex items-center gap-6">
              <span className="w-16 text-center text-xs text-white/40">Free</span>
              <span className="w-16 text-center text-xs text-eth-gold font-semibold">Pro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Glide Implementation */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-eth-gold font-bold">🔧 Glide Implementation Notes</h3>
        <div className="space-y-2 text-sm text-white/60">
          <p>
            <strong className="text-white">User_Is_VIP Column:</strong> Boolean in the Users sheet. Default = <code className="bg-white/10 px-1.5 rounded">FALSE</code>
          </p>
          <p>
            <strong className="text-white">Visibility Condition:</strong> Set the "Add Event" FAB button visibility to <code className="bg-white/10 px-1.5 rounded">User_Is_VIP = TRUE</code> OR <code className="bg-white/10 px-1.5 rounded">Events Count &lt; 5</code>
          </p>
          <p>
            <strong className="text-white">Rollup Column:</strong> In Glide, create a Rollup on Events filtered by <code className="bg-white/10 px-1.5 rounded">User_Email</code> → Count. Use this to enforce the 5-event free limit.
          </p>
          <p>
            <strong className="text-white">Upgrade Banner:</strong> Show a "Subscribe via Telebirr" banner when <code className="bg-white/10 px-1.5 rounded">User_Is_VIP = FALSE</code> and event count ≥ 5.
          </p>
        </div>
      </div>

      {/* Quick toggle for demo */}
      <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-4 text-center">
        <p className="text-white/40 text-xs mb-2">Demo Toggle (for testing)</p>
        <button
          onClick={onUpgrade}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg text-sm transition-colors flex items-center gap-2 mx-auto"
        >
          {isPremium ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          {isPremium ? 'Switch to Free' : 'Switch to Pro'}
        </button>
      </div>
    </div>
  );
}
