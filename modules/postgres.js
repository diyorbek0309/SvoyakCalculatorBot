const { Sequelize } = require("sequelize");
const { POSTGRES } = require("../config");
const Models = require("./models");

const sequelize = new Sequelize(POSTGRES, {
  logging: false,
});

async function postgres() {
  try {
    let db = {};

    db.users = await Models.UserModel(Sequelize, sequelize);
    db.groups = await Models.GroupModel(Sequelize, sequelize);
    db.games = await Models.GameModel(Sequelize, sequelize);
    db.gamers = await Models.GamerModel(Sequelize, sequelize);

    await sequelize.sync({ force: false });

    console.log("Connected to DB");

    return db;
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
}

module.exports = postgres;
