const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "fyp",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "টিকটক থেকে এডিট করা ভিডিও সার্চ করে ডাউনলোড করুন",
                        en: "Search and download fyp edit videos",
                        vi: "Tìm kiếm và tải xuống các video chỉnh sửa TikTok"
                },
                category: "media",
                guide: {
                        bn: '   {pn} <কীওয়ার্ড>: ভিডিও সার্চ করতে নাম লিখুন (যেমন: {pn} naruto)',
                        en: '   {pn} <keyword>: Enter keyword to search (Ex: {pn} naruto)',
                        vi: '   {pn} <từ khóa>: Nhập từ khóa để tìm kiếm (VD: {pn} naruto)'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, কী সার্চ করতে চাও বলো!\nউদাহরণ: {pn} naruto",
                        tooLarge: "× ভিডিওটি অনেক বড় (২৫ মেগাবাইটের বেশি)। অন্য কিছু সার্চ করো!",
                        success: "• 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 Fyp 𝐄𝐝𝐢𝐭 𝐕𝐢𝐝𝐞𝐨.\n• 𝐒𝐞𝐚𝐫𝐜𝐡: %1",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, what do you want to search?\nExample: {pn} naruto",
                        tooLarge: "× Video is too large (25MB+). Try another keyword!",
                        success: "• 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 Fyp 𝐄𝐝𝐢𝐭 𝐕𝐢𝐝𝐞𝐨.\n• 𝐒𝐞𝐚𝐫𝐜𝐡: %1",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, cưng muốn tìm kiếm gì?\nVí dụ: {pn} naruto",
                        tooLarge: "× Video quá lớn (25MB+). Hãy thử từ khóa khác!",
                        success: "• 𝐕𝐢𝐝𝐞𝐨 𝐜𝐡𝐢̉𝐧𝐡 𝐬𝐮̛̉𝐚 Fyp 𝐜𝐮̉𝐚 𝐜𝐮̛𝐧𝐠 ᵭ𝐚̂𝐲.\n• 𝐓𝐢̀𝐦 𝐤𝐢𝐞̂́𝐦: %1",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const keyword = args.join(" ");
                if (!keyword) return message.reply(getLang("noInput"));

                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
                const videoPath = path.join(cacheDir, `tiksr_${Date.now()}.mp4`);

                try {
                        api.setMessageReaction("⌛", event.messageID, () => {}, true);

                        const apiUrl = await baseApiUrl();
                        const res = await axios({
                                method: "GET",
                                url: `${apiUrl}/api/tiksr`,
                                params: { sr: keyword },
                                responseType: "stream"
                        });

                        const writer = fs.createWriteStream(videoPath);
                        res.data.pipe(writer);

                        await new Promise((resolve, reject) => {
                                writer.on("finish", resolve);
                                writer.on("error", reject);
                        });

                        const stat = fs.statSync(videoPath);
                        if (stat.size > 26214400) { 
                                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                                api.setMessageReaction("❌", event.messageID, () => {}, true);
                                return message.reply(getLang("tooLarge"));
                        }

                        await message.reply({
                                body: getLang("success", keyword),
                                attachment: fs.createReadStream(videoPath)
                        }, () => {
                                api.setMessageReaction("✅", event.messageID, () => {}, true);
                                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                        });

                } catch (err) {
                        console.error("TikEdit Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
