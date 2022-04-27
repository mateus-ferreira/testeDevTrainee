require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_DATABASE_DEV, process.env.DB_USERNAME_DEV, process.env.DB_PASSWORD_DEV,{
    dialect: 'sqlite',
    storage: './database.sqlite'
  });

const User = sequelize.define('User', {
    nome: {
        type: DataTypes.STRING,
        unique: true,
        allownull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true

        }
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 18,
        max: 130
    },
    sequelize,
    modelName: 'User'
});

User.removeAttribute('id')

module.exports = User
