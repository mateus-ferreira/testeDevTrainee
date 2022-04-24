const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("teste", "teste", "teste",{
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