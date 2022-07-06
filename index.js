const TelegramBot = require("node-telegram-bot-api");
const Controllers = require("./controllers/controllers");
const { TOKEN } = require("./config");
const postgres = require("./modules/postgres");

const bot = new TelegramBot(TOKEN, { polling: true });

async function main() {
  const psql = await postgres();

  await bot.on("message", (message) => {
    Controllers.MessageController(message, bot, psql);
  });
}

main();
