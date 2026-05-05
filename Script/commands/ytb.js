const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');

const baseApiUrl = async () => {
        const base = await axios.get(`https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json`);
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "ytb",
                aliases: ["youtube"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "ইউটিউব থেকে ভিডিও, অডিও ডাউনলোড বা তথ্য দেখুন",
                        en: "Download video, audio or view video information from YouTube",
                        vi: "Tải video, audio hoặc xem thông tin video trên YouTube"
                },
                category: "media",
                guide: {
                        bn: '   {pn} video [নাম/লিঙ্ক]: ভিডিও ডাউনলোড করতে\n   {pn} audio [নাম/লিঙ্ক]: অডিও ডাউনলোড করতে\n   {pn} info [নাম/লিঙ্ক]: ভিডিওর তথ্য দেখতে\n   উদাহরণ:\n   {pn} -v Mood Lofi\n   {pn} -a Mood Lofi',
                        en: '   {pn} [video|-v] [name|link]: download video\n   {pn} [audio|-a] [name|link]: download audio\n   {pn} [info|-i] [name|link]: view details',
                        vi: '   {pn} [video|-v] [tên|link]: tải video\n   {pn} [audio|-a] [tên|link]: tải audio\n   {pn} [info|-i] [tên|link]: xem thông tin'
                }
        },

        langs: {
                bn: {
                        error: "❌ সমস্যা হয়েছে: contact MahMUD %1",
                        noResult: "⭕ দুঃখিত বেবি, \"%1\" এর জন্য কিছু খুঁজে পাইনি।",
                        choose: "%1যা ডাউনলোড করতে চান তার নাম্বার লিখে রিপ্লাই দিন।",
                        video: "ভিডিও",
                        audio: "অডিও",
                        downloading: "⬇️ আপনার কাঙ্ক্ষিত %1 \"%2\" ডাউনলোড হচ্ছে...",
                        info: "💠 শিরোনাম: %1\n🏪 চ্যানেল: %2\n👨‍👩‍👧‍👦 সাবস্ক্রাইবার: %3\n⏱ সময়কাল: %4\n👀 ভিউ: %5\n👍 লাইক: %6\n🆙 আপলোড: %7\n🔠 আইডি: %8\n🔗 লিঙ্ক: %9"
                },
                en: {
                        error: "❌ An error occurred: contact MahMUD %1",
                        noResult: "⭕ No search results match the keyword %1",
                        choose: "%1Reply with a number to choose or anything else to cancel.",
                        video: "video",
                        audio: "audio",
                        downloading: "⬇️ Downloading %1 \"%2\"",
                        info: "💠 Title: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Duration: %4\n👀 Views: %5\n👍 Likes: %6\n🆙 Upload date: %7\n🔠 ID: %8\n🔗 Link: %9"
                },
                vi: {
                        error: "❌ Đã xảy ra lỗi: contact MahMUD %1",
                        noResult: "⭕ Không có kết quả tìm kiếm cho %1",
                        choose: "%1Reply tin nhắn với số để chọn hoặc nội dung bất kì để gỡ",
                        video: "video",
                        audio: "âm thanh",
                        downloading: "⬇️ Đang tải xuống %1 \"%2\"",
                        info: "💠 Tiêu đề: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Thời gian: %4\n👀 Lượt xem: %5\n👍 Lượt thích: %6\n🆙 Ngày tải: %7\n🔠 ID: %8\n🔗 Link: %9"
                }
        },

        onStart: async function ({ api, args, message, event, commandName, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68); 
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }
                
                const { threadID, messageID, senderID } = event;
                let type;

                switch (args[0]) {
                        case "-v": case "video": type = "video"; break;
                        case "-a": case "-s": case "audio": case "sing": type = "audio"; break;
                        case "-i": case "info": type = "info"; break;
                        default: return message.reply(`• Usage: ${this.config.guide[getLang.name]}`);
                }

                const input = args.slice(1).join(" ");
                if (!input) return api.sendMessage("• Please provide a song name or link baby! 😘", threadID, messageID);

                const apiUrl = await baseApiUrl();
                const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
                
                if (checkurl.test(input)) {
                        const videoID = input.match(checkurl)[1];
                        api.setMessageReaction("⌛", messageID, () => {}, true);
                        if (type === 'info') return fetchInfo(api, threadID, messageID, videoID, apiUrl, getLang);
                        return handleDownload(api, threadID, messageID, videoID, type, apiUrl, getLang);
                }

                try {
                        api.setMessageReaction("😘", messageID, () => {}, true);
                        const res = await axios.get(`${apiUrl}/api/ytb/search?q=${encodeURIComponent(input)}`);
                        const results = res.data.results.slice(0, 6);
                        if (!results || results.length === 0) return api.sendMessage(getLang("noResult", input), threadID, messageID);

                        let msg = "";
                        const attachments = [];
                        const cacheDir = path.join(__dirname, 'cache');
                        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

                        for (let i = 0; i < results.length; i++) {
                                msg += `${i + 1}. ${results[i].title}\nTime: ${results[i].time}\n\n`;
                                const thumbPath = path.join(cacheDir, `thumb_${senderID}_${Date.now()}_${i}.jpg`);
                                const thumbRes = await axios.get(results[i].thumbnail, { responseType: 'arraybuffer' });
                                fs.writeFileSync(thumbPath, Buffer.from(thumbRes.data));
                                attachments.push(fs.createReadStream(thumbPath));
                        }

                        return api.sendMessage({
                                body: getLang("choose", msg),
                                attachment: attachments
                        }, threadID, (err, info) => {
                                attachments.forEach(stream => { if (fs.existsSync(stream.path)) fs.unlinkSync(stream.path); });
                                global.GoatBot.onReply.set(info.messageID, { commandName, author: senderID, results, type, apiUrl });
                        }, messageID);

                } catch (e) {
                        return api.sendMessage(getLang("error", e.message), threadID, messageID);
                }
        },

        onReply: async function ({ event, api, Reply, getLang }) {
                const { results, type, apiUrl, author } = Reply;
                if (event.senderID !== author) return;
                
                const choice = parseInt(event.body);
                if (isNaN(choice) || choice <= 0 || choice > results.length) return api.unsendMessage(Reply.messageID);
                
                const videoID = results[choice - 1].id;
                api.unsendMessage(Reply.messageID);
                api.setMessageReaction("⌛", event.messageID, () => {}, true);
               
                if (type === 'info') return fetchInfo(api, event.threadID, event.messageID, videoID, apiUrl, getLang);
                await handleDownload(api, event.threadID, event.messageID, videoID, type, apiUrl, getLang);
        }
};

