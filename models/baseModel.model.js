const { Model } = require('sequelize');

class BaseModel extends Model {
    id;
    createdAt;
    updatedAt;
}
module.exports = {
    BaseModel
}