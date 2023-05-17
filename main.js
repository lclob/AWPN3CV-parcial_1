
const inputElement = document.getElementById('inputBusqueda');
const buttonSearch = document.getElementById('buscar');
const resultElement = document.getElementById('resultado');
let imagenesHTML = '';
const APIWheater = 'ea6712d88f80281d7c6889ed6fc8553f';
const APIPexels = '3gAuS3993jE1nIm5Ru8A90PMa0dAd9pxZpcXgkL6DUGCYIyLfLNqIiuz';
const APIGoogle = 'AIzaSyAYW3g3NRld4PtVL4Bmz04tueXbASg8o-g'

buttonSearch.addEventListener('click', event => {
  event.preventDefault();

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputElement.value}&appid=${APIWheater}&units=metric`)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      placeInfo(data);
      let query = data.name;
      console.log(query)
      return query;
    })
    .then(async function(query){
      let page_num = 1;
      const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&page=${page_num}`, {
          method: "GET",
          headers: {
              Accept: "application/json",
              Authorization: APIPexels, 
          },
      });

      const image = await res.json();
      console.log(image);
      const photo = image.photos[0].src.large;
      console.log(photo);
      setImage(photo);
      return photo;
    })
    .catch(err => { console.log(`Hubo un error: ${err}`) })
    .finally(final => {
      // borra el loading
      console.log('ejecuto el finally');
    })

});

function placeInfo(data) {
  console.log('data cruda:', data);

  const
    name = data.name,
    temp = data.main.temp,
    tempMax = data.main.temp_max,
    temMin = data.main.temp_min,
    humedad = data.main.humidity,
    st = data.main.feels_like,
    pa = data.main.pressure,
    wind = data.wind.speed,
    lat = data.coord.lat,
    lon = data.coord.lon;

  document.querySelector(".card")?.remove();
  let div = document.createElement("div");
  div.classList.add("card", "mb-3");
  resultElement.appendChild(div);
  div.innerHTML = `

    <div class="row g-0">
      <div class="col-md-4">
        <img src="" class="img-fluid imagen w-100 h-100 rounded-start" alt="..." style="object-fit:cover"/>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <ul class="list-group">
            <li class="list-group-item fw-semibold">Lugar: <span class="fw-normal">${name}</span></li>
            <li class="list-group-item fw-semibold">Temperatura: <span class="fw-normal">${temp}°C</span></li>
            <li class="list-group-item fw-semibold">Latitud :<span class="fw-normal">${lat}</span></li>
            <li class="list-group-item fw-semibold">Longitud: <span class="fw-normal">${lon}</span></li>
            <li class="list-group-item fw-semibold">Temp. máxima: <span class="fw-normal">${tempMax}°C</span></li>
            <li class="list-group-item fw-semibold">Temp. mínima: <span class="fw-normal">${temMin}°C</span></li>
            <li class="list-group-item fw-semibold">Humedad: <span class="fw-normal">${humedad}</span></li>
            <li class="list-group-item fw-semibold">Sensación Térmica: <span class="fw-normal">${st}</span></li>
            <li class="list-group-item fw-semibold">Presión Atmosférica: <span class="fw-normal">${pa}</span></li>
            <li class="list-group-item fw-semibold">Viento: <span class="fw-normal">${wind}</span></li>
          </ul>
        </div>
      </div>
    </div>
  `;

};

function setImage(photo){
 let imagen = document.querySelector('.imagen');
 imagen.src = "";
 imagen.src = photo;
}

