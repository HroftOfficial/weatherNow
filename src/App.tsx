import { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMagnifyingGlass,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import notFound from "./assets/404.png";
import clearUrl from "./assets/clear.png";
import rainUrl from "./assets/rain.png";
import snowUrl from "./assets/snow.png";
import cloudUrl from "./assets/cloud.png";
import mistUrl from "./assets/mist.png";

const APIKey = "API KEY";
/** https://openweathermap.org/api */ 

function App() {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [wind, setWind] = useState<string | null>(null);
  const [city, setCity] = useState("Ростов-на-Дону");
  const [answerStatus, setAnswerStatus] = useState<number>(200)

  const getWetherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
      );
      switch (response.data.weather[0].main) {
        case "Clear":
          setImgUrl(clearUrl);
          setDescription("безоблачно");
          break;
        case "Rain":
          setImgUrl(rainUrl);
          setDescription("дождь");
          break;
        case "Snow":
          setImgUrl(snowUrl);
          setDescription("снег");
          break;
        case "Clouds":
          setImgUrl(cloudUrl);
          setDescription("облачно");
          break;
        case "Haze":
          setImgUrl(mistUrl);
          setDescription("туман");
          break;
        default:
          setImgUrl("");
      }
      setTemp(response.data.main.temp);
      setHumidity(response.data.main.humidity);
      setWind(response.data.wind.speed);
      setAnswerStatus(200);
    } catch (error) {
      if (error instanceof Error) {
        setAnswerStatus(404);
      } else {
        console.log("неизвестная ошибка");
      }
    }
  };

  useEffect(() => {
    getWetherData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="search-box">
          <FontAwesomeIcon icon={faLocationDot} className="location"></FontAwesomeIcon>
          <input type="text" placeholder="Ведите название" value={city} onChange={(e)=> setCity((e.target.value).trim())}/>
          <button onClick={()=>getWetherData()}>
            <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
          </button>
        </div>
        {answerStatus == 404 && (
          <div className="not-found fadeIn">
            <img src={notFound} alt="not found logo" />
            <p> Населенный пункт не найден</p>
          </div>
        )}
        {answerStatus == 200 && (
          <div className="weather-box fadeIn">
            <img src={imgUrl} />
            <p className="temperature">
              {temp}
              <span>°C</span>
            </p>
            <p className="description">{description}</p>
          </div>
        )}
        <div className="weather-details fadeIn">
          <div className="humidity">
            <FontAwesomeIcon icon={faWater} className="formatP" ></FontAwesomeIcon>
            <div className="text">              
              <span>{humidity} %</span>
              <p>Влажность</p>
            </div>
          </div>
          <div className="wind fadeIn">
            <FontAwesomeIcon icon={faWind} className="formatP"></FontAwesomeIcon>
            <div className="text">
              <span>{wind} км/ч</span>
              <p>Ветер</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
