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
      slider(image);
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
function btn() {
  buttonSearch.addEventListener('click', event => {
    event.preventDefault();
    spinner(resultElement);
    value = inputElement.value;

    if (!value) {
      salvaVidas();
    } else {
      localStorage.setItem(`search_value`, `${value}`)
      apiCall(value);
    }
  });

}

function btnKey() {
  inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      spinner(resultElement);
      value = inputElement.value;

      if (!value) {
        salvaVidas();
      } else {
        localStorage.setItem(`search_value`, `${value}`)
        apiCall(value);
      }
    }
  })
}

// spinner
function spinner(resultado) {
  resultado.innerHTML = '';
  let spinner = document.createElement('div');
  spinner.classList.add('d-flex', 'justify-content-center', 'spinner');
  spinner.innerHTML = `
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  resultado.append(spinner);
};

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
  if (day == "d") {
    dayname = "Día"
  } else if (day == "n") {
    dayname = "Noche"
  }

  document.querySelector(".card")?.remove();
  let div = document.createElement("div");
  div.classList.add("card", "mb-3");
  resultElement.appendChild(div);
  div.innerHTML = `
    <div class="row mobile g-0">
      <div id="carouselExample" class="col-md-4 carousel slide carousel-fade">
        <div class="carousel-inner img">
        </div>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h2 class="card-title badge bg-primary rounded-pill p-3">${name}</h2>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">${dayname}</li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Temperatura: 
            <div class="temps">
              <span class="badge bg-s rounded-pill p-2">${temMin} °C</span>
              <span class="badge bg-primary rounded-pill p-2">${temp} °C</span>
              <span class="badge bg-s rounded-pill p-2">${tempMax} °C</span>
            </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Humedad: <span class="badge bg-primary rounded-pill p-2">${humedad} %</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Sensación Térmica: <span class="badge bg-primary rounded-pill p-2">${st} °C</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Presión Atmosférica: <span class="badge bg-primary rounded-pill p-2">${pa} hPa</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Viento: <span class="badge bg-primary rounded-pill p-2">${wind} km/h</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Latitud:<span class="badge bg-primary rounded-pill p-2">${lat}</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Longitud: <span class="badge bg-primary rounded-pill p-2">${lon}</span></li>
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

  let img = document.querySelector('.img');
  spinner(img);
};

// API maps
function map(name, coord) {
  let map = document.querySelector('.map');
  let iframe = document.createElement('iframe');
  map.append(iframe);
  iframe.src = `https://www.google.com/maps/embed/v1/place?key=${APIGoogle}&q=${name}&center=${coord.lat}, ${coord.lon}`;
};

// imagen
function slider(image) {
  let photos = image.photos;
  const photo = image.photos[0];
  console.log(photos)

  let slider = document.querySelector('.img');
  slider.innerHTML = '';
  
  photos.forEach(pic => {
    let img = document.createElement('div');

    if (pic != photo) {
      img.classList.add('carousel-item', 'img-secondary',);
      img.innerHTML = `
        <img src="${pic.src.large}" class="d-block w-100 imagen" alt="imagen de ${pic.alt}">
      `;
    } else {
      img.classList.add('carousel-item', 'img-active', 'active');
      img.innerHTML = `
       <img src="${photo.src.large}" class="d-block w-100 imagen" alt="imagen de ${photo.alt}}">
      `;
    }

    slider.append(img);
    slider.innerHTML += `
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    `;
  });
}

// salvavidas
function salvaVidas() {
  resultElement.innerHTML = "Lo siento, no hemos encontrado el lugar que buscabas."
}

// funciones
btn();
btnKey();