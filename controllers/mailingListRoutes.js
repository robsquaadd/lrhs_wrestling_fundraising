const router = require("express").Router();
const { Mailinglist } = require("../models");
const fs = require('fs');

const updateDataBase = async (first, last, email, phone) => {
	try {
		let dbMailingListData = await Mailinglist.create({
			firstName: first,
			lastName: last,
			email: email,
			phoneNumber: phone,
			donationFlag: 0,
		});
		let returnObject = {
			updated: "Database Updated",
			data: dbMailingListData
		}
		return returnObject;
	} catch (err) {
		console.log(err);
	}
}

router.post("/",async (req,res) => {
	try {
		let {first, last, email, phone} = req.body;
		const response = await updateDataBase(first, last, email, phone);
		if (response["updated"]  === "Database Updated") {
			res.status(200).send(response);
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

router.get("/", async (req, res) => {
	try {
		let dbMailingListData = await Mailinglist.findAll({});
		res.json(dbMailingListData);
	} catch (err) {
		res.status(500).send("There was an error retrieving the data. Please try again later!");
	}
});

module.exports = router;
