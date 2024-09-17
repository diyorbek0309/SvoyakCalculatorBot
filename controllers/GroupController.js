module.exports = class GroupController {
  static async saveGroup(message, bot, psql, isOld = false) {
    const { id, title } = message.chat;
    const { username, first_name } = message.from;

    try {
      const newGroup = await psql.groups.findOne({
        where: {
          id,
        },
      });

      const groupInfo = await bot.getChat(id);
      const chatMemberCount = await bot.getChatMemberCount(id);
      const totalGroupsCount = await psql.groups.count();
      const totalSubscribersCountResult = await psql.groups.sum(
        'subscribers_count'
      );
      const totalSubscribersCount = totalSubscribersCountResult || 0;

      if (!newGroup) {
        await psql.groups.create({
          id,
          title,
          invite_link: groupInfo?.invite_link,
          subscribers_count: chatMemberCount,
        });

        if (!isOld) {
          await bot.sendMessage(
            id,
            `Assalomu aleykum! ${
              username ? '@' + username : first_name
            } SvoyakCalculatorBotni guruhingizga qoʻshganingiz uchun raxmat!`
          );
        }
        await bot.sendMessage(
          '175604385',
          `Added:\n${id} - ${title} \n${groupInfo.invite_link ?? ''} ${
            isOld ? '(old)' : '(new)'
          }\n\nTotal groups: ${totalGroupsCount + 1}\nTotal subscribers: ${
            totalSubscribersCount + chatMemberCount
          }`
        );
      } else {
        if (!isOld) {
          await bot.sendMessage(
            id,
            `Assalomu aleykum! ${
              username ? '@' + username : first_name
            } SvoyakCalculatorBotni guruhingizga qayta qoʻshganingiz uchun raxmat!`
          );
        }
        await bot.sendMessage(
          '175604385',
          `Added:\n${id} - ${title} \n${
            groupInfo.invite_link ?? ''
          } (old)\n\nTotal groups: ${totalGroupsCount}\nTotal subscribers: ${
            totalSubscribersCount + chatMemberCount
          }`
        );
      }
    } catch (error) {
      console.log(error);
      await bot.sendMessage(id, `Qandaydir xatolik sodir boʻldi!`);
    }
  }

  static async removeGroup(message, bot, psql) {
    const { id, title } = message.chat;
    const newStatus = message.new_chat_member.status;

    if (newStatus === 'kicked' || newStatus === 'left') {
      try {
        const group = await psql.groups.findOne({
          where: { id },
        });
        const totalGroupsCount = await psql.groups.count();
        const totalSubscribersCountResult = await psql.groups.sum(
          'subscribers_count'
        );
        const totalSubscribersCount = totalSubscribersCountResult || 0;

        if (group) {
          await psql.groups.destroy({
            where: { id },
          });

          await bot.sendMessage(
            '175604385',
            `Removed:\n${id} - ${title} \n${
              group.invite_link ?? ''
            }\n\nTotal groups: ${totalGroupsCount}\nTotal subscribers: ${totalSubscribersCount}`
          );
        }
      } catch (error) {
        console.error(`Failed to remove group from DB: ${error.message}`);
      }
    }
  }
};
