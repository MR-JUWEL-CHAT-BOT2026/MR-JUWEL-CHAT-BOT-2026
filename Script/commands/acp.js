const moment = require("moment-timezone");

module.exports.config = {
  name: "acp",
  version: "2.2.0",
  hasPermssion: 2,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Accept/Delete Facebook friend requests",
  commandCategory: "bot id",
  usages: "",
  cooldowns: 0
};

/* ================= HANDLE REPLY ================= */

module.exports.handleReply = async function ({ handleReply, event, api }) {
  const { author, listRequest } = handleReply;
  if (event.senderID != author) return;

  const args = event.body.trim().toLowerCase().split(/\s+/);
  const action = args[0];

  if (!["add", "del"].includes(action)) {
    return api.sendMessage("⚠️ Use: add / del / add all / del all", event.threadID);
  }

  let targets = args.slice(1);

  if (targets[0] === "all") {
    targets = [...Array(listRequest.length).keys()].map(i => i + 1);
  }

  const success = [];
  const failed = [];

  const mutation = action === "add"
    ? "FriendingCometFriendRequestConfirmMutation"
    : "FriendingCometFriendRequestDeleteMutation";

  const doc = action === "add"
    ? "3147613905362928"
    : "4108254489275063";

  for (const t of targets) {
    const u = listRequest[parseInt(t) - 1];
    if (!u) continue;

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: mutation,
      doc_id: doc,
      variables: JSON.stringify({
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          friend_requester_id: u.node.id,
          client_mutation_id: Date.now().toString()
        },
        scale: 30,
        refresh_num: 0
      })
    };

    try {
      const res = await api.httpPost(
        "https://www.facebook.com/api/graphql/",
        form
      );

      const data = JSON.parse(res);

      if (data.errors) failed.push(u.node.name);
      else success.push(u.node.name);

    } catch (e) {
      failed.push(u.node.name);
    }
  }

  return api.sendMessage(
`╭──── ACP RESULT ────╮
│ ✅ Success: ${success.length}
│ ❌ Failed: ${failed.length}
╰───────────────────╯

${success.length ? "✅ DONE:\n• " + success.join("\n• ") : ""}

${failed.length ? "\n❌ FAILED:\n• " + failed.join("\n• ") : ""}`,
    event.threadID
  );
};

/* ================= MAIN ================= */

module.exports.run = async function ({ event, api }) {
  try {

    // 🔥 SAFE LOADING
    const load = await api.sendMessage(
      "⏳ Loading Friend Requests...\n[□□□□□□□□□□] 0%",
      event.threadID
    );

    let p = 0;
    const bar = setInterval(() => {
      p += 20;
      const block = "█".repeat(p / 10);
      const empty = "░".repeat(10 - p / 10);

      api.editMessage(
        `⏳ Loading Friend Requests...\n[${block}${empty}] ${p}%`,
        load.messageID
      );

      if (p >= 100) clearInterval(bar);
    }, 300);

    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name:
        "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 30 } })
    };

    const res = await api.httpPost(
      "https://www.facebook.com/api/graphql/",
      form
    );

    const listRequest = JSON.parse(res)
      .data.viewer.friending_possibilities.edges;

    if (!listRequest.length)
      return api.sendMessage("📭 No Friend Requests Found!", event.threadID);

    let msg = `╭━━━━ FRIEND REQUEST ━━━━╮
│ 👥 Total: ${listRequest.length}
╰───────────────────────╯\n\n`;

    listRequest.forEach((u, i) => {

      const time = moment(u.time * 1000);
      const days = moment().diff(time, "days");
      const months = moment().diff(time, "months");

      const ago = months > 0
        ? `${months} মাস আগে`
        : `${days} দিন আগে`;

      const profile = `fb.com/${u.node.id}`;

      msg += `
[${i + 1}]
👤 ${u.node.name}
🆔 ${u.node.id}
🔗 ${profile}
⏳ ${ago}
───────────────`;
    });

    msg += `

⚡ Reply:
✔ add 1
✔ add all
✔ del 1
✔ del all
`;

    api.sendMessage(msg, event.threadID, (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        author: event.senderID,
        messageID: info.messageID,
        listRequest
      });
    });

  } catch (e) {
    return api.sendMessage(
      "❌ Failed to load requests!",
      event.threadID
    );
  }
};
