document.getElementById('consultarBtn').addEventListener('click', consultarClima);
document.getElementById('limpiarBtn').addEventListener('click', limpiarFormulario);

const meteoblueApiKey = 'ZWbQFRK6p2e9XO3P';
const openCageApiKey = 'TU_API_KEY_OPENCAGE'; // Reemplaza con tu clave de OpenCage

function consultarClima() {
    const ciudad = document.getElementById('city').value;
    if (!ciudad) {
        alert('Por favor, ingrese una ciudad.');
        return;
    }

    // Obtener coordenadas de la ciudad usando OpenCage
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${ciudad}&key=${openCageApiKey}&language=es&pretty=1`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                alert('Ciudad no encontrada.');
                return;
            }
            const { lat, lng } = data.results[0].geometry;
            consultarMeteoblue(lat, lng);
        })
        .catch(error => {
            console.error('Error al obtener coordenadas:', error);
            alert('Error al obtener coordenadas.');
        });
}

function consultarMeteoblue(lat, lon) {
    fetch(`https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=${meteoblueApiKey}&lat=${lat}&lon=${lon}&asl=0&format=json`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.data_1h) {
                alert('Datos del clima no encontrados.');
                return;
            }
            mostrarClima(data);
            mostrarMapa(lat, lon);
        })
        .catch(error => {
            console.error('Error al consultar el clima:', error);
            alert('Error al consultar el clima.');
        });
}

function mostrarClima(data) {
    const tbody = document.querySelector('#weatherTable tbody');
    tbody.innerHTML = `
        <tr>
            <td>${data.data_1h.weather[0].description}</td>
            <td>${data.data_1h.temperature[0]} °C</td>
            <td>${data.data_1h.humidity[0]} %</td>
            <td>${data.data_1h.wind_speed[0]} m/s</td>
        </tr>
    `;
}

function mostrarMapa(lat, lon) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng: lon },
        zoom: 10
    });
    new google.maps.Marker({
        position: { lat, lng: lon },
        map: map
    });
}

function limpiarFormulario() {
    document.getElementById('weatherForm').reset();
    document.querySelector('#weatherTable tbody').innerHTML = '';
    document.getElementById('map').innerHTML = '';
}