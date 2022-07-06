module.exports = class Models {
  static async UserModel(Sequelize, sequelize) {
    return await sequelize.define("user", {
      chat_id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
      },
    });
  }
};
