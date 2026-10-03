const axios = require("axios");
const fs = require('fs');

// ✅ Cache, Cooldown, Stats সিস্টেম
const cache = new Map();        // গান cache
const cooldown = new Map();     // rate limit
const songStats = {};           // গান স্ট্যাটস

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports.config = {
  name: "song",
  version: "3.0.0",
  aliases: ["music", "play"],
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  countDown: 5,
  hasPermssion: 0,
  description: "Download audio from YouTube",
  category: "media",
  commandCategory: "media",
  usePrefix: true,
  prefix: true,
  usages: "{pn} [<song name>|<song link>]:\n   Example:\n{pn} chipi chipi chapa chapa"
};

const cleanup = (path) => { try { fs.unlinkSync(path); } catch {} };

// ✅ Progress মেসেজ পাঠানো
const sendLoading = async (api, threadID) => {
  return new Promise((resolve) => {
    api.sendMessage("⏳ গান খোঁজা হচ্ছে, একটু অপেক্ষা করো...", threadID, (err, info) => {
      resolve(err ? null : info.messageID);
    });
  });
};

module.exports.run = async ({ api, args, event }) => {
  if (!args[0]) {
    return api.sendMessage(
      "❌ একটা গানের নাম বা YouTube লিংক দাও!\n\nউদাহরণ: song chipi chipi chapa chapa",
      event.threadID,
      event.messageID
    );
  }

  // ✅ Rate Limiting — ৩০ সেকেন্ডে ১টা রিকোয়েস্ট
  const userID = event.senderID;
  if (cooldown.has(userID)) {
    const timeLeft = Math.ceil((cooldown.get(userID) - Date.now()) / 1000);
    return api.sendMessage(
      `⏳ একটু অপেক্ষা করো! আরো ${timeLeft} সেকেন্ড পরে আবার চেষ্টা করো।`,
      event.threadID,
      event.messageID
    );
  }
  cooldown.set(userID, Date.now() + 30000);
  setTimeout(() => cooldown.delete(userID), 30000);

  const base = await baseApiUrl();
  const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;

  // ✅ সরাসরি YouTube লিংক
  if (checkurl.test(args[0])) {
    const match = args[0].match(checkurl);
    const videoID = match?.[1];
    if (!videoID) {
      return api.sendMessage("❌ ভুল YouTube লিংক!", event.threadID, event.messageID);
    }

    // ✅ Loading মেসেজ
    const loadingID = await sendLoading(api, event.threadID);

    try {
      let downloadLink, title;

      // ✅ Cache চেক
      if (cache.has(videoID)) {
        ({ downloadLink, title } = cache.get(videoID));
      } else {
        const res = await axios.get(`${base}/ytDl3?link=${videoID}&format=mp3`);
        title = res.data.title;
        downloadLink = res.data.downloadLink;

        // ✅ ফাইল সাইজ চেক
        const { headers } = await axios.head(downloadLink);
        const sizeMB = parseInt(headers['content-length'] || 0) / (1024 * 1024);
        if (sizeMB > 25) {
          if (loadingID) await api.unsendMessage(loadingID);
          return api.sendMessage(
            `❌ ফাইল সাইজ ${sizeMB.toFixed(1)}MB — ২৫MB এর বেশি পাঠানো যাবে না!`,
            event.threadID,
            event.messageID
          );
        }

        cache.set(videoID, { downloadLink, title });
        setTimeout(() => cache.delete(videoID), 10 * 60 * 1000); // ১০ মিনিট পর cache মুছবে
      }

      // ✅ স্ট্যাটস আপডেট
      songStats[title] = (songStats[title] || 0) + 1;

      // ✅ Loading মেসেজ মুছো
      if (loadingID) await api.unsendMessage(loadingID);

      return api.sendMessage(
        { body: `🎵 ${title}`, attachment: await dipto(downloadLink, `audio_${userID}.mp3`) },
        event.threadID,
        () => cleanup(`audio_${userID}.mp3`),
        event.messageID
      );

    } catch (err) {
      if (loadingID) await api.unsendMessage(loadingID);
      return api.sendMessage("❌ ডাউনলোড করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
    }
  }

  // ✅ গানের নাম দিয়ে search
  let keyWord = args.join(" ").replace("?feature=share", "");
  const maxResults = 6;
  let result;

  // ✅ Loading মেসেজ
  const loadingID = await sendLoading(api, event.threadID);

  try {
    result = ((await axios.get(`${base}/ytFullSearch?songName=${keyWord}`)).data).slice(0, maxResults);
  } catch (err) {
    if (loadingID) await api.unsendMessage(loadingID);
    return api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
  }

  if (!result || result.length === 0) {
    if (loadingID) await api.unsendMessage(loadingID);
    return api.sendMessage(
      `⭕ "${keyWord}" এর জন্য কোনো রেজাল্ট পাওয়া যায়নি।`,
      event.threadID,
      event.messageID
    );
  }

  // ✅ সুন্দর ফরম্যাটেড মেসেজ (ফিচার ৮)
  let msg = "🎵 গান বেছে নাও:\n";
  msg += "━━━━━━━━━━━━━━━\n\n";
  const thumbnails = [];

  for (let i = 0; i < result.length; i++) {
    const info = result[i];
    thumbnails.push(diptoSt(info.thumbnail, `photo_${i}_${userID}.jpg`));
    msg += `${i + 1}. 🎵 ${info.title}\n`;
    msg += `   ⏱ ${info.time}  |  📺 ${info.channel.name}\n\n`;
  }

  msg += "━━━━━━━━━━━━━━━\n";
  msg += "👆 নম্বর দিয়ে রিপ্লাই করো";

  // ✅ Loading মেসেজ মুছো
  if (loadingID) await api.unsendMessage(loadingID);

  api.sendMessage(
    { body: msg, attachment: await Promise.all(thumbnails) },
    event.threadID,
    (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: "song",
        messageID: info.messageID,
        author: event.senderID,
        result
      });
    },
    event.messageID
  );
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
  try {
    const { result } = handleReply;

    // ✅ শুধু যে পাঠিয়েছে সে রিপ্লাই করতে পারবে
    if (event.senderID !== handleReply.author) {
      return api.sendMessage(
        "❌ এই লিস্টটা তোমার না, নিজে সার্চ করো!",
        event.threadID,
        event.messageID
      );
    }

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > result.length) {
      return api.sendMessage(
        `❌ ১ থেকে ${result.length} এর মধ্যে নম্বর দাও।`,
        event.threadID,
        event.messageID
      );
    }

    const userID = event.senderID;
    const infoChoice = result[choice - 1];
    const videoID = infoChoice.id;

    // ✅ Loading মেসেজ
    const loadingID = await sendLoading(api, event.threadID);

    const base = await baseApiUrl();
    let downloadLink, title, quality;

    // ✅ Cache চেক
    if (cache.has(videoID)) {
      ({ downloadLink, title, quality } = cache.get(videoID));
    } else {
      const res = await axios.get(`${base}/ytDl3?link=${videoID}&format=mp3`);
      title = res.data.title;
      downloadLink = res.data.downloadLink;
      quality = res.data.quality;

      // ✅ ফাইল সাইজ চেক
      const { headers } = await axios.head(downloadLink);
      const sizeMB = parseInt(headers['content-length'] || 0) / (1024 * 1024);
      if (sizeMB > 25) {
        if (loadingID) await api.unsendMessage(loadingID);
        return api.sendMessage(
          `❌ ফাইল সাইজ ${sizeMB.toFixed(1)}MB — ২৫MB এর বেশি পাঠানো যাবে না!`,
          event.threadID,
          event.messageID
        );
      }

      cache.set(videoID, { downloadLink, title, quality });
      setTimeout(() => cache.delete(videoID), 10 * 60 * 1000);
    }

    // ✅ স্ট্যাটস আপডেট
    songStats[title] = (songStats[title] || 0) + 1;

    await api.unsendMessage(handleReply.messageID);
    if (loadingID) await api.unsendMessage(loadingID);

    // ✅ সুন্দর ফরম্যাটেড রেসপন্স (ফিচার ৮)
    await api.sendMessage(
      {
        body: `🎵 ${title}\n━━━━━━━━━━━━━━━\n📊 Quality: ${quality}\n🔥 মোট ${songStats[title]} বার শোনা হয়েছে`,
        attachment: await dipto(downloadLink, `audio_${userID}.mp3`)
      },
      event.threadID,
      () => cleanup(`audio_${userID}.mp3`),
      event.messageID
    );

  } catch (error) {
    console.error(error);
    api.sendMessage(
      "⭕ সমস্যা হয়েছে, হয়তো ফাইল সাইজ ২৫MB এর বেশি।",
      event.threadID,
      event.messageID
    );
  }
};

// ✅ MP3 ডাউনলোড
async function dipto(url, pathName) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(pathName, Buffer.from(response.data));
  return fs.createReadStream(pathName);
}

// ✅ Thumbnail ডাউনলোড
async function diptoSt(url, pathName) {
  const response = await axios.get(url, { responseType: "stream" });
  response.data.path = pathName;
  return response.data;
                                }
