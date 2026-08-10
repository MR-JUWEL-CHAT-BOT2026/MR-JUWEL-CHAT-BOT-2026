const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Readable } = require("stream");

// ==================== বাংলাদেশের ৮ বিভাগের নামাজের সময়সূচি ====================
const divisionPrayerTimes = {
  "ঢাকা বিভাগ": { 
    Fajr: "3:49 AM", 
    Dhuhr: "12:56 PM", 
    Asr: "3:33 PM", 
    Maghrib: "6:59 PM", 
    Isha: "8:28 PM" 
  },
  "চট্টগ্রাম বিভাগ": { 
    Fajr: "3:45 AM", 
    Dhuhr: "12:52 PM", 
    Asr: "3:30 PM", 
    Maghrib: "6:55 PM", 
    Isha: "8:24 PM" 
  },
  "রাজশাহী বিভাগ": { 
    Fajr: "3:52 AM", 
    Dhuhr: "12:58 PM", 
    Asr: "3:35 PM", 
    Maghrib: "7:02 PM", 
    Isha: "8:30 PM" 
  },
  "খুলনা বিভাগ": { 
    Fajr: "3:50 AM", 
    Dhuhr: "12:57 PM", 
    Asr: "3:33 PM", 
    Maghrib: "6:58 PM", 
    Isha: "8:27 PM" 
  },
  "সিলেট বিভাগ": { 
    Fajr: "3:42 AM", 
    Dhuhr: "12:50 PM", 
    Asr: "3:28 PM", 
    Maghrib: "6:52 PM", 
    Isha: "8:22 PM" 
  },
  "বরিশাল বিভাগ": { 
    Fajr: "3:47 AM", 
    Dhuhr: "12:55 PM", 
    Asr: "3:32 PM", 
    Maghrib: "6:57 PM", 
    Isha: "8:26 PM" 
  },
  "রংপুর বিভাগ": { 
    Fajr: "3:55 AM", 
    Dhuhr: "12:59 PM", 
    Asr: "3:37 PM", 
    Maghrib: "7:04 PM", 
    Isha: "8:33 PM" 
  },
  "ময়মনসিংহ বিভাগ": { 
    Fajr: "3:48 AM", 
    Dhuhr: "12:56 PM", 
    Asr: "3:33 PM", 
    Maghrib: "6:58 PM", 
    Isha: "8:28 PM" 
  }
};

