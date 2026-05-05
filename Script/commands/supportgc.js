module.exports.config = {
 name: "supportgc",
 version: "1.1",
 credits: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 cooldowns: 5,
 hasPermission: 0,
 description: "Join the official support group chat",
 usePrefix: true,
 commandCategory: "General",
 usage: "supportgc",
};

module.exports.run = async function ({ api, event }) {
 const userId = event.senderID;
 const supportGroupThreadId = "6601227983317461";// Replace with the actual thread ID of the support group, if available.

 try {
 const threadInfo = await api.getThreadInfo(supportGroupThreadId);
 const participantIds = threadInfo.participantIDs;

 if (participantIds.includes(userId)) {
 return api.sendMessage("You are already add to this group\n আপনি ইতিমধ্যেই আমাদের support গ্রুপে যুক্ত আছেন।", event.threadID);
 } else {
 await api.addUserToGroup(userId, supportGroupThreadId);
 return api.sendMessage("You have been added. If you don't get the group, check the message request\n আপনাকে আমাদের সাপোর্ট গ্রুপে যোগ করা হয়েছে। যদি আপনি গ্রুপটি না পান, তাহলে মেসেজ রিকোয়েস্টটি দেখুন।", event.threadID);
 }
 } catch (error) {
 console.error("Error adding user to group:", error);
 return api.sendMessage("You can't be edited. Send me request or message in inbox and check again\n আপনাকে আমাদের সাপোর্ট গ্রুপে যুক্ত করতে ব্যর্থ হয়েছি। আপনি ইনবক্সে আমাকে অনুরোধ বা বার্তা পাঠান এবং আবার চেক করুন।", event.threadID);
 }
};