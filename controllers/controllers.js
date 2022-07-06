module.exports = class Controllers {
  static async MessageController(message, bot, psql) {
    const chat_id = message.chat.id;
    const text = message.text;

    const user = await psql.users.findOne({
      where: {
        chat_id,
      },
    });

    console.log(user);
  }
};
