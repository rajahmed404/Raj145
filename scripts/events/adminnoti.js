module.exports.config = {
  name: "adminNoti",
  eventType: [
    "log:thread-admins",
    "log:user-nickname",
    "log:thread-call",
    "log:thread-icon",
    "log:thread-color",
    "log:link-status",
    "log:magic-words",
    "log:thread-approval-mode",
    "log:thread-poll",
    "log:unsubscribe" // added unsubscribe event
  ],
  version: "1.0.2",
  credits: "Mirai Team & mod by Yan Maglinte & updated by Joy",
  description: "Group Information Update with kick notification",
  envConfig: {
    autoUnsend: true,
    sendNoti: true,
    timeToUnsend: 10
  }
};

module.exports.run = async function({ event, api, Threads, Users }) {
  const { author, threadID, logMessageType, logMessageData, logMessageBody } = event;
  const { setData, getData } = Threads;
  const fs = require("fs");
  const iconPath = __dirname + "/cache/emoji.json";
  if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));
  if (author === threadID) return;

  try {
    let dataThread = (await getData(threadID)).threadInfo;

    switch (logMessageType) {
      case "log:thread-admins": {
        if (logMessageData.ADMIN_EVENT === "add_admin") {
          dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
          api.sendMessage(`[ GROUP UPDATE ]\n❯ USER UPDATE: ${await Users.getNameUser(logMessageData.TARGET_ID)} became a group admin.`, threadID);
        } else if (logMessageData.ADMIN_EVENT === "remove_admin") {
          dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id !== logMessageData.TARGET_ID);
          api.sendMessage(`[ GROUP UPDATE ]\n❯ Removed admin privileges from ${await Users.getNameUser(logMessageData.TARGET_ID)}.`, threadID);
        }
        break;
      }

      case "log:user-nickname": {
        const { participant_id, nickname } = logMessageData;
        if (participant_id && nickname) {
          dataThread.nicknames = dataThread.nicknames || {};
          dataThread.nicknames[participant_id] = nickname;
          const participantName = await Users.getNameUser(participant_id);
          api.sendMessage(`[ GROUP ]\n❯ Updated nickname for ${participantName}: ${nickname}.`, threadID);
        }
        break;
      }

      case "log:thread-icon": {
        const preIcon = JSON.parse(fs.readFileSync(iconPath));
        dataThread.threadIcon = logMessageData.thread_icon || "👍";
        if (global.configModule[this.config.name].sendNoti) {
          api.sendMessage(`[ GROUP UPDATE ]\n❯ ${logMessageBody.replace("emoji", "icon")}\n❯ Previous Icon: ${preIcon[threadID] || "unknown"}`, threadID, async (error, info) => {
            preIcon[threadID] = dataThread.threadIcon;
            fs.writeFileSync(iconPath, JSON.stringify(preIcon));
            if (global.configModule[this.config.name].autoUnsend) {
              await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
              return api.unsendMessage(info.messageID);
            }
          });
        }
        break;
      }

      case "log:thread-call": {
        if (logMessageData.event === "group_call_started") {
          const name = await Users.getNameUser(logMessageData.caller_id);
          api.sendMessage(`[ GROUP UPDATE ]\n❯ ${name} started a ${(logMessageData.video) ? 'video ' : ''}call.`, threadID);
        } else if (logMessageData.event === "group_call_ended") {
          const callDuration = logMessageData.call_duration;
          const hours = Math.floor(callDuration / 3600);
          const minutes = Math.floor((callDuration % 3600) / 60);
          const seconds = callDuration % 60;
          const timeFormat = `${hours}:${minutes}:${seconds}`;
          api.sendMessage(`[ GROUP UPDATE ]\n❯ ${(logMessageData.video) ? 'Video' : 'Audio'} call ended.\n❯ Duration: ${timeFormat}`, threadID);
        } else if (logMessageData.joining_user) {
          const name = await Users.getNameUser(logMessageData.joining_user);
          api.sendMessage(`[ GROUP UPDATE ]\n❯ ${name} joined the ${(logMessageData.group_call_type == '1') ? 'video' : 'audio'} call.`, threadID);
        }
        break;
      }

      case "log:link-status": {
        api.sendMessage(logMessageBody, threadID);
        break;
      }

      case "log:magic-words": {
        api.sendMessage(`» [ GROUP UPDATE ]\n❯ Magic word "${logMessageData.magic_word}" added with theme "${logMessageData.theme_name}".\n❯ Emoji: ${logMessageData.emoji_effect || "None"}\n❯ Total effects: ${logMessageData.new_magic_word_count}`, threadID);
        break;
      }

      case "log:thread-poll": {
        const obj = JSON.parse(logMessageData.question_json);
        if (logMessageData.event_type === "question_creation" || logMessageData.event_type === "update_vote") {
          api.sendMessage(logMessageBody, threadID);
        }
        break;
      }

      case "log:thread-approval-mode": {
        api.sendMessage(logMessageBody, threadID);
        break;
      }

      case "log:thread-color": {
        dataThread.threadColor = logMessageData.thread_color || "🌤";
        if (global.configModule[this.config.name].sendNoti) {
          api.sendMessage(`[ GROUP UPDATE ]\n❯ ${logMessageBody.replace("Theme", "Color")}`, threadID, async (error, info) => {
            if (global.configModule[this.config.name].autoUnsend) {
              await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
              return api.unsendMessage(info.messageID);
            }
          });
        }
        break;
      }

      case "log:unsubscribe": {
        const kickedID = event.leftParticipantFbId;
        const adminID = author;

        // Ignore if left by own
        if (kickedID === adminID) break;

        const kickedName = await Users.getNameUser(kickedID);
        const adminName = await Users.getNameUser(adminID);

        api.sendMessage(`[ GROUP UPDATE ]\n❯ ${kickedName} (${kickedID}) \nরাগ করে না বাবু গ্রুপে শান্তির জন্য তোমাকে কিক মারা হলো \n\n তুই এই গ্রুপে থাকার যোগ্য না আবাল 🤣\n has been removed by ${adminName} (${adminID})`, threadID);
        break;
      }
    }

    await setData(threadID, { threadInfo: dataThread });
  } catch (error) {
    console.log(error);
  }
};
