// ===================================================================
// EOTC CALENDAR ENGINE — Ethiopian Orthodox Tewahedo Church
// Bahire Hasab Algorithm + Fixed Monthly/Yearly Festivals
// Full TypeScript Implementation
// ===================================================================

import { BahireHasab } from './bahireHasab';

// ===================================================================
// PART 1: FIXED MONTHLY FESTIVALS (Saints Days — Recurring Every Month)
// These occur on the same day number every Ethiopian month, 12 times/year
// ===================================================================

export interface MonthlyFestival {
  day: number;           // Ethiopian day of month (1–30)
  saint: string;         // English name
  amharic: string;       // Amharic name
  geez: string;          // Ge'ez script
  color: string;         // Badge color class
  icon: string;          // Emoji icon
  description: string;   // Brief English description
  descriptionAm: string; // Brief Amharic description
  fastingRule?: string;  // Any associated fast rule
  category: 'saint' | 'maryam' | 'trinity' | 'angel';
}

export const MONTHLY_FESTIVALS: MonthlyFestival[] = [
  {
    day: 1,
    saint: 'Lideta (Nativity of Mary)',
    amharic: 'ልደታ ለማርያም',
    geez: 'ልደታ',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '👼',
    category: 'maryam',
    description:
      'Commemoration of the birth of the Virgin Mary, Mother of God. One of the most beloved feasts honoring Our Lady.',
    descriptionAm: 'የድንግል ማርያምን ልደት የሚዘክር ቀን ነው።',
  },
  {
    day: 3,
    saint: 'Kidus Qirqos & Iyalutha',
    amharic: 'ቅዱስ ቄርቆስ እና ኢያሉጣ',
    geez: 'ቄርቆስ',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '✝️',
    category: 'saint',
    description:
      'St. Cyricus (a young martyr) and his mother St. Julitta who were martyred together. Their faith under persecution is celebrated.',
    descriptionAm: 'ቅዱስ ቄርቆስና እናቱ ኢያሉጣ ሰማዕትነትን የተቀበሉበት ቀን ነው።',
  },
  {
    day: 5,
    saint: 'Kidus Abbo (St. Samuel)',
    amharic: 'አቡነ ሳሙኤል / አቦ',
    geez: 'አቦ',
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: '🌿',
    category: 'saint',
    description:
      'Commemoration of Abbo (also known as Samuel of Waldeba), a renowned monk and ascetic who performed many miracles.',
    descriptionAm: 'አቡነ ሳሙኤል (አቦ) ታዋቂ ሰማዕት እና ቅዱስ መነኩሴ ናቸው።',
  },
  {
    day: 6,
    saint: 'Kidus Yared',
    amharic: 'ቅዱስ ያሬድ',
    geez: 'ያሬድ',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '🎵',
    category: 'saint',
    description:
      "St. Yared, the father of Ethiopian sacred music (Zema). He composed the three modes of liturgical chant: Ge'ez, Ezel, and Araray.",
    descriptionAm: 'ቅዱስ ያሬድ የኢትዮጵያ ቤተ ክርስቲያን ዜማ አባት ነው።',
  },
  {
    day: 7,
    saint: 'Kidus Libanos (Abba Gebre Menfes Qidus)',
    amharic: 'አቡነ ገብረ መንፈስ ቅዱስ',
    geez: 'ገብረ መንፈስ ቅዱስ',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: '🦁',
    category: 'saint',
    description:
      'Commemoration of Abba Gebre Menfes Qidus, the beloved "Father of Lions," known for living in the wilderness with wild animals for 363 years.',
    descriptionAm: 'አቡነ ገብረ መንፈስ ቅዱስ "የአናብስቱ አባት" ተብለው ይጠራሉ።',
  },
  {
    day: 10,
    saint: 'Kidus Aregawi (Za-Mikael)',
    amharic: 'አቡነ አረጋዊ',
    geez: 'አረጋዊ',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: '🏔️',
    category: 'saint',
    description:
      'One of the Nine Saints (Tsadkan) who came from Syria to Ethiopia in the 5th century. Founded the monastery of Debre Damo.',
    descriptionAm: 'አቡነ አረጋዊ ከዘጠኙ ቅዱሳን አንዱ ሲሆን የደብረ ዳሞ ገዳም መሥራቹ ናቸው።',
  },
  {
    day: 12,
    saint: 'Kidus Mikael (St. Michael the Archangel)',
    amharic: 'ቅዱስ ሚካኤል',
    geez: 'ሚካኤል',
    color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    icon: '⚔️',
    category: 'angel',
    description:
      'The Feast of Archangel Michael, the chief prince of the heavenly host and guardian of the faithful. One of the most widely celebrated EOTC feasts. Observed monthly.',
    descriptionAm: 'ሊቀ መላእክት ቅዱስ ሚካኤል በወር አንድ ጊዜ ይከበራል። ቤተ ክርስቲያኒቱ ሰፊ አከባበር ታደርጋለች።',
    fastingRule: 'Fasting observed on the eve (Tikur/Wednesday preceding)',
  },
  {
    day: 13,
    saint: 'Hidar Tsion (Our Lady Zion)',
    amharic: 'ህዳር ጽዮን',
    geez: 'ጽዮን',
    color: 'bg-blue-600/20 text-blue-200 border-blue-600/30',
    icon: '💙',
    category: 'maryam',
    description:
      'Commemoration of Our Lady of Zion — the Ark of the Covenant and the Church of St. Mary of Zion in Axum. Celebrated with great solemnity in Hidar month.',
    descriptionAm: 'የጽዮን ቅድስት ማርያም ክብረ በዓል ነው። በህዳር ወር ይከበራል።',
  },
  {
    day: 16,
    saint: 'Kidus Tekle Haymanot',
    amharic: 'ቅዱስ ተክለ ሃይማኖት',
    geez: 'ተክለ ሃይማኖት',
    color: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    icon: '🌳',
    category: 'saint',
    description:
      'The greatest Ethiopian saint, founder of Debre Libanos Monastery. Known for standing on one leg for 22 years in prayer. Patron saint of Ethiopia.',
    descriptionAm: 'ቅዱስ ተክለ ሃይማኖት የደብረ ሊባኖስ ገዳም መሥራች፤ ታላቅ ቅዱስ ናቸው።',
  },
  {
    day: 19,
    saint: 'Kidus Gabriel (St. Gabriel the Archangel)',
    amharic: 'ቅዱስ ገብርኤል',
    geez: 'ገብርኤል',
    color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: '🌟',
    category: 'angel',
    description:
      'The Feast of Archangel Gabriel, the heavenly messenger who announced the Incarnation to the Virgin Mary. Widely celebrated across Ethiopia with great joy. Observed monthly.',
    descriptionAm: 'ሊቀ መላእክት ቅዱስ ገብርኤል ለድንግል ማርያም ብስራትን ያበሰረ ቅዱስ ነው። በወር አንድ ጊዜ ይከበራል።',
    fastingRule: 'Fasting observed on the eve',
  },
  {
    day: 21,
    saint: 'Selassie (Holy Trinity)',
    amharic: 'ቅድስት ሥላሴ',
    geez: 'ሥላሴ',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    icon: '☀️',
    category: 'trinity',
    description:
      'Monthly commemoration of the Holy Trinity — Father, Son, and Holy Spirit. The EOTC places enormous theological importance on the Trinity (Selassie).',
    descriptionAm: 'ቅድስት ሥላሴ — አብ፣ ወልድ፣ መንፈስ ቅዱስ — ቅዱስ ቀን ነው።',
  },
  {
    day: 22,
    saint: 'Kidus Gebre Kristos',
    amharic: 'ቅዱስ ገብረ ክርስቶስ',
    geez: 'ገብረ ክርስቶስ',
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '🕊️',
    category: 'saint',
    description:
      'Commemoration of St. Gebre Kristos, a monk revered for his extreme asceticism and spiritual warfare against demons.',
    descriptionAm: 'ቅዱስ ገብረ ክርስቶስ ጠቅላይ ሐዋርያ ናቸው።',
  },
  {
    day: 23,
    saint: 'Kidus Giorgis (St. George)',
    amharic: 'ቅዱስ ጊዮርጊስ',
    geez: 'ጊዮርጊስ',
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: '🐉',
    category: 'saint',
    description:
      'St. George, the Great Martyr — patron saint of Ethiopia. The slayer of the dragon symbolizes victory of faith over evil. Every town has a St. George church. Observed monthly.',
    descriptionAm: 'ቅዱስ ጊዮርጊስ የኢትዮጵያ ተጠባባቂ ቅዱስ ነው። ቀዩ ፈረሰኛ ወይም ድራጎን ገዳዩ ሰማዕት ነው።',
    fastingRule: 'Fasting observed on the eve by many devotees',
  },
  {
    day: 25,
    saint: 'Kidus Stephanos (St. Stephen)',
    amharic: 'ቅዱስ እስጢፋኖስ',
    geez: 'እስጢፋኖስ',
    color: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: '💎',
    category: 'saint',
    description:
      'St. Stephen, the first Christian martyr (Protomartyr). His stoning by the Sanhedrin is commemorated as the opening of the era of Christian martyrdom.',
    descriptionAm: 'ቅዱስ እስጢፋኖስ ከሐዋርያት ቀጥሎ ሰማዕትነትን የተቀበለ ዲያቆን ነው።',
  },
  {
    day: 27,
    saint: 'Medhane Alem (Savior of the World)',
    amharic: 'መድኃኔ ዓለም',
    geez: 'መድኃኔ ዓለም',
    color: 'bg-gold-500/20 text-yellow-200 border-yellow-500/30',
    icon: '✨',
    category: 'trinity',
    description:
      'Feast of Medhane Alem (Christ the Savior of the World). The largest church in Ethiopia — the Medhane Alem Cathedral in Addis Ababa — is dedicated to this feast. Observed monthly.',
    descriptionAm: 'መድኃኔ ዓለም ክርስቶስ — ዓለምን የሚያድን — ቅዱስ ቀን ነው። ትልቁ ቤተ ክርስቲያን ስሙን ይይዛል።',
    fastingRule: 'Fasting observed on the eve (Tahsas 26 eve)',
  },
  {
    day: 28,
    saint: 'Debre Tabor (Transfiguration)',
    amharic: 'ደብረ ታቦር',
    geez: 'ደብረ ታቦር',
    color: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
    icon: '⛰️',
    category: 'trinity',
    description:
      'Commemoration of the Transfiguration of Christ on Mount Tabor, where He appeared in radiant glory before Peter, James, and John.',
    descriptionAm: 'ጌታ ኢየሱስ ክርስቶስ በደብረ ታቦር ፊቱ የበራ ቀን ነው።',
  },
  {
    day: 29,
    saint: 'Bale Wold (Son of the Father)',
    amharic: 'ቤተ ልሔም / ቃለ ዓምላክ',
    geez: 'ቃለ ዓምላክ',
    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: '🌊',
    category: 'saint',
    description:
      'Monthly feast of Bale Wold, honoring the Son of God made flesh. Deeply tied to Bethlehem and the mystery of the Incarnation.',
    descriptionAm: 'ቃለ አምላክ — ወልደ አምላክ — ቅዱስ ቀን ነው።',
  },
  {
    day: 30,
    saint: 'Kidus Petros & Paulos (SS. Peter & Paul)',
    amharic: 'ቅዱስ ጴጥሮስ እና ጳውሎስ',
    geez: 'ጴጥሮስ ወጳውሎስ',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '🗝️',
    category: 'saint',
    description:
      "The feast of the chief Apostles: St. Peter (the Rock, first Pope) and St. Paul (Apostle to the Gentiles). The Apostles' Fast ends on this day each year.",
    descriptionAm: 'ቅዱስ ጴጥሮስ እና ቅዱስ ጳውሎስ — ሐዋርያት አለቆቹ — ቅዱስ ቀን ነው።',
    fastingRule: 'Tsome Hawaryat (Apostles Fast) ends on Sene 30',
  },
];

