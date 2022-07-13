const TelegramBot = require("node-telegram-bot-api");
const Controllers = require("./controllers/controllers");
const { TOKEN } = require("./config");
const postgres = require("./modules/postgres");

const bot = new TelegramBot(TOKEN, { polling: true });

async function main() {
  const psql = await postgres();

  // await bot.on("message", (message) => {
  //   Controllers.MessageController(message, bot, psql);
  // });

  await bot.on("new_chat_members", (message) => {
    console.log(message);
    if (message.chat.id) {
      Controllers.GroupController(message.chat, bot, psql);
    }
  });

  await bot.onText(/\/startSvoyak/, (message) => {
    Controllers.GameController(message.chat, message.from, "start", bot, psql);
  });

  await bot.onText(/\/endSvoyak/, (message) => {
    Controllers.GameController(message.chat, message.from, "end", bot, psql);
  });

  await bot.onText(/[1-9][0-9]/, (message) => {
    if (message.reply_to_message) {
      Controllers.GamerController(message, bot, psql);
    } else {
      bot.sendMessage(
        message.chat.id,
        "Ochkoni xabarga javob tarzida jo'natishingiz kerak!"
      );
    }
  });
}

main();
