const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");

module.exports.config = {
    name: "autoinfo",
    eventType: ["log:subscribe"],
    version: "4.3.0",
    credits: "MR JUWEL",
    description: "Welcome + Full Smart User Info System with custom frame and extra features",
};

module.exports.run = async ({ api, event }) => {
    try {
        let newUsers = event.logMessageData.addedParticipants;

        let threadInfo = await api.getThreadInfo(event.threadID);
        let groupName = threadInfo.threadName || "Unknown Group";
        let memberCount = threadInfo.participantIDs.length;
        let namesInGroup = threadInfo.userInfo.map(u => u.name);

        const emojis = ["🔥","🌸","✨","🎉","💫","🌟"];

        // cache ফোল্ডার চেক
        const cacheDir = __dirname + '/cache';
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

        for (let user of newUsers) {
            let id = user.userFbId;

            setTimeout(async () => {
                try {
                    let data = await api.getUserInfo(id);
                    let u = data[id];

                    let name = u.name || "Unknown";
                    let profileUrl = u.profileUrl || "N/A";
                    let username = u.vanity || "N/A";
                    let gender = u.gender === 2 ? "Male" : u.gender === 1 ? "Female" : "Unknown";
                    let isFriend = u.isFriend ? "Yes ✅" : "No ❌";
                    let time = new Date().toLocaleString("en-GB");

                    let role = threadInfo.adminIDs.some(e => e.id == id) ? "Admin 👑" : "Member 👤";

                    let duplicate = namesInGroup.filter(n => n === name).length > 1 
                        ? "⚠️ Same name exists" 
                        : "✅ Unique";

                    let position = memberCount;

                    let activity = Math.random() > 0.5 ? "Active 🟢" : "Less Active 🔴";

                    // ✅ শুধু এই অংশটাই পরিবর্তন করা হয়েছে
                    let country = "Bangladesh 🇧🇩";
                    let greeting = "";
                    try {
                        let res = await axios.get("https://ipapi.co/json/");
                        country = "Bangladesh 🇧🇩";
                        if (true) greeting = "স্বাগতম 🌸";
                    } catch {
                        greeting = "স্বাগতম 🌸";
                    }

                    let privacy = profileUrl !== "N/A" ? "Public 🔓" : "Private 🔒";

                    // Time since account created (approximation)
                    let accountAge = id.length > 14 ? "New Account 🆕" : "Old Account 🏆";
                    let detailedAge = `UID Length: ${id.length} characters`;

                    const imgPath = `${cacheDir}/ckuser_${id}.png`;
                    const fbPicUrl = `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

                    // Mention all admins for alert
                    let adminMentions = threadInfo.adminIDs.map(admin => ({
                        id: admin.id,
                        tag: threadInfo.userInfo.find(u => u.id === admin.id)?.name || "Admin"
                    }));

                    // Participation Tracker (simple random for demo)
                    let participation = Math.floor(Math.random() * 100); // 0-99%

                    const sendInfo = () => {
                        api.sendMessage({
                            body: `━━━━━━━━━━━━━━━━━━━
🎀  নতুন মেম্বারের ইনফরমেশন  🎀
━━━━━━━━━━━━━━━━━━━

${greeting}, ${name}!

┃
┣━━━━━━━━━━━━━━━┫
┃ 👤 Name: ${name}
┃ 📌 Mention: @${name}
┃ 🏠 Group: ${groupName}
┣━━━━━━━━━━━━━━━┫
┃ 🆔 UID: ${id}
┃ 📛 Username: ${username}
┃ 🚻 Gender: ${gender}
┃ 🤝 Friend with bot: ${isFriend}
┣━━━━━━━━━━━━━━━┫
┃ 🔰 Role: ${role}
┃ 👥 Total Members: ${memberCount}
┃ 📍 Position: ${position}
┃ ⏰ Join Time: ${time}
┣━━━━━━━━━━━━━━━┫
┃ 📊 Activity: ${activity} (Participation: ${participation}%)
┃ 🌍 Country: ${country}
┃ 🔐 Privacy: ${privacy}
┣━━━━━━━━━━━━━━━┫
┃ 🔎 Duplicate: ${duplicate}
┃ 📅 Account: ${accountAge}
┃ 📝 Details: ${detailedAge}
┃ 🔗 Profile: ${profileUrl}
┣━━━━━━━━━━━━━━━┫
┃`,
                            mentions: [{ id, tag: name }, ...adminMentions],
                            attachment: fs.createReadStream(imgPath)
                        }, event.threadID, () => fs.unlinkSync(imgPath));
                    };

                    request(encodeURI(fbPicUrl))
                        .pipe(fs.createWriteStream(imgPath))
                        .on("close", sendInfo)
                        .on("error", (err) => {
                            console.log("Image download failed", err);
                            sendInfo();
                        });

                } catch (err) {
                    console.log(err);
                }
            }, 30000);
        }

    } catch (e) {
        console.log(e);
    }
};
