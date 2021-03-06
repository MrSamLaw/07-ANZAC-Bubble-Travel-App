//hero screen
var heroButton = document.querySelector(".custom-btn");
var landingPage = document.querySelector(".hero");

//small header
var smallHeader = document.querySelector("#pageHeader");

//initial select page
var selectPage = document.querySelector("#select-options");
var checkInDate;
var checkOutDate;
var submitButton = document.querySelector("#submit-user-choices");
var returnToSearchPage = document.querySelector("#returnToSearch-btn");
var searchPageViewAgain = document.querySelector("#pageReset")

//city searched page
var cityPage = document.querySelector("#city-page");
var marginPart = document.querySelector("#marginPart");

//about us page
var aboutUsButton = document.querySelector("#about-us-btn");
var aboutUsPage = document.querySelector("#aboutUsPage");


// User Details
var submitUserDetails = document.querySelector("#user-details");
var userNameEl = document.querySelector("#userNameInput");
var userHomeEl = document.querySelector("#userHomeInput");
var userPostcodeEl = document.querySelector("#userPostcodeInput");
var userEmailEl = document.querySelector("#userEmailInput");
var userMobileEl = document.querySelector("#userPhoneInput");
var userName;
var userHome;
var userPostcode;
var userEmail;
var userMobile;


// Page change buttons
heroButton.addEventListener("click", function () {
	landingPage.style.display = "none";
	selectPage.style.display = "block";
	smallHeader.style.display = "block";
	marginPart.style.display = "none";
});

aboutUsButton.addEventListener("click", function () {
	aboutUsPage.style.display = "block";
	marginPart.style.display = "none";
});

returnToSearchPage.addEventListener("click", function (event) {
	event.preventDefault();
	selectPage.style.display = "block";
	searchPageViewAgain.style.display = "none";
	marginPart.style.display = "none";
});

// Date Picker
$(function () {
	var dateFormat = "yy-mm-dd",
		checkIn = $("#checkIn")
			.datepicker({
				dateFormat: 'yy-mm-dd',
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 3
			})
			.on("change", function () {
				checkOut.datepicker("option", "minDate", getDate(this));

			}),
		checkOut = $("#checkOut").datepicker({
			dateFormat: 'yy-mm-dd',
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 3
		})
			.on("change", function () {
				checkIn.datepicker("option", "maxDate", getDate(this));
			});

	function getDate(element) {
		var date;
		try {
			date = $.datepicker.parseDate(dateFormat, element.value);
		} catch (error) {
			date = null;
		}
		checkInDate = $('#checkIn').val();
		checkOutDate = $('#checkOut').val();

		return date;
	}

});

submitButton.addEventListener("click", function (event) {
	event.preventDefault();
	inputCheck();
});

function inputCheck() {
	if (document.getElementById("loc").value == "Select City") {
		document.getElementById("errorMsg").textContent = "Please select a city";
		document.getElementById("loc").style.backgroundColor = "rgba(116,4,4,0.5)";
		$("#inputErrorModal").modal();
	} else if (!checkInDate) {
		document.getElementById("errorMsg").textContent = "Please select a Check In date";
		document.getElementById("checkIn").style.backgroundColor = "rgba(116,4,4,0.5)";
		$("#inputErrorModal").modal();
	} else if (!checkOutDate) {
		document.getElementById("errorMsg").textContent = "Please select a Check Out date";
		document.getElementById("checkOut").style.backgroundColor = "rgba(116,4,4,0.5)";
		$("#inputErrorModal").modal();
	} else if (document.getElementById("adults1").value <= 0) {
		document.getElementById("errorMsg").textContent = "Please select the Number of Adults travelling";
		document.getElementById("adults1").style.backgroundColor = "rgba(116,4,4,0.5)";
		$("#inputErrorModal").modal();
	}
	else {
		searchHotels();
	}
}

