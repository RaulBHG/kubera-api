'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class steam_account_reference_game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      steam_account_reference_game.belongsTo(models.steam_account, {
        foreignKey: "steam_account_id",
        as: "steam_account",
      });
    }
  }
  steam_account_reference_game.init(
    {
      steam_account_id: DataTypes.UUID,
      steam_game_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      playtime_2_weeks: DataTypes.INTEGER,
      playtime_forever: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "steam_account_reference_game",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return steam_account_reference_game;
};