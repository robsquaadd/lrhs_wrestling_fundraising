const mailingListProcessor = async () => {
	try {
		const response = await fetch(`/mailingList`, {
			method: "GET"
		});
		const data = await response.text();
		console.log(data);
		let messageObject = {}
		messageObject["string"] = data;
		return messageObject;
	} catch (err) {
		console.error(err.message);
	}
}

const sendEmails = async (clickedButton, mailingList) => {
	try {
		const response = await fetch(`/admin/first_email`,
		{
			method: "POST",
			body: JSON.stringify(mailingList),
			headers: {
				"Content-Type": "application/json",
			}
		});
		console.log(response);
	} catch (err) {
		console.error(err.message);
	}
}

const mainFunction = () => {
	let email1=document.getElementById("send_email_1");
	let email2=document.getElementById("send_email_2");
	let email3=document.getElementById("send_email_3");
	email1.addEventListener("click", async (e)=>{
		try {
			let mailingList = await mailingListProcessor();
			await sendEmails(e.target, mailingList);
		} catch (err) {
			console.error(err);
		}
	});
	email2.addEventListener("click",()=>{
		let mailingList = mailingListProcessor();
		//sendEmails(e.target, mailingList);
	}); 
	email3.addEventListener("click",()=>{
		let mailingList = mailingListProcessor();
		//sendEmails(e.target, mailingList);
	}); 
}

mainFunction();