function searchHotels() {
	$('#select-options').css('display', 'none');
	$('#city-page').css('display', 'block');
	$('#marginPart').css('display', 'block');

	var destinationId = document.getElementById('loc').value;
	var checkIn = $('#checkIn').val();
	var checkOut = $('#checkOut').val();
	var pageSize = 25
	var adults1 = document.getElementById('adults1').value

	//Basic string with required parameters
	var requiredString = "https://hotels4.p.rapidapi.com/properties/list?destinationId=" + destinationId + '&pagenumber=1&checkIn=' + checkIn + '&checkOut=' + checkOut + '&pageSize=' + pageSize + '&adults1=' + adults1;

	var url = requiredString

	var priceMinSwitch = document.getElementById('priceMin').value;
	var priceMin;
	switch (priceMinSwitch) {
		case "fifty":
			priceMin = 50;
			break;
		case "hundred":
			priceMin = 100;
			break;
		case "hundredFifty":
			priceMin = 150;
			break;
		case "twoHundred":
			priceMin = 200;
			break;
		case "twoHundredFifty":
			priceMin = 250;
			break;
		case "threeHundredPlus":
			priceMin = 300;
			break;
	}

	var sortOrder = document.getElementById('sortOrder').value;

	if (priceMin) {
		url = url + '&priceMin=' + priceMin;
	}
	if (sortOrder) {
		url = url + '&sortOrder=' + sortOrder;
	}

	var hotelSearchQuery = url

	//Fetch hotel listing.
	fetch(hotelSearchQuery, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "c6aa062b9amsh42c409cede2d9bep1e5e77jsnbca33b5d4fcc",
			"x-rapidapi-host": "hotels4.p.rapidapi.com"
		}
	})

		.then(function (response) {
			return response.json();
		})

		.then(function (data) {

			var hotelSearchResultsEl = document.createElement("h5");
			hotelSearchResultsEl.textContent = "Your search for " + city;
			hotelSearchResultsEl.textContent += " for " + adults1 + " adults";
			hotelSearchResultsEl.textContent += ". Checking in on " + moment(checkIn).format("Do MMM YYYY");
			hotelSearchResultsEl.textContent += ". Checking out on " + moment(checkOut).format("Do MMM YYYY");
			hotelSearchResultsEl.textContent += ". returned the following results:";
			$(".weatherSection").prepend(hotelSearchResultsEl);

			var hotelContainerEl = document.querySelector('#hotels-container');
			var hotels = data.data.body.searchResults.results;

			// function for results 
			if (hotels.length === 0) {
				// display text for no hotels
				hotelContainerEl.textContent = 'No hotels found.';
				return;
			}

			// appending cards for results
			for (var i = 0; i < hotels.length; i++) {

				var hotelCardEL = document.createElement('div');
				hotelCardEL.classList = 'card';
				hotelCardEL.setAttribute('style', 'width: 18rem');
				//hotelCardEL.setAttribute('href', '' + hotelName);
				hotelContainerEl.appendChild(hotelCardEL);

				var hotelBodyEL = document.createElement('div');
				hotelBodyEL.classList = 'card-body';

				var hotelNameEL = document.createElement('h5');
				hotelNameEL.classList = 'card-title-main text-center';
				hotelNameEL.textContent = data.data.body.searchResults.results[i].name; //hotel name 
				var hotelAddEL = document.createElement('h5');
				hotelAddEL.classList = 'card-title text-center';
				hotelAddEL.textContent = data.data.body.searchResults.results[i].address.streetAddress;  //address
				var hotelCityEl = document.createElement('h6');
				hotelCityEl.classList = 'card-subtitle mb-2 text-muted';
				hotelCityEl.textContent = data.data.body.searchResults.results[i].neighbourhood; //city/town
				var hotelDescriptEL = document.createElement('p');
				hotelDescriptEL.classList = 'card-text';
				hotelDescriptEL.textContent = 'This hotel is a ' + data.data.body.searchResults.results[i].vrBadge; //hotel description
				var hotelPriceEL = document.createElement('p');
				hotelPriceEL.classList = 'card-text';
				hotelPriceEL.textContent = 'Current cost per night is USD$' + data.data.body.searchResults.results[i].ratePlan.price.exactCurrent; //+ currency //hotel price
				var hotelRatingEL = document.createElement('p');
				hotelRatingEL.classList = 'card-text';
				hotelRatingEL.textContent = 'Hotel is rated ' + data.data.body.searchResults.results[i].guestReviews.rating + '/' + data.data.body.searchResults.results[i].guestReviews.scale + ' with ' + data.data.body.searchResults.results[i].guestReviews.total + ' reviews';
				var hotelImageEL = document.createElement('img');
				hotelImageEL.classList = 'card-img-bottom';
				hotelImageEL.setAttribute('src', data.data.body.searchResults.results[i].optimizedThumbUrls.srpDesktop);

				hotelCardEL.appendChild(hotelBodyEL);
				hotelCardEL.appendChild(hotelImageEL);
				hotelBodyEL.appendChild(hotelNameEL);
				hotelBodyEL.appendChild(hotelAddEL);
				hotelBodyEL.appendChild(hotelCityEl);
				hotelBodyEL.appendChild(hotelPriceEL);
				hotelBodyEL.appendChild(hotelRatingEL);
			}
		});

	var searchInputLocEl = document.querySelector("#loc");
	var city;
	var loc = searchInputLocEl.value;

	switch (loc) {
		case "950540":
			city = "Auckland";
			break;
		case "1636970":
			city = "Christchurch";
			break;
		case "950155":
			city = "Nelson";
			break;
		case "1640249":
			city = "Northland";
			break;
		case "1633614":
			city = "Queenstown";
			break;
		case "1633616":
			city = "Rotorua";
			break;
		case "950424":
			city = "Southland";
			break;
		case "951308":
			city = "Wellington";
			break;
	}
	getUrl(city);
};

