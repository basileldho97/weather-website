const apiKey = "afbc99db955a3347823752de85e7e55a";
        let map;

        async function getWeather() {
            const cityName = document.getElementById('cityInput').value.trim();
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

            const weatherResult = document.getElementById('weatherResult');
            const forecastResult = document.getElementById('forecastResult');
            const mapElement = document.getElementById('map');
            weatherResult.innerHTML = '';
            forecastResult.innerHTML = '';
            mapElement.style.display = 'none'; // Hide map initially

            if (!cityName) {
                weatherResult.innerHTML = '<p class="error">Please enter a city name.</p>';
                return;
            }

            try {
                //  current weather
                const weatherResponse = await fetch(currentWeatherUrl);
                if (!weatherResponse.ok) throw new Error("City not found");
                const weatherData = await weatherResponse.json();

                weatherResult.innerHTML = `
                    <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
                    <p><strong>🌡 Temperature:</strong> ${weatherData.main.temp}°C</p>
                    <p><strong>☁️ Weather:</strong> ${weatherData.weather[0].description}</p>
                    <p><strong>💧 Humidity:</strong> ${weatherData.main.humidity}%</p>
                    <p><strong>🌬 Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
                    <p><strong>🌅 Sunrise:</strong> ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                    <p><strong>🌇 Sunset:</strong> ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                `;

                // 5-day forecast
                const forecastResponse = await fetch(forecastUrl);
                if (!forecastResponse.ok) throw new Error("Forecast not found");
                const forecastData = await forecastResponse.json();

                const dailyForecasts = forecastData.list.filter(item =>
                    item.dt_txt.includes("12:00:00")
                );

                forecastResult.innerHTML = `<h3>📅 5-Day Forecast</h3>`;
                dailyForecasts.forEach(forecast => {
                    forecastResult.innerHTML += `
                        <div class="forecast-card">
                            <p><strong>${new Date(forecast.dt * 1000).toLocaleDateString()}</strong></p>
                            <p>${forecast.weather[0].description}</p>
                            <p>${forecast.main.temp}°C</p>
                        </div>
                    `;
                });

                //  map
                const { lat, lon } = weatherData.coord;
                mapElement.style.display = 'block'; // Display 
                if (!map) {
                    map = L.map('map').setView([lat, lon], 10);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(map);
                } else {
                    map.setView([lat, lon], 10);
                }
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${weatherData.name}</b><br>${weatherData.weather[0].description}`)
                    .openPopup();
            } catch (error) {
                weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
            }
        }