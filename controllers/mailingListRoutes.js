//TODO: Build API routes here and export.
const router = require("express").Router();
const fs = require("fs");

router.post("/",(req,res) => {
	const {first, last, email, phone} = req.body;
	const newsletterString = first + last + email + phone;
	if (!req.body) {
		res.send("Empty String");
	};
	fs.appendFile('mailing_list.csv', newsletterString, (err) => {
		if (err) throw err;
		console.log("File Updated");
		res.send(`File updated with ${req.body}`);
	});
});

module.exports = router;
