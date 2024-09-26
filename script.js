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

const progressBar = async () => {
	try {
		let progressBar = document.getElementById("progress_bar");
		let progressHeader = document.getElementById("progress_bar_header");
		let response = await fetch('/admin/update_database,{
			method: "GET"
		});
		await new Promise(r => setTimeout(r, 5000));
		let data = await response.json();
		console.log(data)
		let donatedValue = data["total"];
		let goalValue = 12000.00;
		let percent_width = donatedValue/goalValue * 100;
		progressBar.style.width = percent_width.toString() + "%";
		progressHeader.textContent = `We have raised $${donatedValue.toString()} of our $${goalValue.toString()} goal! Thank you so much for your support!`
		return 0;
	} catch (err) {
		console.error(err);
	}
}

document.getElementById("data_gatering_form").addEventListener("submit", (e)=>{
	e.preventDefault();
	formSubmitted();
});

progressBar();
