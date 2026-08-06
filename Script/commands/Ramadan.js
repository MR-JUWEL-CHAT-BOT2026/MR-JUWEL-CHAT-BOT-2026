const axios = require("axios");

module.exports.config = {
  name: "ramadan",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "MR JUWEL + FIXED",
  description: "Ramadan Sehri & Iftar Time with Random Dua 🌙",
  commandCategory: "Islamic",
  usages: "[district name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const location = args.join(" ");

  if (!location) {
    return api.sendMessage(
      "🌙 | জেলার নাম লিখুন!\nউদাহরণ: ramadan Rangpur",
      event.threadID
    );
  }

  try {
    const url = `https://mahbub-ullash.cyberbot.top/api/ramadan?location=${encodeURIComponent(location)}`;
    const res = await axios.get(url);
    const data = res.data;

    if (!data || !data.today) {
      return api.sendMessage(
        "❌ জেলা খুঁজে পাওয়া যায়নি! সঠিক নাম লিখুন।",
        event.threadID
      );
    }

    const randomDua = [
      "🤲 রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাহ ওয়া ফিল আখিরাতি হাসানাহ...",
      "🌙 আল্লাহুম্মা ইন্নাকা আফুউন তুহিব্বুল আফওয়া ফা'ফু আন্নি।",
      "💖 আল্লাহুম্মা ইন্নি লাকা সুমতু ওয়া বিকা আমানতু...",
      "🕌 আল্লাহুম্মাগফিরলি ওয়ারহামনি ওয়াহদিনি..."
    ];

    const dua = randomDua[Math.floor(Math.random() * randomDua.length)];

    const msg = `
╔══🌙 𝗥𝗔𝗠𝗔𝗗𝗔𝗡 𝗧𝗜𝗠𝗘 🌙══╗

📍 জেলা: ${data.name || "N/A"}
📅 আজ: ${data.today?.today_date || "N/A"}

🌅 সেহরি শেষ: ${data.today?.sehri_end || "N/A"}
🌇 ইফতার: ${data.today?.iftar || "N/A"}

📆 আগামীকাল সেহরি: ${data.tomorrow?.sehri_end || "N/A"}
📆 আগামীকাল ইফতার: ${data.tomorrow?.iftar || "N/A"}

🕌 নামাজের সময়:
☀️ ফজর: ${data.other_times?.fajri || "N/A"}
🌞 যোহর: ${data.other_times?.zohr || "N/A"}
🌤 আসর: ${data.other_times?.asr || "N/A"}
🌆 মাগরিব: ${data.other_times?.maghrib || "N/A"}
🌙 এশা: ${data.other_times?.isha || "N/A"}

════════════════════
📖 আজকের দোয়া:
${dua}

🤖 Powered By: MR JUWEL
╚══════════════════╝
`;

    api.sendMessage(msg, event.threadID);
  } catch (err) {
    api.sendMessage(
      "❌ জেলা খুঁজে পাওয়া যায়নি! সঠিক নাম লিখুন।",
      event.threadID
    );
  }
};
