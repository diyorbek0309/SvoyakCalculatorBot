const sendResults = require('../services/sendResults');

module.exports = async function GamerController(message, bot, psql) {
  const {
    reply_to_message: {
      from: { id, username, first_name },
    },
    from: { id: creator_id },
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
      if (
        (+game.creator_id === creator_id || creator_id === 175604385) &&
        parseInt(message.text) < 1001 &&
        parseInt(message.text) > -1001
      ) {
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
            user_name: username ? `@${username}` : first_name,
            score: parseInt(message.text),
          });
          const allGamers = await psql.gamers.findAll({
            where: {
              game_id: game.id,
            },
          });
          allGamers.sort((a, b) => b.score - a.score);
          if (allGamers.length > 0) {
            await sendResults(bot, game, allGamers);
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
          await sendResults(bot, game, allGamers);
        }
      }
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(
      process.env.ADMIN,
      `Qandaydir xatolik sodir boʻldi: ${error}`
    );
  }
};