// ===================================================================
// PART 2: FIXED YEARLY FESTIVALS (Specific Ethiopian Calendar Dates)
// ===================================================================

export interface YearlyFestival {
  id: string;
  name: string;
  amharic: string;
  geez: string;
  ethMonth: number;   // 1=Meskerem ... 13=Pagume
  ethDay: number;
  isMovable: false;
  type: 'holiday' | 'fast' | 'feast' | 'national';
  icon: string;
  color: string;
  description: string;
  descriptionAm: string;
  fastDays?: number;  // if it's a fasting period
  fastEndDay?: number;
  fastEndMonth?: number;
}

export const YEARLY_FESTIVALS: YearlyFestival[] = [
  // ── MESKEREM (Month 1) ────────────────────────────────────────────
  {
    id: 'enkutatash',
    name: 'Enkutatash (Ethiopian New Year)',
    amharic: 'እንቁጣጣሽ',
    geez: 'ዓመተ ምሕረት',
    ethMonth: 1, ethDay: 1,
    isMovable: false,
    type: 'holiday',
    icon: '🎊',
    color: 'from-yellow-600 to-amber-500',
    description:
      'Ethiopian New Year — "Gift of Jewels." Children carry bundles of yellow Adey Abeba flowers and sing songs to neighbors. National public holiday. The rainy season (Kiremt) ends and the Tseday spring begins.',
    descriptionAm: 'እንቁጣጣሽ — የኢትዮጵያ አዲስ ዓመት። ልጆች አደይ አበባ ይዘው ቤት ቤት ዞሩ ይዘምሩ።',
  },
  {
    id: 'meskel',
    name: 'Meskel (Finding of the True Cross)',
    amharic: 'መስቀል',
    geez: 'ደምሴ',
    ethMonth: 1, ethDay: 17,
    isMovable: false,
    type: 'feast',
    icon: '✝️',
    color: 'from-red-700 to-red-500',
    description:
      'Celebrates the finding of the True Cross by Queen Helena (mother of Constantine). The Demera (bonfire) is lit the eve before (Meskerem 16). UNESCO-inscribed cultural heritage. The cross wood was found using incense smoke direction.',
    descriptionAm: 'ንግሥት ዕሌኒ የጌታን መስቀል ያወጣችበት ቀን ነው። ደመራ ይደረጋል።',
  },
  {
    id: 'meskel_eve',
    name: 'Demera (Eve of Meskel)',
    amharic: 'ደመራ',
    geez: 'ደምሴ',
    ethMonth: 1, ethDay: 16,
    isMovable: false,
    type: 'feast',
    icon: '🔥',
    color: 'from-orange-600 to-red-500',
    description:
      'The Demera bonfire ceremony on the eve of Meskel. Tall poles decorated with yellow flowers are gathered and burned. The direction the smoke falls predicts the coming year.',
    descriptionAm: 'ደመራ — የመስቀል ዋዜማ። ትልቅ እሳት ይደረጋል።',
  },
  // ── TIKIMT (Month 2) ────────────────────────────────────────────
  {
    id: 'kidus_urael',
    name: 'Kidus Urael',
    amharic: 'ቅዱስ ዑራኤል',
    geez: 'ዑራኤል',
    ethMonth: 2, ethDay: 14,
    isMovable: false,
    type: 'feast',
    icon: '🌙',
    color: 'from-blue-700 to-blue-500',
    description:
      'Annual feast of Archangel Urael (Uriel), the angel of fire and light. One of the four archangels of EOTC tradition.',
    descriptionAm: 'ሊቀ መላእክት ዑራኤል ቅዱስ ዕለቱ ነው።',
  },
  // ── HIDAR (Month 3) ─────────────────────────────────────────────
  {
    id: 'hidar_tsion',
    name: 'Hidar Tsion (Feast of St. Mary of Zion)',
    amharic: 'ህዳር ጽዮን',
    geez: 'ጽዮን',
    ethMonth: 3, ethDay: 21,
    isMovable: false,
    type: 'feast',
    icon: '🕊️',
    color: 'from-blue-800 to-blue-600',
    description:
      'The great annual feast at the Church of St. Mary of Zion in Axum — the holiest church in Ethiopia, believed to house the Ark of the Covenant. The Tabot is carried in procession.',
    descriptionAm: 'የአክሱም ጽዮን ቤተ ማርያም ታላቅ ክብረ በዓል ነው።',
  },
  {
    id: 'tsome_nebiyat_start',
    name: 'Tsome Nebiyat Begins (Fast of the Prophets)',
    amharic: 'ጾመ ነቢያት ይጀምራል',
    geez: 'ጾም ነቢያት',
    ethMonth: 3, ethDay: 15,
    isMovable: false,
    type: 'fast',
    icon: '🌑',
    color: 'from-gray-700 to-gray-600',
    fastDays: 43,
    fastEndDay: 28,
    fastEndMonth: 4,
    description:
      'The Fast of the Prophets begins — commemorating the prophets who foretold the coming of Christ. Lasts from Hidar 15 to Tahsas 28 (eve of Genna/Christmas). 43 days of fasting. Observers abstain from animal products until 3 PM.',
    descriptionAm: 'ጾመ ነቢያት — ከህዳር ፲፭ እስከ ታኅሣሥ ፳፰ ሐዋርያት ነቢያት ይጾማሉ። ፵፫ ቀናት ጾም።',
  },
  // ── TAHSAS (Month 4) ────────────────────────────────────────────
  {
    id: 'genna',
    name: 'Genna (Ethiopian Christmas)',
    amharic: 'ገና',
    geez: 'ልደት',
    ethMonth: 4, ethDay: 29,
    isMovable: false,
    type: 'feast',
    icon: '⭐',
    color: 'from-amber-600 to-yellow-500',
    description:
      'Ethiopian Christmas — Genna. Celebrated on Tahsas 29 (January 7). The birth of Jesus Christ. Churches hold an all-night vigil (Leil). The traditional game of Genna (similar to field hockey) is played. Men and boys dress in white shamma.',
    descriptionAm: 'ገና — ልደተ ክርስቶስ። ታኅሣሥ ፳፱ ይከበራል። ቤተ ክርስቲያን ሌሊቱን ሙሉ ይቆያሉ።',
  },
  {
    id: 'tsome_nebiyat_end',
    name: 'Tsome Nebiyat Ends',
    amharic: 'ጾመ ነቢያት ይጠናቀቃል',
    geez: 'ፍጻሜ ጾም',
    ethMonth: 4, ethDay: 28,
    isMovable: false,
    type: 'fast',
    icon: '🌕',
    color: 'from-gray-600 to-gray-500',
    description:
      'The Fast of the Prophets ends on the eve of Genna (Tahsas 28). The fast is broken after the midnight liturgy on Christmas Eve.',
    descriptionAm: 'ጾመ ነቢያት ሲጠናቀቅ ዋሉ ዋዜማ ማታ ቅዳሴ ከቆሙ ይበላሉ።',
  },
  // ── TIR (Month 5) ───────────────────────────────────────────────
  {
    id: 'timket',
    name: 'Timket (Ethiopian Epiphany)',
    amharic: 'ጥምቀት',
    geez: 'ጥምቀት',
    ethMonth: 5, ethDay: 11,
    isMovable: false,
    type: 'feast',
    icon: '💧',
    color: 'from-cyan-700 to-blue-600',
    description:
      'The grandest Ethiopian Orthodox festival — Timket (Epiphany/Baptism of Christ). The Tabot (replica of Ark) is carried to a body of water the eve before (Tir 10). Priests bless the water at dawn on Tir 11. Thousands bathe in the blessed water. UNESCO Intangible Heritage.',
    descriptionAm: 'ጥምቀት — የኢትዮጵያ ሦስቱ ኢምፔሮሽ ዓበይት ሃይማኖታዊ ፌስቲቫል ነው። ታቦቱ ወደ ውኃ ሄዶ ሕዝቡ ይጠመቃል።',
  },
  {
    id: 'kidane_mihret',
    name: 'Kidane Mihret (Covenant of Mercy)',
    amharic: 'ቅዳኔ ምሕረት',
    geez: 'ቅዳኔ ምሕረት',
    ethMonth: 5, ethDay: 16,
    isMovable: false,
    type: 'feast',
    icon: '🤝',
    color: 'from-blue-600 to-indigo-600',
    description:
      'Kidane Mihret — the Covenant of Mercy. Commemorates the promise made by Jesus to His mother Mary that whoever calls upon Her name will receive mercy. A major Marian feast celebrated with all-night vigils.',
    descriptionAm: 'ቅዳኔ ምሕረት — ጌታ ለድንግል ማርያም የሰጠው ቃል ኪዳን ቀን ነው።',
  },
  // ── YEKATIT (Month 6) ───────────────────────────────────────────
  {
    id: 'adwa',
    name: 'Adwa Victory Day',
    amharic: 'የአድዋ ድል',
    geez: 'ዓድዋ',
    ethMonth: 6, ethDay: 23,
    isMovable: false,
    type: 'national',
    icon: '🏆',
    color: 'from-green-700 to-green-500',
    description:
      'Ethiopian Patriots Day — commemorates the decisive Battle of Adwa (March 2, 1896) where Emperor Menelik II\'s army defeated the Italian colonial forces. First decisive victory of an African nation against a European colonial power.',
    descriptionAm: 'የአድዋ ድል ቀን — ኢትዮጵያ ፋሺስት ጣሊያንን ያሸነፈችበት ቀን ነው።',
  },
  // ── MEGABIT (Month 7) ───────────────────────────────────────────
  {
    id: 'tsome_filseta',
    name: 'Tsome Filseta Begins (Fast of the Assumption)',
    amharic: 'ጾመ ፍልሰታ ይጀምራል',
    geez: 'ጾም ፍልሰት',
    ethMonth: 12, ethDay: 1,
    isMovable: false,
    type: 'fast',
    icon: '🌑',
    color: 'from-slate-700 to-slate-600',
    fastDays: 15,
    fastEndDay: 15,
    fastEndMonth: 12,
    description:
      'Tsome Filseta (Fast of the Assumption / Migration) begins on Nehase 1. A 15-day strict fast observed before the Feast of the Assumption of Mary (Filseta). Considered one of the strictest fasts — some observe a dry fast (no water until sunset).',
    descriptionAm: 'ጾመ ፍልሰታ — ከነሐሴ ፩ እስከ ፲፭ ይጾማሉ። ለቅድስት ማርያም ፍልሰት ቀዳሚ ጾም ነው።',
  },
  {
    id: 'filseta',
    name: 'Filseta (Assumption of Mary)',
    amharic: 'ፍልሰታ ለማርያም',
    geez: 'ፍልሰት',
    ethMonth: 12, ethDay: 16,
    isMovable: false,
    type: 'feast',
    icon: '🌹',
    color: 'from-pink-700 to-rose-500',
    description:
      'The Feast of the Assumption/Dormition of the Virgin Mary (Filseta). After 15 days of strict fasting, the feast is celebrated with great joy. Churches are packed. The Tabot of Maryam is carried out. Nehase 16 is the greatest Marian feast of the year.',
    descriptionAm: 'ፍልሰታ ለማርያም — ቅድስት ድንግል ማርያም ዕርገቷ ቀን ነው። ከ፲፭ ቀን ጾም በኋላ ይከበራል።',
  },
  // ── SENE (Month 10) — Fixed yearly on this month ────────────────
  {
    id: 'petros_paulos',
    name: 'Feast of SS. Peter & Paul (End of Apostles Fast)',
    amharic: 'ጴጥሮስ ወጳውሎስ',
    geez: 'ጴጥሮስ ወጳውሎስ',
    ethMonth: 10, ethDay: 30,
    isMovable: false,
    type: 'feast',
    icon: '🗝️',
    color: 'from-emerald-700 to-green-600',
    description:
      'The annual feast of Apostles Peter and Paul on Sene 30 marks the end of Tsome Hawaryat (Apostles\' Fast). The fast duration varies each year based on Easter date.',
    descriptionAm: 'ቅዱስ ጴጥሮስ እና ቅዱስ ጳውሎስ ዓመታዊ ቀን። ጾመ ሐዋርያትን ያጠናቅቃል።',
  },
];

