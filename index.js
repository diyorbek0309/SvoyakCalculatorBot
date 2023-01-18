const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("./config");
const ExtraControllers = require("./controllers/ExtraControllers");
const GameController = require("./controllers/GameController");
const GamerController = require("./controllers/GamerController");
const postgres = require("./modules/postgres");

const bot = new TelegramBot(TOKEN, { polling: true });

async function main() {
  const psql = await postgres();

  await bot.onText(/\/startSvoyak/, (message) => {
    GameController(message.chat, message.from, "start", bot, psql);
  });

  await bot.onText(/\/endSvoyak/, (message) => {
    GameController(message.chat, message.from, "end", bot, psql);
  });

  await bot.onText(/^[-+]?\d+?$/, (message) => {
    if (message.reply_to_message) {
      if (parseInt(message.text) > 1001 || parseInt(message.text) < -1001) {
        bot.sendMessage(message.chat.id, `Notoʻgʻri ball berdingiz!`);
      } else {
        GamerController(message, bot, psql);
      }
    }
  });

  await bot.onText(/\/changeCreator/, (message) => {
    if (message.reply_to_message) {
      ExtraControllers.ChangeCreator(message, bot, psql);
    }
  });

  await bot.onText(/\/aytibar/, (message) => {
    ExtraControllers.Aytibar(message, bot);
  });

  await bot.onText(/\/clearDB/, () => {
    ExtraControllers.ClearDB(psql);
  });
}

main();
