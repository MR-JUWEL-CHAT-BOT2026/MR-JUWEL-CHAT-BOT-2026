module.exports.config = {
  name: "listbox",
  version: "3.1.0",
  credits: "MRJUWEL",
  hasPermssion: 2,
  description: "Advanced thread manager (bulk + analytics + role control)",
  commandCategory: "System",
  usages: "listbox",
  cooldowns: 10
};

/* ===================== HANDLE REPLY ===================== */

module.exports.handleReply = async function ({ api, event, Threads, handleReply }) {
  try {
    if (!handleReply || parseInt(event.senderID) !== parseInt(handleReply.author)) return;

    const args = event.body.trim().split(" ");
    const cmd = args[0].toLowerCase();
    const index = parseInt(args[1]);
    const idgr = handleReply.groupid?.[index - 1];

    if (!idgr && !["help","refresh"].includes(cmd)) {
      return api.sendMessage("⚠️ সঠিক নাম্বার দিন!", event.threadID);
    }

    /* ================= BAN ================= */
    if (cmd === "ban") {
      const data = (await Threads.getData(idgr)).data || {};
      data.banned = true;
      await Threads.setData(idgr, { data });

      global.data.threadBanned.set(idgr, 1);
      logAction("BAN", idgr, event.senderID);

      return api.sendMessage(`🚫 Group BANNED\nID: ${idgr}`, event.threadID);
    }

    /* ================= UNBAN (NEW) ================= */
    if (cmd === "unban") {
      const data = (await Threads.getData(idgr)).data || {};
      data.banned = false;
      await Threads.setData(idgr, { data });

      global.data.threadBanned.delete(idgr);
      logAction("UNBAN", idgr, event.senderID);

      return api.sendMessage(`✅ Group UNBANNED\nID: ${idgr}`, event.threadID);
    }

    /* ================= OUT ================= */
    if (cmd === "out") {
      await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
      logAction("OUT", idgr, event.senderID);

      return api.sendMessage(`👋 Left group:\nID: ${idgr}`, event.threadID);
    }

    /* ================= INFO (UPGRADED) ================= */
    if (cmd === "info") {
      const info = await api.getThreadInfo(idgr);

      const admins = info.adminIDs.map(a => a.id).join(", ") || "None";

      return api.sendMessage(
`📊 GROUP INFO

📛 Name: ${info.threadName}
🆔 ID: ${idgr}
👥 Members: ${info.participantIDs.length}
👑 Admins: ${admins}
🔒 Approval: ${info.approvalMode ? "ON" : "OFF"}
😀 Emoji: ${info.emoji || "None"}`,
        event.threadID
      );
    }

    /* ================= REFRESH (NEW) ================= */
    if (cmd === "refresh") {
      return module.exports.run({ api, event });
    }

    /* ================= INACTIVE (NEW) ================= */
    if (cmd === "inactive") {
      let msg = "📉 INACTIVE GROUPS\n\n";

      for (let id of handleReply.groupid) {
        try {
          const info = await api.getThreadInfo(id);
          if ((info.messageCount || 0) < 50) {
            msg += `• ${info.threadName}\nID: ${id}\n\n`;
          }
        } catch {}
      }

      return api.sendMessage(msg || "No inactive groups found", event.threadID);
    }

    /* ================= BROADCAST (NEW) ================= */
    if (cmd === "send") {
      const message = args.slice(2).join(" ");
      if (!message) return api.sendMessage("⚠️ Message দিন!", event.threadID);

      let success = 0;

      for (let id of handleReply.groupid) {
        try {
          await api.sendMessage(message, id);
          success++;
        } catch {}
      }

      return api.sendMessage(`📤 Sent to ${success} groups`, event.threadID);
    }

  } catch (e) {
    return api.sendMessage("❌ Error occurred in action!", event.threadID);
  }
};

/* ===================== MAIN RUN ===================== */

module.exports.run = async function ({ api, event }) {
  try {
    const inbox = await api.getThreadList(100, null, ["INBOX"]);
    const list = inbox.filter(g => g.isGroup && g.isSubscribed);

    let groups = [];
    let groupid = [];

    for (const g of list) {
      try {
        const info = await api.getThreadInfo(g.threadID);

        groups.push({
          id: g.threadID,
          name: g.name || "Unknown",
          members: info?.participantIDs?.length || 0
        });

      } catch {}
    }

    groups.sort((a, b) => b.members - a.members);

    const pageSize = 20;
    const page = 1;
    const start = (page - 1) * pageSize;
    const pageData = groups.slice(start, start + pageSize);

    /* ================= UI UPGRADE ================= */
    let msg = `╔═══════ LISTBOX PRO ═══════╗\n`;
    msg += `📄 Page: ${page}\n╚══════════════════════════╝\n\n`;

    pageData.forEach((g, i) => {
      msg += `╔═══ ${start + i + 1} ═══╗\n`;
      msg += `📛 ${g.name}\n`;
      msg += `🆔 ${g.id}\n`;
      msg += `👥 ${g.members} Members\n`;
      msg += `╚════════════╝\n\n`;
      groupid.push(g.id);
    });

    msg += `━━━━━━━━━━━━━━
Reply:
ban <no>
unban <no>
out <no>
info <no>
inactive
send <no> msg
refresh`;

    api.sendMessage(msg, event.threadID, (err, data) => {
      global.client.handleReply.push({
        name: this.config.name,
        author: event.senderID,
        messageID: data.messageID,
        groupid,
        type: "reply",
        page
      });
    });

  } catch (e) {
    api.sendMessage("❌ Failed to load group list", event.threadID);
  }
};

/* ===================== LOG SYSTEM ===================== */

function logAction(type, id, user) {
  console.log(`📌 ACTION: ${type} | GROUP: ${id} | BY: ${user}`);
       }
