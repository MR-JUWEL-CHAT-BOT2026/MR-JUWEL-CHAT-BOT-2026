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
    version: "3.0.0",
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "Advanced bot logger — forwards to Group Admins + Bot Admins (UID from config.json)",
    envConfig: {
        enable: true,
        logToFile: true,
        welcomeMessage: true,
        goodbyeMessage: true,
        antiKickAlert: true,
        forwardToGroupAdmins: true,   // গ্রুপ এডমিনদের ইনবক্সে ফরওয়ার্ড
        forwardToBotAdmins: true,     // বট এডমিনদের ইনবক্সে ফরওয়ার্ড
        rateLimit: 3000
    }
};

const fs = require("fs-extra");
const path = require("path");
const logger = require("../../utils/log");

/* ============================================================
 *  🎨 UI CONSTANTS
 * ============================================================ */
const UI = {
    line: "━━━━━━━━━━━━━━━━━━━━━━",
    thin: "─────────────────────",
    arrow: "➤",
    star: "⭐",
    fire: "🔥",
    crown: "👑",
    shield: "🛡️",
    wave: "🌊",
    sparkle: "✨",
    bot: "🤖",
    group: "👥",
    clock: "🕐",
    warn: "⚠️",
    info: "ℹ️",
    check: "✅",
    cross: "❌"
};

/* ============================================================
 *  🧠 UTILS
 * ============================================================ */
const cooldown = new Map();
const LOG_DIR = path.join(__dirname, "../../logs");
const LOG_FILE = path.join(LOG_DIR, "god-events.json");

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function saveLog(entry) {
    try {
        ensureLogDir();
        let logs = [];
        if (fs.existsSync(LOG_FILE)) logs = fs.readJsonSync(LOG_FILE);
        logs.push({ ...entry, time: Date.now() });
        if (logs.length > 1000) logs = logs.slice(-1000);
        fs.writeJsonSync(LOG_FILE, logs, { spaces: 2 });
    } catch (e) {
        logger("Log save failed: " + e.message, "[ god ]");
    }
}

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

/* ============================================================
 *  👑 BOT ADMINS — from config.json (no hardcoded UID!)
 * ============================================================ */
