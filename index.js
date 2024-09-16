const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("./config");
const ExtraControllers = require("./controllers/ExtraControllers");
const GameController = require("./controllers/GameController");
const GamerController = require("./controllers/GamerController");
const postgres = require("./modules/postgres");

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
    GameController(message.chat, message.from, "start", bot, psql);
  });

  bot.onText(/\/endSvoyak/, (message) => {
    GameController(message.chat, message.from, "end", bot, psql);
  });

  bot.onText(/^[-+]?\d+?$/, (message) => {
    if (message.reply_to_message) {
      GamerController(message, bot, psql);
    }
  });

  bot.onText(/\/removeMe/, (message) => {
    ExtraControllers.RemoveGamer(message, bot, psql);
  });

  bot.onText(/\/changeCreator/, (message) => {
    if (message.reply_to_message) {
      ExtraControllers.ChangeCreator(message, bot, psql);
    }
  });

  bot.onText(/\/getStats/, (message) => {
    ExtraControllers.StatsController(message, bot, psql);
  });

  bot.onText(/\/clearDB/, (message) => {
    ExtraControllers.ClearDB(message, bot, psql);
  });

  bot.onText(/\/help/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Botdan foydalanish uchun buyruqlar:\n\n/startSvoyak - oʻyinni boshlash buyruqi. Ushbu buyruqni bergan foydalanuvchi oʻyin boshlovchisi hisoblanadi va ochko berish imkoniyatiga ega boʻladi. Ochkolar xabarga javob sifatida berilishi kerak.\n\n/changeCreator - boshlovchini oʻzgartirish buyruqi. Ushbu buyruqdan amaldagi boshlovchi yoki guruh adminlari foydalanishi mumkin. Buyruq xabarga javob sifatida berilishi kerak.\n\n/removeMe - tablodan oʻz ismingizni oʻchirish uchun ishlatishingiz mumkin.\n\n/endSvoyak - oʻyinni yakunlash va natijalarni e'lon qilish buyruqi. Ushbu buyruqdan amaldagi boshlovchi yoki guruh adminlari foydalanishi mumkin.`
    );
  });

  bot.onText(/\/about/, (message) => {
    bot.sendMessage(
      message.chat.id,
      `Shaxsiy oʻyin jarayonida ochkolarni hisoblab boruvchi bot.\nDasturchi: @dasturchining_tundaligi`
    );
  });

  // Listen for any kind of message
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (msg.chat.type === "supergroup" || msg.chat.type === "group") {
      if (msg.new_chat_members) {
        console.log(msg);
        
        msg.new_chat_members.forEach((member) => {
          console.log(member);

          if (member.id == 5536335495) {
            console.log(member);
            bot.sendMessage(
              chatId,
              "Hello everyone! I have been added to this group."
            );
          }
        });
      }
    }
  });

  // // Handle when the bot is added to a group
  bot.on("my_chat_member", (update) => {
    const chatId = update.chat.id;
    const status = update.my_chat_member.new_chat_member.status;

    if (
      status === "member" ||
      status === "administrator" ||
      status === "owner"
    ) {
      bot.sendMessage(chatId, "I have joined the group as a member.");
    }
  });

  // Handle when the bot is removed from a group
  bot.on("chat_member", (update) => {
    const chatId = update.chat.id;
    const status = update.chat_member.new_chat_member.status;

    if (status === "left" || status === "kicked") {
      bot.sendMessage(chatId, "I have been removed from the group.");
    }
  });
}

main();
