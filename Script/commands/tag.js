module.exports.config = {
  name: "tag",
  version: "7.0.0",
  hasPermssion: 1,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Funny everyone mention system",
  commandCategory: "group",
  usages: "[count]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

  const threadID = event.threadID;

  const threadInfo = await api.getThreadInfo(threadID);

  const botID = api.getCurrentUserID();

  const members = threadInfo.participantIDs.filter(
    id => id != botID
  );

  const repeat = parseInt(args[0]) || 1;

  if (repeat > 10) {
    return api.sendMessage(
      "⚠️ সর্বোচ্চ 10 বার tag দেওয়া যাবে!",
      threadID
    );
  }

  const topCaptions = [

    "📢 ওই গ্রুপের লুকিয়ে থাকা পাবলিকরা কোথায়? সবাই বের হও না হলে CID ডাকা হবে 🕵️🐸",

    "🚨 জরুরি ঘোষণা — যারা seen মেরে পালাও তাদের আজকে উপস্থিতি বাধ্যতামূলক 😹",

    "👀 ghost member দের খোঁজা চলছে, অনলাইনে থাকলে একটা শব্দ করো নাহলে সন্দেহ করা হবে ☠️",

    "🔥 গ্রুপে এত নীরবতা কেন? মনে হচ্ছে সবাই WiFi বিল বাকি রেখে বসে আছে 😭",

    "😴 যারা ঘুমানোর অভিনয় করতেছো তারা উঠে attendance দাও, principal আসতেছে 📝",

    "🐸 চিপা gang বের হও, এত লুকিয়ে থাকলে tax লাগিয়ে দেওয়া হবে 💸",

    "⚡ online কিংরা কোথায়? নাকি সবাই প্রেম করতে busy আছো 😹",

    "🎤 এই যে silent member গুলো, তোমরা কি শুধু seen মারার চাকরি করো নাকি 🤨",

    "💀 গ্রুপটা দেখে মনে হচ্ছে ২০০ বছর আগের কবরস্থান, কেউ বেঁচে থাকলে reply দাও ☠️",

    "🌚 যারা online থেকেও reply দাও না তাদের বিরুদ্ধে আন্তর্জাতিক মামলা হবে 🚔",

    "🚔 inactive member ধরার অভিযান শুরু হয়ে গেছে, পালানোর চেষ্টা করলে লাভ নাই 😎",

    "😹 সবাই এত চুপ কেন? মনে হচ্ছে exam hall এ বসে আছি 📚",

    "📢 online থাকলে একটা emoji দাও, না দিলে ধরে নেওয়া হবে তোমাকে অপহরণ করা হয়েছে 👻",

    "🔥 group গরম করতে সবাই দ্রুত হাজির হও, না হলে admin কান্না শুরু করবে 😭",

    "🐒 লুকিয়ে থাকা পাবলিক বের হও, তোমাদের খুঁজতে খুঁজতে battery শেষ 😑",

    "⚠️ warning — যারা reply দিবা না তাদের ghost member ঘোষণা করা হবে 👻",

    "😤 এত শান্তি ভালো লাগে না, কেউ একটা ঝগড়া শুরু করো 😹",

    "🎭 নাটক বাদ দিয়ে সবাই সামনে আসো, audience অপেক্ষা করছে 🍿",

    "📛 roll call শুরু হয়ে গেছে — যারা absent থাকবে তাদের নামে মামলা হবে 🚨",

    "💃 সবাই বের হয়ে একটু নাচানাচি করো, গ্রুপে মরিচা পড়ে গেছে 🕺"

  ];

  for (let r = 0; r < repeat; r++) {

    const randomCaption =
      topCaptions[
        Math.floor(Math.random() * topCaptions.length)
      ];

    let mentions = [];

    members.forEach((id) => {

      mentions.push({
        tag: "@everyone",
        id
      });

    });

    await api.sendMessage(
      {
        body: `${randomCaption}\n\n@everyone`,
        mentions
      },
      threadID
    );

    await new Promise(resolve =>
      setTimeout(resolve, 3000)
    );

  }

};
