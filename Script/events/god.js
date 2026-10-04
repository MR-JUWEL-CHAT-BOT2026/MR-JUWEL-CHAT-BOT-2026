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
    version: "4.0.1",
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "👑 GOD Event Logger — Premium UI Edition",
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
 *  🎨 PREMIUM UI CONSTANTS
 * ============================================================ */
const UI = {
    // Fancy borders
    topBorder:    "╔══════════════════════════╗",
    midBorder:    "╠══════════════════════════╣",
    botBorder:    "╚══════════════════════════╝",
    line:         "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    thin:         "─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─",
    dot:          "•",

    // Arrows
    arrow:        "➤",
    arrow2:       "▸",
    arrow3:       "›",

    // Icons
    star:         "⭐",
    fire:         "🔥",
    crown:        "👑",
    shield:       "🛡️",
    wave:         "🌊",
    sparkle:      "✨",
    sparkles:     "💫",
    bot:          "🤖",
    group:        "👥",
    clock:        "🕐",
    warn:         "⚠️",
    info:         "ℹ️",
    check:        "✅",
    cross:        "❌",
    diamond:      "💎",
    heart:        "💖",
    rocket:       "🚀",
    globe:        "🌐",
    pin:          "📍",
    tag:          "🏷️",
    user:         "👤",
    id:           "🆔",
    time:         "⏰",
    ram:          "💾",
    uptime:       "📊"
};

/* ============================================================
 *  🧠 UTILS
 * ============================================================ */
const cooldown = new Map();

function dhakaTime() {
    return new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
        hour12: true,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }) + " (BD)";
}

