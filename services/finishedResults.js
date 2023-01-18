module.exports = async function finishedResults(bot, game, allGamers) {
  await bot.sendMessage(
    game.group_id,
    `📊 Yakuniy natijalar 📊 \n \n🥇 @${
      allGamers[0].user_name || allGamers[0].first_name
    }: ${allGamers[0].score} ball` +
      `\n` +
      `${
        allGamers[1]
          ? `🥈 @${allGamers[1].user_name || allGamers[1].first_name}: ${
              allGamers[1].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[2]
          ? `🥉 @${allGamers[2].user_name || allGamers[2].first_name}: ${
              allGamers[2].score
            } ball` + `\n`
          : ""
      }` +
      "\n \n" +
      "🏆Gʻoliblarni gʻalaba bilan tabriklaymiz! 🎉🎉🎉 \n \nOʻyinimizda faol ishtirok etgan barchaga rahmat,  ilmingiz bundanda ziyoda boʻlsin! 😇"
  );
};
