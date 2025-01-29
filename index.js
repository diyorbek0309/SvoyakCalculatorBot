const TelegramBot = require('node-telegram-bot-api');
const { TOKEN } = require('./config');
const ExtraControllers = require('./controllers/ExtraControllers');
const GameController = require('./controllers/GameController');
const GamerController = require('./controllers/GamerController');
const GroupController = require('./controllers/GroupController');
const postgres = require('./modules/postgres');

const bot = new TelegramBot(TOKEN, { polling: true });

async function main() {
  const psql = await postgres();

  bot.onText(/^\/start$/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Botdan foydalanish uchun guruhga administrator sifatida qoʻshishingiz kerak!`
    );
  });

  bot.onText(/\/startSvoyak/, (message) => {
    GameController(message.chat, message.from, 'start', bot, psql);
  });

  bot.onText(/\/endSvoyak/, (message) => {
    GameController(message.chat, message.from, 'end', bot, psql);
  });

  bot.onText(/^[-+]?\d+?$/, (message) => {
    if (message.reply_to_message) {
      GamerController(message, bot, psql);
    }
  });

  bot.onText(/\/sendAll/, async (message) => {
    GroupController.postForwardingHandler(message, bot, psql);
  });

  bot.onText(/\/removeMe/, (message) => {
    ExtraControllers.RemoveGamer(message, bot, psql);
  });

  bot.onText(/\/changeCreator/, (message) => {
    if (message.reply_to_message) {
      ExtraControllers.ChangeCreator(message, bot, psql);
    }
  });

  bot.onText(/\/stats/, (message) => {
    ExtraControllers.StatsController(message, bot, psql);
  });

  bot.onText(/\/clearDB/, (message) => {
    ExtraControllers.ClearDB(message, bot, psql);
  });

  bot.onText(/\/help/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Botdan foydalanish uchun buyruqlar:\n\n/startSvoyak - oʻyinni boshlash buyruqi. Ushbu buyruqni bergan foydalanuvchi oʻyin boshlovchisi hisoblanadi va ochko berish imkoniyatiga ega boʻladi. Ochkolar xabarga javob sifatida berilishi kerak.\n\n/changeCreator - boshlovchini oʻzgartirish buyruqi. Ushbu buyruqdan amaldagi boshlovchi yoki guruh adminlari foydalanishi mumkin. Buyruq xabarga javob sifatida berilishi kerak.\n\n/removeMe - tablodan oʻz ismingizni oʻchirish uchun ishlatishingiz mumkin.\n\n/endSvoyak - oʻyinni yakunlash va natijalarni e'lon qilish buyruqi. Ushbu buyruqdan amaldagi boshlovchi yoki guruh adminlari foydalanishi mumkin.\n\nBall berish uchun toʻgʻri javobga reply qilib ballni yozasiz.`
    );
  });

  bot.onText(/\/about/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Shaxsiy oʻyin jarayonida ochkolarni hisoblab boruvchi bot.\nDasturchi: @dasturchining_tundaligi`
    );
  });

  bot.on('message', async (message) => {
    if (message.chat.type === 'supergroup' || message.chat.type === 'group') {
      await GroupController.saveGroup(message, bot, psql, true);

      if (message.new_chat_members) {
        message.new_chat_members.forEach((member) => {
          if (member.id == 5536335495) {
            GroupController.saveGroup(message, bot, psql);
          }
        });
      }
    }
  });

  bot.on('my_chat_member', async (message) => {
    GroupController.removeGroup(message, bot, psql);
  });

  bot.onText(/\/startForwarding/, (msg) => {
    if (msg.from.id === parseInt(process.env.ADMIN)) {
      GroupController.forwardMessagesToAdmin(bot, psql);
    }
  });
}

main();