// ==================== ডেটা ====================
const nazrul = [
  { timer: '0', message: ['উচ্চারন:- রাব্বির হামহুমা কামা রাব্বাঈয়ানী সাগিরা\n⋆✦⋆\nঅর্থ:- হে আমার প্রতিপালক আমার পিতামাতা শৈশবে যে ভাবে আমাদের লালন-পালন করছিলো আপনিও ঠিক তাদের প্রতি সে ভাবে রহমত বর্ষন করুন'] },
  { timer: '1', message: ['উচ্চারন:- আল্লাহুম্মা বিসমিকা আমুতু ওয়া আহ্ইয়া\n⋆✦⋆\nহে আল্লাহ! তোমার নামে আমি শয়ন করছি এবং তোমারই দয়ায় আমি পুনর্জাগ্রত হব।'] },
  { timer: '2', message: ['উচ্চারন:- লা ইলাহা ইল্লা আংতা, সুবহানাকা ইন্নি কুংতু মিনাজ জ্বলিমিন।\n⋆✦⋆\nঅর্থ: তুমি ছাড়া সত্য কোনো উপাস্য নেই; তুমি পুতঃপবিত্র, নিশ্চয় আমি জালিমদের দলভুক্ত।'] },
  { timer: '3', message: ['উচ্চারণ: আতুবু ইলাল্লাহি মিম্মা আজনাবতু\n⋆✦⋆\nঅর্থ: হে আল্লাহ! আমি যে গোনাহ করেছি তা থেকে আল্লাহর কাছে ক্ষমা প্রার্থনা করছি।'] },
  { timer: '4', message: ['উচ্চারণ: আল্লাহুম্মা মা আসবাহা বী মিন নি’মাতিন আও বিআহাদিম মিন খালকিকা ফামিনকা ওয়াহদাকা লা শারীকা লাকা, লাকাল হামদু ওয়ালাকাশ-শোকরু।\n⋆✦⋆\nঅর্থ: হে আল্লাহ! এই সকালে আমার মাঝে বা আপনার যেকোনো সৃষ্টির মাঝে যা কিছু নেয়ামত, সব আপনারই তরফ থেকে।'] },
  { timer: '5', message: ['উচ্চারন: রাব্বানা আ’তিনা ফিদ্দুনিয়া হাছানাতাঁও ওয়াফিল আখিরাতি হাছানাতাঁও ওয়াক্বিনা আজাবান্নার।\n⋆✦⋆\nঅর্থ: হে আল্লাহ! আমাকে ইহকালীন যাবতীয় সুখ-শান্তি ও পরকালীন যাবতীয় সুখ-শান্তি প্রদান কর।'] },
  { timer: '6', message: ['উচ্চারন: আস সালাতু খাইরুম মিনান্নাওম\n⋆✦⋆\nঅর্থ: ঘুম হতে নামাজ উত্তম।'] },
  { timer: '7', message: ['উচ্চারন: আলহামদুলিল্লাহ\n⋆✦⋆\nঅর্থ: প্রশংসা একমাত্র আল্লাহর জন্য।'] },
  { timer: '8', message: ['উচ্চারন: বিসমিল্লাহির রাহমানির রাহিম\n⋆✦⋆\nঅর্থ: দয়াময় পরম দয়ালু আল্লাহর নামে।'] },
  { timer: '9', message: ['সকল প্রশংসা আল্লাহর জন্য, যিনি সমস্ত বিশ্বের রব এবং বিচার দিবসের মালিক। তিনি আমাকে সৃষ্টি করেছেন এবং ঘুম থেকে জাগিয়েছেন, তার কাছে আমরা পুনরায় ফিরে যাবো।'] },
  { timer: '10', message: ['উচ্চারন: রাব্বাবা যালামনা আনফুসানা ওয়া ইল্লাম তাগফির্লানা ওয়াতার হামনা লানা কুনান্না মিনাল খা’সিরিন।\n⋆✦⋆\nঅর্থ: হে আল্লাহ! আমি আমার নিজের উপর জুলুম করেছি। এখন তুমি যদি ক্ষমা ও রহম না কর, তাহলে আমি ধ্বংস হয়ে যাব।'] },
  { timer: '11', message: ['উচ্চারন: মা খালাক্বতুল জ্বিন্না অল ইনসা ইল্লা লি ইয়াবুদূন\n⋆✦⋆\nঅর্থ: আল্লাহ জ্বীন ও মানবকে শুধু তার ইবাদতের জন্য সৃষ্টি করেছেন।'] },
  { timer: '12', message: ['উচ্চারন: রাব্বানাগ ফিরলি ওয়ালি ওয়ালিদাইয়া, ওয়ালিল মু’মিনিনা ইয়াওমা ইয়াক্বুমুল\n⋆✦⋆\nঅর্থ: হে আমাদের প্রতিপালক! রোজ কেয়ামতে আমাকে, আমার পিতা-মাতা ও সকল মুমিনকে ক্ষমা করুন।'] },
  { timer: '13', message: ['উচ্চারন: মিনহা খালাকনাকুম ওয়া ফিহা নুঈদুকুম ওয়া মিনহা নুখরিজুকুম তারাতান উখরা\n⋆✦⋆\nঅর্থ: এই মাটি দিয়ে আমাদেরকে সৃষ্টি করছে, এই মাটির ভিতরে আমাদেরকে ফিরিয়ে আনবে, এই মাটি দিয়ে আমাদেরকে পুনরায় সৃষ্টি করবে।'] },
  { timer: '14', message: ['উচ্চারন: আল্লাহুম্মা ইন্নী আসআলুকাল জান্নাতা ওয়াআউজুবিকা মিনান্নার\n⋆✦⋆\nঅর্থ: হে আল্লাহ! আমি আপনার কাছে জান্নাত চাই এবং জাহান্নাম থেকে আপনার কাছে আশ্রয় চাই।'] },
  { timer: '15', message: ['উচ্চারন: লা ইলাহা ইল্লা আন্তা সুবহানাকা ইন্নি কুনতু মিনাজ জালিমিন\n⋆✦⋆\nঅর্থ: আল্লাহ ব্যতীত আর কোনো উপাস্য নেই। আমি আল্লাহর পবিত্রতা ঘোষণা করছি। নিশ্চয়ই আমি পাপী।'] },
  { timer: '16', message: ['উচ্চারণ: আতুবু ইলাল্লাহি মিম্মা আজনাবতু\n⋆✦⋆\nঅর্থ: যে গোনাহ আমি করেছি তা থেকে আল্লাহর কাছে তাওবাহ করছি।'] },
  { timer: '17', message: ['উচ্চারন: আউজুবিল্লাহ মিনাশ শাইতোয়ানির রাজীম\n⋆✦⋆\nঅর্থ: বিতাড়িত শয়তান হতে আল্লাহর কাছে সাহায্য প্রার্থনা করছি।'] },
  { timer: '18', message: ['উচ্চারন: লা আনাতুল্লাহি আলা ইবলীস\n⋆✦⋆\nঅর্থ: ইবলীসের উপরে আল্লাহর অভিশাপ বর্ষিত হোক।'] },
  { timer: '19', message: ['উচ্চারণ: আল্লাহুম্মাগ ফিরলি হায়্যিনা ওয়া মাইয়্যিতিনা ওয়া শাহিদিনা ওয়া গায়িবিনা ওয়া সাগীরিনা ওয়া কাবীরিনা ওয়া যাকারিনা ওয়া উনছানা\n⋆✦⋆\nঅর্থ: হে আল্লাহ, আমাদের জীবিত ও মৃত, উপস্থিত ও অনুপস্থিত, ছোট ও বড় এবং পুরুষ ও নারী সকলকে ক্ষমা করে দিন।'] },
  { timer: '20', message: ['উচ্চারন: আল্লাহুম্মাফ তাহলি আবওয়াবা রহমাতিক\n⋆✦⋆\nঅর্থ: হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাগুলো খুলে দিন।'] },
  { timer: '21', message: ['উচ্চারন: আল্লাহুম্মাগ ফিরলী ওয়ালিল মু’মিনিনা ওয়াল মু’মিনাতি, ওয়াল মুসলিমিনা ওয়াল মুসলিমাতি\n⋆✦⋆\nঅর্থ: হে আল্লাহ! তুমি আমার ও সমস্ত মু’মিন নর-নারীর এবং সমস্ত মুসলিম পুরুষ ও স্ত্রীলোকের পাপ সমূহ মোচন করে দাও।'] },
  { timer: '22', message: ['উচ্চারন: আশহাদু আল্লা লা-ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা-শারী-কালাহু ওয়া আশহাদু আন্না মুহাম্মাদান আবদুহু ওয়া রাসূলুহ্\n⋆✦⋆\nঅর্থ: আমি সাক্ষ্য দিচ্ছি যে আল্লাহ ব্যতীত কোনো উপাস্য নেই, তিনি অদ্বিতীয়, তাঁর কোনো শরীক নেই, এবং আমি সাক্ষ্য দিচ্ছি যে মুহাম্মদ (সঃ) আল্লাহর বান্দা ও রাসূল।'] },
  { timer: '23', message: ['উচ্চারন: লা-ইলা-হা ইল্লাল্লাহু-মুহাম্মাদুর রাসূলুল্লাহ\n⋆✦⋆\nঅর্থ: আল্লাহ ব্যতীত অন্য কোন উপাস্য নেই, মুহাম্মদ (সঃ) আল্লাহর রাসূল।'] }
];

