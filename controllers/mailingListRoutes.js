const router = require("express").Router();
const { Mailinglist } = require("../models");
const fs = require('fs');

const updateDataBase = async (first, last, email, phone, donationFlag) => {
	try {
		let updated = false;
		let [dbMailingListData, created] = await Mailinglist.findOrCreate({
			where: {
				firstName: first,
				lastName: last,
				email: email,
				phoneNumber: phone,
			},
			defaults: {
				donationFlag: donationFlag,
			},
		});
		/*
		if (created === false && dbMailingListData) {
			dbMailingListData = await Mailinglist.update({
				donationFlag: donationFlag,
				where: {
					//TODO: Determine how to write update query for
					//the mailing list from the email receipts.
				}
			});
			updated = true;
		}
		*/
		let returnObject = {
			created: created,
			updated: updated,
			data: dbMailingListData
		}
		return returnObject;
	} catch (err) {
		console.log(err);
	}
}

router.post("/",async (req,res) => {
	try {
		let {first, last, email, phone, donationFlag} = req.body;
		const response = await updateDataBase(first, last, email, phone, donationFlag);
		res.status(200).send(response);
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

router.delete("/", async (req, res) => {
	try {
		let checkObject = {};
		let duplicateArray = []
		for (let i=0; i<req.body.length;i++) {
			let key = req.body[i].email + req.body[i].phoneNumber;
			console.log(key);
			if (checkObject.hasOwnProperty(key)) {
				duplicateArray.push(req.body[i]);
			} else {
				checkObject[key] = 1;
			}
		}
		let responseArray = []
		for (let i=0; i<duplicateArray.length; i++) {
			let deleteSuccessful = await Mailinglist.destroy({
				where: {
					id: duplicateArray[i].id,
				},
			});
		}
		res.status(200).json(responseArray);
	} catch (err) {	
		res.status(500).json(err);
	}
});

module.exports = router;