// Retrieve Forecast API
function getUrl(city) {
	var ApiKey = "510c27e4545e6077957004db2b092e1f";
	var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
	var queryUrl = requestUrl + city + "&appid=" + ApiKey + "&units=metric";

	fetch(queryUrl)
		.then(function (response) {
			return response.json();
		}).then(function (data) {
			fiveDayForecastData(data);
		})
		.catch(function (error) {
			console.log(error);
		})
};

// Retrieve Forecast API
function getUrl(city) {
	var weatherApiKey = "510c27e4545e6077957004db2b092e1f";

	var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
	var queryUrl = requestUrl + city + "&appid=" + weatherApiKey + "&units=metric";

	fetch(queryUrl)
		.then(function (response) {
			return response.json();
		}).then(function (data) {
			fiveDayForecastData(data);
		})
		.catch(function (error) {
			console.log(error);
		})
}

// Print Forecast
function fiveDayForecastData(forecastData) {
	var filteredForecast = forecastData.list.filter(function (day) {
		return day.dt_txt.indexOf("15:00:00") !== -1
	});
	document.querySelector(".horizontal-scrollable").innerHTML = "";

	for (var i = 0; i < filteredForecast.length; i += 1) {
		var card = $("<div>").attr("class", "weather-card", "col-xs-4");
		var date = $("<h5>").text(moment.unix(filteredForecast[i].dt).format('L')).attr("class", "date");
		var img = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + filteredForecast[i].weather[0].icon + "@2x.png").attr("class", "icon");
		var description = $("<p>").text("Description: " + filteredForecast[i].weather[0].description).attr("class", "description-info")
		var p1 = $("<p>").text("Temperature: " + filteredForecast[i].main.temp + '??C').attr("class", "weather-info");
		var p2 = $("<p>").text("Wind: " + filteredForecast[i].wind.speed + ' MPH').attr("class", "weather-info");
		var p3 = $("<p>").text("Humidity: " + filteredForecast[i].main.humidity + '%').attr("class", "weather-info");
		card.append(date, img, description, p1, p2, p3);
		$(".horizontal-scrollable").append($(card));
	}
}

