const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "say",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "যেকোনো লেখাকে অডিও বা ভয়েস মেসেজে রূপান্তর করুন",
                        en: "Convert any text into an audio or voice message",
                        vi: "Chuyển đổi bất kỳ văn bản nào thành tin nhắn âm thanh hoặc giọng nói"
                },
                category: "media",
                guide: {
                        bn: '   {pn} <লেখা>: (অথবা কোনো মেসেজে রিপ্লাই দিন)',
                        en: '   {pn} <text>: (or reply to a message)',
                        vi: '   {pn} <văn bản>: (hoặc trả lời tin nhắn)'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, কিছু তো লেখো অথবা মেসেজে রিপ্লাই দাও",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please write something or reply to a message",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, hãy viết gì đó hoặc phản hồi tin nhắn",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                let text = args.join(" ");
                if (event.type === "message_reply" && event.messageReply.body) {
                        text = event.messageReply.body;
                }

                if (!text) return message.reply(getLang("noInput"));

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);

                        const baseUrl = await baseApiUrl();
                        const response = await axios.get(`${baseUrl}/api/say`, {
                                params: { text },
                                headers: { "Author": authorName },
                                responseType: "stream"
                        });

                        return message.reply({
                                body: "",
                                attachment: response.data
                        }, () => {
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        });

                } catch (err) {
                        console.error("Say Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        const errorMsg = err.response?.data?.error || err.message;
                        return message.reply(getLang("error", errorMsg));
                }
        }
};
