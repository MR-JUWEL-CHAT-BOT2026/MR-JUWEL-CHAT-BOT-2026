const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "4k",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "AI দিয়ে ছবি HD / 4K করুন",
  commandCategory: "tools",
  usages: "[reply image / image url]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    let imageUrl;

    // 📸 Reply check
    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      if (event.messageReply.attachments[0].type === "photo") {
        imageUrl = event.messageReply.attachments[0].url;
      }
    }

    // 🔗 URL input
    if (!imageUrl && args[0]) {
      imageUrl = args.join(" ");
    }

    if (!imageUrl) {
      return api.sendMessage("❌ | একটা ছবি reply দাও বা image link দাও!", event.threadID, event.messageID);
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    // 🌐 Base API
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
    const baseUrl = base.data.mahmud;

    const apiUrl = `${baseUrl}/api/hd/mahmud?imgUrl=${encodeURIComponent(imageUrl)}`;

    // 📥 Get Image Stream
    const res = await axios.get(apiUrl, { responseType: "stream" });

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    return api.sendMessage({
      body: "✨ | তোমার 4K ইমেজ রেডি 😘",
      attachment: res.data
    }, event.threadID, event.messageID);

  } catch (err) {
    console.log(err);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    return api.sendMessage("❌ | Error: " + err.message, event.threadID, event.messageID);
  }
};
