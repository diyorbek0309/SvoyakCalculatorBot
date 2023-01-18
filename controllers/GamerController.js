const sendResults = require("../services/sendResults");

module.exports = async function GamerController(message, bot, psql) {
  const { id, username, first_name } = message.reply_to_message.from;
  const creator_id = message.from.id;
  const group_id = parseInt(message.chat.id);
  const game = await psql.games.findOne({
    where: {
      group_id,
      status: "started",
    },
  });

  try {
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
          if (allGamers.length > 30) {
            bot.sendMessage(
              game.group_id,
              `Tabloda koʻpi bilan 30 ishtirokchi koʻrsatiladi!`
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
        await bot.sendMessage(game.group_id, `Hali oʻyin boshlanmagan!`);
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(
      game.group_id,
      `Qandaydir xatolik sodir boʻldi. Iltimos, oʻyinni qayta boshlang!`
    );
  }
};