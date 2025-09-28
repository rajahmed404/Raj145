const axios = require("axios");

let API_BASE = "";

// GitHub থেকে API URL fetch করা
axios.get("https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json")
  .then(response => {
    API_BASE = response.data.api;
  })
  .catch(error => {
    console.error("Error fetching API base URL:", error);
  });

module.exports.config = {
  name: "teach",
  version: "1.0.9",
  permission: 0,
  credits: "JOY",
  description: "Teach Simsimi QnA (Add only)",
  prefix: true,
  category: "admin",
  usages: "teach question | answer",
  cooldowns: 2,
};

module.exports.run = async function({ event, args, api }) {
  // যদি কোনো argument না দেওয়া হয়
  if (!args[0]) {
    return api.sendMessage(
      "📌 Usage:\n" +
      ".teach question | answer\n\nউদাহরণ:\n" +
      ".teach তুমি কেমন আছো? | আমি ভালো আছি",
      event.threadID,
      event.messageID
    );
  }

  if (!API_BASE) {
    return api.sendMessage("❌ API base URL not set.", event.threadID, event.messageID);
  }

  const raw = args.join(" ");
  if (!raw.includes("|")) {
    return api.sendMessage("❌ Format: teach question | answer", event.threadID, event.messageID);
  }

  const [ask, ans] = raw.split("|").map(x => x.trim());

  if (!ask || !ans) {
    return api.sendMessage("❌ Question বা Answer খালি হতে পারবে না", event.threadID, event.messageID);
  }

  try {
    const res = await axios.get(`${API_BASE}/sim?teach=${encodeURIComponent(raw)}`);

    if (res.data.msg === "already_exists") {
      return api.sendMessage(
        `⚠️ Your Data Already Added To Database\n1️⃣ ASK: ${ask}\n2️⃣ ANS: ${ans}`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      `📝 Your Data Added To Database Successfully\n1️⃣ ASK: ${ask}\n2️⃣ ANS: ${ans}`,
      event.threadID,
      event.messageID
    );

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ API error: " + e.message, event.threadID, event.messageID);
  }
};