// ===================================================================
// PART 3: MOVABLE FEASTS & FASTS — BAHIRE HASAB ALGORITHM
// "Bahire Hasab" = "Sea of Calculation" — the EOTC computus
// Foundation: Ethiopian Easter is always on a Sunday, never before
// Miyazia 1 or after Miyazia 30 (in most years).
// ===================================================================

export interface MovableFeast {
  id: string;
  name: string;
  amharic: string;
  geez: string;
  type: 'feast' | 'fast' | 'period';
  icon: string;
  color: string;
  description: string;
  descriptionAm: string;
  offsetFromFasika: number; // Days relative to Fasika (negative = before)
  durationDays?: number;
}

export interface ComputedMovableFeast {
  feast: MovableFeast;
  ethYear: number;
  ethMonth: number;
  ethDay: number;
  gregDate: Date;
  ethDateString: string;
}

// Movable feasts defined by their offset from Fasika (Ethiopian Easter)
export const MOVABLE_FEASTS_TEMPLATE: MovableFeast[] = [
  {
    id: 'nenewe',
    name: 'Tsome Nenewe (Fast of Nineveh)',
    amharic: 'ጾመ ነነዌ',
    geez: 'ነነዌ',
    type: 'fast',
    icon: '🐋',
    color: 'from-blue-900 to-blue-700',
    description:
      'The Fast of Nineveh — a 3-day strict fast commemorating the Ninevites\' repentance at the preaching of Prophet Jonah. The foundational date of the EOTC movable feast calendar. Bahire Hasab uses this date to calculate all other feasts.',
    descriptionAm: 'ጾመ ነነዌ — ነቢዩ ዮናስ ሰዎቹ ሲሰብክ ነነዌ ሰዎች ዘወር ያሉበትን ያስታውሳል። ሦስት ቀን ጾም።',
    offsetFromFasika: -69, // Nenewe starts 69 days before Fasika
    durationDays: 3,
  },
  {
    id: 'abiy_tsom',
    name: 'Abiy Tsom (Great Lent) Begins',
    amharic: 'አብይ ጾም',
    geez: 'ጾም',
    type: 'fast',
    icon: '🌑',
    color: 'from-gray-900 to-gray-700',
    description:
      'Abiy Tsom — the Great Lent. The holiest and most demanding fast. Starts exactly 55 days before Fasika (14 days after the end of Tsome Nenewe). The fast lasts 55 days. Observers abstain from all animal products (meat, dairy, eggs) until after 3 PM daily. The first two days (Monday & Tuesday) are called "Hudade" — the strictest, with some observing a total dry fast.',
    descriptionAm: 'አብይ ጾም — ታላቅ ጾም። ፋሲካ ከ፵፰ ቀናት ቀደም ብሎ ይጀምራል። ፶፭ ቀናት ጾም። ሁዳዴ ብዙ ጊዜ ሙሉ ጾም ነው።',
    offsetFromFasika: -55,
    durationDays: 55,
  },
  {
    id: 'hudade',
    name: 'Hudade (First 2 Days of Lent)',
    amharic: 'ሁዳዴ',
    geez: 'ሁዳዴ',
    type: 'fast',
    icon: '⚫',
    color: 'from-gray-950 to-gray-800',
    description:
      'Hudade — the first Monday and Tuesday of Abiy Tsom (Great Lent). These are the strictest fasting days of the entire year. Many devout Orthodox Christians observe a complete dry fast (no food or water) for 24–36 hours. Black clothing is sometimes worn in mourning.',
    descriptionAm: 'ሁዳዴ — አብይ ጾም የሚጀምርበት ሰኞ እና ማክሰኞ። ከጾሙ ሁሉ ጠንካራ ቀናት ናቸው።',
    offsetFromFasika: -55,
    durationDays: 2,
  },
  {
    id: 'debre_zeyit',
    name: 'Debre Zeyit (Mid-Lent)',
    amharic: 'ደብረ ዘይት',
    geez: 'ደብረ ዘይት',
    type: 'feast',
    icon: '🫒',
    color: 'from-olive-700 to-green-700',
    description:
      'Debre Zeyit — the Mount of Olives. Falls on the 4th Sunday of Great Lent (mid-point). Commemorates Christ\'s discourse on the Mount of Olives about the End Times. Churches hold special liturgies.',
    descriptionAm: 'ደብረ ዘይት — አብይ ጾም አጋማሽ። ጌታ ኢየሱስ ስለ ዓለም ፍጻሜ ያስተማረበት ቦታ ነው።',
    offsetFromFasika: -28,
  },
  {
    id: 'hosanna',
    name: 'Hosanna (Palm Sunday)',
    amharic: 'ሆሳዕና',
    geez: 'ሆሳዕና',
    type: 'feast',
    icon: '🌿',
    color: 'from-green-800 to-green-600',
    description:
      'Palm Sunday — the triumphal entry of Jesus into Jerusalem. Children carry palm branches (Tsid) and Eucalyptus leaves, shouting "Hosanna!" Churches are decorated with greenery. The faithful receive blessed palm crosses tied into crosses.',
    descriptionAm: 'ሆሳዕና — ጌታ ኢየሱስ ወደ ኢየሩሳሌም ሲገባ ሕዝቡ "ሆሳዕና" ያለበት ዕለት። ቅርንጫፍ ይዘው ይሄዳሉ።',
    offsetFromFasika: -7,
  },
  {
    id: 'sibket',
    name: 'Sibket (Holy Monday)',
    amharic: 'ሲቅለት',
    geez: 'ሲቅለት',
    type: 'feast',
    icon: '🕯️',
    color: 'from-purple-900 to-purple-700',
    description:
      'Holy Monday of Passion Week. Jesus cursed the fig tree and cleansed the Temple. Special liturgy is observed.',
    descriptionAm: 'ሲቅለት — ሰኞ። ጌታ ቤተ መቅደሱን ያፀዳበት ቀን ነው።',
    offsetFromFasika: -6,
  },
  {
    id: 'rube',
    name: 'Rube (Holy Wednesday — Spy Wednesday)',
    amharic: 'ሩቤ',
    geez: 'ሩቤ',
    type: 'fast',
    icon: '🪙',
    color: 'from-slate-800 to-slate-700',
    description:
      'Rube — Holy Wednesday. Judas agreed to betray Christ for 30 pieces of silver. A strict fasting day. The woman with alabaster jar anointed Christ. Churches hold special services.',
    descriptionAm: 'ሩቤ — ረቡዕ። ይሁዳ ጌታን ለ፴ ብር ሊሸጥ ቃል ኪዳን ያደረገበት ቀን ነው።',
    offsetFromFasika: -4,
  },
  {
    id: 'hamus',
    name: 'Hamus (Holy Thursday — Last Supper)',
    amharic: 'ሐሙስ',
    geez: 'ሐሙስ',
    type: 'feast',
    icon: '🍞',
    color: 'from-amber-800 to-amber-600',
    description:
      'Holy Thursday — the Last Supper. Jesus instituted the Eucharist and washed the disciples\' feet. All-night vigil liturgy (Leil) is held. The faithful receive Holy Communion.',
    descriptionAm: 'ሐሙስ — ጌታ ኢየሱስ ቅዱስ ቁርባን ያቋቋመበት ቀን ነው። ሌሊት ቅዳሴ ይደረጋል።',
    offsetFromFasika: -3,
  },
  {
    id: 'siklet',
    name: 'Siklet (Good Friday — The Crucifixion)',
    amharic: 'ስቅለት',
    geez: 'ሕማሙ',
    type: 'fast',
    icon: '✝️',
    color: 'from-red-950 to-red-800',
    description:
      'Siklet (Good Friday) — the Crucifixion of Jesus Christ. The strictest fast of the entire year. A complete dry fast (no food or water) is observed from midnight to 3 PM (when Christ died). Churches hold a solemn Passion service. The faithful prostrate and mourn.',
    descriptionAm: 'ስቅለት — ጌታ ኢየሱስ ክርስቶስ የተሰቀለበት ቀን ነው። ከጾሙ ሁሉ ጠንካራው ቀን ነው። ሌሊቱን ሙሉ ቅዳሴ ይደረጋል።',
    offsetFromFasika: -2,
  },
  {
    id: 'sebat_saat',
    name: 'Sebat Saat (Holy Saturday)',
    amharic: 'ቅዳሜ',
    geez: 'ሰቤቱ',
    type: 'fast',
    icon: '🪦',
    color: 'from-zinc-800 to-zinc-600',
    description:
      'Holy Saturday — Christ in the tomb. Fasting continues. Churches prepare for the midnight Fasika liturgy.',
    descriptionAm: 'ቅዳሜ — ጌታ በመቃብር ያረፈበት ቀን ነው። ሌሊት ቅዳሴ ለፋሲካ ይዘጋጃሉ።',
    offsetFromFasika: -1,
  },
  {
    id: 'fasika',
    name: 'Fasika (Ethiopian Easter — Resurrection)',
    amharic: 'ፋሲካ',
    geez: 'ትንሳኤ',
    type: 'feast',
    icon: '🌅',
    color: 'from-yellow-600 to-amber-400',
    description:
      'Fasika — Ethiopian Easter. The most important feast of the entire EOTC calendar. The Resurrection of Jesus Christ from the dead. After a 55-day fast, the faithful break their fast at midnight with a grand liturgy and communion. Dawn is greeted with the song "Kristos tenestwal!" (Christ is Risen!). Families feast on doro wot, injera, and tej.',
    descriptionAm: 'ፋሲካ — ጌታ ከሞት የተነሳበት ቀን ነው። "ክርስቶስ ተንሥኤ!" ይባላል። ከ፶፭ ቀን ጾም በኋላ ይከበራል።',
    offsetFromFasika: 0,
  },
  {
    id: 'tsome_hawaryat',
    name: 'Tsome Hawaryat Begins (Apostles\' Fast)',
    amharic: 'ጾመ ሐዋርያት',
    geez: 'ሐዋርያት',
    type: 'fast',
    icon: '⚓',
    color: 'from-navy-800 to-blue-800',
    description:
      'Tsome Hawaryat — the Apostles\' Fast. Begins the Monday after Pentecost (50 days after Fasika + 1 day). The duration varies year to year based on when Easter falls. Ends always on Sene 30 (feast of SS Peter & Paul). Observers abstain from animal products until 3 PM.',
    descriptionAm: 'ጾመ ሐዋርያት — ሐዋርያት ቅዱስ ሩሁን ሲቀበሉ ለምስጋና ጀምረው ያጾሙት ጾም ነው። ጾሙ ሰኔ ፴ ይጠናቀቃል።',
    offsetFromFasika: 51, // Monday after Pentecost (50 days post-Easter)
  },
  {
    id: 'erget',
    name: 'Erget (Ascension of Christ)',
    amharic: 'ዕርገት',
    geez: 'ዕርገት',
    type: 'feast',
    icon: '☁️',
    color: 'from-sky-700 to-blue-500',
    description:
      'Erget — the Ascension of Christ into Heaven, 40 days after Fasika. The disciples watched as Christ ascended into the clouds on the Mount of Olives. A joyful feast celebrated with liturgy and festive gatherings.',
    descriptionAm: 'ዕርገት — ጌታ ኢየሱስ ወደ ሰማይ ያረገበት ቀን ነው። ፋሲካ ከ፵ ቀናት ቀጥሎ ይከበራል።',
    offsetFromFasika: 40,
  },
  {
    id: 'pentecost',
    name: 'Pente-Kostieh (Pentecost)',
    amharic: 'ጰንጠቆስጤ',
    geez: 'ጰንጠቆስጤ',
    type: 'feast',
    icon: '🔥',
    color: 'from-red-700 to-orange-600',
    description:
      'Pentecost — the descent of the Holy Spirit on the Apostles in the Upper Room. Exactly 50 days after Fasika. Also known as "Kidana Mehret" of the Spirit. The 50-day period after Easter is called "Tinsae" — no fasting on any day (including Wed/Fri).',
    descriptionAm: 'ጰንጠቆስጤ — መንፈስ ቅዱስ ሐዋርያቱ ላይ የወረደበት ቀን ነው። ከፋሲካ ፶ቱ ቀናት ይጀምራሉ።',
    offsetFromFasika: 50,
  },
];

