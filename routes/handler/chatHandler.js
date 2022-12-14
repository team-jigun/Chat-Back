const User = require('../../schema/User');
const ChatLogs = require('../../schema/ChatLogs');

module.exports = {
  getChatLogs: async _ => {
    try {
      return await ChatLogs.find();
    } catch (error) {
      console.log(`getChatLogs\nError Name: ${error.name}\nError Message: ${error.message}`);

      return [];
    }
  },
  getChatLog: async (userId, message) => {
    try {
      const user = await User.findOne({ id: userId });
    
      return new ChatLogs({ userId, username: user.name, message });
    } catch (error) {
      console.log(error);

      return new ChatLogs({ userId, username: 'undefined', message: '서버 오류로 인해 발생된 메시지입니다.' });
    }
  }
}