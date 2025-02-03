'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mystery_box_roll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      mystery_box_roll.hasMany(models.game_provider_game, {
        foreignKey: "mystery_box_roll_id",
        as: "games",
      });
    }
  }
  mystery_box_roll.init(
    {
      viewed: DataTypes.BOOLEAN,
      rejected: DataTypes.BOOLEAN,
      selected: DataTypes.BOOLEAN,
      option_number: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "mystery_box_roll",
      underscored: true,
    }
  );
  return mystery_box_roll;
};