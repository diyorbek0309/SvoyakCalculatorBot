const TelegramBot = require("node-telegram-bot-api");
const Controllers = require("./controllers/controllers");
const { TOKEN } = require("./config");
const chatId = "175604385";

const options = {
  polling: true,
};

const bot = new TelegramBot(TOKEN, options);

bot.on("message", (message) => {
  Controllers.MessageController(message, bot);
});
