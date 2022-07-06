const TelegramBot = require("node-telegram-bot-api");
const Controllers =  require("./controllers/controllers");
const TOKEN = "5536335495:AAGVqewfdALT4XaL_pEMUvi87uv_cDpF8Ms";
const chatId = "175604385";

const options = {
  polling: true,
};

const bot = new TelegramBot(TOKEN, options);

bot.on("message", (message) => {
  Controllers.MessageController(message, bot);
});