// ==================== ডিফল্ট নামাজের সময় ====================
const defaultPrayerTimes = { 
  Fajr: "3:49 AM", 
  Dhuhr: "12:56 PM", 
  Asr: "3:33 PM", 
  Maghrib: "6:59 PM", 
  Isha: "8:28 PM" 
};

// ==================== দৈনিক দোয়া ====================
const dailyDua = [
  { time: "সকাল", dua: "হে আল্লাহ! আমাকে সঠিক পথে পরিচালিত কর এবং আমার অন্তরকে ঈমানের আলোয় ভরিয়ে দাও।" },
  { time: "সকাল", dua: "হে আল্লাহ! আমাকে পাপ থেকে দূরে রাখ, যেমন পূর্ব ও পশ্চিম একে অপর থেকে দূরে।" },
  { time: "বিকাল", dua: "হে আল্লাহ! আমার কাজে বরকত দান কর এবং আমাকে সৎকর্মশীল বান্দাদের অন্তর্ভুক্ত কর।" },
  { time: "বিকাল", dua: "হে আল্লাহ! আমার রিজিক প্রশস্ত কর এবং আমাকে তোমার সন্তুষ্টির পথে পরিচালিত কর।" },
  { time: "বিকাল", dua: "রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাতাও ওয়afil আখিরাতি হাসানাতাও ওয়াক্বিনা আজাবান্নার।" },
  { time: "বিকাল", dua: "হে আল্লাহ! আমার মৃত্যুকে ঈমানের উপর খতম কর এবং আমাকে জান্নাতুল ফিরদাউস দান কর।" }
];

const dailyHadith = [
  "রাসুল ﷺ বলেছেন: 'যে ব্যক্তি একটি ভাল কাজের দিকনির্দেশ করে, সে সেই কাজের সমান সওয়াব পাবে।'",
  "রাসুল ﷺ বলেছেন: 'তোমাদের মধ্যে উত্তম সেই ব্যক্তি, যে কুরআন শেখে ও অন্যকে শেখায়।'"
];

