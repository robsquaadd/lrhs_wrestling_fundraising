const router = require("express").Router();
const { Mailinglist } = require("../models");
const fs = require('fs');

const updateDataBase = async (first, last, email, phone) => {
	try {
		/* this is to test duplicate algorithms
		const dbMailingListData = await Mailinglist.create({
			firstName: first,
			lastName: last,
			email: email,
			phoneNumber: phone,
			donationFlag: 0,
		});
		*/
		const [dbMailingListData, created] = await Mailinglist.findOrCreate({
			where: {
				email: email,
				phoneNumber: phone,
			},
			defaults: {
				firstName: first,
				lastName: last,
				donationFlag: 0,
			},
		});
		//let created = true;
		let returnObject = {
			updated: created,
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
