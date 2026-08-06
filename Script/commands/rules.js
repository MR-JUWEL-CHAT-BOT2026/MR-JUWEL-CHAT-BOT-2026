const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "rules_data.json");

// 🔰 LOAD DATA
let lastSent = {};
if (fs.existsSync(dataPath)) {
  lastSent = JSON.parse(fs.readFileSync(dataPath));
}

// 🔰 SAVE DATA
function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(lastSent, null, 2));
}

module.exports.config = {
  name: "rules",
  version: "8.0.0",
  hasPermssion: 0,
  credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
  description: "Auto + Command rules with admin mention (Fixed)",
  commandCategory: "information",
  usages: "rules",
  cooldowns: 5
};

// 🔰 MESSAGE BUILDER
async function buildMessage(api, event, Users) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const threadName = threadInfo.threadName || "Unknown Group";

  const adminIDs = threadInfo.adminIDs || [];

  let adminText = "";
  let mentions = [];

  for (let admin of adminIDs) {
    const name = await Users.getNameUser(admin.id);

    adminText += `➤ ${name}\n`;

    mentions.push({
      tag: name,
      id: admin.id
    });
  }

  const botAdminUID = "61591542717221";
  const botAdminName = await Users.getNameUser(botAdminUID);

  const msg = `
╔══════════════════════╗

😊আসসালামু আলাইকুম আমাদের 🙌🫂

 ${threadName}

 🎀🌷গুপের কিছু রুল্স আছে🫂♻️
╚══════════════════════╝

০১) আজেবাজে খারাপ কথা বলা যাবে না ⚠️  
০২) কাউকে অপমান কিংবা গালাগালি করা যাবে না ⚠️🚫  
০৩) অপ্রয়োজনীয় ট্যাগ / বারবার mention করা যাবে না 🚫  
০৪) SEX নিয়ে কোনো কথা বলা যাবে না ⚠️🚫  
০৫) অশ্লীল ছবি / ভিডিও / মিম দিলে সরাসরি কিক ⚡🚫  
০৬) নিজের ইউটিউব / পেজ লিংক দিয়ে স্প্যাম করলে কিক 🚫  
০৭) অ্যাডমিনদের সম্মান করতে হবে 🛡🌷  
০৮) কোনো ধর্ম বা জাতি নিয়ে কটাক্ষ করা যাবে না 🚫  
০৯) ভুয়া নিউজ / গুজব দিলে রিপোর্ট + ব্লক 🚫  
১০) রাত ১২টার পর শুধু ভদ্র মজা, অশ্লীলতা নয় 🚫  
১১) Meta AI এর সাথে গ্রুপে কথা বলা যাবে না 🚫  
১২) অপরিচিত কাউকে ইনবক্সে ডাকবেন না 🚫  
১৩) অপরিচিত কাউকে ফ্রেন্ড রিকুয়েস্ট দিবেন না 🚫  
১৪) অন্য গ্রুপের লিংক দিলে কিক 🚫  
১৫) আমাদের মেম্বারদের অন্য গ্রুপে এড করবেন না 🚫  
১৬) ৩টার বেশি ইমোজি ব্যবহার করবেন না 🚫  
১৭) গ্রুপের নাম / ফটো চেঞ্জ করলে কিক 🚫  
১৮) বারবার থিম / গ্রুপ ইমোজি চেঞ্জ করলে কিক 🚫  
১৯) ক্যাপশন বা ভিডিও পোস্ট করা যাবে না 🚫  
২০) 18+ কোনো ইমোজি দেওয়া যাবে না 🚫  
২১) আড্ডার সময় বটের সাথে কথা বলা যাবে না 🚫  
২২) গালি দিলে অ্যাডমিনের ইনবক্সে জানাবেন 🚫  
২৩) অন্য গ্রুপের বিষয় আলোচনা করবেন না 🚫  
২৪) গ্রুপ ভালো না লাগলে লিভ নিতে পারবেন 🚫  
২৫) 18+ নিকনেম ব্যবহার করা যাবে না 🚫  
২৬) 18+ নামের আইডি এড করা যাবে না 🚫  
২৭) কাউকে এড করলে তাকে নিয়ম জানাবেন 🚫  
২৮) যারা নিয়ম মানে না তাদের এড করবেন না 🚫  
২৯) কাউকে বিরক্ত করবেন না 🚫  
৩০) অন্যের নিকনেম চেঞ্জ করবেন না 🚫  
৩১) অন্যের নামে নিকনেম দিবেন না 🚫  
৩২) SPAM করবেন না 🚫  
৩৩) সমস্যা হলে অ্যাডমিনকে বলবেন 🚫  
৩৪) গ্রুপে ঝগড়া করবেন না 🚫  
৩৫) সবাই মিলেমিশে আড্ডা দিবেন 🌷😻
╚══════════════════════╝

 👑 BOT ADMIN:
 ${botAdminName}
 🔗 https://www.facebook.com/${botAdminUID}
 
╔══════════════════════╗
👥 GROUP ADMINS:
${adminText}
╚══════════════════════╝
╔══════════════════════╗
     🧾গুপ রুল্স না মানলে 
     ওয়ার্নিং ছারা কিক😒🤌
╚══════════════════════╝
`;

  return { msg, mentions };
};

// 🔰 COMMAND
module.exports.run = async ({ api, event, Users }) => {
  const { msg, mentions } = await buildMessage(api, event, Users);

  return api.sendMessage({
    body: msg,
    mentions: mentions
  }, event.threadID, event.messageID);
};

// 🔰 AUTO SYSTEM (FINAL STRICT TIME FIX)
module.exports.handleEvent = async ({ api, event, Users }) => {
  try {
    if (!event.body) return;

    const now = new Date();

    // 🔥 Bangladesh Time
    const bdTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));

    const hour = bdTime.getHours();
    const minute = bdTime.getMinutes();

    const threadID = event.threadID;
    const today = bdTime.toISOString().slice(0, 10);

    const key = `${threadID}_${today}_rules`;

    // ⏰ শুধু ৪:০০ - ৪:০৫ এর মধ্যে
    if (hour === 16 && minute <= 5 && !lastSent[key]) {

      const { msg, mentions } = await buildMessage(api, event, Users);

      api.sendMessage({
        body: msg,
        mentions: mentions
      }, threadID);

      lastSent[key] = true;
      saveData();
    }

  } catch (e) {
    console.log("RULES AUTO ERROR:", e);
  }
};
