const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "caption",
                aliases: ["cp", "ক্যাপশন"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "বিভিন্ন ক্যাটাগরির ক্যাপশন পান অথবা নতুন ক্যাপশন যোগ করুন",
                        en: "Get captions from various categories or add new ones",
                        vi: "Lấy chú thích từ các danh mục khác nhau hoặc thêm chú thích mới"
                },
                category: "love",
                guide: {
                        bn: '   {pn} <category> <lang>: ক্যাপশন পান (Default: bn)'
                                + '\n   {pn} list: সব ক্যাটাগরি দেখুন'
                                + '\n   {pn} add <cat> <lang> <text>: নতুন ক্যাপশন যোগ করুন',
                        en: '   {pn} <category> <lang>: Get caption (Default: bn)'
                                + '\n   {pn} list: See all categories'
                                + '\n   {pn} add <cat> <lang> <text>: Add new caption',
                        vi: '   {pn} <danh mục> <ngôn ngữ>: Lấy chú thích'
                                + '\n   {pn} list: Xem tất cả các danh mục'
                                + '\n   {pn} add <cat> <lang> <văn bản>: Thêm chú thích mới'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, একটি ক্যাটাগরি দাও! উদাহরণ: {pn} love",
                        listTitle: ">🎀 সহজলভ্য ক্যাটাগরি সমূহ:\n\n",
                        addUsage: "⚠ সঠিক নিয়ম: {pn} add <category> <bn/en> <text>",
                        success: "✅| এই নাও তোমার %1 ক্যাপশন:\n\n%2",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please specify a category! Example: {pn} love",
                        listTitle: ">🎀 Available categories:\n\n",
                        addUsage: "⚠ Usage: {pn} add <category> <bn/en> <text>",
                        success: "✅| Here’s your %1 caption:\n\n%2",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, hãy nhập danh mục! Ví dụ: {pn} love",
                        listTitle: ">🎀 Các danh mục có sẵn:\n\n",
                        addUsage: "⚠ Cách dùng: {pn} add <danh mục> <bn/en> <văn bản>",
                        success: "✅| Chú thích %1 của cưng đây:\n\n%2",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        const baseUrl = await baseApiUrl();

                        if (args[0] === "list") {
                                const res = await axios.get(`${baseUrl}/api/caption/list`);
                                const categories = res.data.categories.map(cat => `• ${cat}`).join("\n");
                                return message.reply(getLang("listTitle") + categories);
                        }

                        if (args[0] === "add") {
                                if (args.length < 4) return message.reply(getLang("addUsage"));
                                const category = args[1];
                                const language = args[2];
                                const captionText = args.slice(3).join(" ");
                                
                                const res = await axios.post(`${baseUrl}/api/caption/add`, { 
                                        category, 
                                        language, 
                                        caption: captionText 
                                });
                                return message.reply(res.data.message);
                        }

                        if (!args[0]) return message.reply(getLang("noInput"));

                        const category = args[0];
                        const language = args[1] || "bn";

                        const res = await axios.get(`${baseUrl}/api/caption`, { 
                                params: { category, language } 
                        });

                        return message.reply(getLang("success", category, res.data.caption));

                } catch (err) {
                        console.error("Caption Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        }
};
