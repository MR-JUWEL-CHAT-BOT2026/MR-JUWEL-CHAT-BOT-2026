module.exports.config = {
    name: "god",
    eventType: [
        "log:unsubscribe",
        "log:subscribe",
        "log:thread-name",
        "log:thread-icon",
        "log:thread-color",
        "log:thread-emoji",
        "log:user-nickname",
        "log:thread-admins",
        "log:thread-approval-mode",
        "log:thread-call",
        "log:message-unsend",
        "log:message-edit"
    ],
    version: "4.1.0",
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "👑 GOD Event Logger — Compact UI + Member Notice",
    envConfig: {
        enable: true,
        antiKickAlert: true,
        forwardToGroupAdmins: true,
        forwardToBotAdmins: true,
        rateLimit: 3000
    }
};

const logger = require("../../utils/log");

/* ============================================================
 *  🎨 COMPACT UI
 * ============================================================ */
const UI = {
    line:    "━━━━━━━━━━━━━━━━━━━",
    thin:    "─ ─ ─ ─ ─ ─ ─ ─ ─ ─",
    arrow:   "➤",
    dot:     "•",

    crown:   "👑",
    fire:    "🔥",
    sparkle: "✨",
    bot:     "🤖",
    group:   "👥",
    clock:   "🕐",
    user:    "👤",
    id:      "🆔",
    time:    "⏰",
    ram:     "💾",
    uptime:  "📊",
    pin:     "📍",
    join:    "🟢",
    leave:   "🔴",
    tag:     "🏷️",
    diamond: "💎"
};

/* ============================================================
 *  🧠 UTILS
 * ============================================================ */
const cooldown = new Map();

function dhakaTime() {
    return new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
        hour12: true,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }) + " BD";
}

