module.exports.config = {
    name: "listadmin",
    version: "3.2.0",
    hasPermssion: 0,
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "Group & Bot Admin List with Full Features",
    commandCategory: "Box Chat",
    usages: "listadmin [পেজ নম্বর]",
    cooldowns: 5
};

// ───── CACHE SYSTEM ─────
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCache(key) {
    const data = cache.get(key);
    if (!data) return null;
    if (Date.now() - data.time > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    return data.value;
}

function setCache(key, value) {
    cache.set(key, { value, time: Date.now() });
}

// ───── USER NAME FETCH (Facebook নাম) ─────
async function fetchUserName(api, uid) {
    const cached = getCache(`user_${uid}`);
    if (cached) return cached;

    try {
        // প্রথমে getUserInfo দিয়ে চেষ্টা
        const info = await api.getUserInfo(uid);
        const user = info[uid];

        if (user) {
            // Facebook এ যে নামে আছে সেটা নেওয়া
            const name =
                user.name ||
                (user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : null) ||
                user.firstName ||
                user.vanity ||
                "Unknown";

            setCache(`user_${uid}`, name);
            return name;
        }
    } catch {}

    // দ্বিতীয় চেষ্টা: getUserProfile
    try {
        const profile = await api.getUserProfile(uid);
        if (profile) {
            const name =
                profile.name ||
                profile.fullName ||
                (profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`
                    : null) ||
                profile.firstName ||
                "Unknown";

            setCache(`user_${uid}`, name);
            return name;
        }
    } catch {}

    return `Unknown (${uid})`;
}

// ───── PERMISSION CHECK ─────
function isGroupAdmin(userID, adminIDs) {
    return adminIDs.some(ad => ad.id === userID);
}

function isBotAdmin(userID) {
    const botAdmins = global.config?.ADMINBOT || global.config?.adminBot || [];
    return botAdmins.map(String).includes(String(userID));
}

// ───── PAGINATION ─────
function paginate(arr, page, perPage = 5) {
    const total = Math.ceil(arr.length / perPage) || 1;
    const start = (page - 1) * perPage;
    return {
        items: arr.slice(start, start + perPage),
        total,
        current: page
    };
}

// ───── GROUP তৈরির তারিখ ─────
function getCreatedTime(threadInfo) {
    try {
        const raw =
            threadInfo.formed ||
            threadInfo.createdTime ||
            threadInfo.snippet?.timestamp ||
            threadInfo.threadProperties?.formed ||
            threadInfo.timestamp ||
            null;

        if (!raw) return "অজানা";

        const ms = raw * 1000 > 1e12 ? raw : raw * 1000;
        const date = new Date(ms);
        if (isNaN(date.getTime())) return "অজানা";

        return date.toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    } catch {
        return "অজানা";
    }
}

// ───── MAIN RUN ─────
module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const page = parseInt(args?.[0]) || 1;

    let threadInfo;
    try {
        threadInfo = await api.getThreadInfo(threadID);
    } catch {
        return api.sendMessage(
            "❌ গ্রুপের তথ্য লোড করতে সমস্যা হয়েছে!",
            threadID, messageID
        );
    }

    const groupAdmins = threadInfo.adminIDs || [];

    // ───── PERMISSION CHECK ─────
    if (!isGroupAdmin(senderID, groupAdmins) && !isBotAdmin(senderID)) {
        return api.sendMessage(
            "⛔ শুধুমাত্র অ্যাডমিনরা এই কমান্ড ব্যবহার করতে পারবে!",
            threadID, messageID
        );
    }

    // ───── LOADING MESSAGE ─────
    const loadMsg = await api.sendMessage(
        "⏳ Facebook থেকে অ্যাডমিনদের নাম লোড হচ্ছে...",
        threadID
    );

    try {
        // ───── GROUP INFO ─────
        const groupName    = threadInfo.threadName || "Unknown Group";
        const totalMembers = threadInfo.participantIDs?.length || 0;
        const createdTime  = getCreatedTime(threadInfo);
        const groupID      = threadID;

        // ───── BOT ADMINS ─────
        const botAdmins = global.config?.ADMINBOT || global.config?.adminBot || [];

        // ───── সব UID একসাথে Fetch (দ্রুত) ─────
        const allUIDs = [
            ...groupAdmins.map(ad => ad.id),
            ...botAdmins.map(String)
        ];
        const uniqueUIDs = [...new Set(allUIDs)];

        // সব নাম একসাথে লোড
        await Promise.all(uniqueUIDs.map(uid => fetchUserName(api, uid)));

        // ───── GROUP ADMIN LIST ─────
        const groupPaged = paginate(groupAdmins, page);
        const groupList = groupPaged.items.length
            ? (await Promise.all(
                groupPaged.items.map(async (ad, idx) => {
                    const name  = await fetchUserName(api, ad.id);
                    const isBot = isBotAdmin(ad.id);
                    const tag   = isBot ? "\n     ┗👑 বট অ্যাডমিনও" : "";
                    return (
                        `  ${(page - 1) * 5 + idx + 1}. 👤 ${name}` +
                        `\n     ┗🆔 ${ad.id}` +
                        `\n     ┗🔗 fb.com/${ad.id}` +
                        tag
                    );
                })
            )).join("\n\n")
            : "  কোনো গ্রুপ অ্যাডমিন নেই";

        // ───── BOT ADMIN LIST ─────
        const botPaged = paginate(botAdmins, page);
        const botList = botPaged.items.length
            ? (await Promise.all(
                botPaged.items.map(async (uid, idx) => {
                    const name = await fetchUserName(api, String(uid));
                    const isGA = isGroupAdmin(String(uid), groupAdmins);
                    const tag  = isGA ? "\n     ┗🛡️ গ্রুপ অ্যাডমিনও" : "";
                    return (
                        `  ${(page - 1) * 5 + idx + 1}. 🤖 ${name}` +
                        `\n     ┗🆔 ${uid}` +
                        `\n     ┗🔗 fb.com/${uid}` +
                        tag
                    );
                })
            )).join("\n\n")
            : "  কোনো বট অ্যাডমিন নেই";

        // ───── PAGINATION INFO ─────
        const groupPageInfo = groupAdmins.length > 5
            ? `\n\n  📄 পেজ ${groupPaged.current}/${groupPaged.total} | পরের পেজ: listadmin ${page + 1}`
            : "";
        const botPageInfo = botAdmins.length > 5
            ? `\n\n  📄 পেজ ${botPaged.current}/${botPaged.total} | পরের পেজ: listadmin ${page + 1}`
            : "";

        // ───── FINAL MESSAGE ─────
        const msg = `
╔══════════════════════╗
║   👑 অ্যাডমিন প্যানেল v3   ║
╚══════════════════════╝

🏠 গ্রুপ   : ${groupName}
🆔 ID      : ${groupID}
👥 মেম্বার  : ${totalMembers} জন
📅 তারিখ   : ${createdTime}

┌──────────────────────┐
  🛡️ গ্রুপ অ্যাডমিন [${groupAdmins.length} জন]
└──────────────────────┘
${groupList}${groupPageInfo}

┌──────────────────────┐
  ⚙️ বট অ্যাডমিন [${botAdmins.length} জন]
└──────────────────────┘
${botList}${botPageInfo}

🔄 রিফ্রেশ করতে 👍 রিঅ্যাক্ট করুন
✦ ${module.exports.config.credits}`.trim();

        await api.editMessage(msg, loadMsg.messageID);

    } catch (err) {
        console.error("[listadmin error]", err);
        await api.editMessage(
            "❌ লোড করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।",
            loadMsg.messageID
        );
    }
};

// ───── 👍 REACTION = REFRESH ─────
module.exports.handleReaction = async function ({ api, event }) {
    if (event.reaction !== "👍") return;

    return module.exports.run({
        api,
        event: {
            threadID: event.threadID,
            messageID: event.messageID,
            senderID: event.userID
        },
        args: []
    });
};
