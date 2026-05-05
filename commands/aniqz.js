const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "animequiz",
                aliases: ["aniqz"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "অ্যানিমে চরিত্রের ছবি দেখে নাম অনুমান করার খেলা",
                        en: "Guess the anime character name by looking at the picture",
                        vi: "Đoán tên nhân vật anime bằng cách nhìn vào bức ảnh"
                },
                category: "game",
                guide: {
                        bn: '   {pn}: গেমটি শুরু করতে লিখুন',
                        en: '   {pn}: Type to start the game',
                        vi: '   {pn}: Nhập để bắt đầu trò chơi'
                }
        },

        langs: {
                bn: {
                        start: "একটি অ্যানিমে চরিত্রের ছবি এসেছে! নামটা বলো তো বেবি?",
                        correct: "✅ | একদম সঠিক উত্তর বেবি!\n\nতুমি জিতেছো %1 কয়েন এবং %2 এক্সপি।",
                        wrong: "🥺 | উত্তরটি ভুল হয়েছে বেবি!\n\nসঠিক উত্তর ছিল: %1",
                        notYour: "× বেবি, এটি তোমার জন্য নয়! নিজের জন্য গেম শুরু করো। >🐸",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        start: "A random anime character has appeared! Guess the name, baby.",
                        correct: "✅ | Correct answer, baby!\n\nYou have earned %1 coins and %2 exp.",
                        wrong: "🥺 | Wrong Answer, baby!\n\nThe Correct answer was: %1",
                        notYour: "× This is not your game, baby! >🐸",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        start: "Một nhân vật anime đã xuất hiện! Đoán tên đi cưng.",
                        correct: "✅ | Đáp án chính xác cưng ơi!\n\n✨ Bạn nhận được %1 xu và %2 exp.",
                        wrong: "🥺 | Sai rồi cưng ơi!\n\nĐáp án đúng là: %1",
                        notYour: "× Đây không phải phần chơi của bạn cưng à! >🐸",
                        error: "× Lỗi: %1. Liên hệ MahMUD để được hỗ trợ."
                }
        },

        onReply: async function ({ api, event, Reply, usersData, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68); 
                if (module.exports.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const { aniqzNames, author } = Reply;
                const getCoin = 1000;
                const getExp = 121;
                
                if (event.senderID !== author) {
                        return api.sendMessage(getLang("notYour"), event.threadID, event.messageID);
                }

                const reply = event.body.trim().toLowerCase();
                const userData = await usersData.get(event.senderID);
                
                await api.unsendMessage(Reply.messageID);

                const isCorrect = aniqzNames.some(name => reply.includes(name.toLowerCase()));

                if (isCorrect) {
                        userData.money += getCoin;
                        userData.exp += getExp;
                        await usersData.set(event.senderID, userData);

                        return api.sendMessage(getLang("correct", getCoin, getExp), event.threadID, event.messageID);
                } else {
        
                        return api.sendMessage(getLang("wrong", aniqzNames.join(", ")), event.threadID, event.messageID);
                }
        },

        onStart: async function ({ api, event, getLang }) {
                try {
                        const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68); 
                        if (this.config.author !== authorName) return;

                        const apiUrl = await baseApiUrl();
                        if (!apiUrl) return api.sendMessage("❌ API URL not found!", event.threadID);

                        const response = await axios.get(`${apiUrl}/api/aniqz`);
                        const { name, imgurLink } = response.data.aniqz;

                        const aniqzNames = Array.isArray(name) ? name : [name];

                        const imageStream = await axios({
                                method: "GET",
                                url: imgurLink,
                                responseType: "stream",
                                headers: { 'User-Agent': 'Mozilla/5.0' }
                        });

                        return api.sendMessage({
                                        body: getLang("start"),
                                        attachment: imageStream.data
                                },
                                event.threadID,
                                (err, info) => {
                                        if (err) return api.sendMessage("❌ Failed to send character image.", event.threadID);

                                        global.GoatBot.onReply.set(info.messageID, {
                                                commandName: this.config.name,
                                                messageID: info.messageID,
                                                author: event.senderID,
                                                aniqzNames
                                        });

                                        setTimeout(() => {
                                                api.unsendMessage(info.messageID);
                                        }, 40000); 
                                },
                                event.messageID
                        );
                } catch (error) {
                        console.error("AnimeQuiz Error:", error.message);
                        return api.sendMessage(getLang("error", error.message), event.threadID, event.messageID);
                }
        }
};
