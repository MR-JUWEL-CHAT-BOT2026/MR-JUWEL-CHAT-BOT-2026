/**
 * scan.js
 * QR Code Scanner Command (Reply Image Version)
 */

const fs = require("fs");
const path = require("path");
const jimp = require("jimp");
const QrCode = require("qrcode-reader");
const imageDownloader = require("image-downloader");

module.exports.config = {
  name: "scan",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "Scan QR code from a replied image",
  commandCategory: "user",
  usages: "!scan (reply to an image containing QR code)",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, type, messageReply } = event;

  // Check if user replied to a message
  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("❌Please reply to a QR code image!", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];

  // Check if attachment is a photo
  if (attachment.type !== "photo") {
    return api.sendMessage("> ❌\n The replied message is not an image!", threadID, messageID);
  }

  // Ensure cache folder exists
  const cachePath = path.join(__dirname, "cache");
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

  const filePath = path.join(cachePath, `qrcode_${Date.now()}.png`);

  try {
    // Download the image
    await imageDownloader.image({ url: attachment.url, dest: filePath });

    // Read image using jimp
    const img = await jimp.read(fs.readFileSync(filePath));
    const qr = new QrCode();

    // Decode QR code
    const value = await new Promise((resolve, reject) => {
      qr.callback = (err, v) => err ? reject(err) : resolve(v);
      qr.decode(img.bitmap);
    });

    // Send the QR code result
    return api.sendMessage(`✅𝐫𝐞𝐬𝐮𝐥𝐭: ${value.result}`, threadID, messageID);

  } catch (err) {
    console.log("QR Scan Error:", err);
    return api.sendMessage("> ❌\nFailed to read QR code. Make sure the image is clear!", threadID, messageID);
  }
};
