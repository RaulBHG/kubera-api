'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game_provider_games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  game_provider_games.init(
    {
      platform_id: DataTypes.STRING,
      game_provider: DataTypes.ENUM,
      name: DataTypes.STRING,
      region: DataTypes.STRING,
      external_data: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "game_provider_games",
      underscored: true,
    }
  );
  return game_provider_games;
};