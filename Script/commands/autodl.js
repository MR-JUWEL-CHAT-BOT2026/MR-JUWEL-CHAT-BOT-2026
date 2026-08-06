const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
  config: {
    name: "autodl",
    version: "3.2.0",
    hasPermssion: 0,
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "Advanced Auto Video Downloader",
    commandCategory: "media",
    usages: "paste link",
    cooldowns: 5
  },

  run: async function () {},

  handleEvent: async function ({ api, event, Users }) {
    try {
      const body = event.body || "";
      if (!body.startsWith("https://")) return;

      const senderID = event.senderID;
      const userName = global.data.userName.get(senderID) || "Unknown User";
      const mention = [{ tag: userName, id: senderID }];
      const startTime = Date.now();

      //━━━━━━━━━━ COOLDOWN FEATURE (আগের মতোই) ━━━━━━━━━━//
      const COOLDOWN_TIME = 5 * 60 * 1000;
      const adminIDs = Array.isArray(global.config.ADMINBOT)
        ? global.config.ADMINBOT.map(String)
        : [];
      const isAdmin = adminIDs.includes(String(senderID));

      const dbPath = path.join(__dirname, "cache", "autodl-count.json");
      if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ total: 0, users: {} }, null, 2));
      }

      const preDb = JSON.parse(fs.readFileSync(dbPath));
      if (!preDb.users[senderID]) {
        preDb.users[senderID] = {
          name: userName,
          totalDownload: 0,
          totalTime: 0,
          lastDownload: null,
          cooldownUntil: 0
        };
        fs.writeFileSync(dbPath, JSON.stringify(preDb, null, 2));
      }

      if (!isAdmin) {
        const now = Date.now();
        const cooldownUntil = preDb.users[senderID].cooldownUntil || 0;
        if (now < cooldownUntil) {
          const remaining = cooldownUntil - now;
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          api.setMessageReaction("⏰", event.messageID, () => {}, true);
          return api.sendMessage(
            `┏━━━〔 ⏰ DOWNLOAD COOLDOWN ⏰ 〕━━━┓\n\n👤 USER : ${userName}\n━━━━━━━━━━━━━━━━━━\n❌ ৫ মিনিটের আগে আর ভিডিও ডাউনলোড দিতে পারবে না\n🕒 বাকি সময় : ${minutes} মিনিট ${seconds} সেকেন্ড\n⌛ কুলডাউন শেষ হলে আবার ভিডিও ডাউনলোড দিতে পারবে\n┗━━━━━━━━━━━━━━━━━━┛`,
            event.threadID,
            event.messageID
          );
        }
      }

      //━━━━━━━━━━ PLATFORM DETECT (আগের মতোই) ━━━━━━━━━━//
      let platform = "Unknown";
      let emoji = "🎬";
      if (body.includes("facebook.com") || body.includes("fb.watch")) {
        platform = "Facebook";
        emoji = "📘";
      } else if (body.includes("tiktok.com")) {
        platform = "TikTok";
        emoji = "🎵";
      } else if (body.includes("youtube.com") || body.includes("youtu.be")) {
        platform = "YouTube";
        emoji = "▶️";
      } else if (body.includes("instagram.com")) {
        platform = "Instagram";
        emoji = "📸";
      } else if (body.includes("likee.video")) {
        platform = "Likee";
        emoji = "❤️";
      } else if (body.includes("pinterest.com")) {
        platform = "Pinterest";
        emoji = "📌";
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      //━━━━━━━━━━ PROGRESS BAR (আগের মতোই, কিন্তু ফাস্ট) ━━━━━━━━━━//
      const progressSteps = [
        { percent: 10, bar: '█░░░░░░░░░', status: '📡 Connecting...' },
        { percent: 30, bar: '███░░░░░░░', status: '📥 Fetching Info...' },
        { percent: 50, bar: '█████░░░░░', status: '📤 Downloading...' },
        { percent: 70, bar: '███████░░░', status: '⚡ Processing...' },
        { percent: 90, bar: '█████████░', status: '📦 Preparing...' },
        { percent: 100, bar: '██████████', status: '✅ Complete!' }
      ];

      const loading = await api.sendMessage(
        `╔══════✦═════╗\n  📥 AUTO DOWNLOADER\n╚══════✦══════╝\n\n  ${emoji} ${platform}\n\n  ═══════════════════\n  ${progressSteps[0].bar} ${progressSteps[0].percent}%\n  ${progressSteps[0].status}\n  ═══════════════════\n\n  ⏳ Please wait...`,
        event.threadID
      );

      //━━━━━━━━━━ স্পিড বুস্টার: প্রোগ্রেস বার আপডেট কম করা ━━━━━━━━━━//
      // শুধু 2টি আপডেট দেখানো হবে (50% এবং 100%)
      await new Promise(resolve => setTimeout(resolve, 800));
      await api.editMessage(
        `╔═════════✦════════╗\n  📥 AUTO DOWNLOADER\n╚═════════✦════════╝\n\n  ${emoji} ${platform}\n\n  ════════════════════\n  ${progressSteps[2].bar} ${progressSteps[2].percent}%\n  ${progressSteps[2].status}\n  ════════════════════\n\n  ⏳ Please wait...`,
        loading.messageID
      );

      //━━━━━━━━━━ ফাস্ট ডাউনলোড (অপটিমাইজড) ━━━━━━━━━━//
      // ডেটা ফেচ ও ডাউনলোড একসাথে (প্যারালাল)
      const [data, response] = await Promise.all([
        alldown(body),
        alldown(body).then(d => axios({
          url: d.url,
          method: "GET",
          responseType: "stream",
          timeout: 30000,
          maxRedirects: 5,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }))
      ]);

      if (!data || !data.url) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.editMessage("❌ Unable To Download This Video!", loading.messageID);
      }

      //━━━━━━━━━━ ফাইনাল প্রোগ্রেস আপডেট ━━━━━━━━━━//
      await api.editMessage(
        `╔═════════✦════════╗\n  📥 AUTO DOWNLOADER\n╚═════════✦════════╝\n\n  ${emoji} ${platform}\n\n  ═════════════════\n  ${progressSteps[4].bar} ${progressSteps[4].percent}%\n  ${progressSteps[4].status}\n  ═════════════════\n\n  ⏳ Please wait...`,
        loading.messageID
      );

      let title = data.title || data.caption || data.desc || data.video_title || `${platform} Video`;
      let duration = data.duration || data.length || "Unknown";
      let quality = data.quality || data.resolution || "HD";
      title = title.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

      const fileName = `autodl_${senderID}.mp4`;
      const filePath = path.join(__dirname, "cache", fileName);

      //━━━━━━━━━━ ফাইল রাইট (আগের মতোই) ━━━━━━━━━━//
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const stats = fs.statSync(filePath);
        const fileSize = (stats.size / 1024 / 1024).toFixed(2) + " MB";
        const endTime = Date.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(1);

        // Update database (আগের মতোই)
        if (!fs.existsSync(dbPath)) {
          fs.writeFileSync(dbPath, JSON.stringify({ total: 0, users: {} }, null, 2));
        }
        const db = JSON.parse(fs.readFileSync(dbPath));
        if (!db.users[senderID]) {
          db.users[senderID] = {
            name: userName,
            totalDownload: 0,
            totalTime: 0,
            lastDownload: null,
            cooldownUntil: 0
          };
        }
        db.total += 1;
        db.users[senderID].totalDownload += 1;
        db.users[senderID].totalTime += Number(totalTime);
        db.users[senderID].lastDownload = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" });
        if (!isAdmin) {
          db.users[senderID].cooldownUntil = Date.now() + COOLDOWN_TIME;
        }
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        //━━━━━━━━━━ ফাইনাল কমপ্লিট মেসেজ ━━━━━━━━━━//
        await api.editMessage(
          `╔═══════════✦══════════╗\n  📥 AUTO DOWNLOADER\n╚═══════════✦══════════╝\n\n  ${emoji} ${platform}\n\n  ═══════════════════════\n  ${progressSteps[5].bar} ${progressSteps[5].percent}%\n  ${progressSteps[5].status}\n  ═══════════════════════\n\n  ✅ Download Complete!`,
          loading.messageID
        );

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        //━━━━━━━━━━ ফাইনাল মেসেজ (আগের মতোই) ━━━━━━━━━━//
        return api.sendMessage(
          {
            body:
              `╔══════════✦═════════╗\n『 AUTO DOWNLOADER 』\n╚═════════✦════════╝\n\n╭━━━━━━━━━━━━━━━━━━╮\n┃ 👤 REQUEST BY :\n┃ ${userName}\n┣━━━━━━━━━━━━━━━━━━┫\n┃ 🎬 YOUR DOWNLOAD :\n┃ ${db.users[senderID].totalDownload} Videos\n┣━━━━━━━━━━━━━━━━━━┫\n┃ 🌍 TOTAL DOWNLOAD :\n┃ ${db.total} Videos\n┣━━━━━━━━━━━━━━━━━━┫\n┃ ⚡ DOWNLOAD TIME :\n┃ ${totalTime} Seconds\n┣━━━━━━━━━━━━━━━━━━┫\n┃ 📦 FILE SIZE :\n┃ ${fileSize}\n╰━━━━━━━━━━━━━━━━━━╯\n\n⎯͢🩷ꤪ⁽𝐌ꤪ𝆠፝֟𝐑₎ꜛ⪼─⃞⤹𐙚\n𝐉𝆠፝֟🅤𝆠፝֟𝐖𝆠፝֟🅔𝆠፝֟𝐋༢ꜛ國🩷ꤪ🪽`,
            mentions: mention,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          },
          event.messageID
        );
      });

      writer.on("error", () => {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("❌ File Write Error!", event.threadID, event.messageID);
      });

    } catch (e) {
      console.log(e);
      return api.sendMessage(`❌ Error:\n${e.message}`, event.threadID, event.messageID);
    }
  }
};
