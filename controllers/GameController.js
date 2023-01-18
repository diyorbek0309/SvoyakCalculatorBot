const finishedResults = require("../services/finishedResults");

module.exports = async function GameController(
  group,
  creator,
  type,
  bot,
  psql
) {
  const { id } = group;

  try {
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
        const allGamers = await psql.gamers.findAll({
          where: {
            game_id: game.id,
          },
        });
        game.status = "finished";
        await game.save();

        finishedResults(bot, game, allGamers);
        await bot.sendMessage(id, `SvoyakCalculatorBot o'z ishini tugatdi!`);
        await bot.sendMessage(
          id,
          `Boshlovchi @${game.creator_user_name}ga nichik tashakkur bildirsak akan @Xalmenova_Tamara ?)))`
        );
      } else {
        await bot.sendMessage(
          id,
          `Ushbu o'yinni faqat @${game.creator_user_name} yakunlay oladi!`
        );
      }
    } else {
      await bot.sendMessage(id, `Faol o'yin yo'q!`);
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(
      id,
      `Qandaydir xatolik sodir bo'ldi. Iltimos, o'yinni qayta boshlang!`
    );
  }
};