const islamicQuotes = [
  "সর্বোত্তম সম্পদ হলো সন্তুষ্টি। – হযরত আলী (রাঃ)",
  "যে আল্লাহর উপর ভরসা করে, আল্লাহ তার জন্য যথেষ্ট। – সূরা আত-তালাক ৬৫:৩"
];

const ramadanMessage = [
  "রমজান মুবারক! আল্লাহর রহমত, মাগফিরাত ও নাজাতের শ্রেষ্ঠ মাসে বেশি বেশি ইবাদত করো।",
  "রোজা শুধু ক্ষুধা-তৃষ্ণা নয়, বরং আত্মার পরিশুদ্ধি ও আল্লাহর নিকটে যাওয়ার মাধ্যম।"
];

const goodNightMsg = [
  "শুভ রাত্রি! ঘুমানোর আগে আল্লাহকে স্মরণ করুন, ক্ষমা চেয়ে নিদ্রা নিন।",
  "রাসুল ﷺ বলেছেন: 'যে ব্যক্তি ঘুমানোর আগে সূরা ইখলাস, ফালাক ও নাস তিনবার পাঠ করবে, সে আল্লাহর হেফাজতে থাকবে।'"
];

// ==================== গুড মর্নিং মেসেজ ====================
const goodMorningMsg = [
  "আসসালামু আলাইকুম! সুপ্রভাত। আজকের দিনটি আল্লাহর রহমতে শুভ হোক।",
  "বিসমিল্লাহির রাহমানির রাহিম। সকালের এই সুন্দর সময়ে আল্লাহকে স্মরণ করুন।",
  "সুবহানাল্লাহ! নতুন এক দিনের সূচনা। আল্লাহ আমাদের সকলকে সঠিক পথে চলার তৌফিক দান করুন।"
];

// ==================== ইসলামিক ইভেন্ট ====================
const islamicEvents = [
  { month: "মুহররম", day: 1, event: "ইসলামি নববর্ষ", importance: "medium" },
  { month: "মুহররম", day: 10, event: "আশুরা", importance: "high" },
  { month: "রবিউল আউয়াল", day: 12, event: "ঈদে মিলাদুন্নবী ﷺ", importance: "high" },
  { month: "রজব", day: 27, event: "মেরাজ রাত", importance: "high" },
  { month: "শাবান", day: 15, event: "শবে বরাত", importance: "high" },
  { month: "রমজান", day: 1, event: "রমজানের শুরু", importance: "high" },
  { month: "রমজান", day: 27, event: "শবে কদর", importance: "high" },
  { month: "শাওয়াল", day: 1, event: "ঈদুল ফিতর", importance: "high" },
  { month: "জিলহজ", day: 9, event: "আরাফার দিন", importance: "high" },
  { month: "জিলহজ", day: 10, event: "ঈদুল আযহা", importance: "high" }
];

// ==================== দিনের আমল ====================
const dailyAmol = {
  morning: [
    { name: "সুবহানাল্লাহ", count: "১০০ বার", reward: "বিপদ থেকে রক্ষা" },
    { name: "দুরুদ শরীফ", count: "১০০ বার", reward: "১০টি গুনাহ মাফ" },
    { name: "আয়াতুল কুরসি", count: "১ বার", reward: "সারা দিনের হেফাজত" },
    { name: "সূরা ইখলাস", count: "৩ বার", reward: "পুরো কুরআন পড়ার সওয়াব" },
    { name: "সূরা ফালাক", count: "৩ বার", reward: "শয়তানের কুমন্ত্রণা থেকে বাঁচা" },
    { name: "সূরা নাস", count: "৩ বার", reward: "শয়তানের কুমন্ত্রণা থেকে বাঁচা" }
  ],
  evening: [
    { name: "সূরা মুলক", count: "১ বার", reward: "কবরের আজাব থেকে মুক্তি" },
    { name: "আয়াতুল কুরসি", count: "১ বার", reward: "সারা রাতের হেফাজত" },
    { name: "সূরা ইখলাস", count: "৩ বার", reward: "পুরো কুরআন পড়ার সওয়াব" },
    { name: "সূরা ফালাক", count: "৩ বার", reward: "শয়তানের কুমন্ত্রণা থেকে বাঁচা" },
    { name: "সূরা নাস", count: "৩ বার", reward: "শয়তানের কুমন্ত্রণা থেকে বাঁচা" }
  ]
};

