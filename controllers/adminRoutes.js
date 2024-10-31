const router = require("express").Router();
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const Imap = require("node-imap");
const inspect = require("util").inspect;
require("dotenv").config();

const sendWithTwilio = async (mailingList, targetNumber) => {
	try {
		const accountSID = process.env.TWILIO_ACCOUNT_SID;
		const authToken = process.env.TWILIO_AUTH_TOKEN;
		const client = twilio(accountSID, authToken);
		const fundraisingLink = "https://polar-lake-08946-5b3daeb6c84d.herokuapp.com";
		let  messageBody = "";
		if (targetNumber === 1) {
			messageBody = `Hey Mustang Family! This is Coach Collier from the Lakewood Ranch High School Wrestling Team! We are looking forward to an exciting wrestling season this year! But, we need your help! Our team is looking to raise $12,000 to cover tournament and gear expenses for the season! If you'd like to help us reach that goal, please go to our fundraising campaign page here: ${fundraisingLink} and click the button that says Donate Now! Whether you donate $2 or $2000 every donation counts! Thank you in advance for all of your support! Vamos Mustangos!`;
		} else if (targetNumber === 2) {
			messageBody = `Hello Everyone! Words cannot describe how thankful we are for everything you do to help and support our Mustang Wrestling Teams. Last season might have been our best season yet, and we couldn't have done it without you! The 2023-2024 season was the first season of Girls Wrestling at Lakewood Ranch High School, and they did not disappoint, earning the Runner-Up Individual District title. As for the boys, they won the Team District title and the Individual District title, both last season, for the first time in school history. To continue our success on the mat, we need your assistance with fundraising for our teams. We are asking for $12,000 to cover the costs and expenses of running the boys and girls teams. Your contribution helps us pay for tournament entry fees, gear for the kids like warm up tops, cleaning supplies for the wrestling room, and more. Our fundraising page is linked here ${fundraisingLink}. If you know of anyone looking to give back to the sport of wrestling, please forward this to them or there is a sign up at the bottom of the page to upload their information. However much you can donate is greatly appreciated, and we thank you for everything you do, can do, and have done to help us out. ¡Vamos Mustangos!`;
		} else if (targetNumber === 3) {
			messageBody = ``;
		}
		for (let i=0;i<mailingList.length;i++) {
			 let message = await client.messages.create({
				body: messageBody,
				from: "+19286934017",
				to: "+1" + mailingList[i].phoneNumber
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
		targetBody = `Hello Everyone,<br><br>This is Coach Nate from the Lakewood Ranch High School Wrestling Team! Words cannot describe how thankful we are for everything you do to help and support our Mustang Wrestling Teams. Last season might have been our best season yet, and we couldn't have done it without you! The 2023-2024 season was the first season of Girls Wrestling at Lakewood Ranch High School, and they did not disappoint, earning the Runner-Up Individual District title. As for the boys, they won the Team District title and the Individual District title, both last season, for the first time in school history.<br><br>To continue our success on the mat, we need your assistance with fundraising for our teams. We are asking for $12,000 to cover the costs and expenses of running the boys and girls teams. Your contribution helps us pay for tournament entry fees, gear for the kids like warm up tops, cleaning supplies for the wrestling room, and more. Our fundraising page is linked below. If you know of anyone looking to give back to the sport of wrestling, please forward this to them or there is a sign up at the bottom of the page to upload their information.<br><br>However much you can donate is greatly appreciated, and we thank you for everything you do, can do, and have done to help us out.<br><br>¡Vamos Mustangos!`;
	} else if (targetNumber === 3) {
		targetBody = ``;
	}
	let mailOptions = {
		from: "lrhswrestling0@gmail.com",
		to:"collierr@manateeschools.net", 
		subject: "Lakewood Ranch Wrestling Fundraising",
	}
	if (mailingList.email && mailingList.email !== "") {
		mailOptions.to = mailingList.email;
		if (mailingList[i].donationFlag === 1) {
			targetBody = `Hey ${mailingList.firstName}!<br><br>The wrestlers and coaches from the Lakewood Ranch Wrestling Team want to take this time to thank you so much for donating to our team! We appreciate your contribution to our program and your contribution to the development of these young men!<br><br>We hate to ask, but could you do one more thing for us? Can you send this to one person that has not heard about Lakewood Ranch Wrestling? We want to spread awareness about what these amazing young men are doing in the classroom, on the mat, and in the community!<br><br>Thank you so much for everything that your do!<br><br>Vamos Mustangos!`;
		}
		mailOptions.html = `<!DOCTYPE html>
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
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Email Sent!");
			}
		});
	}
}

router.get("/read_emails", async (req, res) => {
	try {
		const imap = new Imap({
			user: process.env.GMAIL_ACCOUNT_EMAIL, 
			password: process.env.GMAIL_ACCOUNT_PASSWORD,
			host: 'imap.gmail.com',
			port: 993,
			tls: true
		});
		let runningTotal = 0;
		let returnObject = {
			"total": 0,
			data: []
		};
		imap.once("ready", () => {
			imap.openBox('INBOX', true,  (err, box) => {
				if (err) throw err;
				let f = imap.seq.fetch(`1:${box.messages.total}`, {
					bodies: ["HEADER.FIELDS (FROM)","1"],
					struct: true
				});
				f.on("message", (msg, seqno) => {
					let buffer = "";
					let messageObject = {};
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
						let name = dataArray[3]?.slice(19).split(' ');
						let email = dataArray[4]?.slice(20,dataArray[4].length-1);
						runningTotal += Number(dataArray[11].replaceAll(/[^0-9|.]/g,""));
						messageObject["email"] = email;
						messageObject["firstName"] = name[0];
						messageObject["lastName"] = name[1];
						messageObject["donationFlag"] = 1;
						returnObject.data.push(messageObject);
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
			returnObject["total"] = runningTotal;
			res.send(returnObject);
		});
		imap.connect();		
	} catch(err) {
		console.error(err);
	}
});


router.post("/send_email", async (req, res) => {
	try {
		await sendEmails(req.body.mailingList, req.body.targetValue);
		//await sendWithTwilio(req.body.mailingList, req.body.targetValue);
		res.send("Messages sent successfully")
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
