async function formSubmitted() {
	let inputsList = document.getElementsByClassName("form_input");
	let parsedPhone = inputsList[3].value.replaceAll(/[^0-9]/g, "");
	let content = {
		first: inputsList[0].value,
		last: inputsList[1].value,
		email: inputsList[2].value,
		phone: parsedPhone,
		donationFlag: 0,
	};
	const url = `/mailingList`;
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(content),
		headers: {
			"Content-type": "application/json",
		},
	});
	if (response.ok) {
		document.location.replace("/");
	}
	else {
		alert(response.statusText);
	}
}

const get_mailing_list = async () => {
	try {
		const response = await fetch (`/mailingList`, {
			method: "GET"
		});
		const data = await response.json();
		return data;
	} catch (err) {
		console.log(err);
	}
}

const read_emails = async () => {
	try {
		const response = await fetch(`/admin/read_emails`,{
			method: "GET"
		});
		const data = await response.json();
		return data;
	} catch (err) {
		console.log(err);
	}
}


const update_database = async (read_email_data) => {
	try {
		const response = await fetch(`/mailingList`, {
			method: "POST",
			body: JSON.stringify(requestObject),
			headers: {
				"Content-Type": "application/json"
			},
		}); 
	} catch (err) {
		console.error(err);
	}
	return 0;
}

const progressBar = async () => {
	try {
		let progressBar = document.getElementById("progress_bar");
		let progressHeader = document.getElementById("progress_bar_header");
		let read_email_data = await read_emails();
		let donatedValue = read_email_data["total"];
		const goalValue = 12000.00;
		let percent_width = donatedValue/goalValue * 100;
		progressBar.style.width = percent_width.toString() + "%";
		progressHeader.textContent = `We have raised $${donatedValue.toString()} of our $${goalValue.toString()} goal! Thank you so much for your support!`
		return read_email_data;	
	} catch (err) {
		console.error(err);
		let progressHeader = document.getElementById("progress_bar_header");
		let progressBarContainer = document.getElementById("progress_bar_container");
		progressHeader.textContent = "Thank you in advance for supporting the Lakewood Ranch Wrestling Team! We are looking forward to a great season!"
		progressBar.style.display = "none";
		progressBarContainer.style.display = "none";
	}
	
}

const on_load = async () => {
	try {
		const read_email_data = await progressBar();
		if (read_email_data) {
			for (let i=0;i<read_email_data.length;i++) {
				await update_database(read_email_data["data"][i]);
			}
		}
	} catch (err) {
		console.log(err);
	}
}

document.getElementById("data_gatering_form").addEventListener("submit", (e)=>{
	e.preventDefault();
	formSubmitted();
});

on_load();
