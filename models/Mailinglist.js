const {Model, DataTypes} = require("sequelize")
const sequelize = require("../config/connection");

//TODO: don't allow duplicates.

class Mailinglist extends Model {}

Mailinglist.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			unique: true,
		},
		donationFlag: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: "mailingList"
	}
);

module.exports = Mailinglist;
