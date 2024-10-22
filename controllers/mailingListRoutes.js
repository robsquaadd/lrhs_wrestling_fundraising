const router = require("express").Router();
const { Mailinglist } = require("../models");
const fs = require('fs');

const updateDataBase = async (first, last, email, phone, donationFlag) => {
	try {
		let updateSuccessful = 0;
		if (!phone) {
			phone = "";
		}
		let [dbMailingListData, created] = await Mailinglist.findOrCreate({
			where: {
				firstName: first,
				lastName: last,
				email: email,
			},
			defaults: {
				donationFlag: donationFlag,
				phoneNumber: phone
			},
		});
		if (created === false && dbMailingListData) {
			updateSuccessful = await Mailinglist.update(
				{ donationFlag: donationFlag },
				{
					where: {
						firstName: first,
						lastName: last,
						email: email,
					}
				}
			);
		}
		let returnObject = {
			created: created,
			updated: updateSuccessful,
			data: dbMailingListData
		}
		return returnObject;
	} catch (err) {
		return err;
	}
}

router.post("/",async (req,res) => {
	try {
		let {first, last, email, phone, donationFlag} = req.body;
		const response = await updateDataBase(first, last, email, phone, donationFlag);
		res.status(200).send(response);
	}
	catch (err) {
		res.status(500).send({error: err});
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
