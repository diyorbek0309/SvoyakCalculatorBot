const sendResults = require('../services/sendResults');

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

  static async StatsController(message, bot, psql) {
    const totalGroupsCount = await psql.groups.count();
    const totalGamers = await psql.gamers.count();
    const totalGames = await psql.games.count();
    const totalSubscribersCountResult = await psql.groups.sum(
      'subscribers_count'
    );
    const totalSubscribersCount = totalSubscribersCountResult || 0;

    await bot.sendMessage(
      message.chat.id,
      `Total groups: ${totalGroupsCount}\nTotal subscribers: ${
        totalSubscribersCount + chatMemberCount
      }\nTotal games: ${totalGames}\nTotal gamers: ${totalGamers}`
    );
  }

  static async ChangeCreator(message, bot, psql) {
    const {
      reply_to_message: {
        from: { id, username, first_name },
      },
      from: {
        id: old_creator_id,
        username: old_username,
        first_name: old_first_name,
      },
    } = message;

    const group_id = parseInt(message.chat.id);
    const admins = await bot.getChatAdministrators(group_id);
    const adminIds = admins.map((admin) => admin.user.id);

    const game = await psql.games.findOne({
      where: {
        group_id,
        status: 'started',
      },
    });

    try {
      if (game) {
        if (
          +game.creator_id === old_creator_id ||
          old_creator_id === 175604385 ||
          adminIds.includes(old_creator_id)
        ) {
          game.creator_id = id;
          game.creator_user_name = username ? '@' + username : first_name;
          await game.save();
          await bot.sendMessage(
            group_id,
            `Boshlovchi muvaffaqiyatli oʻzgartirildi. Endi ${
              username ? '@' + username : first_name
            } boshlovchi!`
          );
        } else {
          await bot.sendMessage(
            group_id,
            `${
              old_username ? '@' + old_username : old_first_name
            } siz boshlovchi yoki admin emassiz!`
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

  static async RemoveGamer(message, bot, psql) {
    const {
      from: { id, username, first_name },
    } = message;

    const group_id = Number(message.chat.id);

    const game = await psql.games.findOne({
      where: {
        group_id,
        status: 'started',
      },
    });

    try {
      if (game) {
        let allGamers = await psql.gamers.findAll({
          where: {
            game_id: game.id,
          },
        });
        allGamers.sort((a, b) => b.score - a.score);

        if (allGamers.find((gamer) => +gamer.user_id === id)) {
          allGamers = allGamers.filter((gamer) => +gamer.user_id !== id);
          await psql.gamers.destroy({
            where: {
              user_id: id,
            },
          });

          sendResults(bot, game, allGamers);
          await bot.sendMessage(
            group_id,
            `${username ? '@' + username : first_name} tablodan oʻchirildi!`
          );
        }
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

    await bot.sendMessage(group_id, `Bot uchun 10mingdan tashabaringla! 😂🤣`);
  }

  static async ClearDB(message, bot, psql) {
    const group_id = Number(message.chat.id);
    try {
      await psql.games.destroy({
        where: {
          status: 'finished',
        },
      });
      await bot.sendMessage(group_id, `Bajarildi apka ✅`);
    } catch (error) {
      await bot.sendMessage(
        group_id,
        `Qandaydir xatolik sodir boʻldi. Iltimos, oʻyinni qayta boshlang!`
      );
    }
  }
};
