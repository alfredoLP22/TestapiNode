const { BaseModel } = require("./baseModel.model");
const { sequelize } = require("../database/config");
const { DataTypes, Model } = require("sequelize");
const { User } = require("./user.model");

class Asset extends BaseModel {}

Asset.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    article: {
        type: DataTypes.STRING,
        validate: {
            max: 250
        },
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        validate: {
            max: 250
        },
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        default: Date.now(),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{ sequelize,freezeTableName: true,tableName: 'asset' });

module.exports = {
    Asset
}