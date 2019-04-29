/**
 * User Schema
 */

module.exports = (sequelize, DataTypes) => {
  const userSchema = sequelize.define("users", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    refreshToken:{
      type:DataTypes.STRING
    }
  });

  return userSchema;
};