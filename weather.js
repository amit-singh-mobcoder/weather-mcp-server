import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.WEATHER_STACK_API_KEY;

export const getWeatherByCity = async (cityName) => {
    try {
        console.log("API_KEY", API_KEY)
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${cityName}`);
        const data = await response.json();
        return JSON.stringify(data);
    } catch (error) {
        console.error('Error in getWeatherByCity api', error);
    }

}
