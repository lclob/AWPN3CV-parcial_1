
const inputElement = document.getElementById('inputBusqueda');
const buttonSearch = document.getElementById('buscar');
const resultElement = document.getElementById('resultado');
let imagenesHTML = '';
const APIkey = 'ea6712d88f80281d7c6889ed6fc8553f';

buttonSearch.addEventListener('click', event => {
  event.preventDefault();

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputElement.value}&appid=${APIkey}&units=metric`)
    .then(resp => {
      console.log(`response: ${resp}`, resp);
      return resp.json(); // retorno al siguiente then el response como json
    })
    .then(data => {
      console.log('data cruda:', data);
      const name = data.name;
      const temp = data.main.temp;
      console.log(temp);
      document.querySelector(".card")?.remove();
      let div = document.createElement("div");
      div.classList.add("card");
      resultElement.appendChild(div);
      div.innerHTML = `
        <ul>
        <li>${name}</li>
        <li>${temp}°C</li>
        </ul>
      `;
      console.log(div);
    })
    .catch(err => { console.log(`Hubo un error: ${err}`) })
    .finally(final => {
      // borra el loading
      console.log('ejecuto el finally');
    })
});