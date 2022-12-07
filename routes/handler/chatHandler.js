const ChatLogs = require("../../schema/ChatLogs");
const User = require("../../schema/User");

module.exports = {
  getChatLogs: async (_) => {
    try {
      return await ChatLogs.find();
    } catch (error) {
      console.log(
        `getChatLogs\nError name: ${error.name}\nError message: ${error.message}`
      );
      return [];
    }
  },
  getChatLog: async (userId, message) => {
    try {
      const user = await User.findOne({ id: userId });

      return new ChatLogs({ userId, username: user.name, message });
    } catch (error) {
      console.log(error);

      return new ChatLogs({
        userId,
        username: "Unknown",
        message: "서버에 문제가 발생하여 전송에 실패했습니다.",
      });
    }
  },
};
