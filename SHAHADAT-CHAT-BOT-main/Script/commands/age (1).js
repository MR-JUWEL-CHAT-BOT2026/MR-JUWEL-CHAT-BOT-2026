const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "age",
                aliases: ["বয়স"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "আপনার জন্ম তারিখ দিয়ে বর্তমান বয়স ক্যালকুলেট করুন",
                        en: "Calculate your current age using date of birth",
                        vi: "Tính tuổi hiện tại của bạn bằng ngày sinh"
                },
                category: "utility",
                guide: {
                        bn: '   {pn} <YYYY-MM-DD>: (যেমন: {pn} 2002-05-15)',
                        en: '   {pn} <YYYY-MM-DD>: (Ex: {pn} 2002-05-15)',
                        vi: '   {pn} <YYYY-MM-DD>: (VD: {pn} 2002-05-15)'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, তোমার জন্ম তারিখ দাও!\n\nউদাহরণ: {pn} 2002-05-15",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please provide your date of birth\n\nExample: {pn} 2002-05-15",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng cung cấp ngày sinh\n\nVí dụ: {pn} 2002-05-15",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const dob = args[0];
                if (!dob) return message.reply(getLang("noInput"));

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        
                        const apiBase = await mahmud();
                        const res = await axios.get(`${apiBase}/api/age/font3?dob=${dob}`);

                        if (res.data && res.data.error) {
                                return message.reply(res.data.error);
                        }

                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                        return message.reply(res.data.message);

                } catch (err) {
                        console.error("Age Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        const errorMsg = err.response?.data?.error || err.message;
                        return message.reply(getLang("error", errorMsg));
                }
        }
};
