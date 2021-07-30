import "./App.css";
// import jsondata from "./weather.json";
import React, { useState, useEffect } from "react";
import logo from "./weather-logo.svg";
import { getName } from "country-list";
import axios from "axios";

const url = "https://api.openweathermap.org/data/2.5/weather?";
const api_key = "8f9b4dd4a16b52fcd66d2e11fceedc37";
//"ccce415d8abc392c53dd9d5544a3b5b4";
//"b190a0605344cc4f3af08d0dd473dd25";

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [main, setMain] = useState({});
  const [weather, setWeather] = useState([]);
  const [location, setLocation] = useState({ longitude: null, latitude: null });

  useEffect(() => {
    const fetchData = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            setLocation({ lon, lat });
            const api_url =
              url + "lat=" + lat + "&lon=" + lon + "&appid=" + api_key;
            axios.get(api_url).then(
              (response) => {
                if (response.status >= 200 && response.status < 300) {
                  setWeatherData(response.data);
                  setMain(response.data.main);
                  setWeather(response.data.weather);
                  console.log("WeatherData: ");
                  console.log(weatherData);
                } else {
                  console.log(response.status);
                }
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
          },
          {
            timeout: 1000,
          }
        );
      }
    };
    if (isLoading) {
      setTimeout(() => {
        fetchData();
        setIsError(true);
        if (weatherData !== undefined) {
          console.log(weatherData);
          setMain(weatherData.main);
          setWeather(weatherData.weather);
          setIsLoading(false);
          setIsError(false);
        }
      }, 1000);
    }
    return () => {};
  }, [isLoading, weatherData, location]);

  if (isLoading) {
    return (
      <>
        <div className='main-container'>
          <h1>Loading..</h1>
        </div>
      </>
    );
  }
  if (isError) {
    return (
      <>
        <div className='main-container'>
          <h1>Error!</h1>
        </div>
      </>
    );
  }
  // const { main, weather } = weatherData;

  // console.log(weather[0]);

  return (
    <>
      {/* <script>navigator.geolocation;</script> */}
      {/* {location !== undefined ? (
        <>
          <h2>latitude:{location.latitude}</h2>
          <h2>longitude:{location.longitude}</h2>
        </>
      ) : (
        <h1>not found</h1>
      )} */}

      <div className='main-container'>
        <h1>Current Weather</h1>
        <div className='country-name'>
          <h2>
            Country:
            {weatherData.sys !== undefined
              ? getName(weatherData.sys.country)
              : ""}
          </h2>
        </div>
        <div className='city-name'>
          <h2>Location: {weatherData.name}</h2>
        </div>
        <div className='weather-img'>
          <img
            src={
              "http://openweathermap.org/img/wn/" +
              (weather ? weather[0].icon : "10d") +
              "@2x.png"
            }
            alt={weather ? weather[0].description : ""}
          />
        </div>
        <div className='weather-text'>
          <h2>Current Weather: {weather ? weather[0].main : "Unknown"}</h2>
        </div>
        <div className='current-temp'>
          <h2>
            Current Temperature: {(main ? main.temp - 273.15 : 0).toFixed(2)} °C
          </h2>
        </div>
        <div className='feels-like-temp'>
          <h2>
            Feels Like: {(main ? main.feels_like - 273.15 : 0).toFixed(2)} °C
          </h2>
        </div>
        <div className='humidity'>
          <h3>Humidity: {main ? main.humidity : 0}%</h3>
        </div>
        <button
          type='button'
          className='btn'
          onClick={() => {
            setIsLoading(true);
            // setTime(1000);
          }}
        >
          Refresh
        </button>
      </div>
    </>
  );
}

export default App;
