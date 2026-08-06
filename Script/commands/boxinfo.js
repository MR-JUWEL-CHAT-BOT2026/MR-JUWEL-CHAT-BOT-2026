const fs = require("fs");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "boxinfo",
  version: "3.0.0",
  hasPermssion: 1,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "View detailed group/box information",
  commandCategory: "Box",
  usages: "boxinfo",
  cooldowns: 5,
  dependencies: [],
};

// ─────────────────────────────────────────
// 📁 Data File Path
// ─────────────────────────────────────────
const DATA_FILE = path.join(__dirname, "cache", "boxinfo_data.json");

// ─────────────────────────────────────────
// 💾 Load & Save Helpers
// ─────────────────────────────────────────
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveData(data) {
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ─────────────────────────────────────────
// 🎂 Group Birthday & Age
// ─────────────────────────────────────────
function getGroupAge(threadID) {
  const data = loadData();
  const now = Date.now();

  if (!data[threadID]) {
    data[threadID] = { createdAt: now, peakHours: {}, lastWeeklyReport: null };
    saveData(data);
  }

  const createdAt = data[threadID].createdAt;
  const diffMs   = now - createdAt;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years    = Math.floor(diffDays / 365);
  const months   = Math.floor((diffDays % 365) / 30);
  const days     = diffDays % 30;

  const createdDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  let ageText = "";
  if (years  > 0) ageText += `${years}y `;
  if (months > 0) ageText += `${months}mo `;
  ageText += `${days}d`;

  return { createdDate, ageText, createdAt };
}

// ─────────────────────────────────────────
// ⏰ Peak Hour Tracking
// ─────────────────────────────────────────
function trackPeakHour(threadID) {
  const data = loadData();
  if (!data[threadID]) {
    data[threadID] = { createdAt: Date.now(), peakHours: {}, lastWeeklyReport: null };
  }
  const hour = String(new Date().getHours());
  data[threadID].peakHours[hour] = (data[threadID].peakHours[hour] || 0) + 1;
  saveData(data);
}

function getPeakHour(threadID) {
  const data      = loadData();
  const peakHours = data[threadID]?.peakHours || {};
  if (Object.keys(peakHours).length === 0) return "No data yet";

  const [hourStr, count] = Object.entries(peakHours).sort((a, b) => b[1] - a[1])[0];
  const hour   = parseInt(hourStr);
  const ampm   = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${ampm}  (Active ${count}x)`;
}

// ─────────────────────────────────────────
// 📊 Peak Hour Bar Chart (ASCII)
// ─────────────────────────────────────────
function getPeakHourChart(threadID) {
  const data      = loadData();
  const peakHours = data[threadID]?.peakHours || {};
  if (Object.keys(peakHours).length === 0) return null;

  // Group into Morning / Afternoon / Evening / Night
  const slots = {
    "🌅 Morning   (6-12) ": [6,7,8,9,10,11],
    "☀️ Afternoon (12-18)": [12,13,14,15,16,17],
    "🌆 Evening  (18-24) ": [18,19,20,21,22,23],
    "🌙 Night     (0-6)  ": [0,1,2,3,4,5],
  };

  const max = Math.max(...Object.values(peakHours), 1);
  let chart = "";

  for (const [label, hours] of Object.entries(slots)) {
    const total = hours.reduce((sum, h) => sum + (peakHours[String(h)] || 0), 0);
    const bars  = Math.round((total / max) * 8);
    const bar   = "█".repeat(bars) + "░".repeat(8 - bars);
    chart += `  ${label}: ${bar} ${total}\n`;
  }
  return chart.trimEnd();
}

// ─────────────────────────────────────────
// 📅 Weekly Report
// ─────────────────────────────────────────
function shouldSendWeeklyReport(threadID) {
  const data = loadData();
  if (!data[threadID]) return false;
  const now       = new Date();
  const isMonday  = now.getDay() === 1;
  if (!isMonday)  return false;
  const last      = data[threadID].lastWeeklyReport;
  if (!last)      return true;
  return new Date(last).toDateString() !== now.toDateString();
}

function markWeeklyReportSent(threadID) {
  const data = loadData();
  if (data[threadID]) {
    data[threadID].lastWeeklyReport = Date.now();
    saveData(data);
  }
}

async function sendWeeklyReport(api, event, threadInfo) {
  const { threadName, participantIDs, messageCount, adminIDs } = threadInfo;
  const tid                = event.threadID;
  const { ageText }        = getGroupAge(tid);
  const peakHour           = getPeakHour(tid);
  const chart              = getPeakHourChart(tid);
  const date               = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const report =
    `┌──────────────────────────────┐\n` +
    `│   📊  WEEKLY GROUP REPORT    │\n` +
    `└──────────────────────────────┘\n` +
    `\n` +
    `  📅  Date     : ${date}\n` +
    `  🏷️  Group    : ${threadName}\n` +
    `  👥  Members  : ${participantIDs.length}\n` +
    `  👑  Admins   : ${adminIDs.length}\n` +
    `  💬  Messages : ${messageCount}\n` +
    `  ⏰  Peak Hour : ${peakHour}\n` +
    `  🎂  Age       : ${ageText}\n` +
    `\n` +
    `┌──────────────────────────────┐\n` +
    `│       📈 ACTIVITY CHART      │\n` +
    `└──────────────────────────────┘\n` +
    (chart ? `\n${chart}\n` : `  No activity data yet.\n`) +
    `\n` +
    `  ✅  Group is active & running!\n` +
    `\n` +
    `  ─────────────────────────────\n` +
    `  ⚡  Powered by CYBER BOT TEAM`;

  api.sendMessage(report, tid, null, event.messageID);
  markWeeklyReportSent(tid);
}

// ─────────────────────────────────────────
// 🧮 Gender Ratio Bar
// ─────────────────────────────────────────
function genderBar(males, females, total) {
  if (total === 0) return "N/A";
  const maleBlocks   = Math.round((males   / total) * 10);
  const femaleBlocks = Math.round((females / total) * 10);
  const unknownBlocks = 10 - maleBlocks - femaleBlocks;
  return (
    "♂".repeat(Math.max(0, maleBlocks)) +
    "♀".repeat(Math.max(0, femaleBlocks)) +
    "·".repeat(Math.max(0, unknownBlocks))
  );
}

// ─────────────────────────────────────────
// 🏅 Group Size Badge
// ─────────────────────────────────────────
function getGroupBadge(memberCount) {
  if (memberCount >= 200) return "💎 MEGA  GROUP";
  if (memberCount >= 100) return "🏆 LARGE GROUP";
  if (memberCount >=  50) return "🥈 MED   GROUP";
  return                         "🥉 SMALL GROUP";
}

// ─────────────────────────────────────────
// 🚀 Main Command
// ─────────────────────────────────────────
module.exports.run = async function ({ api, event }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const {
      participantIDs, userInfo, adminIDs,
      messageCount, emoji, threadName,
      threadID, approvalMode, imageSrc,
    } = threadInfo;

    // Track activity
    trackPeakHour(threadID);

    // Weekly report check
    if (shouldSendWeeklyReport(threadID)) {
      await sendWeeklyReport(api, event, threadInfo);
    }

    // Gender count
    let males = 0, females = 0, unknown = 0;
    for (const user of Object.values(userInfo)) {
      if      (user.gender === "MALE")   males++;
      else if (user.gender === "FEMALE") females++;
      else                               unknown++;
    }

    const total             = participantIDs.length;
    const malePct           = total ? Math.round((males   / total) * 100) : 0;
    const femalePct         = total ? Math.round((females / total) * 100) : 0;
    const gBar              = genderBar(males, females, total);
    const badge             = getGroupBadge(total);
    const approvalStatus    = approvalMode ? "✅ Enabled" : "❌ Disabled";
    const { createdDate, ageText } = getGroupAge(threadID);
    const peakHour          = getPeakHour(threadID);
    const chart             = getPeakHourChart(threadID);
    const cachePath         = path.join(__dirname, "cache", "1.png");
    const now               = new Date().toLocaleString("en-US", {
      dateStyle: "medium", timeStyle: "short"
    });

    // ── Main Message ──────────────────────────────────────────
    const messageBody =
      `╔═══════════════════════════════╗\n` +
      `║    ⚙️   G R O U P   I N F O   ║\n` +
      `╚═══════════════════════════════╝\n` +
      `\n` +
      `  ${badge}\n` +
      `\n` +
      `┌─  BASIC INFO  ────────────────┐\n` +
      `│ 🏷️  Name     : ${threadName}\n` +
      `│ 🆔  Group ID : ${threadID}\n` +
      `│ 😀  Emoji    : ${emoji || "None"}\n` +
      `│ 🔐  Approval : ${approvalStatus}\n` +
      `└───────────────────────────────┘\n` +
      `\n` +
      `┌─  MEMBERS  ───────────────────┐\n` +
      `│ 👥  Total   : ${total} members\n` +
      `│ 👑  Admins  : ${adminIDs.length}\n` +
      `│ ♂️   Males   : ${males} (${malePct}%)\n` +
      `│ ♀️   Females : ${females} (${femalePct}%)\n` +
      `│ ❓  Unknown : ${unknown}\n` +
      `│ 📊  Ratio   : ${gBar}\n` +
      `└───────────────────────────────┘\n` +
      `\n` +
      `┌─  ACTIVITY  ──────────────────┐\n` +
      `│ 💬  Messages : ${messageCount}\n` +
      `│ ⏰  Peak Hour: ${peakHour}\n` +
      `└───────────────────────────────┘\n` +
      `\n` +
      `┌─  TIMELINE  ──────────────────┐\n` +
      `│ 🎂  Created  : ${createdDate}\n` +
      `│ 📆  Age      : ${ageText}\n` +
      `│ 🕐  Checked  : ${now}\n` +
      `└───────────────────────────────┘\n` +
      (chart
        ? `\n┌─  ACTIVITY CHART  ────────────┐\n${chart}\n└───────────────────────────────┘\n`
        : "") +
      `\n` +
      `  ⚡  Powered by 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐`;

    // ── Send with or without image ────────────────────────────
    const sendMsg = () => {
      api.sendMessage(
        { body: messageBody, attachment: fs.createReadStream(cachePath) },
        event.threadID,
        () => { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); },
        event.messageID
      );
    };

    if (imageSrc) {
      request(encodeURI(imageSrc))
        .pipe(fs.createWriteStream(cachePath))
        .on("close", sendMsg)
        .on("error", () =>
          api.sendMessage({ body: messageBody }, event.threadID, null, event.messageID)
        );
    } else {
      api.sendMessage({ body: messageBody }, event.threadID, null, event.messageID);
    }

  } catch (err) {
    console.error("[boxinfo] Error:", err);
    api.sendMessage(
      "❌ Failed to fetch group info. Please try again.",
      event.threadID, null, event.messageID
    );
  }
};
