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
        await bot.sendMessage(chat_id, `Siz botda roʻyxatdan oʻtgansiz!`);
      }
    } catch (error) {
      console.log(error);
      await bot.sendMessage(chat_id, `Qandaydir xatolik sodir boʻldi!`);
    }
  }

  static async ChangeCreator(message, bot, psql) {
    const { id, username, first_name } = message.reply_to_message.from;
    const old_creator_id = message.from.id;
    const old_username = message.from.username;
    const old_first_name = message.from.first_name;
    const group_id = parseInt(message.chat.id);
    const game = await psql.games.findOne({
      where: {
        group_id,
        status: "started",
      },
    });

    try {
      if (game) {
        if (+game.creator_id === old_creator_id) {
          game.creator_id = id;
          game.creator_user_name = username || first_name;
          await game.save();
          await bot.sendMessage(
            group_id,
            `Boshlovchi muvaffaqiyatli oʻzgartirildi. Endi ${
              username ? "@" + username : first_name
            } boshlovchi!`
          );
        } else {
          await bot.sendMessage(
            group_id,
            `@${
              old_username ? "@" + old_username : old_first_name
            } siz boshlovchi emassiz!`
          );
        }
      } else {
        if (group_id) await bot.sendMessage(group_id, `Faol oʻyin yoʻq!`);
      }
    } catch (error) {
      console.log(error);
      await bot.sendMessage(
        group_id,
        `Qandaydir xatolik sodir boʻldi. Iltimos, oʻyinni qayta boshlang!`
      );
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
