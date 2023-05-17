$.getJSON("https://ipapi.co/json", function (data) {
    city = data.city;
    country = data.country_name;
    latitude = data.latitude;
    longitude = data.longitude;
    page = 1;

    $(".ip").html(`Your IP address is - ${data.ip}`)

    $(".section1 .ipapi").html(`
    <table>
    <tr><td>City/Town:</td><td>${data.city}</td></tr>
    <tr><td>Province/State:</td><td>${data.region}</td></tr>
    <tr><td>Country:</td><td>${data.country_name}</td></tr>
    <tr><td style="background:darkorchid">&nbsp</td></tr>
    <tr><td style="background:darkorchid">Other details:</td></tr>
    <tr><td>Latitude:</td><td>${data.latitude}</td></tr>
    <tr><td>Longitude:</td><td>${data.longitude}</td></tr>
    <tr><td>Currency:</td><td>${data.currency}</td></tr>
    <tr><td style="padding-right:0">Country Capital:</td><td>${data.country_capital}</td></tr>
    <tr><td>Country Code:</td><td>${data.country_code}</td></tr>
    <tr><td>Country Area:</td><td>${data.country_area}</td></tr>
    <tr><td>Population:</td><td>${data.country_population}</td></tr>
    </table>
    `)

    $(".iframe iframe").attr("src", "https://www.mapquest.com/embed?center=" + data.latitude + "," + data.longitude + "&zoom=13&maptype=map");

    openWeather();
    news()
});




function openWeather() {
    openWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=f7a6aacb71c9cc9099b7c04f85d3b6c2&units=metric";
    $.getJSON(openWeatherURL, function (data) {
        function time() {
            let now = new Date(data.current.dt * 1000);
            let minutes = now.getMinutes();
            let hours = now.getHours();
            if (minutes < 10) {
                minutes = "0" + minutes
            }
            if (hours == 0) {
                hours = 12;
                return hours + ":" + minutes + " AM";
            }
            else if (hours < 12) {
                return hours + ":" + minutes + " AM";
            }
            else {
                hours = hours - 12;
                return hours + ":" + minutes + " PM";
            }
        }

        function date() {
            let now = new Date(data.current.dt * 1000);
            let day = now.getDate();
            let month = now.getMonth();
            let monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return day + " " + monthName[month];
        }

        function day(number) {
            number = number * 1000;
            number = new Date(number);
            number = number.getDay();
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return days[number];
        }

        $(".section2 .wrapper").append(`
        <div class="top">
            <div class="text1">${city}</div>
            <div class="text2">${time()}, ${date()}.</div>
        </div>
    
        <div class="middle">
            <div class="left">
                <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png">
                <div>${data.current.temp}&#176;C</div>
            </div>
    
            <div class="right">
                <div>Feels like: ${data.current.feels_like}&#176;C</div>
                <div>Max:${data.daily[0].temp.max}&#176;C&nbsp;&nbsp;&nbsp;Min:${data.daily[0].temp.min}&#176;C</div>
                <div>Humidity: ${data.current.humidity}%</div>
                <div>Pressure: ${data.current.pressure} mbar</div>
                <div>Wind speed: ${(data.current.wind_speed * 3.6).toFixed(2)} kmph</div>
            </div>
        </div>
        `)

        for (let i = 1; i < 7; i++) {
            $(".bottom").append(`
            <div class="daily">
            <div>${day(data.daily[i].dt)}</div>
            <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png">
            <div>${data.daily[i].temp.max}&#176;/${data.daily[i].temp.min}&#176;</div>
         </div>
            `);
        }
    });
}





function news() {
    $(".section3 .text1").html(`News related to ${country} is diplayed`)
    newsApiURL = "https://newsapi.org/v2/everything?q=" + country + "&sortBy=publishedAt&language=en&pageSize=12&page=" + page + "&apiKey=f59bb2fd9eda4b43b6ebd10c980291d7";
    page++;
    $.getJSON(newsApiURL, function (data) {
        console.log(data)
        for (let i = 0; i < 12; i++) {
            $(".section3 .wrapper").append(`
        <div class="card invert">
        <img class="notInvert" src="${data.articles[i].urlToImage}">
        <div class="title">${data.articles[i].title}</div>
        <div class="description">${(data.articles[i].content).replace(/(\[.*?\])/g, '')}</div>
        <a href="${data.articles[i].url}" target="_blank"><button class="notInvert">Read more</button></a>
    </div>
        `)
        }
    });
}

//navigation
function mobNav() {
    if (document.querySelector("nav").style.left == "-100%" && document.querySelector(".hamburger").offsetHeight == "25") {
        document.querySelectorAll(".hamburgerLine")[0].style = "transform:rotate(36.1deg)";
        document.querySelectorAll(".hamburgerLine")[1].style = "transition:0.5s; width:0px";
        document.querySelectorAll(".hamburgerLine")[2].style = "transform:rotate(-36.1deg)";
        document.querySelector("nav").style = "left:0";
    }
    else if (document.querySelector(".hamburger").offsetHeight == "25") {
        document.querySelectorAll(".hamburgerLine")[0].style = "transform:rotate(0)";
        document.querySelectorAll(".hamburgerLine")[1].style = "transition:0.5s; width:35px";
        document.querySelectorAll(".hamburgerLine")[2].style = "transform:rotate(0)";
        document.querySelector("nav").style = "left:-100%";
        setTimeout(() => {
            document.querySelectorAll(".dropInput").forEach(item => {
                item.checked = false;
            }
            )
        }, 500);

    }
}

//dark mode
checkTheme();
function checkTheme() {
    if (sessionStorage.getItem("theme") == "darkMode") {
        darkMode();
    }
}

function darkMode() {
    document.documentElement.classList.toggle("darkMode");
    if (document.documentElement.className == "darkMode") {
        document.querySelector(".darkModeIcon").src = "images/header/moon.svg";
        sessionStorage.setItem("theme", "darkMode");
    }
    else {
        document.querySelector(".darkModeIcon").src = "images/header/sun.svg";
        sessionStorage.setItem("theme", "lightMode");
    }
}