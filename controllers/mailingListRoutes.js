const router = require("express").Router();
const fs = require("fs");

const updateDataBase =  (newsletterString) => {
		 return new Promise((res, rej)=> {
		 	fs.appendFile('mailing_list.csv', newsletterString, (err) => {
			if (err) rej(err)
			console.log("File Updated");
			res("File Updated");
		});
	});
}

router.post("/",async (req,res) => {
	const {first, last, email, phone} = req.body;
	if (first === undefined || last === undefined || email === undefined || phone === undefined) {
		res.status(400).send("Bad Request!");
	}
	const newsletterString = first + "," +  last + "," +  email + "," + phone + "\n";
	
	try {
		const response = await updateDataBase(newsletterString);
		if (response  === "File Updated") {
			res.status(200).send(response);
		}
	}
	catch (err) {
		res.status(500).send("There was an error writing your file. Please try again later!");
	}
});

/*router.get("/", (req, res) => {
	TODO: grabs all emails and phone numbers, connects them to twilio api, sends templated email or text message to numbers and emails.	
}*/

module.exports = router;
