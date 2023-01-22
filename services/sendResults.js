module.exports = async function sendResults(bot, game, allGamers) {
  let message = "📋 Tablo 📋 \n \n";
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