// ==================== মৃতদের জন্য দোয়া ====================
const deceasedDua = `
╔═══ ✦ মৃতদের জন্য দোয়া ✦ ═══╗
﷽ 
উচ্চারণ: রাব্বানাগ ফিরলি ওয়া লি ওয়ালিদাইয়া ওয়া লিল মু'মিনিনা ইয়াওমা ইয়াকুমুল হিসাব

অর্থ: হে আমাদের প্রতিপালক! আমাকে, আমার পিতা-মাতাকে এবং যারা মুমিন তাদের সবাইকে ক্ষমা করে দিন যেদিন হিসাব কায়েম হবে।

📖 সূরা ইবরাহিম: ৪১
╚═══ ✦ 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐ ✦ ═══╝
`;

// আসল মক্কার আজান
const defaultAdhan = "https://i.imgur.com/95GRyZE.mp4";

// ==================== হেল্পার ফাংশন ====================
function getCurrentTimeInDhaka() {
  return new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
}

function getHijriDate(date) {
  try {
    return new Intl.DateTimeFormat('bn-BD-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return "হিজরী তারিখ";
  }
}

function parsePrayerTime(time) {
  const parts = time.split(' ');
  if (parts.length !== 2) return 0;
  const [t, period] = parts;
  let [h, m] = t.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function getCurrentHour() {
  const now = new Date();
  return now.getHours();
}

function getCurrentMinute() {
  const now = new Date();
  return now.getMinutes();
}

async function getAudioStream(url) {
  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "arraybuffer",
      timeout: 10000
    });
    return Readable.from(Buffer.from(response.data));
  } catch (e) {
    console.error("Adhan load failed:", e.message);
    return null;
  }
}

function getPrayerTimesForDivision(divisionName) {
  if (!divisionName) return defaultPrayerTimes;
  return divisionPrayerTimes[divisionName] || defaultPrayerTimes;
}

function isFriday() {
  const now = new Date();
  return now.getDay() === 5;
}

// ==================== ফ্রেম ফাংশন ====================
function getHourlyFrame(data, prayerTimes) {
  return `
 ╔═════ ✦ ✦ ✦ ═════╗
 ﴾ ইসলামিক টাইম এলার্ট ﴿
 ╚═════ ✦ ✦ ✦ ═════╝
 ╔═════════════════╗
 📅 তারিখ: ${data.engDate}
 📆 বাংলা: ${data.bnDate}
 🕋 হিজরী: ${data.hijriDate}
 ⏰ সময়: ${data.bnTime}
 ╚═════════════════╝
 ╔═════════════════╗
 🕌 নামাজের সময়সূচি (${data.divisionName})
 ┣━━━━━━━━━━━━━━━━┫
 🌅 ফজর: ${prayerTimes.Fajr}
 ☀️ যোহর: ${prayerTimes.Dhuhr}
 🌤️ আসর: ${prayerTimes.Asr}
 🌇 মাগরিব: ${prayerTimes.Maghrib}
 🌙 এশা: ${prayerTimes.Isha}
 ╚═════════════════╝
 ╔═════════════════╗
 ${data.dua}
 ╚═════════════════╝
 ╔═════════════════╗
 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
`;
}

function getPrayerReminderFrame(name, time, divisionName) {
  return `
 ┏━ 🕌 আজানের সময় হয়েছে! ━┓
 ﴾ ${name} নামাজ ﴿
 ╚═════════════════╝
 ╔═════════════════╗
 ⏰ নামাজ শুরু: ${time}
 📍 স্থান: আপনার নিকটস্থ মসজিদে
 ﷺ *আল্লাহু আকবার! আল্লাহু আকবার!*
 ﴾ নামাজ কায়েম করুন, দুনিয়া অপেক্ষা করবে ﴿
 ╚═════════════════╝
 ﷽ 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
`;
}

function getGoodMorningFrame(msg) {
  return `
 ╔═══ ✦ গুড মর্নিং ✦ ═══╗
 🌅 আসসালামু আলাইকুম! 🌅
 
 ${msg}
 
 আজকের দিনটি হোক আল্লাহর রহমতে ভরা।
 ﷽ আল্লাহ আমাদের সকলকে হেদায়েত দান করুন।
 ﴾ আমিন ﴿
 ╚═══ ✦ 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐ ✦ ═══╝
`;
}

function getDailyDuaFrame(dua) {
  return `
 ╔═══ ✦ দৈনিক দোয়া (বিকাল) ✦ ═══╗
 ﷽ 
 📿 আজকের দোয়া:
 
 ${dua}
 
 ﴾ আল্লাহ আমাদের সকল দোয়া কবুল করুন ﴿
 ╚═══ ✦ 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐ ✦ ═══╝
`;
}

