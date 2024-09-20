const router = require("express").Router();
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const Imap = require("node-imap");
const inspect = require("util").inspect;
require("dotenv").config();

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
				console.log("Email Sent!");
			}
		});
	}
}

const readEmails = () => {
	const imap = new Imap({
		user: "robert.collier.120@gmail.com", 
		password: process.env.GMAIL_ACCOUNT_PASSWORD,
		host: 'imap.gmail.com',
		port: 993,
		tls: true
	});
	imap.once("ready", () => {
		imap.openBox('INBOX', true,  (err, box) => {
			if (err) throw err;
			let f = imap.seq.fetch(`${box.messages.total-32}:${box.messages.total-30}`, {
				bodies: ["HEADER.FIELDS (FROM SUBJECT TO DATE)","1"],
				struct: true
			});
			f.on("message", (msg, seqno) => {
				msg.on("body", (stream, info) => {
					let buffer = '';
					stream.on('data', (chunk) => {
						buffer += chunk.toString('utf8');
					});
					stream.once('end', () => {
						if (info.which === "1") {
							let decodedBody = Buffer.from(buffer, "base64").toString('utf8');
							console.log(`Message ${seqno}\n Parsed Body: ${decodedBody}`);
						} else {
							console.log(`Message ${seqno}\n Parsed Header: ${inspect(Imap.parseHeader(buffer))}`);
						}
					});
				});
				msg.once("attributes", (attributes) => {
					console.log(`Attributes: ${inspect(attributes,false,8)}`);
				});
				msg.once("end", () => {
					console.log(`Message #${seqno} finished`);
				});
			});
			f.once("error", (err) => {
				console.log(`Fetch Error: ${err}`);
			});
			f.once("end", () => {
				console.log("done fetching all messages");
				imap.end();
			});
		});
	});
	imap.once("error", (err) => {
		console.error(err);
	});
	imap.once("end", ()=> {
		console.log("connection ended");
		return "successful";
	});
	imap.connect();
}

router.get("/update_database", (req, res) => {
	try {
		let emailResponse= readEmails();
		res.send(emailResponse);
	} catch(err) {
		console.error(err);
	}
});


router.post("/first_email", async (req, res) => {
	try {
		let mailingList = req.body["string"]
		let mailingListArray = mailingList.split("\n");
		for (let i=0;i<mailingListArray.length;i++) {
			mailingListArray[i] = mailingListArray[i].split(',')
		};
		await sendEmails(mailingListArray);
		//await sendWithTwilio(req.body);
		res.send("Messages sent successfully")
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