async function handleDownload(api, threadID, messageID, videoID, type, apiUrl, getLang) {
        const format = type === 'audio' ? 'mp3' : 'mp4';
        const filePath = path.join(__dirname, 'cache', `yt_${Date.now()}.${format}`);

        try {
                const res = await axios.get(`${apiUrl}/api/ytb/get?id=${videoID}&type=${type}`);
                const { title, downloadLink } = res.data.data;
                
                api.sendMessage(getLang("downloading", getLang(type), title), threadID, messageID);
                
                const response = await axios({ url: downloadLink, method: 'GET', responseType: 'stream' });
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);

                writer.on('finish', () => {
                        api.sendMessage({
                                body: `✅ Successfully Downloaded: ${title}`,
                                attachment: fs.createReadStream(filePath)
                        }, threadID, () => { 
                                api.setMessageReaction("✅", messageID, () => {}, true);
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
                        }, messageID);
                });
        } catch (e) {
                api.sendMessage(getLang("error", "Download failed baby! 🥺"), threadID, messageID);
        }
}

async function fetchInfo(api, threadID, messageID, videoID, apiUrl, getLang) {
        try {
                const res = await axios.get(`${apiUrl}/api/ytb/details?id=${videoID}`);
                const d = res.data.details;
                const msg = getLang("info", 
                        d.title, d.channel, d.subCount || 'N/A', d.duration_raw || d.duration, 
                        d.view_count, d.like_count || 'N/A', d.upload_date || 'N/A', videoID, d.webpage_url
                );

                const thumbPath = path.join(__dirname, 'cache', `info_${videoID}.jpg`);
                const thumbRes = await axios.get(d.thumbnail, { responseType: 'arraybuffer' });
                fs.writeFileSync(thumbPath, Buffer.from(thumbRes.data));
                
                api.sendMessage({ body: msg, attachment: fs.createReadStream(thumbPath) }, 
                        threadID, () => { 
                                api.setMessageReaction("✅", messageID, () => {}, true);
                                if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath); 
                        }, messageID);
        } catch (e) {
                api.sendMessage(getLang("error", "Could not find details."), threadID, messageID);
        }
                    }
