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
            } SvoyakCalculatorBotni guruhingizga qayta qoʻshganingiz uchun raxmat!\nBot imkoniyatlaridan toʻliq foydalanish uchun guruhda admin qiling!`
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
      await bot.sendMessage(
        process.env.ADMIN,
        `Qandaydir xatolik sodir boʻldi: ${error}`
      );
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
        await bot.sendMessage(
          process.env.ADMIN,
          `Failed to remove group from DB: ${error.message}`
        );
      }
    }
  }

  static async postForwardingHandler(message, bot, psql) {
    const chatId = message.chat.id;
    let awaitingPostLink = true;

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
          const postLinkMatch = text.match(/t\.me\/([\w_]+)\/(\d+)/);
          if (!postLinkMatch) {
            awaitingPostLink = false;
            await bot.sendMessage(
              chatId,
              'Invalid post link. Please make sure the link is correct.'
            );
            return;
          }

          const channelId = `@${postLinkMatch[1]}`;
          const postId = postLinkMatch[2];
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
              await bot.copyMessage(group.id, channelId, postId);

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

  static async forwardMessagesToAdmin(bot, psql) {
    let isForwarding = false;
    let forwardingGroupId = null;
    let awaitingGroupId = false;
    const adminId = process.env.ADMIN;

    bot.removeAllListeners('message');

    bot.onText(/\/stopForwarding/, async (msg) => {
      if (isForwarding && msg.from.id === parseInt(adminId)) {
        isForwarding = false;
        forwardingGroupId = null;
        await bot.sendMessage(adminId, '🚫 Forwarding has been stopped.');
      } else {
        await bot.sendMessage(adminId, '⚠️ Forwarding is not active.');
      }
    });

    bot.on('message', async (msg) => {
      if (awaitingGroupId && msg.from.id === parseInt(adminId)) {
        const groupId = msg.text.trim();

        try {
          const group = await psql.groups.findOne({ where: { id: groupId } });

          if (group) {
            forwardingGroupId = groupId;
            awaitingGroupId = false;
            isForwarding = true;

            await bot.sendMessage(
              adminId,
              `✅ Forwarding messages from group ${
                group?.title || forwardingGroupId
              } to admin has started.`
            );
          } else {
            awaitingGroupId = false;
            await bot.sendMessage(
              adminId,
              `❌ Error: Group ID ${groupId} not found in the database.`
            );
          }
        } catch (error) {
          console.error('Database error:', error);
          awaitingGroupId = false;
          await bot.sendMessage(
            adminId,
            '⚠️ Database error occurred while checking the group ID.'
          );
        }
      }
    });

    bot.on('message', async (message) => {
      if (!isForwarding || message.chat.id != forwardingGroupId) return;

      try {
        const { text, from, reply_to_message, date } = message;

        let sender = from.first_name || 'Unknown';
        if (from.last_name) sender += ` ${from.last_name}`;
        if (from.username) sender += ` (@${from.username})`;

        let replyTo = '';
        if (reply_to_message) {
          const replyFrom = reply_to_message.from;
          replyTo = `\n🔄 Reply to: ${replyFrom.first_name || 'Unknown'}`;
          if (replyFrom.last_name) replyTo += ` ${replyFrom.last_name}`;
          if (replyFrom.username) replyTo += ` (@${replyFrom.username})`;
        }

        const messageDate = new Date(date * 1000).toLocaleString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
        });

        const forwardText = `📩 *New Message in Group*\n👤 *From:* ${sender}${replyTo}\n🕒 *Time:* ${messageDate}\n\n📝 *Message:* ${
          text || '[No text]'
        } `;

        await bot.sendMessage(adminId, forwardText, { parse_mode: 'Markdown' });
      } catch (error) {
        console.error('Error forwarding message:', error);
      }
    });

    awaitingGroupId = true;
    await bot.sendMessage(
      adminId,
      '📥 Please enter the groupId of the group you want to forward messages from:'
    );
  }
};