// ===================================================================
// THE BAHIRE HASAB ALGORITHM — Computing Ethiopian Easter (Fasika)
// "Bahire Hasab" = "Sea of Calculation"
//
// ► The full, authoritative, step-by-step implementation now lives in:
//       src/utils/bahireHasab.ts   (BahireHasab class)
//
// This file re-exports the two functions that the rest of the app uses
// so that existing imports keep working without any changes.
// ===================================================================

export { computeFasika, BahireHasab } from './bahireHasab';
export type { BahireHasabResult, BahireHasabSteps, MovableFeastResult, EthDate } from './bahireHasab';

/**
 * Checks if an Ethiopian year is a leap year.
 * Ethiopian leap year: ethYear % 4 === 3 (Pagume has 6 days)
 * In Bahire Hasab terms: AmeteAlem mod 4 === 0  (Year of John)
 * Equivalently: (ethYear + 5500) mod 4 === 0  ↔  ethYear mod 4 === 3
 */
export function isEthLeapYear(ethYear: number): boolean {
  return ethYear % 4 === 3;
}

// All feast computation now delegates to BahireHasab class in bahireHasab.ts.
// computeFasika is re-exported above via: export { computeFasika } from './bahireHasab'

/**
 * Compute ALL movable feasts for a given Ethiopian year using the new engine.
 * Returns legacy-compatible ComputedMovableFeast objects so existing UI
 * components continue to work without changes.
 */
