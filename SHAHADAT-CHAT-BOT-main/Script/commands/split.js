const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "split",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "একটি ছবিকে দুই ভাগে বিভক্ত করুন",
                        en: "Split an image into two halves",
                        vi: "Chia một hình ảnh thành hai nửa"
                },
                category: "tools",
                guide: {
                        bn: '   {pn} (ছবিতে রিপ্লাই দিন)',
                        en: '   {pn} (reply to image)',
                        vi: '   {pn} (phản hồi hình ảnh)'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, একটি ছবিতে রিপ্লাই দাও!",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।",
                        done: "✅ এই নাও তোমার স্প্লিট করা ছবি:"
                },
                en: {
                        noInput: "× Baby, please reply to an image!",
                        error: "× API error: %1. Contact MahMUD for help.",
                        done: "✅ Split Done! Here are the images:"
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng phản hồi một hình ảnh!",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.",
                        done: "✅ Đã chia xong! Đây là ảnh của bạn:"
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                if (!event.messageReply || !event.messageReply.attachments?.[0]?.url) {
                        return message.reply(getLang("noInput"));
                }

                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

                const t = Date.now();
                const leftPath = path.join(cacheDir, `left_${event.senderID}_${t}.jpg`);
                const rightPath = path.join(cacheDir, `right_${event.senderID}_${t}.jpg`);

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        
                        const imgUrl = event.messageReply.attachments[0].url;
                        const apiBase = await mahmud();
                        const res = await axios.get(`${apiBase.replace(/\/$/, "")}/api/split?url=${encodeURIComponent(imgUrl)}`);

                        if (res.data && (res.data.error || !res.data.success)) {
                                return message.reply(res.data.error || "API error");
                        }

                        const saveImg = (b64, p) => fs.writeFileSync(p, Buffer.from(b64.split(",")[1], "base64"));
                        saveImg(res.data.left, leftPath);
                        saveImg(res.data.right, rightPath);

                        await message.reply({
                                body: getLang("done"),
                                attachment: [fs.createReadStream(leftPath), fs.createReadStream(rightPath)]
                        });

                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                        
                        setTimeout(() => {
                                [leftPath, rightPath].forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
                        }, 5000);

                } catch (err) {
                        console.error("Split Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        [leftPath, rightPath].forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
                        return message.reply(getLang("error", err.response?.data?.error || err.message));
                }
        }
};
