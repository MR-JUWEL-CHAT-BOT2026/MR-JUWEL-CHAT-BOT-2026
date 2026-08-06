// includes/resolveMention.js
//
// Robust mention detection that does not fully trust event.mentions' exact
// shape from the login library (rx-fca). rx-fca is an npm dependency - it
// isn't part of this repo/zip, so its internal parsing can't be inspected
// or patched directly here. Instead of guessing at one specific bug, this
// checks every known shape AND falls back to matching "@FullName" text in
// the message body against the thread's actual member list - the same
// fallback pattern several commands already use (Mention.js, Boxadmin.js,
// 0admin.js, love.js, etc. all have a local getUIDByFullName for exactly
// this reason). That fallback works even if event.mentions is empty,
// malformed, or shaped differently than expected.
//
// Usage:
//   const { getMentionedIDs } = require("<relative path to>/includes/resolveMention.js");
//   const ids = await getMentionedIDs(api, event); // -> string[] of user IDs

async function getMentionedIDs(api, event) {
    const ids = new Set();
    const m = event && event.mentions;

    // Shape 1: event.mentions as an object keyed by user ID - the format
    // every command in this bot expects.
    if (m && typeof m === "object" && !Array.isArray(m)) {
        for (const id of Object.keys(m)) {
            if (id) ids.add(String(id));
        }
    }

    // Shape 2: some fca forks return an array of mention objects instead,
    // e.g. [{ id, tag, fromIndex, length }].
    if (Array.isArray(m)) {
        for (const entry of m) {
            const id = entry && (entry.id || entry.userID || entry.senderID || entry.fbid);
            if (id) ids.add(String(id));
        }
    }

    // Shape 3 (fallback): match "@FullName" text in the body against the
    // thread's actual member list. Works regardless of whether the login
    // library populates event.mentions at all.
    if (ids.size === 0 && event && event.body && event.body.includes("@") && event.threadID) {
        try {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const users = threadInfo.userInfo || [];
            const bodyLower = event.body.toLowerCase();
            for (const u of users) {
                if (!u.name) continue;
                const nameLower = u.name.trim().toLowerCase();
                if (nameLower && bodyLower.includes("@" + nameLower)) ids.add(String(u.id));
            }
        } catch (e) {
            // ignore - fall through with whatever shape 1/2 already found
        }
    }

    return Array.from(ids);
}

module.exports = { getMentionedIDs };
