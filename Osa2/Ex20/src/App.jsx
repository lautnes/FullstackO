import { useState, useEffect } from 'react';
import axios from 'axios';

// Component for listing multiple countries with a "show" button for each
const CountryList = ({ countries, onSelectCountry }) => (
  <div>
    {countries.map(country => (
      <p key={country.name.common}>
        {country.name.common} <button onClick={() => onSelectCountry(country)}>show</button>
      </p>
    ))}
  </div>
);

// Component for showing details of a single country, including weather information
const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather data for the country's capital
  useEffect(() => {
    if (apiKey && country.capital) {
      const capital = country.capital[0]; // Use the first capital if there are multiple
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
        .then(response => setWeather(response.data))
        .catch(error => console.error("Error fetching weather data:", error));
    }
  }, [apiKey, country.capital]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          {weather.weather[0] && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Main App component handling the search and display of countries
const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Fetch all countries and filter based on the search term
  useEffect(() => {
    if (search) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
          );
          setCountries(filteredCountries);
          setSelectedCountry(null); // Reset selected country when search changes
        })
        .catch(error => console.error("Error fetching country data:", error));
    } else {
      setCountries([]);
      setSelectedCountry(null);
    }
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1>Country Information</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search for a country"
      />
      {selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) : countries.length > 10 ? (
        <p>Too many matches, specify another filter.</p>
      ) : countries.length > 1 ? (
        <CountryList countries={countries} onSelectCountry={handleSelectCountry} />
      ) : countries.length === 1 ? (
        <CountryDetail country={countries[0]} />
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
};

export default App;
