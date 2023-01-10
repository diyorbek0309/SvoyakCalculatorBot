const TelegramBot = require("node-telegram-bot-api");
const Controllers = require("./controllers/controllers");
const { TOKEN } = require("./config");
const postgres = require("./modules/postgres");

const bot = new TelegramBot(TOKEN, { polling: true });

async function main() {
  const psql = await postgres();

  // await bot.on("message", (message) => {
  //   console.log(bot);
  // });

  // await bot.on("new_chat_members", (message) => {
  //   if (message.chat.id) {
  //     Controllers.GroupController(message.chat, bot, psql);
  //   }
  // });

  await bot.onText(/\/startSvoyak/, (message) => {
    Controllers.GameController(message.chat, message.from, "start", bot, psql);
  });

  await bot.onText(/\/endSvoyak/, (message) => {
    Controllers.GameController(message.chat, message.from, "end", bot, psql);
  });

  await bot.onText(/^[-+]?\d+?$/, (message) => {
    if (message.reply_to_message) {
      if (parseInt(message.text) > 1001 || parseInt(message.text) < -1001) {
        bot.sendMessage(message.chat.id, `Noto'g'ri ball berdingiz!`);
      } else {
        Controllers.GamerController(message, bot, psql);
      }
    } else {
      bot.sendMessage(
        message.chat.id,
        "Ochkoni xabarga javob tarzida jo'natishingiz kerak!"
      );
    }
  });
  await bot.onText(/\/aytibar/, (message) => {
    Controllers.Aytibar(message, bot);
  });
}

main();
