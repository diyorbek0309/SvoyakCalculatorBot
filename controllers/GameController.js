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

    const admins = await bot.getChatAdministrators(id);
    const adminIds = admins.map((admin) => admin.user.id);

    if (type === "start") {
      if (!game) {
        await psql.games.create({
          group_id: id,
          creator_id: creator.id,
          creator_user_name: creator.username
            ? `@${creator.username}`
            : creator.first_name,
          status: "started",
        });

        await bot.sendMessage(id, `SvoyakCalculatorBot oʻz ishini boshladi!`);
      } else {
        await bot.sendMessage(
          id,
          `Guruhda oʻyin boʻlayapti, yangisini boshlash uchun hozirgi oʻyinni tugatishingiz kerak!`
        );
      }
    } else if (type === "end" && game) {
      if (
        +game.creator_id === creator.id ||
        adminIds.includes(creator.id) ||
        creator.id === 175604385
      ) {
        const allGamers = await psql.gamers.findAll({
          where: {
            game_id: game.id,
          },
        });
        game.status = "finished";
        await game.save();

        if (allGamers.length) {
          finishedResults(bot, game, allGamers);
          await bot.sendMessage(
            id,
            `Boshlovchi ${game.creator_user_name}'ga alohida tashakkur aytamiz!\n\nDasturchi: @dasturchining_tundaligi`
          );
        }
        await bot.sendMessage(id, `SvoyakCalculatorBot oʻz ishini tugatdi!`);
      } else {
        await bot.sendMessage(
          id,
          `Ushbu oʻyinni faqat ${game.creator_user_name} yakunlay oladi!`
        );
      }
    } else {
      await bot.sendMessage(id, `Faol oʻyin yoʻq!`);
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(
      id,
      `Qandaydir xatolik sodir boʻldi. Iltimos, oʻyinni qayta boshlang!`
    );
  }
};
