module.exports.config = {
  name: "supportgc",
  aliases: ["sgc"],
  version: "3.1",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Auto Join Support Group (Bangla UI)",
  commandCategory: "support",
  usages: "supportgc [কারণ]",
  cooldowns: 5
};

const fs = require("fs");
const path = require("path");

module.exports.run = async function ({ api, event }) {
  const supportGroupId = "737267832805258";
  const supportLink = "https://m.me/j/AbZg4gx6-JZtRY6t/?send_source=gc%3Acopy_invite_link_c";

  const userID = event.senderID;
  const threadID = event.threadID;
  const reason = event.body.split(" ").slice(1).join(" ") || "কোনো কারণ দেওয়া হয়নি";

  const logPath = path.join(__dirname, "support_log.json");
  let logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];

  try {
    const userInfo = await api.getUserInfo(userID);
    const userName = userInfo[userID]?.name || "অজানা ইউজার";

    const threadInfo = await api.getThreadInfo(supportGroupId);
    const participantIDs = threadInfo?.participantIDs || [];

    // 🔹 Already Member
    if (participantIDs.includes(userID)) {
      return api.sendMessage(
`╔══════════════════════╗
   📌 সাপোর্ট গ্রুপ
╚══════════════════════╝

👤 ${userName}
⚠️ আপনি আগেই গ্রুপে আছেন

🔗 গ্রুপ লিংক:
${supportLink}`,
        threadID
      );
    }

    // 🔹 Log save
    logs.push({
      uid: userID,
      name: userName,
      reason,
      time: new Date().toLocaleString()
    });
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    // 🔹 Retry system
    let attempts = 0;

    const tryAdd = () => {
      attempts++;

      api.addUserToGroup(userID, supportGroupId, async (err) => {

        if (err && attempts < 3) return tryAdd();

        // ❌ Fail
        if (err) {
          return api.sendMessage(
`╔══════════════════════╗
   ❌ যোগ করা যায়নি
╚══════════════════════╝

👤 ${userName}

⚠️ আপনাকে অটোভাবে গ্রুপে যোগ করা যায়নি

🔒 সম্ভাব্য কারণ:
• Privacy setting ON
• Bot admin নয়
• Messenger restriction

🔗 নিচের লিংকে ক্লিক করে যোগ দিন:
${supportLink}`,
            threadID
          );
        }

        // ✅ Success
        api.sendMessage(
`╔══════════════════════╗
   ✅ সফলভাবে যোগ হয়েছে
╚══════════════════════╝

👤 ${userName}
📝 কারণ: ${reason}

🎉 আপনাকে সাপোর্ট গ্রুপে যোগ করা হয়েছে

🔗 গ্রুপ লিংক:
${supportLink}`,
          threadID
        );

        // 🔹 Notify group
        const notify =
`╔══════════════════════╗
   📥 নতুন সদস্য
╚══════════════════════╝

👤 নাম: ${userName}
🆔 UID: ${userID}
📝 কারণ: ${reason}

⚙️ Status: Pending`;

        api.sendMessage(notify, supportGroupId);

        // 🎉 Welcome message
        setTimeout(() => {
          api.sendMessage(
`╔══════════════════════╗
   🎉 স্বাগতম
╚══════════════════════╝

👋 স্বাগতম ${userName}

📜 নিয়মাবলী:
• স্প্যাম করবেন না
• সম্মান বজায় রাখুন
• এডমিনদের অনুসরণ করুন

🛠️ আপনার সমস্যার সমাধান শীঘ্রই দেয়া হবে

🔗 গ্রুপ লিংক:
${supportLink}`,
            supportGroupId
          );
        }, 3000);
      });
    };

    tryAdd();

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ সমস্যা হয়েছে, পরে আবার চেষ্টা করুন", threadID);
  }
};
