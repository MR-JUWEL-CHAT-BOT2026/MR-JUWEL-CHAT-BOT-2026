const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "clown",
                version: "1.7",
                author: "MahMUD",
                role: 0,
                category: "fun",
                cooldown: 10,
                guide: {
                        en: "{pn} [mention/reply/UID]",
                        bn: "{pn} [মেনশন/রিপ্লাই/UID]",
                        vi: "{pn} [mention/reply/UID]"
                }
        },

        langs: {
                bn: {
                        noTarget: "• বেবি, কাকে জোকার (clown) বানাবে? মেনশন, রিপ্লাই বা UID দাও",
                        error: "❌ An error occurred: contact MahMUD %1",
                        success: "Effect clown successful"
                },
                en: {
                        noTarget: "• Baby, mention, reply, or provide UID of the target",
                        error: "❌ An error occurred: contact MahMUD %1",
                        success: "Effect clown successful"
                },
                vi: {
                        noTarget: "• Cưng ơi, hãy đề cập, phản hồi hoặc cung cấp UID",
                        error: "❌ An error occurred: contact MahMUD %1",
                        success: "Hiệu ứng clown thành công"
                }
        },

        onStart: async function ({ api, event, args, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const { threadID, messageID, messageReply, mentions } = event;
                let id2 = messageReply?.senderID || Object.keys(mentions)[0] || args[0];

                if (!id2) return api.sendMessage(getLang("noTarget"), threadID, messageID);

                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
                const filePath = path.join(cacheDir, `clown_${id2}_${Date.now()}.png`);

                try {
                        api.setMessageReaction("⏳", messageID, () => { }, true);

                        const apiUrl = await baseApiUrl();
                        const url = `${apiUrl}/api/dig?type=clown&user=${id2}`;

                        const response = await axios.get(url, { responseType: "arraybuffer" });
                        fs.writeFileSync(filePath, Buffer.from(response.data));

                        api.sendMessage({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, threadID, (err) => {
                                if (!err) {
                                        api.setMessageReaction("🪽", messageID, () => { }, true);
                                }
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        }, messageID);

                } catch (err) {
                        api.setMessageReaction("❌", messageID, () => { }, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        api.sendMessage(getLang("error", err.message || "API Error"), threadID, messageID);
                }
        }
};
