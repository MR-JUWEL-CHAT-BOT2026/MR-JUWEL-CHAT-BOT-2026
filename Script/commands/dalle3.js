const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "dalle3",
                version: "1.7",
                author: "MahMUD",
                countDown: 15,
                role: 0,
                description: {
                        bn: "DALL-E 3 মডেল দিয়ে এআই ছবি তৈরি করুন",
                        en: "Generate AI images using DALL-E 3 model",
                        vi: "Tạo hình ảnh AI bằng mô hình DALL-E 3"
                },
                category: "image gen",
                guide: {
                        bn: '   {pn} <prompt>: ছবি তৈরি করতে বর্ণনা দিন',
                        en: '   {pn} <prompt>: Provide a description to generate image',
                        vi: '   {pn} <prompt>: Cung cấp mô tả để tạo hình ảnh'
                }
        },

        langs: {
                bn: {
                        noPrompt: "× বেবি, ছবি তৈরি করার জন্য কিছু তো লেখো",
                        wait: "🔄 | DALL-E 3 ছবি তৈরি হচ্ছে, একটু অপেক্ষা করো বেবি...",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐃𝐀𝐋𝐋-𝐄 𝟑 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲 <😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noPrompt: "× Baby, please provide a prompt to generate image",
                        wait: "🔄 | DALL-E 3 Image Generating, please wait...",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐃𝐀𝐋𝐋-𝐄 𝟑 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲 <😘",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noPrompt: "× Cưng ơi, vui lòng nhập mô tả để tạo ảnh",
                        wait: "🔄 | Đang tạo ảnh DALL-E 3, vui lòng chờ chút...",
                        success: "Ảnh DALL-E 3 của cưng đây",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const prompt = args.join(" ");
                if (!prompt) return message.reply(getLang("noPrompt"));

                const cacheDir = path.join(__dirname, "cache");
                const filePath = path.join(cacheDir, `dalle3_${Date.now()}.png`);
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        const waitMsg = await message.reply(getLang("wait"));

                        const baseUrl = await baseApiUrl();
                        const response = await axios.post(`${baseUrl}/api/dalle3`, 
                                { prompt }, 
                                { responseType: "arraybuffer" }
                        );

                        fs.writeFileSync(filePath, Buffer.from(response.data));

                        if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
                        api.setMessageReaction("✅", event.messageID, () => {}, true);

                        return message.reply({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, () => {
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        });

                } catch (err) {
                        console.error("Dalle3 Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
