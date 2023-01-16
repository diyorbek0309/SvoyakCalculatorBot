const sendResults = require("../services/sendResults");

module.exports = class Controllers {
  static async MessageController(message, bot, psql) {
    const chat_id = message.chat.id;
    const text = message.text;

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
      await bot.sendMessage(chat_id, `Siz botda ro'yxatdan o'tgansiz!`);
    }
  }

  static async GroupController(group, bot, psql) {
    const { id, title } = group;

    const newGroup = await psql.groups.findOne({
      where: {
        id,
      },
    });

    if (!newGroup) {
      await psql.groups.create({
        id,
        title,
      });

      await bot.sendMessage(
        id,
        `SvoyakCalculatorBotni guruhingizga qo'shganingiz uchun raxmat!`
      );
    } else {
      await bot.sendMessage(
        id,
        `SvoyakCalculatorBotni guruhingizga qaytarganingiz uchun raxmat!`
      );
    }
  }

  static async GameController(group, creator, type, bot, psql) {
    const { id } = group;
    const game = await psql.games.findOne({
      where: {
        group_id: id,
        status: "started",
      },
    });

    if (type === "start") {
      if (!game) {
        await psql.games.create({
          group_id: id,
          creator_id: creator.id,
          creator_user_name: creator.username || creator.first_name,
          status: "started",
        });

        await bot.sendMessage(id, `SvoyakCalculatorBot o'z ishini boshladi!`);
      } else {
        await bot.sendMessage(
          id,
          `Guruhda o'yin bo'layapti, yangisini boshlash uchun hozirgi o'yinni tugatishingiz kerak!`
        );
      }
    } else if (type === "end" && game) {
      if (+game.creator_id === creator.id) {
        game.status = "finished";
        await game.save();

        await bot.sendMessage(id, `SvoyakCalculatorBot o'z ishini tugatdi!`);
      } else {
        await bot.sendMessage(
          id,
          `Ushbu o'yinni faqat @${game.creator_user_name} yakunlay oladi!`
        );
      }
    } else {
      await bot.sendMessage(id, `Faol o'yin yo'q!`);
    }
  }

  static async GamerController(message, bot, psql) {
    const { id, username, first_name } = message.reply_to_message.from;
    const creator_id = message.from.id;

    const group_id = parseInt(message.chat.id);
    const game = await psql.games.findOne({
      where: {
        group_id,
        status: "started",
      },
    });

    if (game) {
      if (+game.creator_id === creator_id) {
        const gamer = await psql.gamers.findOne({
          where: {
            game_id: game.id,
            user_id: id,
          },
        });
        if (!gamer) {
          await psql.gamers.create({
            game_id: game.id,
            user_id: id,
            user_name: username || first_name,
            score: parseInt(message.text),
          });
          const allGamers = await psql.gamers.findAll({
            where: {
              game_id: game.id,
            },
          });
          allGamers.sort((a, b) => b.score - a.score);
          if (allGamers.length > 25) {
            bot.sendMessage(
              id,
              `Tabloda ko'pi bilan 25 o'yinchi ko'rsatiladi!`
            );
          } else {
            sendResults(bot, game, allGamers);
          }
        } else {
          gamer.score = parseInt(gamer.score) + parseInt(message.text);
          await gamer.save();
          const allGamers = await psql.gamers.findAll({
            where: {
              game_id: game.id,
            },
          });
          allGamers.sort((a, b) => b.score - a.score);
          sendResults(bot, game, allGamers);
        }
      }
    } else {
      if (game.group_id)
        await bot.sendMessage(game.group_id, `Hali o'yin boshlanmagan!`);
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
