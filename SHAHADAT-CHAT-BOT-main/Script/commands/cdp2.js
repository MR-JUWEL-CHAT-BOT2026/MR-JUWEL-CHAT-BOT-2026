const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "copuledp2",
                aliases: ["cdp2"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "নিব্বা-নিব্বিদের জন্য রেন্ডম কাপল ডিপি পান (ভার্সন ২)",
                        en: "Fetch a random couple DP for nibba and nibbi (v2)"
                },
                category: "image",
                guide: {
                        bn: '   {pn}: রেন্ডম কাপল ডিপি (২) পেতে ব্যবহার করুন',
                        en: '   {pn}: Use to get a random couple DP (v2)'
                }
        },

        langs: {
                bn: {
                        notFound: "× কাপল ডিপি খুঁজে পাওয়া যায়নি। পরে চেষ্টা করো বেবি!",
                        success: "এই নাও তোমার কাপল ডিপি বেবি <😘",
                        error: "× ডিপি আনতে সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        notFound: "× Couldn't fetch couple DP. Try again later baby!",
                        success: "Here is your cdp baby <😘",
                        error: "× API error: %1. Contact MahMUD for help."
                }
        },

        onStart: async function ({ api, message, event, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        const baseUrl = await baseApiUrl();
                        const response = await axios.get(`${baseUrl}/api/cdp2`, {
                                headers: { "author": authorName }
                        });

                        if (response.data.error) {
                                return message.reply(response.data.error);
                        }

                        const { male, female } = response.data;
                        if (!male || !female) {
                                return message.reply(getLang("notFound"));
                        }

                        const attachments = [
                                await global.utils.getStreamFromURL(male),
                                await global.utils.getStreamFromURL(female)
                        ];

                        return message.reply({
                                body: getLang("success"),
                                attachment: attachments
                        });

                } catch (err) {
                        console.error("CDP2 Fetch Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        }
};
