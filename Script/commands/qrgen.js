const QRCode = require("qrcode");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "qrgen",
  aliases: ["qrcode"],
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MOHAMMAD AKASH",
  description: "Generate QR code from text or link",
  commandCategory: "utility",
  usages: "[text/link]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    // ইনপুট ডাটা
    let data = args.join(" ").trim();
    if (!data) data = "https://example.com";

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const filePath = path.join(cacheDir, `qr_${Date.now()}.png`);

    // QR Code Generate
    await QRCode.toFile(filePath, data, {
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      },
      scale: 8
    });

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    api.sendMessage(
      {
        body: "✅ 𝗬𝗼𝘂𝗿 𝗤𝗥 𝗖𝗼𝗱𝗲 𝗜𝘀 𝗥𝗲𝗮𝗱𝘆!",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      },
      event.messageID
    );

  } catch (err) {
    console.error("QRGen Error:", err);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    api.sendMessage("❌ QR code generate করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