function getPropDetails() {
	var requiredString = "https://hotels4.p.rapidapi.com/properties/get-details?id=" + Id

	addOptions(requiredString)

	//Optional parameter select string building
	function addOptions() {
		var adults1 = document.getElementById('adults1').value;
		var children1 = document.getElementById('children1').value;
		var currency = document.getElementById('currency').value;
		var checkIn = document.getElementById('checkIn').value;
		var checkOut = document.getElementById('checkOut').value;
		var loc = document.getElementById('loc').value;

		var url = requiredString;

		if (adults1) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'adults1=' + adults1;
		}

		if (children1) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'children1=' + children1;
		}
		if (currency) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'currency=' + currency;
		}
		if (checkIn) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'checkIn=' + checkIn;
		}
		if (checkOut) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'checkOut=' + checkOut;
		}
		if (loc) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'locs=' + loc;
		}
		return url
	}
	var getDetails = url

	//Query string needs completing from parameters above, will need to be taken from user selection.
	fetch(getDetails, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "652a2de92cmsh43a2bf88c4f4751p196d97jsnfa734ca7135b",
			"x-rapidapi-host": "hotels4.p.rapidapi.com"
		}
	})
		.then(response => {
			console.log(response);
		})
		.catch(err => {
			console.error(err);
		});
};

function getPhotos() {

	//Fetch Photos
	fetch("https://hotels4.p.rapidapi.com/properties/get-hotel-photos?&id=" + Id, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "652a2de92cmsh43a2bf88c4f4751p196d97jsnfa734ca7135b",
			"x-rapidapi-host": "hotels4.p.rapidapi.com"
		}
	})
		.then(response => {
			console.log(response);
		})
		.catch(err => {
			console.error(err);
		});
};

function getReviewsList() {

	//Basic string with required parameters
	var requiredString = "https://hotels4.p.rapidapi.com/reviews/list?id=" + id

	addOptions(requiredString)

	//Optional parameter select string building
	function addOptions() {
		var page = document.getElementById('page').value;
		var loc = document.getElementById('loc').value;

		var url = requiredString;

		if (page) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'page=' + page;
		}
		if (loc) {
			if (indexOf(url, '?') !== false) {
				var symbol_insert = '&';
			} else {
				var symbol_insert = '?';
			}
			url = url + symbol_insert + 'locs=' + loc;
		}
		return url
	}

	var getReviews = url

	//Fetch Reviews List
	fetch(getReviews, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "652a2de92cmsh43a2bf88c4f4751p196d97jsnfa734ca7135b",
			"x-rapidapi-host": "hotels4.p.rapidapi.com"
		}
	})

		.then(response => {
			console.log(response);
		})
		.catch(err => {
			console.error(err);

		});
}

// User Details
function saveUserDetails() {
	if (userNameEl.value === null) {
		submitUserDetails.disabled = true;
	} else {
		userName = userNameEl.value;
	}

	var userDetails = {
		userName: userNameEl.value,
		userHome: userHomeEl.value,
		userPostcode: userPostcodeEl.value,
		userEmail: userEmailEl.value,
		userMobile: userMobileEl.value
	};

	localStorage.setItem("userDetails", JSON.stringify(userDetails));
}

function renderLastUser() {
	var lastUser = JSON.parse(localStorage.getItem("userDetails"));

	if (lastUser !== null) {
		document.getElementById("userNameInput").innerHTML = lastUser.userName;
		document.getElementById("userHomeInput").innerHTML = lastUser.userHome;
		document.getElementById("userPostcodeInput").innerHTML = lastUser.userPostcode;
		document.getElementById("userEmailInput").innerHTML = lastUser.userEmail;
		document.getElementById("userPhoneInput").innerHTML = lastUser.userMobile;
	} else {
		return;
	}
}

submitUserDetails.addEventListener("click", function (event) {
	event.preventDefault();
	saveUserDetails();
	renderLastUser();
});

function init() {
	saveUserDetails();
}
init();
