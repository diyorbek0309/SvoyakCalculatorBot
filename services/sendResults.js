module.exports = async function sendResults(bot, game, allGamers) {
  await bot.sendMessage(
    game.group_id,
    `📋 Tablo 📋 \n \n🥇 ${allGamers[0].user_name}: ${allGamers[0].score} ball` +
      `\n` +
      `${
        allGamers[1]
          ? `🥈 ${allGamers[1].user_name}: ${allGamers[1].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[2]
          ? `🥉 ${allGamers[2].user_name}: ${allGamers[2].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[3]
          ? `4️⃣ ${allGamers[3].user_name}: ${allGamers[3].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[4]
          ? `5️⃣ ${allGamers[4].user_name}: ${allGamers[4].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[5]
          ? `6️⃣ ${allGamers[5].user_name}: ${allGamers[5].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[6]
          ? `7. ${allGamers[6].user_name}: ${allGamers[6].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[7]
          ? `8. ${allGamers[7].user_name}: ${allGamers[7].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[8]
          ? `9. ${allGamers[8].user_name}: ${allGamers[8].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[9]
          ? `10. ${allGamers[9].user_name}: ${allGamers[9].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[10]
          ? `11. ${allGamers[10].user_name}: ${allGamers[10].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[11]
          ? `12. ${allGamers[11].user_name}: ${allGamers[11].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[12]
          ? `13. ${allGamers[12].user_name}: ${allGamers[12].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[13]
          ? `14. ${allGamers[13].user_name}: ${allGamers[13].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[14]
          ? `15. ${allGamers[14].user_name}: ${allGamers[14].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[15]
          ? `16. ${allGamers[15].user_name}: ${allGamers[15].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[16]
          ? `17. ${allGamers[16].user_name}: ${allGamers[16].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[17]
          ? `18. ${allGamers[17].user_name}: ${allGamers[17].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[18]
          ? `19. ${allGamers[18].user_name}: ${allGamers[18].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[19]
          ? `20. ${allGamers[19].user_name}: ${allGamers[19].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[20]
          ? `21. ${allGamers[20].user_name}: ${allGamers[20].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[21]
          ? `22. ${allGamers[21].user_name}: ${allGamers[21].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[22]
          ? `23. ${allGamers[22].user_name}: ${allGamers[22].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[23]
          ? `24. ${allGamers[23].user_name}: ${allGamers[23].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[24]
          ? `25. ${allGamers[24].user_name}: ${allGamers[24].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[25]
          ? `26. ${allGamers[25].user_name}: ${allGamers[25].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[26]
          ? `27. ${allGamers[26].user_name}: ${allGamers[26].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[27]
          ? `28. ${allGamers[27].user_name}: ${allGamers[27].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[28]
          ? `29. ${allGamers[28].user_name}: ${allGamers[28].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[29]
          ? `30. ${allGamers[29].user_name}: ${allGamers[29].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[30]
          ? `31. ${allGamers[30].user_name}: ${allGamers[30].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[31]
          ? `32. ${allGamers[31].user_name}: ${allGamers[31].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[32]
          ? `33. ${allGamers[32].user_name}: ${allGamers[32].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[33]
          ? `34. ${allGamers[33].user_name}: ${allGamers[33].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[34]
          ? `35. ${allGamers[34].user_name}: ${allGamers[34].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[35]
          ? `36. ${allGamers[35].user_name}: ${allGamers[35].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[36]
          ? `37. ${allGamers[36].user_name}: ${allGamers[36].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[37]
          ? `38. ${allGamers[37].user_name}: ${allGamers[37].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[38]
          ? `39. ${allGamers[38].user_name}: ${allGamers[38].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[39]
          ? `40. ${allGamers[39].user_name}: ${allGamers[39].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[40]
          ? `41. ${allGamers[40].user_name}: ${allGamers[40].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[41]
          ? `42. ${allGamers[41].user_name}: ${allGamers[41].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[42]
          ? `43. ${allGamers[42].user_name}: ${allGamers[42].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[43]
          ? `44. ${allGamers[43].user_name}: ${allGamers[43].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[44]
          ? `45. ${allGamers[44].user_name}: ${allGamers[44].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[45]
          ? `46. ${allGamers[45].user_name}: ${allGamers[45].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[46]
          ? `47. ${allGamers[46].user_name}: ${allGamers[46].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[47]
          ? `48. ${allGamers[47].user_name}: ${allGamers[47].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[48]
          ? `49. ${allGamers[48].user_name}: ${allGamers[48].score} ball` + `\n`
          : ""
      }` +
      `${
        allGamers[49]
          ? `50. ${allGamers[49].user_name}: ${allGamers[49].score} ball` + `\n`
          : ""
      }`
  );
};
