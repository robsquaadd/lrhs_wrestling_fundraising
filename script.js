async function formSubmitted() {
	let inputsList = document.getElementsByClassName("form_input");
	let parsedPhone = inputsList[3].value.replaceAll(/[^0-9]/g, "");
	let content = {
		first: inputsList[0].value,
		last: inputsList[1].value,
		email: inputsList[2].value,
		phone: parsedPhone
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

/*
const update_database = async (mailing_list_data, read_email_data) {
	//TODO: create a function that takes the mailing list data and the email data, compares them, and updates the ones that match to show that they have donated.
	return 0;
}
*/
const progressBar = async () => {
	let progressBar = document.getElementById("progress_bar");
	let progressHeader = document.getElementById("progress_bar_header");
	let read_email_data = await read_emails();
	let donatedValue = read_email_data["total"];
	let goalValue = 12000.00;
	let percent_width = donatedValue/goalValue * 100;
	progressBar.style.width = percent_width.toString() + "%";
	progressHeader.textContent = `We have raised $${donatedValue.toString()} of our $${goalValue.toString()} goal! Thank you so much for your support!`
	return 0;
}

const on_load = async () => {
	try {
		const read_email_data = await progressBar();
		const get_mailing_list_data = await get_mailing_list();
		await update_database(get_mailing_list_data, read_email_data);
	} catch (err) {
		console.log(err);
	}
}

document.getElementById("data_gatering_form").addEventListener("submit", (e)=>{
	e.preventDefault();
	formSubmitted();
});

on_load();
progressBar();
