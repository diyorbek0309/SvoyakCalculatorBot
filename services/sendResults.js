module.exports = async function sendResults(bot, game, allGamers) {
  await bot.sendMessage(
    game.group_id,
    `Umumiy natijalar: \n \n1. @${
      allGamers[0].user_name || allGamers[0].first_name
    }: ${allGamers[0].score} ball` +
      `\n` +
      `${
        allGamers[1]
          ? `2. @${allGamers[1].user_name || allGamers[1].first_name}: ${
              allGamers[1].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[2]
          ? `3. @${allGamers[2].user_name || allGamers[2].first_name}: ${
              allGamers[2].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[3]
          ? `4. @${allGamers[3].user_name || allGamers[3].first_name}: ${
              allGamers[3].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[4]
          ? `5. @${allGamers[4].user_name || allGamers[4].first_name}: ${
              allGamers[4].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[5]
          ? `6. @${allGamers[5].user_name || allGamers[5].first_name}: ${
              allGamers[5].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[6]
          ? `7. @${allGamers[6].user_name || allGamers[6].first_name}: ${
              allGamers[6].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[7]
          ? `8. @${allGamers[7].user_name || allGamers[7].first_name}: ${
              allGamers[7].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[8]
          ? `9. @${allGamers[8].user_name || allGamers[8].first_name}: ${
              allGamers[8].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[9]
          ? `10. @${allGamers[9].user_name || allGamers[9].first_name}: ${
              allGamers[9].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[10]
          ? `11. @${allGamers[10].user_name || allGamers[10].first_name}: ${
              allGamers[10].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[11]
          ? `12. @${allGamers[11].user_name || allGamers[11].first_name}: ${
              allGamers[11].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[12]
          ? `13. @${allGamers[12].user_name || allGamers[12].first_name}: ${
              allGamers[12].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[13]
          ? `14. @${allGamers[13].user_name || allGamers[13].first_name}: ${
              allGamers[13].score
            } ball` + `\n`
          : ""
      }` +
      `${
        allGamers[14]
          ? `15. @${allGamers[14].user_name || allGamers[14].first_name}: ${
              allGamers[14].score
            } ball` + `\n`
          : ""
      }`
  );
};
