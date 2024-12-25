'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class steam_account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      steam_account.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  steam_account.init(
    {
      user_id: DataTypes.UUID,
      steam_username: DataTypes.STRING,
      steam_userid: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "steam_account",
      underscored: true,
    }
  );
  return steam_account;
};