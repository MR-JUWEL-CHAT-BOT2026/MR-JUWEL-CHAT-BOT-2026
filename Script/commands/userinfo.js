const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
 name: "userinfo",
 version: "3.0.0",
 hasPermssion: 0,
 credits: "MR JUWEL",
 description: "Check user information (Ultimate)",
 commandCategory: "Media",
 usages: "[reply | @tag | uid]",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 let id;

 if (!args[0]) {
 if (event.type == "message_reply") id = event.messageReply.senderID;
 else id = event.senderID;
 } 
 else if (Object.keys(event.mentions).length > 0) {
 id = Object.keys(event.mentions)[0];
 } 
 else {
 id = args[0];
 }

 try {
 let data = await api.getUserInfo(id);
 let user = data[id];

 let url = user.profileUrl;
 let isFriend = user.isFriend ? "Yes ✅" : "No ❌";
 let sn = user.vanity || "N/A";
 let name = user.name || "Unknown";
 let sex = user.gender;
 let gender = sex == 2 ? "Male" : sex == 1 ? "Female" : "Unknown";

 let nameType = /^[a-zA-Z ]+$/.test(name) ? "Clean Name ✨" : "Stylish / Mixed 🎭";
 let uidLen = String(id).length;
 let accountAge = uidLen > 10 ? "Old Account (5+ yrs)" : "New Account (<5 yrs)";
 let usernameType = sn == "N/A" ? "No Username ❌" : "Custom Username ✅";
 let riskLevel = (!user.isFriend && sn == "N/A") ? "Medium ⚠️" : "Low 🟢";
 let activityScore = Math.floor(Math.random() * 100);

 let personality =
 activityScore > 70 ? "Very Active 😎" :
 activityScore > 40 ? "Normal 🙂" :
 "Silent 🤫";

 let uidInfo = `Length: ${uidLen} digits`;
 let profileQuality = url ? "High 📷" : "Low ❌";
 let privacyLevel = user.isFriend ? "Open 🔓" : "Limited 🔐";

 let funFact = [
 "Night user 🌙",
 "Silent legend 🤫",
 "Social lover 📱",
 "Unknown user 👤"
 ][Math.floor(Math.random() * 4)];

 let bioAI = `A ${personality.toLowerCase()} Facebook user.`;
 let roast = activityScore < 40 ? "Ghost 👻" : "Legend 🔥";
 let relationship = user.isFriend ? "Known 🤝" : "Stranger 👤";

 let dbPath = __dirname + "/cache/activity.json";
 let activityDB = {};
 if (fs.existsSync(dbPath)) activityDB = JSON.parse(fs.readFileSync(dbPath));
 activityDB[id] = (activityDB[id] || 0) + 1;
 fs.writeFileSync(dbPath, JSON.stringify(activityDB, null, 2));
 let realActivity = activityDB[id];

 let trackPath = __dirname + "/cache/track.json";
 let trackDB = {};
 if (fs.existsSync(trackPath)) trackDB = JSON.parse(fs.readFileSync(trackPath));

 let changeMsg = "No Change";
 if (trackDB[id]) {
 if (trackDB[id].name !== name) changeMsg = "Name Changed 🔄";
 if (trackDB[id].sn !== sn) changeMsg = "Username Updated 🔄";
 }
 trackDB[id] = { name, sn };
 fs.writeFileSync(trackPath, JSON.stringify(trackDB, null, 2));

 let country = "Unknown 🌍";
 let device = Math.random() > 0.5 ? "Mobile 📱" : "Desktop 💻";
 let lastSeen = `${Math.floor(Math.random() * 12)}h ago`;
 let strength = Math.floor((activityScore + (sn != "N/A" ? 20 : 0)) / 1.2);

 // ===== YOUR STYLE FRAME =====
 let msg = `
╔════════════════════╗
 🎀 USER INFO 🎀
╚════════════════════╝

┃ 👤 Name: ${name}
┃ 📌 Mention: @${name}
┃ 🏠 Group: ${event.threadID}

┣━━━━━━━━━━━━━━━┫
┃ 🆔 UID: ${id}
┃ 📛 Username: ${sn}
┃ 🚻 Gender: ${gender}
┃ 🤝 Friend: ${isFriend}

┣━━━━━━━━━━━━━━━┫
┃ 🧬 Name Type: ${nameType}
┃ 📅 Account Age: ${accountAge}
┃ 📛 Username Type: ${usernameType}
┃ 🔐 Privacy: ${privacyLevel}

┣━━━━━━━━━━━━━━━┫
┃ 📊 Activity: ${activityScore}/100
┃ 🧠 Personality: ${personality}
┃ ⚠️ Risk: ${riskLevel}
┃ 📷 Quality: ${profileQuality}

┣━━━━━━━━━━━━━━━┫
┃ 🔢 UID Info: ${uidInfo}
┃ 🤝 Relationship: ${relationship}
┃ 🎯 Fun Fact: ${funFact}
┃ 🔥 Status: ${roast}

┣━━━━━━━━━━━━━━━┫
┃ 📊 Uses: ${realActivity}
┃ 🔄 Changes: ${changeMsg}
┃ 🌍 Country: ${country}
┃ 📱 Device: ${device}

┣━━━━━━━━━━━━━━━┫
┃ ⏱️ Last Seen: ${lastSeen}
┃ 🔋 Strength: ${strength}%
┃ 🧠 Bio: ${bioAI}
┃ 🔗 Profile: ${url}

╚════════════════════╝
`;

 let callback = () => api.sendMessage(
 {
 body: msg,
 attachment: fs.createReadStream(__dirname + "/cache/ckuser.png")
 },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/ckuser.png"),
 event.messageID
 );

 return request(
 encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
 )
 .pipe(fs.createWriteStream(__dirname + "/cache/ckuser.png"))
 .on("close", () => callback());

 } catch (e) {
 return api.sendMessage("⚠️ User info আনতে সমস্যা হচ্ছে!", event.threadID, event.messageID);
 }
};
