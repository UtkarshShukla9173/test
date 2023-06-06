const { DataTypes } = require('sequelize');
const db = require('./dbConnection');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file:{
  type:DataTypes.file,
  allowNull:true
  }
});

module.exports = User;