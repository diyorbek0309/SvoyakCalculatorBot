module.exports = class Models {
  static async UserModel(Sequelize, sequelize) {
    return await sequelize.define("user", {
      chat_id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
      },
    });
  }
  static async GroupModel(Sequelize, sequelize) {
    return await sequelize.define("group", {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
      },
    });
  }
  static async GameModel(Sequelize, sequelize) {
    return await sequelize.define("game", {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      group_id: {
        type: Sequelize.DataTypes.BIGINT,
      },
      creator_id: {
        type: Sequelize.DataTypes.BIGINT,
      },
      creator_user_name: {
        type: Sequelize.DataTypes.STRING,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
      },
    });
  }
  static async GamerModel(Sequelize, sequelize) {
    return await sequelize.define("gamer", {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      game_id: {
        type: Sequelize.DataTypes.UUID,
      },
      user_id: {
        type: Sequelize.DataTypes.BIGINT,
      },
      user_name: {
        type: Sequelize.DataTypes.STRING,
      },
      score: {
        type: Sequelize.DataTypes.INTEGER,
      },
    });
  }
};
