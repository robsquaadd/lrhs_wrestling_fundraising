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

const formSubmitted = () => {
	let inputsList = document.getElementsByClassName("form_input");
	let content = "";
	for (let i=0;i<inputsList.length;i++) {
		content += inputsList[i].value + ",";
	}
	console.log(content);
	//TODO: put the data in a csv file using a fetch request.
}

document.getElementById("data_gatering_form").addEventListener("submit", (e)=>{
	e.preventDefault();
	formSubmitted();
});

progressBar();
