const axios = require("axios");

const baseApiUrl = async () => {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
    return base.data.mahmud;
};

module.exports.config = {
    name: "namaz",
    version: "1.7",
    author: "MahMUD",
    countDown: 5,
    role: 0,
    description: "Get prayer times for your city",
    category: "Islamic",
    usages: "{pn} <city>",
    aliases: ["prayer", "salah", "নামাজ"]
};

module.exports.langs = {
    bn: {
        noData: "× দুঃখিত, %1 শহরের নামাজের সময় পাওয়া যায়নি। 🕌",
        error: "× সমস্যা হয়েছে: %1"
    },
    en: {
        noData: "× Sorry, prayer times for %1 were not found. 🕌",
        error: "× API error: %1"
    },
    vi: {
        noData: "× Không tìm thấy thời gian cầu nguyện cho %1. 🕌",
        error: "× Lỗi: %1"
    }
};

module.exports.run = async function ({ api, event, args, message, getLang }) {
    const authorName = "MahMUD";

    // optional author protection
    if (this.config.author !== authorName) {
        return api.sendMessage(
            "You are not authorized to change the author name.",
            event.threadID,
            event.messageID
        );
    }

    const city = args.join(" ") || "Dhaka";

    try {
        api.setMessageReaction("⏳", event.messageID, () => {}, true);

        const baseUrl = await baseApiUrl();
        const apiUrl = `${baseUrl}/api/namaz/font3/${encodeURIComponent(city)}`;

        const res = await axios.get(apiUrl, {
            headers: { author: authorName }
        });

        if (res.data?.error) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            return message.reply(res.data.error);
        }

        if (res.data?.message) {
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            return message.reply(res.data.message);
        }

        api.setMessageReaction("❓", event.messageID, () => {}, true);
        return message.reply(getLang("noData", city));

    } catch (err) {
        console.error("Namaz Error:", err);
        api.setMessageReaction("❌", event.messageID, () => {}, true);

        const errorMsg = err.response?.data?.error || err.message;
        return message.reply(getLang("error", errorMsg));
    }
};
