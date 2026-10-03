const BOSS     = "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐";
const BOX_TOP  = "╔══════════════════════════════╗";
const BOX_MID  = "╠══════════════════════════════╣";
const BOX_BOT  = "╚══════════════════════════════╝";
const LINE     = "┃";
const THIN     = "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄";

// ================= TIME HELPERS =================

function msToHuman(ms) {
    if (ms <= 0) return "০ সেকেন্ড";
    const totalSec = Math.round(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const parts = [];
    if (h > 0) parts.push(`${h} ঘন্টা`);
    if (m > 0) parts.push(`${m} মিনিট`);
    if (s > 0 && h === 0) parts.push(`${s} সেকেন্ড`);
    return parts.join(" ");
}

function clockStr(ts) {
    const d = new Date(ts);
    const bdTime = new Date(d.getTime() + (6 * 60 * 60 * 1000));
    const hh = String(bdTime.getUTCHours()).padStart(2, "0");
    const mm = String(bdTime.getUTCMinutes()).padStart(2, "0");
    const ss = String(bdTime.getUTCSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}

function unlockLine(endsAt) {
    if (!endsAt) return `${LINE} 🔒 পার্মানেন্ট লক করা আছে`;
    const rem = msToHuman(endsAt - Date.now());
    return `${LINE} ⏳ আর ${rem} পরে আনলক হবে\n` +
           `${LINE} 🕐 আনলক সময় (বাংলাদেশ): ${clockStr(endsAt)}`;
}

// ================= NOTICE BUILDERS =================

function buildTextOffNotice(endsAt, permanent) {
    const timeLine = permanent
        ? `${LINE} 🔒 পার্মানেন্ট টেক্সট অফ করা হয়েছে`
        : unlockLine(endsAt);

    return `${BOX_TOP}\n` +
`${LINE} 🔇 গ্রুপ টেক্সট অফ নোটিশ 🔇\n` +
`${BOX_MID}\n` +
`${LINE}\n` +
`${LINE} 👑 @everyone\n` +
`${LINE} ${BOSS}\n` +
`${LINE} এই গ্রুপের টেক্সট অফ করে দিছে!\n` +
`${BOX_MID}\n` +
`${LINE} ❌ নিষিদ্ধ:\n` +
`${LINE} • টেক্সট মেসেজ\n` +
`${LINE} • ইমোজি / স্টিকার\n` +
`${LINE} • ফটো / ভিডিও\n` +
`${LINE} • লিংক / ফাইল\n` +
`${LINE}\n` +
`${LINE} ⚠️ শুধুমাত্র গ্রুপ অ্যাডমিন ও বট অ্যাডমিন মেসেজ করতে পারবেন\n` +
`${LINE}    অন্য কেউ মেসেজ করলে সতর্ক করা হবে!\n` +
`${BOX_MID}\n` +
`${timeLine}\n` +
`${BOX_BOT}\n` +
`${THIN}\n` +
`🤖 Bot by ${BOSS}`;
}

function buildWarnNotice(uname, durationStr, endsAt) {
    const timeLine = endsAt
        ? `${LINE} ⏳ আর ${msToHuman(endsAt - Date.now())} বাকি আছে`
        : `${LINE} 🔒 পার্মানেন্ট চলছে`;

    return `${BOX_TOP}\n` +
`${LINE} ⚠️ সতর্কতা ⚠️\n` +
`${BOX_MID}\n` +
`${LINE}\n` +
`${LINE} 👤 @${uname}\n` +
`${LINE} ${BOSS}\n` +
`${LINE} ${durationStr} এর জন্য টেক্সট অফ আছে!\n` +
`${BOX_MID}\n` +
`${timeLine}\n` +
`${LINE}\n` +
`${LINE} 📌 আপনার মেসেজ ডিলিট করুন (টাইপ করুন: ডিলিট)\n` +
`${LINE} ⏳ ১৫ সেকেন্ড সময় পাচ্ছেন!\n` +
`${LINE} ❌ না করলে কিক হবে!\n` +
`${BOX_BOT}\n` +
`${THIN}\n` +
`🤖 Bot by ${BOSS}`;
}

function buildKickNotice(uname, durationStr) {
    return `${BOX_TOP}\n` +
`${LINE} 🥾 কিক নোটিশ 🥾\n` +
`${BOX_MID}\n` +
`${LINE}\n` +
`${LINE} 👤 @${uname}\n` +
`${LINE} ${BOSS}\n` +
`${LINE} ${durationStr} এর জন্য টেক্সট অফ চলছে\n` +
`${LINE} মেসেজ ডিলিট না করায় কিক করা হয়েছে!\n` +
`${BOX_BOT}\n` +
`${THIN}\n` +
`🤖 Bot by ${BOSS}`;
}

function buildNoAdminNotice(uname) {
    return `${BOX_TOP}\n` +
`${LINE} ℹ️ বট নোটিশ ℹ️\n` +
`${BOX_MID}\n` +
`${LINE}\n` +
`${LINE} 😔 আমি এডমিন না!\n` +
`${LINE} তাই @${uname} কে কিক দিতে পারলাম না\n` +
`${BOX_BOT}\n` +
`${THIN}\n` +
`🤖 Bot by ${BOSS}`;
}

function buildTextOnNotice() {
    return `${BOX_TOP}\n` +
`${LINE} ✅ টেক্সট আনলক নোটিশ ✅\n` +
`${BOX_MID}\n` +
`${LINE}\n` +
`${LINE} 🎉 @everyone\n` +
`${LINE} এখন সবাই মেসেজ করতে পারবে\n` +
`${BOX_BOT}\n` +
`${THIN}\n` +
`🤖 Bot by ${BOSS}`;
}

function buildNotBotAdminNotice() {
    return `${BOX_TOP}\n` +
`${LINE} ⛔ অ্যাক্সেস নেই ⛔\n` +
`${BOX_MID}\n` +
`${LINE}\n` +
`${LINE} শুধু বট অ্যাডমিন ব্যবহার করতে পারবে\n` +
`${BOX_BOT}\n` +
`${THIN}\n` +
`🤖 Bot by ${BOSS}`;
}

// ================= ARG PARSER =================

function parseTime(args) {
    if (!args[0]) return { perma: true, ms: null, txt: "পার্মানেন্ট" };
    const x = args[0].toLowerCase();
    const m = x.match(/^(\d+)m$/);
    const h = x.match(/^(\d+)h$/);
    if (m) return { perma: false, ms: m[1] * 60000, txt: `${m[1]} মিনিট` };
    if (h) return { perma: false, ms: h[1] * 3600000, txt: `${h[1]} ঘন্টা` };
    return { perma: true, ms: null, txt: "পার্মানেন্ট" };
}

// ================= STORE =================

if (!global.textOff) global.textOff = {};
if (!global.textOffWarn) global.textOffWarn = {};

// ================= MESSAGE EVENT HANDLER =================

async function handleMessageEvent(api, event) {
    const { threadID, senderID, messageID, body } = event;
    if (!global.textOff[threadID] || !global.textOff[threadID].locked) return;

    const state = global.textOff[threadID];
    // সময় শেষ হলে আনলক
    if (state.endTime && Date.now() > state.endTime) {
        // লক নোটিশ ডিলিট
        if (state.noticeMsgId) {
            try { await api.deleteMessage(state.noticeMsgId); } catch (e) {}
        }
        delete global.textOff[threadID];
        // আনলক নোটিশ পাঠান
        const unlockMsg = await api.sendMessage(buildTextOnNotice(), threadID);
        // ১ মিনিট পর আনলক নোটিশ ডিলিট
        setTimeout(async () => {
            try { await api.deleteMessage(unlockMsg.messageID); } catch (e) {}
        }, 60000);
        return;
    }

    // **ছাড়পত্র: গ্রুপ অ্যাডমিন ও বট অ্যাডমিন**
    const threadInfo = await api.getThreadInfo(threadID);
    const groupAdmins = threadInfo.adminIDs.map(i => i.id);
    const botAdmins = global.config?.ADMINBOT || [];
    
    if (groupAdmins.includes(senderID) || botAdmins.includes(senderID)) {
        return; // এরা মেসেজ করতে পারবে
    }

    // যদি এই ইউজারের জন্য আগে থেকে কোনো ওয়ার্নিং সক্রিয় থাকে, তাহলে ইগনোর করি
    if (global.textOffWarn[threadID] && global.textOffWarn[threadID][senderID]) {
        return;
    }

    // ইউজারের মেসেজ ডিলিট
    try { await api.deleteMessage(messageID); } catch (e) {}

    // ওয়ার্নিং মেসেজ তৈরি ও পাঠান
    const durationStr = state.perma ? "পার্মানেন্ট" : msToHuman(state.endTime - Date.now());
    const name = (await api.getUserInfo(senderID))[senderID]?.name || senderID;
    const warnMsg = buildWarnNotice(name, durationStr, state.endTime);
    const sentWarn = await api.sendMessage(warnMsg, threadID);

    // ওয়ার্নিং স্টেট সংরক্ষণ
    if (!global.textOffWarn[threadID]) global.textOffWarn[threadID] = {};
    global.textOffWarn[threadID][senderID] = {
        warnMsgId: sentWarn.messageID,
        userMsgId: messageID,
        timer: setTimeout(async () => {
            // ১৫ সেকেন্ড শেষ – ইউজার ডিলিট করেনি
            const kickMsg = buildKickNotice(name, durationStr);
            try {
                await api.editMessage(kickMsg, sentWarn.messageID);
            } catch (e) {}

            // ২ সেকেন্ড পর কিক
            setTimeout(async () => {
                try {
                    await api.removeUserFromGroup(senderID, threadID);
                } catch (e) {
                    const noAdminMsg = buildNoAdminNotice(senderID);
                    await api.sendMessage(noAdminMsg, threadID);
                }
                delete global.textOffWarn[threadID][senderID];
            }, 2000);

        }, 15000)
    };
}

// ================= COMMAND RUN =================

module.exports = {
    config: {
        name: "textoff",
        version: "4.2.0",
        hasPermssion: 2, // শুধু বট অ্যাডমিন
        credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
        description: "Text Off System with Edit & Delete",
        commandCategory: "group",
        usages: "textoff | textoff 30m | textoff 2h",
        cooldowns: 3
    },

    run: async function({ api, event, args }) {
        const { threadID, senderID } = event;

        const botAdmins = global.config?.ADMINBOT || [];
        if (!botAdmins.includes(senderID)) {
            return api.sendMessage(buildNotBotAdminNotice(), threadID);
        }

        const t = parseTime(args);
        const end = t.perma ? null : Date.now() + t.ms;

        // আগের লক থাকলে তার নোটিশ ডিলিট
        if (global.textOff[threadID] && global.textOff[threadID].noticeMsgId) {
            try { await api.deleteMessage(global.textOff[threadID].noticeMsgId); } catch (e) {}
        }

        const noticeMsg = await api.sendMessage(buildTextOffNotice(end, t.perma), threadID);

        global.textOff[threadID] = {
            locked: true,
            perma: t.perma,
            endTime: end,
            setBy: senderID,
            noticeMsgId: noticeMsg.messageID
        };

        // টাইমড লক – আনলক
        if (!t.perma) {
            setTimeout(async () => {
                try {
                    if (global.textOff[threadID] && global.textOff[threadID].locked) {
                        if (global.textOff[threadID].noticeMsgId) {
                            try { await api.deleteMessage(global.textOff[threadID].noticeMsgId); } catch (e) {}
                        }
                        delete global.textOff[threadID];
                        const unlockMsg = await api.sendMessage(buildTextOnNotice(), threadID);
                        setTimeout(async () => {
                            try { await api.deleteMessage(unlockMsg.messageID); } catch (e) {}
                        }, 60000);
                    }
                } catch (e) {}
            }, t.ms);
        }
    },

    handleEvent: async function({ api, event }) {
        const { threadID, senderID, body } = event;

        // "ডিলিট" কমান্ড হ্যান্ডল
        if (body && body.trim().toLowerCase() === "ডিলিট") {
            if (global.textOffWarn[threadID] && global.textOffWarn[threadID][senderID]) {
                const warnData = global.textOffWarn[threadID][senderID];
                clearTimeout(warnData.timer);
                try { await api.deleteMessage(warnData.warnMsgId); } catch (e) {}
                try { await api.deleteMessage(event.messageID); } catch (e) {}
                delete global.textOffWarn[threadID][senderID];
                return;
            }
        }

        // বাকি মেসেজ হ্যান্ডল
        if (event.type === "message") {
            await handleMessageEvent(api, event);
        }
    }
};
