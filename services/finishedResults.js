module.exports = async function finishedResults(bot, game, allGamers) {
  allGamers.sort((a, b) => b.score - a.score);

  let message = "📊 Yakuniy natijalar 📊 \n \n";
  let currentRank = 1;
  let currentScore = allGamers[0].score;
  for (let i = 0; i < allGamers.length; i++) {
    let gamer = allGamers[i];
    if (gamer.score != currentScore) {
      currentRank = i + 1;
      currentScore = gamer.score;
    }
    message += `${getEmoji(currentRank)} ${gamer.user_name}: ${
      gamer.score
    } ball\n`;
  }
  message +=
    "\n \n" +
    "🏆Gʻoliblarni gʻalaba bilan tabriklaymiz! 🎉🎉🎉 \n \nOʻyinimizda faol ishtirok etgan barchaga rahmat,  ilmingiz bundanda ziyoda boʻlsin! 😇";
  await bot.sendMessage(game.group_id, message);
};

function getEmoji(rank) {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `${rank}.`;
  }
}