export function computeAllMovableFeasts(ethYear: number): ComputedMovableFeast[] {
  const { allFeasts } = BahireHasab.compute(ethYear);
  return allFeasts.map(f => ({
    feast: {
      id:               f.id,
      name:             f.name,
      amharic:          f.amharic,
      geez:             f.geez,
      type:             f.type,
      icon:             f.icon,
      color:            'from-gray-800 to-gray-700',
      description:      f.description,
      descriptionAm:    f.descriptionAm,
      offsetFromFasika: f.offsetFromFasika,
      durationDays:     f.durationDays,
    },
    ethYear:       f.date.month <= 4 ? ethYear + 1 : ethYear, // approximate; actual year from Date
    ethMonth:      f.date.month,
    ethDay:        f.date.day,
    gregDate:      f.date.gregDate,
    ethDateString: f.date.formatted,
  }));
}

// ===================================================================
// PART 4: FIXED FASTING RULES
// ===================================================================

export interface FastingRule {
  id: string;
  name: string;
  amharic: string;
  description: string;
  rule: string;
  exceptions: string;
  icon: string;
  color: string;
}

export const FASTING_RULES: FastingRule[] = [
  {
    id: 'wednesday',
    name: 'Wednesday Fast (ረቡዕ)',
    amharic: 'የሮብ ጾም',
    description:
      'Every Wednesday is a fasting day, commemorating the day Judas agreed to betray Christ. Observers abstain from all animal products until after the 9th hour (3 PM).',
    rule: 'Abstain from meat, dairy, and eggs until 3 PM every Wednesday.',
    exceptions:
      'Lifted during the 50 days of Tinsae (Pentecost period after Easter). Also lifted on major feasts that fall on Wednesday.',
    icon: '🌑',
    color: 'text-slate-400',
  },
  {
    id: 'friday',
    name: 'Friday Fast (ዓርብ)',
    amharic: 'የዓርብ ጾም',
    description:
      'Every Friday is a fasting day, commemorating the Crucifixion of Christ on Good Friday. The most commonly observed weekly fast.',
    rule: 'Abstain from meat, dairy, and eggs until 3 PM every Friday.',
    exceptions:
      'Lifted during the 50 days of Tinsae (after Easter). Lifted on Christmas (Tahsas 29) and Timket if they fall on Friday.',
    icon: '✝️',
    color: 'text-red-400',
  },
  {
    id: 'tsome_nebiyat',
    name: 'Tsome Nebiyat (Fast of the Prophets)',
    amharic: 'ጾመ ነቢያት',
    description:
      'A 43-day fast from Hidar 15 to Tahsas 28 (eve of Christmas). Commemorates the prophets who foretold Christ\'s coming. Less strict than Great Lent for the laity but still observed by the devout.',
    rule: 'Hidar 15 – Tahsas 28. Abstain from animal products until 3 PM.',
    exceptions: 'Sundays during this period: the fast is eased slightly.',
    icon: '📜',
    color: 'text-amber-400',
  },
  {
    id: 'abiy_tsom',
    name: 'Abiy Tsom (Great Lent)',
    amharic: 'አብይ ጾም',
    description:
      'The holiest fast: 55 days before Easter. All EOTC faithful are expected to observe this fast. The first two days (Hudade) are dry fasts.',
    rule: '55 days before Fasika. Total abstinence from animal products. Eat only after 3 PM.',
    exceptions: 'The sick, elderly, pregnant women, and young children are exempt.',
    icon: '🌑',
    color: 'text-gray-300',
  },
  {
    id: 'tsome_nenewe',
    name: 'Tsome Nenewe (Fast of Nineveh)',
    amharic: 'ጾመ ነነዌ',
    description:
      'A 3-day fast commemorating the repentance of the people of Nineveh at the preaching of Jonah. One of the most beloved fasts — even non-regular fasters observe it.',
    rule: '3 days (Monday–Wednesday), ~11 weeks before Easter. Strict fast until 3 PM.',
    exceptions: 'Eased for the sick and children.',
    icon: '🐋',
    color: 'text-blue-400',
  },
  {
    id: 'tsome_hawaryat',
    name: 'Tsome Hawaryat (Apostles\' Fast)',
    amharic: 'ጾመ ሐዋርያት',
    description:
      'Begins Monday after Pentecost, always ends on Sene 30. Duration varies by year. The shortest Apostles\' Fast is 14 days; the longest can be 55 days.',
    rule: 'Monday after Pentecost → Sene 30. Abstain from animal products until 3 PM.',
    exceptions: 'Lifted on feast days that fall within the period.',
    icon: '⚓',
    color: 'text-blue-300',
  },
  {
    id: 'tsome_filseta',
    name: 'Tsome Filseta (Fast of the Assumption)',
    amharic: 'ጾመ ፍልሰታ',
    description:
      'A 15-day strict fast before the Assumption of Mary, from Nehase 1–15. One of the strictest fasts — many observe a dry fast until after 3 PM. Ends with the joyful Feast of Filseta on Nehase 16.',
    rule: 'Nehase 1–15 (Aug 7–21 Gregorian). Dry fast until after 3 PM.',
    exceptions: 'Some ease on Nehase 8 (mid-fast feast) and Sundays.',
    icon: '🌑',
    color: 'text-pink-400',
  },
  {
    id: 'tinsae_no_fast',
    name: 'Tinsae — NO Fasting Period (50 Days)',
    amharic: 'ፋሲካ — ምንም ጾም የለም',
    description:
      'For 50 days after Easter (Fasika to Pentecost), no fasting is permitted — including Wednesdays and Fridays. This is the "Tinsae" season of pure joy and celebration of the Resurrection.',
    rule: 'NO fasting of any kind from Fasika Day to Pentecost (50 days).',
    exceptions: 'No exceptions — even the strictest fasters must eat freely.',
    icon: '🌅',
    color: 'text-yellow-400',
  },
];