function getBotAdmins() {
    // আপনার বটের config.json স্ট্রাকচার অনুযায়ী কাজ করবে
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
 *  👥 GROUP ADMINS — from thread info
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
 *  🎨 UI BUILDERS
 * ============================================================ */
function header(title) {
    return (
        `${UI.line}\n` +
        `   ${UI.sparkle} ${UI.crown}  ${title}  ${UI.crown} ${UI.sparkle}\n` +
        `${UI.line}`
    );
}

function footer() {
    return (
        `${UI.line}\n` +
        `   ${UI.bot} Powered by 乛 M𝆠፝֟R JU𝆠፝֟W𝆠፝֟EL ${UI.fire}\n` +
        `${UI.line}`
    );
}

function infoBlock(rows) {
    return rows.map(r => `  ${UI.arrow} ${r.label}: ${r.value}`).join("\n");
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
    let extra = [];

    try {
        switch (event.logMessageType) {

            /* ---------------- GROUP NAME ---------------- */
            case "log:thread-name": {
                const oldName = (await Threads.getData(event.threadID)).name || "Unknown";
                const newName = event.logMessageData.name || "Unknown";
                icon = "📝";
                task = `Group name changed`;
                extra.push(
                    `  ${UI.arrow} Old : ${oldName}`,
                    `  ${UI.arrow} New : ${newName}`
                );
                await Threads.setData(event.threadID, { name: newName });
                break;
            }

            case "log:thread-icon": {
                icon = "🖼️";
                task = `Group icon changed`;
                break;
            }

            case "log:thread-color": {
                icon = "🎨";
                task = `Theme color changed`;
                break;
            }

            case "log:thread-emoji": {
                icon = "😀";
                task = `Group emoji changed`;
                break;
            }

            /* ---------------- NICKNAME ---------------- */
            case "log:user-nickname": {
                const uid = event.logMessageData.participant_id;
                const name = await safeName(api, uid);
                icon = "🏷️";
                task = `Nickname updated`;
                extra.push(
                    `  ${UI.arrow} User : ${name}`,
                    `  ${UI.arrow} Nick : ${event.logMessageData.nickname || "(cleared)"}`
                );
                break;
            }

            /* ---------------- ADMINS ---------------- */
            case "log:thread-admins": {
                const uid = event.logMessageData.TARGET_ID;
                const name = await safeName(api, uid);
                const action = event.logMessageData.ADMIN_EVENT;
                icon = action === "add_admin" ? "👑" : "🚫";
                task = action === "add_admin" ? `Admin promoted` : `Admin demoted`;
                extra.push(`  ${UI.arrow} User : ${name}`);
                break;
            }

            case "log:thread-approval-mode": {
                icon = "🔐";
                task = `Approval mode changed to: ${event.logMessageData.APPROVAL_MODE}`;
                break;
            }

            case "log:thread-call": {
                const started = event.logMessageData.event === "group_call_started";
                icon = "📞";
                task = started ? `Group call started` : `Group call ended`;
                break;
            }

            case "log:message-unsend": {
                icon = "🗑️";
                task = `A message was deleted`;
                break;
            }

            case "log:message-edit": {
                icon = "✏️";
                task = `A message was edited`;
                break;
            }

            /* ---------------- SUBSCRIBE ---------------- */
            case "log:subscribe": {
                const added = event.logMessageData.addedParticipants || [];
                const botAdded = added.some(i => i.userFbId == api.getCurrentUserID());

                if (botAdded) {
                    icon = "🤖";
                    task = `Bot was added to a new group!`;
                } else {
                    icon = "🎉";
                    const names = added.map(u => u.fullName).join(", ");
                    task = `New member joined`;
                    extra.push(`  ${UI.arrow} Member(s): ${names}`);

                    if (cfg.welcomeMessage) {
                        const welcome =
                            `${UI.line}\n` +
                            `   ${UI.sparkle} W E L C O M E ${UI.sparkle}\n` +
                            `${UI.thin}\n` +
                            `  ${UI.star} স্বাগতম ${names}!\n` +
                            `  ${UI.arrow} Group : ${(await Threads.getData(event.threadID)).name || "Unknown"}\n` +
                            `  ${UI.arrow} Members: ${(await api.getThreadInfo(event.threadID)).participantIDs.length}\n` +
                            `${UI.line}`;
                        api.sendMessage(welcome, event.threadID);
                    }
                }
                break;
            }

            /* ---------------- UNSUBSCRIBE ---------------- */
            case "log:unsubscribe": {
                const leftId = event.logMessageData.leftParticipantFbId;
                const botLeft = leftId == api.getCurrentUserID();

                if (botLeft) {
                    icon = "💀";
                    task = `Bot was kicked from group!`;
                } else {
                    icon = "👋";
                    const name = await safeName(api, leftId);
                    task = `Member left the group`;
                    extra.push(`  ${UI.arrow} Member: ${name}`);

                    if (cfg.goodbyeMessage) {
                        const bye =
                            `${UI.line}\n` +
                            `   ${UI.wave} G O O D B Y E ${UI.wave}\n` +
                            `${UI.thin}\n` +
                            `  ${UI.cross} ${name} গ্রুপ ছেড়ে চলে গেছে\n` +
                            `  ${UI.arrow} আবার দেখা হবে! ${UI.sparkle}\n` +
                            `${UI.line}`;
                        api.sendMessage(bye, event.threadID);
                    }
                }
                break;
            }

            default: return;
        }

        if (!task) return;

        /* ---------- BUILD FINAL REPORT ---------- */
        const threadName = (await Threads.getData(event.threadID)).name || "Unknown";
        const authorName = await safeName(api, event.author);

        const report =
            `${header("GOD EVENT LOGGER")}\n` +
            `  ${icon}  ${task}\n` +
            `${UI.thin}\n` +
            infoBlock([
                { label: "Group ", value: threadName },
                { label: "Thread", value: event.threadID },
                { label: "By    ", value: authorName },
                { label: "UID   ", value: event.author }
            ]) +
            (extra.length ? "\n" + extra.join("\n") : "") +
            `\n${UI.thin}\n` +
            `  ${UI.clock} ${dhakaTime()}\n` +
            `  ${UI.info} Uptime : ${uptime()}\n` +
            `  ${UI.info} RAM    : ${ram()}\n` +
            `${footer()}`;

        /* ---------- SAVE LOG ---------- */
        if (cfg.logToFile) {
            saveLog({
                threadID: event.threadID,
                threadName,
                author: event.author,
                authorName,
                type: event.logMessageType,
                task
            });
        }

        /* ============================================================
         *  📤 BUILD RECEIVER LIST (no hardcoded UID!)
         * ============================================================ */
        const receivers = new Set();

        // 👑 Bot Admins from config.json
        if (cfg.forwardToBotAdmins) {
            getBotAdmins().forEach(id => receivers.add(String(id)));
        }

        // 👥 Group Admins
        if (cfg.forwardToGroupAdmins) {
            const gAdmins = await getGroupAdmins(api, event.threadID);
            gAdmins.forEach(id => receivers.add(String(id)));
        }

        // বট নিজে যেন নিজের ইনবক্সে না পাঠায়
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
                // শুধু ফেইল হলেই ফাইল লগ (স্প্যাম এড়াতে)
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
