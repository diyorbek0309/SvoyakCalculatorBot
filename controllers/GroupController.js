module.exports = async function GroupController(message, bot, psql) {
  const { id, title } = message.chat;

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
      await bot.sendMessage("175604385", `${id} - ${title} (yangi)`);
    } else {
      await bot.sendMessage(
        id,
        `SvoyakCalculatorBotni guruhingizga qaytarganingiz uchun raxmat!`
      );
      await bot.sendMessage("175604385", `${id} - ${title} (qayta qo'shildi)`);
    }
  } catch (error) {
    console.log(error);
    await bot.sendMessage(id, `Qandaydir xatolik sodir boʻldi!`);
  }
};
