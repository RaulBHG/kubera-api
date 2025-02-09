'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game_provider_game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  game_provider_game.init(
    {
      platform_id: DataTypes.STRING,
      game_provider: {
        type: DataTypes.ENUM,
        values: ["kinguin"],
      },
      name: DataTypes.STRING,
      region: DataTypes.STRING,
      external_data: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "game_provider_game",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return game_provider_game;
};