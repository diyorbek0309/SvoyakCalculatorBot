const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("./config");
const ExtraControllers = require("./controllers/ExtraControllers");
const GameController = require("./controllers/GameController");
const GamerController = require("./controllers/GamerController");
const postgres = require("./modules/postgres");

const bot = new TelegramBot(TOKEN, { polling: true });

async function main() {
  const psql = await postgres();

  await bot.onText(/^\/start$/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Botdan foydalanish uchun guruhga administrator sifatida qoʻshishingiz kerak!`
    );
  });

  await bot.onText(/\/startSvoyak/, (message) => {
    GameController(message.chat, message.from, "start", bot, psql);
  });

  await bot.onText(/\/endSvoyak/, (message) => {
    GameController(message.chat, message.from, "end", bot, psql);
  });

  await bot.onText(/^[-+]?\d+?$/, (message) => {
    if (message.reply_to_message) {
      GamerController(message, bot, psql);
    }
  });

  await bot.onText(/\/removeMe/, (message) => {
    ExtraControllers.RemoveGamer(message, bot, psql);
  });

  await bot.onText(/\/changeCreator/, (message) => {
    if (message.reply_to_message) {
      ExtraControllers.ChangeCreator(message, bot, psql);
    }
  });

  await bot.onText(/\/getStats/, (message) => {
    ExtraControllers.StatsController(message, bot, psql);
  });

  await bot.onText(/\/clearDB/, (message) => {
    ExtraControllers.ClearDB(message, bot, psql);
  });

  await bot.onText(/\/help/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Botdan foydalanish uchun buyruqlar:\n\n/startSvoyak - oʻyinni boshlash buyruqi. Ushbu buyruqni bergan foydalanuvchi oʻyin boshlovchisi hisoblanadi va ochko berish imkoniyatiga ega boʻladi. Ochkolar xabarga javob sifatida berilishi kerak.\n\n/changeCreator - boshlovchini oʻzgartirish buyruqi. Ushbu buyruqdan amaldagi boshlovchi yoki guruh adminlari foydalanishi mumkin. Buyruq xabarga javob sifatida berilishi kerak.\n\n/removeMe - tablodan oʻz ismingizni oʻchirish uchun ishlatishingiz mumkin.\n\n/endSvoyak - oʻyinni yakunlash va natijalarni e'lon qilish buyruqi. Ushbu buyruqdan amaldagi boshlovchi yoki guruh adminlari foydalanishi mumkin.`
    );
  });

  await bot.onText(/\/about/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Shaxsiy oʻyin jarayonida ochkolarni hisoblab boruvchi bot.\nDasturchi: @dasturchining_tundaligi`
    );
  });

  // await bot.onText(/\/aytibar/, (message) => {
  //   ExtraControllers.Aytibar(message, bot);
  // });
}

main();
