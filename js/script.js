

const time = document.getElementById('time');
const hours = time.querySelector('#hours');
const minutes = time.querySelector('#minutes');
const seconds = time.querySelector('#seconds');
const viewport = document.querySelector('.vp-wrapper');

viewport.style.minHeight = window.innerHeight + 'px';
viewport.style.height = '100vh';

const date = document.getElementById('date');
const greeting = document.getElementById('greeting');
const daytime = greeting.querySelector('span');

function getTimeOfDay() {
	let hour = new Date().getHours();
	return (hour >= 6 && hour < 12) ? 'morning' :
		(hour >= 12 && hour < 18) ? 'afternoon' :
			(hour >= 18 && hour <= 23) ? 'evening' :
				'night'
}

function updateTime() {
	let rightNow = new Date();
	const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',];
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	hours.textContent = rightNow.getHours() >= 10 ? rightNow.getHours() : '0' + rightNow.getHours();
	minutes.textContent = rightNow.getMinutes() >= 10 ? rightNow.getMinutes() : '0' + rightNow.getMinutes();
	seconds.textContent = rightNow.getSeconds() >= 10 ? rightNow.getSeconds() : '0' + rightNow.getSeconds();

	date.textContent = week[rightNow.getDay()] + ', ' + rightNow.getDate() + ' ' + months[rightNow.getMonth()];


	daytime.textContent = 'Good ' + getTimeOfDay() + ', ';
};

document.addEventListener('DOMContentLoaded', function (e) {
	setInterval(() => {
		updateTime();
	}, 1000);
	updateTime();
})

//-------save name thing--------------//

//const greeting = document.getElementById('greeting');
const input_name = greeting.querySelector('.greeting__input-name');
const span_name = greeting.querySelector('.greeting__saved-name');

span_name.style.display = 'inline-block';
input_name.style.display = 'none';

/*span_name.addEventListener('click', function (e) {
	let name = span_name.textContent;
	if (name && name !== '[your name]') {
		input_name.value = name;
	}

	span_name.style.display = 'none';
	input_name.style.display = 'inline-block';
	input_name.focus();
})*/

function setName(e) {
	let name = input_name.value;

	if (name) {
		span_name.textContent = name;
	}
	span_name.style.display = 'inline-block';
	input_name.style.display = 'none';

}

document.addEventListener('click', function (e) {
	let hidden = input_name.style.display === 'none';
	if (e.target.closest('.greeting__saved-name')) {
		let name = span_name.textContent;
		if (name && name !== '[your name]') {
			input_name.value = name;
		}

		span_name.style.display = 'none';
		input_name.style.display = 'inline-block';
		input_name.focus();
	} else if (e.target !== input_name && !hidden) {
		setName();
	} else {
		return;
	}
})

input_name.addEventListener('keydown', function (e) {
	if (e.keyCode === 13) {
		setName(e);
	}
})

window.addEventListener('beforeunload', function (e) {
	localStorage.setItem('name', span_name.textContent);
})

window.addEventListener('load', function (e) {
	if (localStorage.getItem('name') && localStorage.getItem('name') !== '[your name]') {
		span_name.textContent = localStorage.getItem('name');
	}
})

//=================Background=======================//
const slider_icons = document.querySelector('.slider-icons');
const nextBgIcon = slider_icons.querySelector('.slider-next');
const prevBgIcon = slider_icons.querySelector('.slider-prev');


function setBg(slide = undefined) {
	let folder = getTimeOfDay();
	let randomNum = Math.floor(Math.random() * 20 + 1);
	let picNum = randomNum < 10 ? '0' + randomNum : randomNum;

	const image = new Image();
	image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${folder}/${slide || picNum}.jpg`

	image.onload = () => {
		viewport.style.backgroundImage = `url('${image.src}')`;
	}

}

setBg();

function nextBg() {
	let currentBg = viewport.style.backgroundImage;
	let curBgNum = currentBg.match(/\d{2}/);

	nextBgNum = +curBgNum === 20 ? '01' : +curBgNum < 9 ? '0' + (+curBgNum + 1) : '' + (+curBgNum + 1);

	setBg(nextBgNum);
}

function prevBg() {
	let currentBg = viewport.style.backgroundImage;
	let curBgNum = currentBg.match(/\d{2}/);

	prevBgNum = +curBgNum === 1 ? '20' : +curBgNum <= 10 ? '0' + (+curBgNum - 1) : '' + (+curBgNum - 1);

	setBg(prevBgNum);
}

slider_icons.addEventListener('click', function (e) {
	if (e.target.closest('.slider-next')) {
		nextBg();
	} else if (e.target.closest('.slider-prev')) {
		prevBg();
	} else return;
})


//================= Weather / Погода ====================//
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.weather__temperature');
const weatherDescription = document.querySelector('.weather__description');
const city = document.querySelector('.weather__city');
async function getWeather() {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
	const res = await fetch(url);
	const data = await res.json();
	console.log(data.weather[0].id, data.weather[0].description, data.main.temp);

	weatherIcon.classList.add(`owf-${data.weather[0].id}`);
	temperature.textContent = `${Math.round(data.main.temp)}°C`;
	weatherDescription.textContent = data.weather[0].description;
}

city.addEventListener('change', function (e) {
	localStorage.setItem('user_city', city.value);
	getWeather();
});

window.addEventListener('load', function (e) {
	if (localStorage.getItem('user_city')) {
		city.value = localStorage.getItem('user_city');
		getWeather();
	} else {
		city.value = 'Minsk';
		getWeather();
	}
});


//======== quotes =========///
const quotes = document.getElementById('.class');
const quote = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const updateIcon = document.getElementById('update');

async function getQuote() {
	const res = await fetch('https://breakingbadapi.com/api/quotes');
	const data = await res.json();
	function showQuote() {
		const random = Math.floor(Math.random() * data.length);
		quote.textContent = data[random]['quote']
		quoteAuthor.textContent = data[random]['author']
	}
	showQuote();
	updateIcon.addEventListener('click', () => {
		updateIcon.classList.add('working');
		quote.classList.add('updating');
		author.classList.add('updating');

		const timerID = 500;

		setTimeout(() => {
			showQuote();
			updateIcon.classList.remove('working');
			quote.classList.remove('updating');
			author.classList.remove('updating');
		}, timerID);
	})
}

getQuote();

// https://breakingbadapi.com/api/characters