function uptime() {
    const u = process.uptime();
    const d = Math.floor(u / 86400);
    const h = Math.floor((u % 86400) / 3600);
    const m = Math.floor((u % 3600) / 60);
    const s = Math.floor(u % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

function ram() {
    return (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB";
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
        return info.threadName || info.name || "Unknown Group";
    } catch {
        return "Unknown Group";
    }
}

/* ============================================================
 *  👑 BOT ADMINS
 * ============================================================ */
function getBotAdmins() {
    if (global.config && Array.isArray(global.config.ADMINBOT)) {
        return global.config.ADMINBOT.map(String);
    }
    if (global.config && Array.isArray(global.config.adminBot)) {
        return global.config.adminBot.map(String);
    }
    if (global.config && Array.isArray(global.config.admins)) {
        return global.config.admins.map(String);
    }
    return [];
}

/* ============================================================
 *  👥 GROUP ADMINS
 * ============================================================ */
async function getGroupAdmins(api, threadID) {
    try {
        const info = await api.getThreadInfo(threadID);
        const adminIDs = info.adminIDs || [];
        return adminIDs.map(a => String(a.id));
    } catch {
        return [];
    }
}

/* ============================================================
 *  🎨 PREMIUM UI BUILDERS
 * ============================================================ */

function fancyHeader(title) {
    return (
        `${UI.topBorder}\n` +
        `║   ${UI.sparkle}  ${UI.crown}  ${title}  ${UI.crown}  ${UI.sparkle}\n` +
        `${UI.midBorder}`
    );
}

function fancyFooter() {
    return (
        `${UI.midBorder}\n` +
        `║  ${UI.bot}  Powered by 乛 M𝆠፝֟R JU𝆠፝֟W𝆠፝֟EL\n` +
        `║  ${UI.fire}  Version 4.0.1  |  ${UI.diamond} Premium\n` +
        `${UI.botBorder}`
    );
}

function infoBlock(rows) {
    return rows
        .map((r, i) => {
            const prefix = i === 0 ? "┌" : (i === rows.length - 1 ? "└" : "├");
            return `  ${prefix} ${UI.arrow2} ${r.label} ${UI.arrow3} ${r.value}`;
        })
        .join("\n");
}

function extraBlock(lines) {
    return lines
        .map((l, i) => {
            const prefix = i === 0 ? "┌" : (i === lines.length - 1 ? "└" : "├");
            return `  ${prefix} ${l}`;
        })
        .join("\n");
}

function statusBar() {
    return (
        `  ${UI.time} Time    ${UI.arrow3} ${dhakaTime()}\n` +
        `  ${UI.uptime} Uptime  ${UI.arrow3} ${uptime()}\n` +
        `  ${UI.ram} RAM     ${UI.arrow3} ${ram()}`
    );
}

/* ============================================================
 *  🚀 MAIN RUNNER
 * ============================================================ */
module.exports.run = async function ({ api, event, Threads }) {
    const cfg = global.configModule?.[this.config.name] || this.config.envConfig;
    if (!cfg.enable) return;

    // 🛡️ Rate limit
    const limit = cfg.rateLimit || 3000;
    if (cooldown.has(event.threadID)) {
        if (Date.now() - cooldown.get(event.threadID) < limit) return;
    }
    cooldown.set(event.threadID, Date.now());

    let task = "";
    let icon = UI.info;
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
                task = `Group name has been updated`;
                extra.push(
                    `${UI.arrow2} Old ${UI.arrow3} ${oldName}`,
                    `${UI.arrow2} New ${UI.arrow3} ${newName}`
                );
                await Threads.setData(event.threadID, { name: newName });
                break;
            }

            case "log:thread-icon": {
                icon = "🖼️";
                tag  = "GROUP ICON";
                task = `Group icon has been changed`;
                break;
            }

            case "log:thread-color": {
                icon = "🎨";
                tag  = "THEME COLOR";
                task = `Group theme color changed`;
                break;
            }

            case "log:thread-emoji": {
                icon = "😀";
                tag  = "EMOJI";
                task = `Group emoji changed`;
                break;
            }

            /* ---------------- NICKNAME ---------------- */
            case "log:user-nickname": {
                const uid = event.logMessageData.participant_id;
                const name = await safeName(api, uid);
                icon = "🏷️";
                tag  = "NICKNAME";
                task = `A member's nickname was updated`;
                extra.push(
                    `${UI.user} User ${UI.arrow3} ${name}`,
                    `${UI.tag} Nick ${UI.arrow3} ${event.logMessageData.nickname || "(cleared)"}`
                );
                break;
            }

            /* ---------------- ADMINS ---------------- */
            case "log:thread-admins": {
                const uid = event.logMessageData.TARGET_ID;
                const name = await safeName(api, uid);
                const action = event.logMessageData.ADMIN_EVENT;
                icon = action === "add_admin" ? "👑" : "🚫";
                tag  = action === "add_admin" ? "ADMIN PROMOTED" : "ADMIN DEMOTED";
                task = action === "add_admin"
                    ? `New admin has been appointed`
                    : `Admin privileges removed`;
                extra.push(`${UI.user} User ${UI.arrow3} ${name}`);
                break;
            }

            case "log:thread-approval-mode": {
                icon = "🔐";
                tag  = "APPROVAL MODE";
                task = `Approval mode changed to ${event.logMessageData.APPROVAL_MODE}`;
                break;
            }

            case "log:thread-call": {
                const started = event.logMessageData.event === "group_call_started";
                icon = "📞";
                tag  = started ? "CALL STARTED" : "CALL ENDED";
                task = started ? `Group call started` : `Group call ended`;
                break;
            }

            case "log:message-unsend": {
                icon = "🗑️";
                tag  = "MESSAGE DELETED";
                task = `A message was deleted`;
                break;
            }

            case "log:message-edit": {
                icon = "✏️";
                tag  = "MESSAGE EDITED";
                task = `A message was edited`;
                break;
            }

            /* ---------------- SUBSCRIBE ---------------- */
            case "log:subscribe": {
                const added = event.logMessageData.addedParticipants || [];
                const botAdded = added.some(i => i.userFbId == api.getCurrentUserID());

                if (botAdded) {
                    icon = "🤖";
                    tag  = "BOT ADDED";
                    task = `Bot was added to a new group!`;
                } else {
                    icon = "🎉";
                    tag  = "NEW MEMBER";
                    const names = added.map(u => u.fullName).join(", ");
                    task = `New member joined the group`;
                    extra.push(`${UI.user} Member ${UI.arrow3} ${names}`);
                    // ❌ Welcome মেসেজ বাদ দেওয়া হয়েছে
                }
                break;
            }

            /* ---------------- UNSUBSCRIBE ---------------- */
            case "log:unsubscribe": {
                const leftId = event.logMessageData.leftParticipantFbId;
                const botLeft = leftId == api.getCurrentUserID();

                if (botLeft) {
                    icon = "💀";
                    tag  = "BOT REMOVED";
                    task = `Bot was kicked from group!`;
                } else {
                    icon = "👋";
                    tag  = "MEMBER LEFT";
                    const name = await safeName(api, leftId);
                    task = `A member left the group`;
                    extra.push(`${UI.user} Member ${UI.arrow3} ${name}`);
                }
                break;
            }

            default: return;
        }

        if (!task) return;

        /* ---------- BUILD FINAL REPORT ---------- */
        const threadName = await getThreadName(api, event.threadID);
        const authorName = await safeName(api, event.author);

        const report =
            `${fancyHeader("GOD EVENT LOGGER")}\n` +
            `║\n` +
            `║  ${icon}  ${UI.crown} ${tag} ${UI.crown}\n` +
            `║  ${UI.arrow2} ${task}\n` +
            `║\n` +
            `${UI.midBorder}\n` +
            `║  ${UI.pin} EVENT DETAILS\n` +
            `║\n` +
            infoBlock([
                { label: `${UI.group} Group `, value: threadName },
                { label: `${UI.id} Thread`, value: event.threadID },
                { label: `${UI.user} By   `, value: authorName },
                { label: `${UI.id} UID  `, value: event.author }
            ]) + "\n" +
            (extra.length
                ? `║\n${UI.midBorder}\n║  ${UI.sparkles} ADDITIONAL INFO\n║\n` +
                  extraBlock(extra) + "\n"
                : "") +
            `║\n${UI.midBorder}\n` +
            `║  ${UI.clock} SYSTEM STATUS\n` +
            `║\n` +
            statusBar().split("\n").map(l => `║${l.slice(1)}`).join("\n") + "\n" +
            `║\n` +
            `${fancyFooter()}`;

        /* ============================================================
         *  📤 BUILD RECEIVER LIST
         * ============================================================ */
        const receivers = new Set();

        if (cfg.forwardToBotAdmins) {
            getBotAdmins().forEach(id => receivers.add(String(id)));
        }

        if (cfg.forwardToGroupAdmins) {
            const gAdmins = await getGroupAdmins(api, event.threadID);
            gAdmins.forEach(id => receivers.add(String(id)));
        }

        const botID = String(api.getCurrentUserID());
        receivers.delete(botID);

        /* ---------- SEND to all receivers ---------- */
        const sendList = [...receivers];
        if (sendList.length === 0) {
            logger("No receivers found — check config.ADMINBOT", "[ god ]");
        }

        for (const uid of sendList) {
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