function getDailyIslamicFrame(dua, hadith, quote) {
  return `
 ╔═══ ✦ 𝗗𝗔𝗜𝗟𝗬 𝗜𝗦𝗟𝗔𝗠𝗜𝗖 ✦ ═══╗
 🌅 আজকের দোয়া: ${dua}
 📖 আজকের হাদিস: ${hadith}
 💭 আজকের উক্তি: ${quote}
 ╚═════════════════╝
 আল্লাহ আমাদের সকলকে হেদায়েত দান করুন।
 ﴾ আমিন ﴿
 ╚═══ ✦ 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐ ✦ ═══╝
`;
}

function getGoodNightFrame(msg) {
  return `
┏━ 🌙 শুভ রাত্রি ━┓
${msg}
╚═════════════════╝
ﷺ ঘুমানোর আগে:
▸ সূরা ইখলাস, ফালাক, নাস × ৩
▸ আয়াতুল কুরসি × ১
▸ দোয়া: বিসমিকা আল্লাহুম্মা আমুতু ওয়া আহইয়া
﷽ আল্লাহ আমাদের হেফাজত করুন।
﴾ আমিন ﴿
乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
`;
}

function getRamadanFrame(msg) {
  return `
 🌙═━┓ রমজান মোবারক ┏━═🌙
 ${msg}
 ﷽ রোজা রাখুন, নামাজ পড়ুন, কুরআন তিলাওয়াত করুন।
 ﴾ আল্লাহ আমাদের কবুল করুন ﴿
 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
`;
}

function getAmolFrame(timeSlot) {
  const amols = dailyAmol[timeSlot];
  if (!amols) return null;
  
  let msg = `╔═══ ✦ ${timeSlot === 'morning' ? '🌅 সকালের' : '🌙 সন্ধ্যার'} আমল ✦ ═══╗\n`;
  msg += `﷽ আসুন আজকের গুরুত্বপূর্ণ আমলগুলো করি:\n\n`;
  
  amols.forEach((amol, index) => {
    msg += `📿 ${index + 1}. ${amol.name} (${amol.count})\n`;
    msg += `   🏆 ফজিলত: ${amol.reward}\n\n`;
  });
  
  msg += `╚═══ ✦ 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐ ✦ ═══╝`;
  return msg;
}

// ==================== মডিউল কনফিগ ====================
module.exports.config = {
  name: "autotime",
  version: "4.2.0",
  permission: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Islamic Time Alert + Daily Dua, Hadith, Quote + Adhan Audio + Good Morning",
  prefix: true,
  commandCategory: "user",
  usages: "",
  cooldowns: 5
};

