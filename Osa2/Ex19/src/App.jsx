import { useState, useEffect } from 'react';
import axios from 'axios';

const CountryList = ({ countries, onSelectCountry }) => (
  <div>
    {countries.map(country => (
      <p key={country.name.common}>
        {country.name.common} <button onClick={() => onSelectCountry(country)}>show</button>
      </p>
    ))}
  </div>
);

const CountryDetail = ({ country }) => (
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
  </div>
);

const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
