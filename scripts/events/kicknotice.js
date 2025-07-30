module.exports.config = {
  name: "kicknotice",
  eventType: ["log:unsubscribe"],
  version: "1.2.0",
  credits: "Joy Ahmed",
  description: "Show who kicked whom with UID, tag, date & profile link"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, author, logMessageData } = event;

  const kickedID = logMessageData?.leftParticipantFbId;
  const kickerID = author;

  if (!kickedID || kickedID === kickerID) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const kickedUser = threadInfo.userInfo.find(u => u.id === kickedID);
    const kickerUser = threadInfo.userInfo.find(u => u.id === kickerID);

    const kickedName = kickedUser?.name || "Unknown";
    const kickerName = kickerUser?.name || "Unknown";

    // 🇧🇩 Bangladesh time
    const date = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const msg =
`╭╼|━━━━━━━━━━━━━━|╾╮
👤 𝗞𝗶𝗰𝗸 𝗔𝗹𝗲𝗿𝘁
👣 Kicked: ${kickedName}
🆔 UID: ${kickedID}
🔗 Profile: https://facebook.com/${kickedID}

👮‍♂️ Kicked By: @${kickerName}
🆔 UID: ${kickerID}
🔗 Profile: https://facebook.com/${kickerID}

🕒 Date: ${date}
╰╼|━━━━━━━━━━━━━━|╾╯`;

    return api.sendMessage({
      body: msg,
      mentions: [{
        tag: `@${kickerName}`,
        id: kickerID
      }]
    }, threadID);
  } catch (e) {
    console.error("❌ KickNotice Error:", e);
  }
};