// ===================================================================
// UTILITY: Get today's EOTC events
// ===================================================================

export function getTodayEOTCEvents(
  ethMonth: number,
  ethDay: number,
  ethYear: number
): {
  monthlyFestivals: MonthlyFestival[];
  yearlyFestivals: YearlyFestival[];
  movableFeasts: ComputedMovableFeast[];
} {
  // Monthly festivals for today's day number
  const monthlyFestivals = MONTHLY_FESTIVALS.filter(f => f.day === ethDay);

  // Yearly festivals for today's month and day
  const yearlyFestivals = YEARLY_FESTIVALS.filter(
    f => f.ethMonth === ethMonth && f.ethDay === ethDay
  );

  // Movable feasts for today
  const allMovable = computeAllMovableFeasts(ethYear);
  const movableFeasts = allMovable.filter(
    f => f.ethMonth === ethMonth && f.ethDay === ethDay
  );

  return { monthlyFestivals, yearlyFestivals, movableFeasts };
}

// ===================================================================
// GOOGLE SHEETS FORMULAS — for the Guide section
// ===================================================================

export const EOTC_SHEET_FORMULAS = {
  yearCorrection: `=ARRAYFORMULA(
  IF(A2:A="","",
    IF(
      DATE(YEAR(A2:A),9,11) > A2:A,
      YEAR(A2:A) - 8,
      YEAR(A2:A) - 7
    )
  )
)`,

  ethMonth: `=ARRAYFORMULA(
  IF(A2:A="","",
    IFS(
      AND(MONTH(A2:A)=9,  DAY(A2:A)>=11), "Meskerem (1)",
      AND(MONTH(A2:A)=10, DAY(A2:A)>=11), "Tikimt (2)",
      AND(MONTH(A2:A)=11, DAY(A2:A)>=10), "Hidar (3)",
      AND(MONTH(A2:A)=12, DAY(A2:A)>=10), "Tahsas (4)",
      AND(MONTH(A2:A)=1,  DAY(A2:A)>=9),  "Tir (5)",
      AND(MONTH(A2:A)=2,  DAY(A2:A)>=8),  "Yekatit (6)",
      AND(MONTH(A2:A)=3,  DAY(A2:A)>=10), "Megabit (7)",
      AND(MONTH(A2:A)=4,  DAY(A2:A)>=9),  "Miyazia (8)",
      AND(MONTH(A2:A)=5,  DAY(A2:A)>=9),  "Ginbot (9)",
      AND(MONTH(A2:A)=6,  DAY(A2:A)>=8),  "Sene (10)",
      AND(MONTH(A2:A)=7,  DAY(A2:A)>=8),  "Hamle (11)",
      AND(MONTH(A2:A)=8,  DAY(A2:A)>=7),  "Nehase (12)",
      AND(MONTH(A2:A)=9,  DAY(A2:A)<=10), "Pagume (13)",
      TRUE, "Check date"
    )
  )
)`,

  monthlyFeast: `=ARRAYFORMULA(
  IF(B2:B="","",
    IFS(
      B2:B=1,  "Lideta (Nativity of Mary)",
      B2:B=5,  "Kidus Abbo",
      B2:B=6,  "Kidus Yared",
      B2:B=12, "⚔️ Kidus Mikael",
      B2:B=16, "Kidus Tekle Haymanot",
      B2:B=19, "🌟 Kidus Gabriel",
      B2:B=21, "☀️ Selassie (Holy Trinity)",
      B2:B=23, "🐉 Kidus Giorgis",
      B2:B=27, "✨ Medhane Alem",
      B2:B=29, "Bale Wold",
      B2:B=30, "🗝️ Petros & Paulos",
      TRUE, ""
    )
  )
)`,

  fasikaYear: `=ARRAYFORMULA(
  IF(D2:D="","",
    LET(
      AA,    5500 + D2:D,
      MR,    MOD(AA, 19),
      wenber, IF(MOD(MR*11,30)=0, 30, MOD(MR*11,30)),
      rabiet, MOD(AA + INT(AA/4), 7),
      miy1wd, MOD(rabiet + 210, 7),
      mebajaWD, MOD(miy1wd + wenber - 1, 7),
      dts,   IF(mebajaWD=0, 0, 7-mebajaWD),
      fday,  wenber + dts,
      "Miyazia " & IF(fday>30, fday-30 & " (Ginbot)", fday)
    )
  )
)`,

  isFastingDay: `=ARRAYFORMULA(
  IF(A2:A="","",
    IFS(
      WEEKDAY(A2:A,2)=3, "🌑 Wednesday Fast",
      WEEKDAY(A2:A,2)=5, "✝️ Friday Fast",
      AND(MONTH(A2:A)=11, DAY(A2:A)>=10, OR(MONTH(A2:A)<12, AND(MONTH(A2:A)=12, DAY(A2:A)<=9))), "📜 Tsome Nebiyat",
      AND(MONTH(A2:A)=8, DAY(A2:A)>=7, DAY(A2:A)<=21), "ፍልሰታ Filseta Fast",
      TRUE, "No fast today"
    )
  )
)`,
};
