'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class piggy_bank_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  piggy_bank_log.init(
    {
      transaction_id: DataTypes.STRING,
      mistery_box: DataTypes.STRING,
      total_euro_ammount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "piggy_bank_log",
      underscored: true,
    }
  );
  return piggy_bank_log;
};