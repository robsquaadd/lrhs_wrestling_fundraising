const router = require("express").Router();
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const Imap = require("node-imap");
const inspect = require("util").inspect;
require("dotenv").config();

const sendWithTwilio = async (mailingList) => {
	try {
		const accountSID = process.env.TWILIO_ACCOUNT_SID;
		const authToken = process.env.TWILIO_AUTH_TOKEN;
		const client = twilio(accountSID, authToken);
		const fundraisingLink = "https://polar-lake-08946-5b3daeb6c84d.herokuapp.com";
		for (let i=0;i<mailingList.length;i++) {
			 let message = await client.messages.create({
				body: `Hey Mustang Family! This is Coach Collier from the Lakewood Ranch High School Wrestling Team! We are looking forward to an exciting wrestling season this year! But, we need your help! Our team is looking to raise $12,000 to cover tournament and gear expenses for the season! If you'd like to help us reach that goal, please go to our fundraising campaign page here: ${fundraisingLink} and click the button that says Donate Now! Whether you donate $2 or $2000 every donation counts!Thank you in advance for all of your support! Vamos Mustangos!`,
				from: "+19286934017",
				to: "+1" + mailingList[i][3],
			});
		}
	} catch (err) {
		console.error(err);
	}
}

const sendEmails = async (mailingList, targetNumber) => {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_ACCOUNT_EMAIL,
			pass: process.env.GMAIL_ACCOUNT_PASSWORD
		}
	});
	let targetBody = ``;
	if (targetNumber === 1) {
		targetBody = `Hey Mustang Family!<br><br>This is Coach Collier from the Lakewood Ranch High School Wrestling Team! We are looking forward to an exciting wrestling season this year! But, we need your help! Our team is looking to raise $12,000 to cover tournament and gear expenses for the season! If you'd like to help us reach that goal, please go to our fundraising campaign page below and click the button that says Donate Now! Whether you donate $2 or $2000 every donation counts!<br><br>Thank you in advance for all of your support! Vamos Mustangos!` 
	} else if (targetNumber === 2) {
		targetBody = ``;
	} else if (targetNumber === 3) {
		targetBody = ``;
	}
	let mailOptions = {
		from: "robert.collier.120@gmail.com",
		to:"collierr@manateeschools.net", 
		subject: "subject",
		html: `<!DOCTYPE html>
<html>
	<head>
		<style>
			body {
				display: flex;
				padding: 0px;
				margin: 0px;
			}
			.green-section {
				background-color: #355E3B;
				width: 20%;
				height: 100vh;
			}
			#main-section {
				background-color: #FFFFFF;
				width: 60%;
				height: 100vh;
				padding: 20px;
			}
			button {
				background-color: #355E3B;
				border-style: none;
				border-radius: 5px;
				width: 40%;
				height: 5%;
				margin-left: 30%;
				margin-right: 30%;
				margin-top: 20px;
				color: #FFFFFF;
				font-weight: bold;
				font-size: 1em;
			}
			a {
				text-decoration: none;
				color: #FFFFFF;
			}
			#body-text {
				font-size: 24px;
			}
			@media (max-width: 1024px){
				button {
					margin-left: 10%;
					margin-right: 10%;
					width: 80%;
				}
			}
		</style>
	</head>
	<body>
		<div class="green-section"></div>
		<div id="main-section">
			<p id="body-text">
				${targetBody}
			</p>
			<button><a href="https://polar-lake-08946-5b3daeb6c84d.herokuapp.com">LRHS Wrestling Fundraising Page</a></button>
		</div>
		<div class="green-section"></div>
	</body>
</html>`
	}
	for (let i=0;i<mailingList.length;i++) {
		if (mailingList[i][2] !== "") {
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
}

router.get("/update_database", async (req, res) => {
	try {
		const imap = new Imap({
			user: process.env.GMAIL_ACCOUNT_EMAIL, 
			password: process.env.GMAIL_ACCOUNT_PASSWORD,
			host: 'imap.gmail.com',
			port: 993,
			tls: true
		});
		let runningTotal = 0;
		let checkString = "";
		let returnObject = {};
		imap.once("ready", () => {
			imap.openBox('INBOX', true,  (err, box) => {
				if (err) throw err;
				let f = imap.seq.fetch(`1:${box.messages.total}`, {
					bodies: ["HEADER.FIELDS (FROM)","1"],
					struct: true
				});
				f.on("message", (msg, seqno) => {
					let buffer = "";
					/*msg.once("attributes", (attributes) => {
						console.log("msg.once attributes");
						//console.log(`Attributes: ${inspect(attributes,false,8)}`);
					});*/
					msg.on("body", (stream, info) => {
						stream.on('data', (chunk) => {
							buffer += chunk.toString('utf8'); 
						});
						/*stream.once('end', () => {
							console.log("stream ended")
						});*/
					});
					msg.once("end", () => {
						let dataArray = buffer.split('<br />');
						let name = dataArray[3]?.slice(19);
						let email = dataArray[4]?.slice(20,dataArray[4].length-1);
						checkString += `${name},${email}\n`
						console.log(dataArray[11].replaceAll(/[^0-9|.]/g,""));
						runningTotal += Number(dataArray[11].replaceAll(/[^0-9|.]/g,""));
					});
				});
				f.once("error", (err) => {
					console.log(`Fetch Error: ${err}`);
				});
				f.once("end", () => {
					imap.end();
				});
			});
		});
		imap.once("error", (err) => {
			console.error(err);
		});
		imap.once("end", ()=> {
			console.log("connection ended");
			returnObject["total"] = runningTotal;
			returnObject["mailingListCheckString"] = checkString;
			res.send(returnObject);
		});
		imap.connect();		
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
		await sendWithTwilio(mailingListArray);
		res.send("Messages sent successfully")
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
