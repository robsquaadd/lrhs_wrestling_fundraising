const mailingListProcessor = async () => {
	try {
		const response = await fetch(`/mailingList`, {
			method: "GET"
		});
		const data = await response.json();
		console.log(JSON.stringify(data));
		return data;
	} catch (err) {
		console.error(err.message);
	}
}

const deleteDuplicates = async (mailingList) => {
	try {
		const response = await fetch(`/mailingList`, 
		{
			method: "DELETE",
			body: JSON.stringify(mailingList),
			headers: {
				"Content-Type": "application/json"
			}
		});
	} catch (err) {
		console.error(err.message);
	}
}

const sendEmails = async (clickedButtonValue, mailingList) => {
	try {
		let slug = "";
		if (clickedButtonValue === "Send 1st Targeted Email/Text") {
			slug = "first_email";
		} else if (clickedButtonValue === "Send 2nd Targeted Email/Text") {
			slug = "second_email";
		} else if (clickedButtonValue === "Send 3rd Targeted Email/Text") {
			slug = "third_email"
		}
		const response = await fetch(`/admin/${slug}`,
		{
			method: "POST",
			body: JSON.stringify(mailingList),
			headers: {
				"Content-Type": "application/json",
			}
		});
	} catch (err) {
		console.error(err.message);
	}
}

const mainFunction = () => {
	let get_database_btn = document.getElementById("get_database_btn");
	get_database_btn.addEventListener("click", async (e) => {
		await mailingListProcessor();
	});
	/*
	let update_database_btn = document.getElementById("update_database_btn");
	update_database_btn.addEventListener("click", async (e) => {
		//TODO: implement functions that get the mailing list, delete duplicates, read the emails, and update donation flags to a value of 1.
		await mailingListProcessor();
		
	});*/
	let email1=document.getElementById("send_email_1");
	//let email2=document.getElementById("send_email_2");
	//let email3=document.getElementById("send_email_3");
	email1.addEventListener("click", async (e) => {
		try {
			let mailingList = await mailingListProcessor();
			await sendEmails(e.target.innerText, mailingList);
		} catch (err) {
			console.error(err);
		}
	});
	/*
	email2.addEventListener("click", async (e) => {
		try {
			let mailingList = mailingListProcessor();
			sendEmails(e.target.innerText, mailingList);
		} catch (err) {
			console.error(err);
		}
	}); 
	email3.addEventListener("click",() => {
		try {
			let mailingList = mailingListProcessor();
			sendEmails(e.target, mailingList);
		} catch (err) {
			console.error(err);
		}
	});
	*/
	let delete_duplicates = document.getElementById("delete_duplicates_btn");
	delete_duplicates.addEventListener("click", async (e) => {
		try {
			let mailingList = await mailingListProcessor();
			await deleteDuplicates(mailingList);
		} catch (err) {
			console.error(err);
		}
	});
}

mainFunction();