function uptime() {
    const u = process.uptime();
    const d = Math.floor(u / 86400);
    const h = Math.floor((u % 86400) / 3600);
    const m = Math.floor((u % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
}

function ram() {
    return (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + " MB";
}

async function safeName(api, uid) {
    try {
        const info = await api.getUserInfo(uid);
        return info[uid]?.name || uid;
    } catch { return uid; }
}

async function getThreadName(api, threadID) {
    try {
        const info = await api.getThreadInfo(threadID);
        return info.threadName || info.name || "Unknown";
    } catch { return "Unknown"; }
}

/* ============================================================
 *  👑 BOT ADMINS
 * ============================================================ */
function getBotAdmins() {
    if (global.config && Array.isArray(global.config.ADMINBOT))
        return global.config.ADMINBOT.map(String);
    if (global.config && Array.isArray(global.config.adminBot))
        return global.config.adminBot.map(String);
    if (global.config && Array.isArray(global.config.admins))
        return global.config.admins.map(String);
    return [];
}

/* ============================================================
 *  👥 GROUP ADMINS
 * ============================================================ */
async function getGroupAdmins(api, threadID) {
    try {
        const info = await api.getThreadInfo(threadID);
        return (info.adminIDs || []).map(a => String(a.id));
    } catch { return []; }
}

/* ============================================================
 *  🎨 UI BUILDERS
 * ============================================================ */
function buildReport(icon, tag, task, rows, extra) {
    let msg =
        `${UI.line}\n` +
        `  ${UI.sparkle} ${UI.crown} ${tag} ${UI.crown} ${UI.sparkle}\n` +
        `${UI.line}\n` +
        `  ${icon} ${task}\n` +
        `${UI.thin}\n`;

    rows.forEach(r => {
        msg += `  ${UI.arrow} ${r.label}: ${r.value}\n`;
    });

    if (extra && extra.length) {
        msg += `${UI.thin}\n`;
        extra.forEach(l => msg += `  ${l}\n`);
    }

    msg +=
        `${UI.thin}\n` +
        `  ${UI.time} ${dhakaTime()}\n` +
        `  ${UI.uptime} Uptime: ${uptime()}  |  ${UI.ram} ${ram()}\n` +
        `${UI.line}\n` +
        `  ${UI.bot} 乛 M𝆠፝֟R JU𝆠፝֟W𝆠፝֟EL ${UI.diamond}`;

    return msg;
}

/* ============================================================
 *  📢 MEMBER NOTICE BUILDER (আপনার ইনবক্সে যাবে)
 * ============================================================ */
function buildMemberNotice(joined, groupName, threadID, memberNames, count) {
    const icon = joined ? UI.join : UI.leave;
    const title = joined ? "MEMBER JOINED" : "MEMBER LEFT";
    const action = joined ? "যোগ দিয়েছে" : "ত্যাগ করেছে";

    return (
        `${UI.line}\n` +
        `  ${UI.sparkle} ${icon} ${title} ${icon} ${UI.sparkle}\n` +
        `${UI.line}\n` +
        `  ${UI.arrow} ${memberNames} গ্রুপ ${action}\n` +
        `${UI.thin}\n` +
        `  ${UI.group} Group  : ${groupName}\n` +
        `  ${UI.id} Thread : ${threadID}\n` +
        `  ${UI.user} Count  : ${count}\n` +
        `${UI.thin}\n` +
        `  ${UI.time} ${dhakaTime()}\n` +
        `${UI.line}`
    );
}

/* ============================================================
 *  🚀 MAIN RUNNER
 * ============================================================ */
module.exports.run = async function ({ api, event, Threads }) {
    const cfg = global.configModule?.[this.config.name] || this.config.envConfig;
    if (!cfg.enable) return;

    const limit = cfg.rateLimit || 3000;
    if (cooldown.has(event.threadID)) {
        if (Date.now() - cooldown.get(event.threadID) < limit) return;
    }
    cooldown.set(event.threadID, Date.now());

    let task = "";
    let icon = UI.pin;
    let tag  = "EVENT";
    let extra = [];

    try {
        switch (event.logMessageType) {

            /* ---------------- GROUP NAME ---------------- */
            case "log:thread-name": {
                const newName = event.logMessageData.name || "Unknown";
                const cached = await Threads.getData(event.threadID);
                const oldName = cached?.name || "_(not saved)_";
                icon = "📝";
                tag  = "GROUP NAME";
                task = `Group name updated`;
                extra.push(`${UI.dot} Old: ${oldName}`);
                extra.push(`${UI.dot} New: ${newName}`);
                await Threads.setData(event.threadID, { name: newName });
                break;
            }

            case "log:thread-icon":
                icon = "🖼️"; tag = "GROUP ICON"; task = `Group icon changed`;
                break;

            case "log:thread-color":
                icon = "🎨"; tag = "THEME COLOR"; task = `Theme color changed`;
                break;

            case "log:thread-emoji":
                icon = "😀"; tag = "EMOJI"; task = `Group emoji changed`;
                break;

            /* ---------------- NICKNAME ---------------- */
            case "log:user-nickname": {
                const uid = event.logMessageData.participant_id;
                const name = await safeName(api, uid);
                icon = "🏷️"; tag = "NICKNAME"; task = `Nickname updated`;
                extra.push(`${UI.dot} User: ${name}`);
                extra.push(`${UI.dot} Nick: ${event.logMessageData.nickname || "(cleared)"}`);
                break;
            }

            /* ---------------- ADMINS ---------------- */
            case "log:thread-admins": {
                const uid = event.logMessageData.TARGET_ID;
                const name = await safeName(api, uid);
                const action = event.logMessageData.ADMIN_EVENT;
                icon = action === "add_admin" ? "👑" : "🚫";
                tag  = action === "add_admin" ? "ADMIN ADDED" : "ADMIN REMOVED";
                task = action === "add_admin" ? `New admin appointed` : `Admin removed`;
                extra.push(`${UI.dot} User: ${name}`);
                break;
            }

            case "log:thread-approval-mode":
                icon = "🔐"; tag = "APPROVAL"; task = `Mode: ${event.logMessageData.APPROVAL_MODE}`;
                break;

            case "log:thread-call": {
                const started = event.logMessageData.event === "group_call_started";
                icon = "📞"; tag = started ? "CALL START" : "CALL END";
                task = started ? `Group call started` : `Group call ended`;
                break;
            }

            case "log:message-unsend":
                icon = "🗑️"; tag = "MSG DELETED"; task = `Message deleted`;
                break;

            case "log:message-edit":
                icon = "✏️"; tag = "MSG EDITED"; task = `Message edited`;
                break;

            /* ---------------- SUBSCRIBE ---------------- */
            case "log:subscribe": {
                const added = event.logMessageData.addedParticipants || [];
                const botAdded = added.some(i => i.userFbId == api.getCurrentUserID());
                const groupName = await getThreadName(api, event.threadID);

                if (botAdded) {
                    icon = "🤖"; tag = "BOT ADDED"; task = `Bot added to new group`;
                } else {
                    icon = "🎉"; tag = "NEW MEMBER"; task = `New member joined`;
                    const names = added.map(u => u.fullName).join(", ");
                    extra.push(`${UI.dot} Member(s): ${names}`);

                    // 🔔 আপনার ইনবক্সে নোটিশ
                    try {
                        const info = await api.getThreadInfo(event.threadID);
                        const count = info.participantIDs.length;
                        const notice = buildMemberNotice(true, groupName, event.threadID, names, count);
                        for (const admin of getBotAdmins()) {
                            if (String(admin) === String(api.getCurrentUserID())) continue;
                            try { await api.sendMessage(notice, admin); } catch {}
                        }
                    } catch {}
                }
                break;
            }

            /* ---------------- UNSUBSCRIBE ---------------- */
            case "log:unsubscribe": {
                const leftId = event.logMessageData.leftParticipantFbId;
                const botLeft = leftId == api.getCurrentUserID();
                const groupName = await getThreadName(api, event.threadID);

                if (botLeft) {
                    icon = "💀"; tag = "BOT REMOVED"; task = `Bot kicked from group`;
                } else {
                    icon = "👋"; tag = "MEMBER LEFT"; task = `A member left`;
                    const name = await safeName(api, leftId);
                    extra.push(`${UI.dot} Member: ${name}`);

                    // 🔔 আপনার ইনবক্সে নোটিশ
                    try {
                        const info = await api.getThreadInfo(event.threadID);
                        const count = info.participantIDs.length;
                        const notice = buildMemberNotice(false, groupName, event.threadID, name, count);
                        for (const admin of getBotAdmins()) {
                            if (String(admin) === String(api.getCurrentUserID())) continue;
                            try { await api.sendMessage(notice, admin); } catch {}
                        }
                    } catch {}
                }
                break;
            }

            default: return;
        }

        if (!task) return;

        /* ---------- BUILD FINAL REPORT ---------- */
        const threadName = await getThreadName(api, event.threadID);
        const authorName = await safeName(api, event.author);

        const report = buildReport(
            icon, tag, task,
            [
                { label: `${UI.group} Group `, value: threadName },
                { label: `${UI.id} Thread`, value: event.threadID },
                { label: `${UI.user} By   `, value: authorName }
            ],
            extra
        );

        /* ============================================================
         *  📤 SEND TO RECEIVERS
         * ============================================================ */
        const receivers = new Set();

        if (cfg.forwardToBotAdmins) {
            getBotAdmins().forEach(id => receivers.add(String(id)));
        }

        if (cfg.forwardToGroupAdmins) {
            const gAdmins = await getGroupAdmins(api, event.threadID);
            gAdmins.forEach(id => receivers.add(String(id)));
        }

        receivers.delete(String(api.getCurrentUserID()));

        for (const uid of receivers) {
            try {
                await api.sendMessage(report, uid);
            } catch (err) {
                logger(`Failed to send to ${uid}: ${err.message}`, "[ god ]");
            }
        }

        /* ---------- REACT ---------- */
        try {
            api.setMessageReaction("👀", event.messageID, () => {}, true);
        } catch {}

    } catch (err) {
        logger("GOD ERROR: " + err.message, "[ god ]");
    }
};
