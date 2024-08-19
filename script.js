async function formSubmitted() {
	let inputsList = document.getElementsByClassName("form_input");
	let content = {
		first: inputsList[0].value,
		last: inputsList[1].value,
		email: inputsList[2].value,
		phone: inputsList[3].value
	};
	const url = "http://localhost:3001/mailingList";
	const response = await fetch(url, {
		method: "POST",
		body: content,
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

const progressBar = () => {
	let progressBar = document.getElementById("progress_bar");
	let progressHeader = document.getElementById("progress_bar_header");
	let donatedValue = 4651.29;
	let goalValue = 10000.00;
	let percent_width = donatedValue/goalValue * 100;
	progressBar.style.width = percent_width.toString() + "%";
	progressHeader.textContent = `We have raised $${donatedValue.toString()} of our $${goalValue.toString()} goal! Thank you so much for your support!`
	console.log(progressBar.style.width);
	return 0;
}

document.getElementById("data_gatering_form").addEventListener("submit", (e)=>{
	e.preventDefault();
	formSubmitted();
});

progressBar();
