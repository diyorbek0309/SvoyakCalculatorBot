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
                ? `11. @${
                    allGamers[10].user_name || allGamers[10].first_name
                  }: ${allGamers[10].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[11]
                ? `12. @${
                    allGamers[11].user_name || allGamers[11].first_name
                  }: ${allGamers[11].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[12]
                ? `13. @${
                    allGamers[12].user_name || allGamers[12].first_name
                  }: ${allGamers[12].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[13]
                ? `14. @${
                    allGamers[13].user_name || allGamers[13].first_name
                  }: ${allGamers[13].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[14]
                ? `15. @${
                    allGamers[14].user_name || allGamers[14].first_name
                  }: ${allGamers[14].score} ball` + `\n`
                : ""
            }`
        );
      } else {
        gamer.score = parseInt(gamer.score) + parseInt(message.text);
        await gamer.save();

        const allGamers = await psql.gamers.findAll({
          where: {
            game_id: game.id,
          },
        });

        allGamers.sort((a, b) => b.score - a.score);

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
                ? `11. @${
                    allGamers[10].user_name || allGamers[10].first_name
                  }: ${allGamers[10].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[11]
                ? `12. @${
                    allGamers[11].user_name || allGamers[11].first_name
                  }: ${allGamers[11].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[12]
                ? `13. @${
                    allGamers[12].user_name || allGamers[12].first_name
                  }: ${allGamers[12].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[13]
                ? `14. @${
                    allGamers[13].user_name || allGamers[13].first_name
                  }: ${allGamers[13].score} ball` + `\n`
                : ""
            }` +
            `${
              allGamers[14]
                ? `15. @${
                    allGamers[14].user_name || allGamers[14].first_name
                  }: ${allGamers[14].score} ball` + `\n`
                : ""
            }`
        );

        // await bot.sendMessage(
        //   game.group_id,
        //   "&#128285; Umumiy natijalar: \n \n" +
        //     `1. ${allGamers[0].user_name}: ${allGamers[0].score} ball` +
        //     `\n` +
        //     `${
        //       allGamers[1]
        //         ? `2. ${allGamers[1].user_name}: ${allGamers[1].score} ball` +
        //           `\n`
        //         : ""
        //     }` +
        //     `${
        //       allGamers[2]
        //         ? `3. ${allGamers[2].user_name}: ${allGamers[2].score} ball` +
        //           `\n`
        //         : ""
        //     }` +
        //     `${
        //       allGamers[3]
        //         ? `4. ${allGamers[3].user_name}: ${allGamers[3].score} ball` +
        //           `\n`
        //         : ""
        //     }` +
        //     `${
        //       allGamers[4]
        //         ? `5. ${allGamers[4].user_name}: ${allGamers[4].score} ball` +
        //           `\n`
        //         : ""
        //     }` +
        //     `${
        //       allGamers[5]
        //         ? `6. ${allGamers[5].user_name}: ${allGamers[5].score} ball` +
        //           `\n`
        //         : ""
        //     }` +
        //     `${
        //       allGamers[6]
        //         ? `7. ${allGamers[6].user_name}: ${allGamers[6].score} ball` +
        //           `\n`
        //         : ""
        //     }`,
        //   `${
        //     allGamers[7]
        //       ? `8. ${allGamers[7].user_name}: ${allGamers[7].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[8]
        //       ? `9. ${allGamers[8].user_name}: ${allGamers[8].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[9]
        //       ? `10. ${allGamers[9].user_name}: ${allGamers[9].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[10]
        //       ? `11. ${allGamers[10].user_name}: ${allGamers[10].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[11]
        //       ? `12. ${allGamers[11].user_name}: ${allGamers[11].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[12]
        //       ? `13. ${allGamers[12].user_name}: ${allGamers[12].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[13]
        //       ? `14. ${allGamers[13].user_name}: ${allGamers[13].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[14]
        //       ? `15. ${allGamers[14].user_name}: ${allGamers[14].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[15]
        //       ? `16. ${allGamers[15].user_name}: ${allGamers[15].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[16]
        //       ? `17. ${allGamers[16].user_name}: ${allGamers[16].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[17]
        //       ? `18. ${allGamers[17].user_name}: ${allGamers[17].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[18]
        //       ? `19. ${allGamers[18].user_name}: ${allGamers[18].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   `${
        //     allGamers[19]
        //       ? `20. ${allGamers[19].user_name}: ${allGamers[19].score} ball` +
        //         `\n`
        //       : ""
        //   }`,
        //   { parse_mode: "HTML" }
        // );
      }
    } else {
      await bot.sendMessage(game.group_id, `Hali o'yin boshlanmagan!`);
    }
  }
};
