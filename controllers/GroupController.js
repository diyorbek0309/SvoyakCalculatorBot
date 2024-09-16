module.exports = async function GroupController(message, bot, psql) {
  const { id, title } = message.chat;
  const { username, first_name } = message.from;

  try {
    const newGroup = await psql.groups.findOne({
      where: {
        id,
      },
    });
    const groupInfo = await bot.getChat(id);
    const totalGroupsCount = await psql.groups.count();
    console.log(groupInfo);
    
    if (!newGroup) {
      await psql.groups.create({
        id,
        title,
      });

      await bot.sendMessage(
        id,
        `Assalomu aleykum! ${
          username ? "@" + username : first_name
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
          username ? "@" + username : first_name
        } SvoyakCalculatorBotni guruhingizga qayta qo'shganingiz uchun raxmat!`
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
