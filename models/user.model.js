const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database/config");
const { Asset } = require("./asset.model");
const { BaseModel } = require("./baseModel.model");
const bcrypt = require('bcryptjs');

class User extends BaseModel {}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
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
},{ sequelize,freezeTableName: true, tableName: 'user' });

User.beforeSave(user => {
    const salt = bcrypt.genSaltSync();
    user.dataValues.password = bcrypt.hashSync(user.dataValues.password, salt);
})

User.Asset = User.hasMany(Asset);
Asset.User = Asset.belongsTo(User);

module.exports = {
    User
}