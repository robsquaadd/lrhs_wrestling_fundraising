const twilio = require("twilio");
const nodemailer = require("nodemailer");
require("dotenv").config();

const mailingListProcessor = async () => {
	try {
		const response = await fetch('http://localhost:3001/mailingList', {
			method: "GET"
		});
		const data = await response.text();
		let dataArray = data.split("\n");
		for (let i=0;i<dataArray.length;i++) {
			dataArray[i] = dataArray[i].split(",");
		}
		dataArray.pop();
		return dataArray;	
	} catch (err) {
		console.error(err.message);
	}
}

const sendWithTwilio = async (mailingList) => {
	try {
		console.log(mailingList);
		const accountSID = process.env.TWILIO_ACCOUNT_SID;
		const authToken = process.env.TWILIO_AUTH_TOKEN;
		const client = twilio(accountSID, authToken);
		for (let i=0;i<mailingList.length;i++) {
			 let message = await client.messages.create({
				body: "This is a test message.",
				from: "+19286934017",
				to: "+1" + mailingList[i][3],
			});
		}
	} catch (err) {
		console.error(err);
	}
}

const sendEmails = async (mailingList) => {
	console.log(process.env.GMAIL_ACCOUNT_EMAIL);
	console.log(process.env.GMAIL_ACCOUNT_PASSWORD);
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_ACCOUNT_EMAIL,
			pass: process.env.GMAIL_ACCOUNT_PASSWORD
		}
	});
	let mailOptions = {
		from: "robert.collier.120@gmail.com",
		to:"collierr@manateeschools.net", 
		subject: "subject",
		text: "this is a test"
	}
	for (let i=0;i<mailingList.length;i++) {
		mailOptions.to = mailingList[i][2];
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Email Sent: " + info.response);
			}
		});
	}
}

const mainFunction = async () => {
	let mailingList = await  mailingListProcessor();
	//sendWithTwilio(mailingList);
	sendEmails(mailingList);
}

mainFunction();