// ==================== onLoad ====================
module.exports.onLoad = ({ api }) => {
  if (global.autotimeInterval) clearInterval(global.autotimeInterval);
  
  // প্রতি ঘণ্টার ট্র্যাকিং - আলাদা ভেরিয়েবল
  let lastSentHour = null;
  
  // রিমাইন্ডার ট্র্যাকিং - প্রতিটি টাইমারের জন্য আলাদা কী
  const sentReminders = {
    goodMorning: false,
    morningAmol: false,
    dailyDua: false,
    morningContent: false,
    goodNight: false,
    eveningAmol: false,
    deceasedDua: false,
    prayerReminders: {} // নামাজের জন্য আলাদা অবজেক্ট
  };
  
  // ডিফল্ট ডিভিশন
  if (!global.currentDivision) {
    global.currentDivision = "ঢাকা বিভাগ";
  }

  console.log("🕌 AutoTime Started Successfully!");

  global.autotimeInterval = setInterval(async () => {
    try {
      // বাংলাদেশের সময় নিচ্ছি
      const now = new Date();
      const bangladeshTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      
      const hour = bangladeshTime.getHours();
      const minute = bangladeshTime.getMinutes();
      const currentMinutes = hour * 60 + minute;
      
      // ডেট টাইম
      const engDate = bangladeshTime.toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      const bnDate = bangladeshTime.toLocaleDateString('bn-BD', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      const bnTime = bangladeshTime.toLocaleTimeString('bn-BD', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
      
      const hijriDate = getHijriDate(bangladeshTime);
      const prayerTimes = getPrayerTimesForDivision(global.currentDivision);

      // ========== প্রতি ঘণ্টায় দোয়া (শুধুমাত্র ০ মিনিটে) ==========
      if (minute === 0 && hour !== lastSentHour) {
        lastSentHour = hour;
        const currentMessage = nazrul.find(item => parseInt(item.timer) === hour);
        if (currentMessage) {
          const data = {
            engDate,
            bnDate,
            hijriDate,
            bnTime,
            divisionName: global.currentDivision,
            dua: currentMessage.message.join("\n")
          };
          const msg = getHourlyFrame(data, prayerTimes);
          for (const threadID of global.data.allThreadID) {
            try {
              api.sendMessage(msg, threadID);
            } catch (e) {}
          }
        }
      }

      // ========== গুড মর্নিং (সকাল ৭:৪০) ==========
      if (hour === 7 && minute === 40 && !sentReminders.goodMorning) {
        sentReminders.goodMorning = true;
        const msg = goodMorningMsg[Math.floor(Math.random() * goodMorningMsg.length)];
        const frame = getGoodMorningFrame(msg);
        for (const t of global.data.allThreadID) {
          try {
            api.sendMessage(frame, t);
          } catch (e) {}
        }
      }

      // ========== সকালের আমল (ভোর ৫:২০) ==========
      if (hour === 5 && minute === 20 && !sentReminders.morningAmol) {
        sentReminders.morningAmol = true;
        const msg = getAmolFrame('morning');
        if (msg) {
          for (const t of global.data.allThreadID) {
            try {
              api.sendMessage(msg, t);
            } catch (e) {}
          }
        }
      }

      // ========== ডেইলি দোয়া (বিকাল ৪:৩০ = 16:30) ==========
      if (hour === 16 && minute === 30 && !sentReminders.dailyDua) {
        sentReminders.dailyDua = true;
        const duaList = dailyDua.filter(d => d.time === "বিকাল");
        const dua = duaList[Math.floor(Math.random() * duaList.length)].dua;
        const frame = getDailyDuaFrame(dua);
        for (const t of global.data.allThreadID) {
          try {
            api.sendMessage(frame, t);
          } catch (e) {}
        }
      }

      // ========== সকালের দৈনিক কনটেন্ট (সকাল ৫:১০) ==========
      if (hour === 5 && minute === 10 && !sentReminders.morningContent) {
        sentReminders.morningContent = true;
        const duaList = dailyDua.filter(d => d.time === "সকাল");
        const dua = duaList[Math.floor(Math.random() * duaList.length)].dua;
        const hadith = dailyHadith[Math.floor(Math.random() * dailyHadith.length)];
        const quote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)];
        const msg = getDailyIslamicFrame(dua, hadith, quote);
        for (const t of global.data.allThreadID) {
          try {
            api.sendMessage(msg, t);
          } catch (e) {}
        }
      }

      // ========== রমজান মেসেজ (সকাল ৪:১০) ==========
      if ((hijriDate.includes("রমজান") || hijriDate.includes("Ramadan")) && hour === 4 && minute === 10) {
        // চেক করুন আজকে এই টাইমারে ইতিমধ্যে মেসেজ পাঠানো হয়েছে কিনা
        const key = `ramadan_${bangladeshTime.toDateString()}`;
        if (!sentReminders[key]) {
          sentReminders[key] = true;
          const msg = ramadanMessage[Math.floor(Math.random() * ramadanMessage.length)];
          for (const t of global.data.allThreadID) {
            try {
              api.sendMessage(getRamadanFrame(msg), t);
            } catch (e) {}
          }
        }
      }

      // ========== শুভ রাত্রি (রাত ১০:৩০ = 22:30) ==========
      if (hour === 22 && minute === 30 && !sentReminders.goodNight) {
        sentReminders.goodNight = true;
        const msg = goodNightMsg[Math.floor(Math.random() * goodNightMsg.length)];
        const frame = getGoodNightFrame(msg);
        for (const t of global.data.allThreadID) {
          try {
            api.sendMessage(frame, t);
          } catch (e) {}
        }
      }
      
      // ========== সন্ধ্যার আমল (সন্ধ্যা ৬টা = 18:00) ==========
      if (hour === 18 && minute === 0 && !sentReminders.eveningAmol) {
        sentReminders.eveningAmol = true;
        const msg = getAmolFrame('evening');
        if (msg) {
          for (const t of global.data.allThreadID) {
            try {
              api.sendMessage(msg, t);
            } catch (e) {}
          }
        }
      }

      // ========== মৃতদের জন্য দোয়া (শুক্রবার ১১টা) ==========
      if (isFriday() && hour === 11 && minute === 0 && !sentReminders.deceasedDua) {
        sentReminders.deceasedDua = true;
        for (const t of global.data.allThreadID) {
          try {
            api.sendMessage(deceasedDua, t);
          } catch (e) {}
        }
      }

      // ========== নামাজ রিমাইন্ডার (১০ মিনিট আগে) ==========
      for (const [name, time] of Object.entries(prayerTimes)) {
        const prayerMinutes = parsePrayerTime(time);
        const diff = prayerMinutes - currentMinutes;
        
        // ১০ মিনিট আগে নোটিফিকেশন
        if (diff === 10) {
          const key = `prayer_${name}_${global.currentDivision}_${bangladeshTime.toDateString()}`;
          if (!sentReminders.prayerReminders[key]) {
            sentReminders.prayerReminders[key] = true;
            const msg = getPrayerReminderFrame(name, time, global.currentDivision);
            
            for (const t of global.data.allThreadID) {
              try {
                const audioStream = await getAudioStream(defaultAdhan);
                if (audioStream) {
                  api.sendMessage({ body: msg, attachment: audioStream }, t);
                } else {
                  api.sendMessage(msg + "\n\n⚠️ আজান অডিও লোড করা যায়নি।", t);
                }
              } catch (e) {
                try {
                  api.sendMessage(msg, t);
                } catch (err) {}
              }
            }
          }
        }
      }

      // ========== রিসেট (প্রতিদিন ১২:০১ AM) ==========
      if (hour === 0 && minute === 1) {
        // রিসেট করার আগে সঠিক দিনের জন্য চেক করুন
        const resetKey = `reset_${bangladeshTime.toDateString()}`;
        if (!sentReminders[resetKey]) {
          sentReminders[resetKey] = true;
          // সব রিমাইন্ডার রিসেট করুন
          Object.keys(sentReminders).forEach(key => {
            if (key !== 'prayerReminders') {
              sentReminders[key] = false;
            }
          });
          sentReminders.prayerReminders = {};
          lastSentHour = null;
          console.log("🔄 Daily reset completed at", bangladeshTime.toLocaleString());
        }
      }

    } catch (error) {
      console.error("AutoTime Error:", error);
    }
  }, 60 * 1000);
};

