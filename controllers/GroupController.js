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
          await bot.sendMessage(
            '175604385',
            `Added:\n${id} - ${title} \n${
              groupInfo.invite_link ?? ''
            } (old)\n\nTotal groups: ${totalGroupsCount}\nTotal subscribers: ${
              totalSubscribersCount + chatMemberCount
            }`
          );
        }
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
            }\n\nTotal groups: ${totalGroupsCount - 1}\nTotal subscribers: ${
              totalSubscribersCount - group.subscribers_count
            }`
          );
        }
      } catch (error) {
        console.error(`Failed to remove group from DB: ${error.message}`);
      }
    }
  }

  static async postForwardingHandler(message, bot, psql) {
    const chatId = message.chat.id;
    let awaitingPostLink = true;
    let channelId = '@zakadabiyot';

    if (chatId == '175604385') {
      await bot.sendMessage(
        chatId,
        'Please send the link to the post you want to forward.'
      );
    }

    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (awaitingPostLink && text && chatId == '175604385') {
        try {
          const postLinkMatch = text.match(/\/(\d+)$/);
          if (!postLinkMatch) {
            awaitingPostLink = false;
            await bot.sendMessage(
              chatId,
              'Invalid post link. Please make sure the link is correct.'
            );
            return;
          }

          const postId = postLinkMatch[1];
          awaitingPostLink = false;

          const groups = await psql.groups.findAll({
            attributes: ['id'],
          });

          if (groups.length === 0) {
            await bot.sendMessage(
              chatId,
              'No groups found to forward the post to.'
            );
            return;
          }

          let successCount = 0;
          let failureCount = 0;

          for (const group of groups) {
            try {
              await bot.forwardMessage(group.id, channelId, postId);
              successCount++;
            } catch (error) {
              await bot.sendMessage(
                chatId,
                `Failed to forward message to group ${group.id}: ${
                  group.title
                }\n${group.invite_link ?? ''}\n${error.message}`
              );
              console.error(
                `Failed to forward message to group ${group.id}:`,
                error.message
              );
              failureCount++;
            }
          }

          await bot.sendMessage(
            chatId,
            `Post forwarded to ${successCount} groups successfully.\n` +
              `Failed to forward to ${failureCount} groups.`
          );
        } catch (error) {
          console.error('Error forwarding post:', error);
          await bot.sendMessage(
            chatId,
            'An error occurred while trying to forward the post.'
          );
        }
      }
    });
  }

  static async showAllMembersHandler(message, bot) {
    const userId = message.from.id;
    awaitingChatId = true;

    if (userId != '175604385') {
      await bot.sendMessage(chatId, 'Only the bot admin can use this command.');
      return;
    }

    bot.on('message', async (msg) => {
      const userId = msg.from.id;

      if (awaitingChatId && userId == '175604385') {
        const chatId = msg.text;
        awaitingChatId = false;

        try {
          const memberCount = await bot.getChatMemberCount(chatId);

          if (memberCount > 100) {
            await bot.sendMessage(
              userId,
              'This command can only be used in groups with less than 100 members.'
            );
            return;
          }

          const membersList = [];

          for (let i = 0; i < memberCount; i++) {
            try {
              const member = await bot.getChatMember(chatId, i);
              const username =
                member.user.username || member.user.first_name || 'Unknown';
              membersList.push(username);
            } catch (error) {
              console.error(
                `Failed to get member with index ${i}:`,
                error.message
              );
            }
          }

          if (membersList.length === 0) {
            await bot.sendMessage(userId, 'No members found in this group.');
            return;
          }

          await bot.sendMessage(
            userId,
            `Group members (${
              membersList.length
            } members):\n\n${membersList.join('\n')}`
          );
        } catch (error) {
          console.error('Error fetching group members:', error);
          await bot.sendMessage(
            userId,
            'An error occurred while fetching group members. Make sure the chatId is correct.'
          );
        }
      }
    });
  }
};
