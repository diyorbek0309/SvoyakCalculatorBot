module.exports = async function GroupController(message, bot, psql) {
  const { id, title } = message.chat;

  try {
    const newGroup = await psql.groups.findOne({
      where: {
        id,
      },
    });
    console.log(bot.getChat(id));
    const totalGroupsCount = await psql.groups.count();

    if (!newGroup) {
      await psql.groups.create({
        id,
        title,
      });

      await bot.sendMessage(
        id,
        `Assalomu aleykum! ${
          message.from.username ?? message.from.first_name
        } SvoyakCalculatorBotni guruhingizga qo'shganingiz uchun raxmat!`
      );
      await bot.sendMessage(
        "175604385",
        `${id} - ${title} (new)\n\nJami guruhlar soni: ${
          totalGroupsCount + 1
        }\nJami obunachilar: 120`
      );
    } else {
      await bot.sendMessage(
        id,
        `Assalomu aleykum! ${
          message.from.username ?? message.from.first_name
        } SvoyakCalculatorBotni guruhingizga qo'shganingiz uchun raxmat!`
      );
      await bot.sendMessage(
        "175604385",
        `${id} - ${title} (new)\n\nJami guruhlar soni: ${totalGroupsCount}\nJami obunachilar: 120`
      );
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(id, `Qandaydir xatolik sodir boʻldi!`);
  }
};
