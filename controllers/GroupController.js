module.exports = async function GroupController(group, bot, psql) {
  const { id, title } = group;

  try {
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

      await bot.sendMessage(
        id,
        `SvoyakCalculatorBotni guruhingizga qo'shganingiz uchun raxmat!`
      );
    } else {
      await bot.sendMessage(
        id,
        `SvoyakCalculatorBotni guruhingizga qaytarganingiz uchun raxmat!`
      );
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(id, `Qandaydir xatolik sodir boʻldi!`);
  }
};
