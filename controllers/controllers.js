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

      bot.sendMessage(chat_id, `Siz botda yangisiz!`);
    } else {
      bot.sendMessage(chat_id, `Siz botda ro'yxatdan o'tgansiz!`);
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

      bot.sendMessage(
        id,
        `SvoyakCalculatorBotni guruhingizga qo'shganingiz uchun raxmat!`
      );
    } else {
      bot.sendMessage(
        id,
        `SvoyakCalculatorBotni guruhingizga qaytarganingiz uchun raxmat!`
      );
    }
  }

  static async GameController(group, creator, type, bot, psql) {
    const { id, title } = group;
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
          creator_user_name: creator.username,
          status: "started",
        });

        bot.sendMessage(id, `SvoyakCalculatorBot o'z ishini boshladi!`);
      } else {
        bot.sendMessage(
          id,
          `Guruhda o'yin bo'layapti, yangisini boshlash uchun hozirgi o'yinni tugatishingiz kerak!`
        );
      }
    } else if (type === "end" && game) {
      // if (game.creator_id === creator.id) {
      game.status = "finished";
      await game.save();

      bot.sendMessage(id, `SvoyakCalculatorBot o'z ishini tugatdi!`);
      // }
      //  else {
      //   bot.sendMessage(
      //     id,
      //     `Ushbu o'yinni faqat @${creator.username} yakunlay oladi!`
      //   );
      // }
    } else {
      bot.sendMessage(id, `Faol o'yin yo'q!`);
    }
  }

  static async GamerController(message, bot, psql) {
    const { id, username, first_name } = message.reply_to_message.from;

    const group_id = parseInt(message.chat.id);
    const game = await psql.games.findOne({
      where: {
        group_id,
        status: "started",
      },
    });

    if (game) {
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
        sendResults(bot, game, allGamers);
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
    } else {
      await bot.sendMessage(game.group_id, `Hali o'yin boshlanmagan!`);
    }
  }
};
