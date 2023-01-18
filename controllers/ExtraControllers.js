module.exports = class ExtraControllers {
  static async MessageController(message, bot, psql) {
    const chat_id = message.chat.id;
    try {
      const user = await psql.users.findOne({
        where: {
          chat_id,
        },
      });

      if (!user) {
        await psql.users.create({
          chat_id,
        });

        await bot.sendMessage(chat_id, `Siz botda yangisiz!`);
      } else {
        await bot.sendMessage(chat_id, `Siz botda ro'yxatdan oʻtgansiz!`);
      }
    } catch (error) {
      console.log(error);
      await bot.sendMessage(chat_id, `Qandaydir xatolik sodir boʻldi!`);
    }
  }

  static async Aytibar(message, bot) {
    const group_id = parseInt(message.chat.id);

    await bot.sendMessage(
      group_id,
      `Bot uchun 10mingdan tashabaringla! 9860190104312326 😂🤣`
    );
  }

  static async ClearDB(psql) {
    await psql.games.destroy({
      where: {
        status: "finished",
      },
    });
  }
};