// ==================== রান ফাংশন ====================
module.exports.run = ({ api, event, args }) => {
  const divisionList = Object.keys(divisionPrayerTimes);
  
  // ========== ডিভিশন লিস্ট দেখান ==========
  if (args[0] && args[0].toLowerCase() === "ডিভিশন") {
    let msg = "📌 **বাংলাদেশের ৮ বিভাগের নামাজের সময়সূচি:**\n\n";
    divisionList.forEach(div => {
      const times = divisionPrayerTimes[div];
      msg += `🕌 **${div}**\n`;
      msg += `🌅 ফজর: ${times.Fajr}\n`;
      msg += `☀️ যোহর: ${times.Dhuhr}\n`;
      msg += `🌤️ আসর: ${times.Asr}\n`;
      msg += `🌇 মাগরিব: ${times.Maghrib}\n`;
      msg += `🌙 এশা: ${times.Isha}\n\n`;
    });
    msg += `📝 আপনার ডিভিশন সেট করতে: "সেট ডিভিশন [ডিভিশনের নাম]" টাইপ করুন।`;
    api.sendMessage(msg, event.threadID);
    return;
  }
  
  // ========== ডিভিশন সেট করুন ==========
  if (args[0] && args[0].toLowerCase() === "সেট" && args[1] && args[1].toLowerCase() === "ডিভিশন") {
    const divisionName = args.slice(2).join(" ");
    if (divisionPrayerTimes[divisionName]) {
      global.currentDivision = divisionName;
      api.sendMessage(`✅ ডিভিশন সফলভাবে "${divisionName}" এ সেট করা হয়েছে!`, event.threadID);
    } else {
      const availableDivisions = Object.keys(divisionPrayerTimes).join(", ");
      api.sendMessage(`❌ "${divisionName}" ডিভিশন পাওয়া যায়নি।\n\nউপলব্ধ ডিভিশন: ${availableDivisions}`, event.threadID);
    }
    return;
  }
  
  // ========== ডিফল্ট মেসেজ ==========
  const currentDiv = global.currentDivision || "ঢাকা বিভাগ";
  const times = getPrayerTimesForDivision(currentDiv);
  
  // বর্তমান সময় দেখান
  const now = new Date();
  const bangladeshTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  const currentTime = bangladeshTime.toLocaleTimeString('bn-BD', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
  
  api.sendMessage(
    `🕋 **ইসলামিক টাইম এলার্ট**\n\n` +
    `⏰ বর্তমান সময়: ${currentTime}\n` +
    `🕌 বর্তমান ডিভিশন: ${currentDiv}\n\n` +
    `📌 কমান্ডসমূহ:\n` +
    `▸ "ডিভিশন" - সব ডিভিশনের সময়সূচি দেখুন\n` +
    `▸ "সেট ডিভিশন [নাম]" - আপনার ডিভিশন সেট করুন\n\n` +
    `🕌 নামাজের সময়সূচি:\n` +
    `🌅 ফজর: ${times.Fajr}\n` +
    `☀️ যোহর: ${times.Dhuhr}\n` +
    `🌤️ আসর: ${times.Asr}\n` +
    `🌇 মাগরিব: ${times.Maghrib}\n` +
    `🌙 এশা: ${times.Isha}\n\n` +
    `乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐`,
    event.threadID
  );
};