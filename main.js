// declaración
const inputElement = document.getElementById('inputBusqueda');
const buttonSearch = document.getElementById('buscar');
const resultElement = document.getElementById('resultado');
const APIWheater = 'ea6712d88f80281d7c6889ed6fc8553f';
const APIGoogle = 'AIzaSyAYW3g3NRld4PtVL4Bmz04tueXbASg8o-g';
const APIPexels = '3gAuS3993jE1nIm5Ru8A90PMa0dAd9pxZpcXgkL6DUGCYIyLfLNqIiuz';

// localStorage
if (!localStorage.getItem("search_value")) {
  btn();
} else {
  value = localStorage.getItem("search_value");
  apiCall(value);
}

// APIs
function apiCall(value) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${APIWheater}&units=metric`)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      resultElement.innerHTML = '';
      // weather
      setInfo(data);
      let name = data.name;
      let coord = data.coord;

      // maps
      map(name, coord);
      return name;
    })
    .then(async function (name) {
      let page_num = 1;
      const res = await fetch(`https://api.pexels.com/v1/search?query=${name}&page=${page_num}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: APIPexels,
        },
      });

      let image = await res.json();
      // imagen
      setImage(image);
    })
    .catch(err => {
      console.log(`Hubo un error: ${err}`);
      salvaVidas();
    })
    .finally(() => {
      console.log('ejecuto el finally');
    })
}

// search
btn();
function btn() {
  buttonSearch.addEventListener('click', event => {
    event.preventDefault();
    value = inputElement.value;
    localStorage.setItem(`search_value`, `${value}`)
    apiCall(value);
  });
}

// API weather
function setInfo(data) {
  console.log('data cruda:', data);

  const
    name = data.name,
    temp = data.main.temp.toFixed(1),
    tempMax = data.main.temp_max.toFixed(1),
    temMin = data.main.temp_min.toFixed(1),
    humedad = data.main.humidity,
    st = data.main.feels_like,
    pa = data.main.pressure,
    wind = (data.wind.speed * 3.6).toFixed(1),
    lat = data.coord.lat,
    lon = data.coord.lon,
    day = data.weather[0].icon.at(-1);
  ;

  let dayname = "";
  if(day == "d"){
    dayname = "Día"
  } else if(day == "n"){
    dayname = "Noche"
  }

  document.querySelector(".card")?.remove();
  let div = document.createElement("div");
  div.classList.add("card", "mb-3");
  resultElement.appendChild(div);
  div.innerHTML = `
    <div class="row mobile g-0">
      <div class="col-md-4 img">
      <img src="" class="img-fluid imagen w-100 rounded-start" alt="..." style="object-fit:cover"/>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h2 class="card-title badge bg-primary rounded-pill p-3">${name}</h2>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">${dayname}</li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Temperatura: <span class="badge bg-primary rounded-pill p-2">${temp} °C</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Latitud:<span class="badge bg-primary rounded-pill p-2">${lat}</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Longitud: <span class="badge bg-primary rounded-pill p-2">${lon}</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Temp. máxima: <span class="badge bg-primary rounded-pill p-2">${tempMax} °C</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Temp. mínima: <span class="badge bg-primary rounded-pill p-2">${temMin} °C</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Humedad: <span class="badge bg-primary rounded-pill p-2">${humedad} %</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Sensación Térmica: <span class="badge bg-primary rounded-pill p-2">${st} °C</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Presión Atmosférica: <span class="badge bg-primary rounded-pill p-2">${pa} hPa</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Viento: <span class="badge bg-primary rounded-pill p-2">${wind} km/h</span></li>
          </ul>
        </div>
      </div>
      <div class="col-8 m-auto">
        <div class="line"></div>
      </div>
      <div class="col-12">
        <div class="map"></div>
      </div>
  `;
};

// API maps
function map(name, coord) {
  let map = document.querySelector('.map');
  let iframe = document.createElement('iframe');
  map.append(iframe);
  iframe.src = `https://www.google.com/maps/embed/v1/place?key=${APIGoogle}&q=${name}&center=${coord.lat}, ${coord.lon}`;
};

// imagen
function setImage(image) {
  const photo = image.photos[0].src.large;
  let imagen = document.querySelector('.imagen');
  imagen.src = "";
  imagen.src = photo;
  imagen.alt = `imagen de ${inputElement.value}`;
}

// salvavidas
function salvaVidas() {
  resultElement.innerHTML = "Lo siento, no hemos encontrado la ciudad que buscabas."
}

