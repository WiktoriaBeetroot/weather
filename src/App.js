import React from "react";
import { Weather } from "./Weather";
import { Input } from './Input';
  
  function convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

class WeatherApp extends React.Component{
  state = { 
    location: '', 
    isLoading: false, 
    locationName: '', 
    weather: {} 
  };

    fetchWeather = async () => {
        if (this.state.location.length < 2) return this.setState({weather: ''});

        try {
            this.setState({ isLoading: true });

            const geoRes = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
            );
            const geoData = await geoRes.json();
        
            if (!geoData.results) throw new Error("Location not found");
        
            const { latitude, longitude, timezone, name, country_code } =
              geoData.results.at(0);
            this.setState({ locationName: `${name} ${convertToFlag(country_code)}`});
        
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
            );
            const weatherData = await weatherRes.json();
            this.setState({ weather : weatherData.daily});
          } catch {
            console.log('Error white fetching the data');
          }finally {
            this.setState({ isLoading: false })
          }
    }

    handlerChange = (e) => this.setState({ location: e.target.value })

    componentDidMount() {
      this.setState({location: localStorage.getItem('location') || ""})
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.location !== prevState.location) {
        this.fetchWeather()
        localStorage.setItem('location', this.state.location)
      }
    }
  
    render() {
        return (
            <div className="app">
                <h1>Weather</h1>

                <Input location={this.state.location} handlerChange={this.handlerChange} />

                {this.state.isLoading && <p className="loader">Loading...</p>}

                {this.state.weather.weathercode && 
                  <Weather  weather={ this.state.weather } location={ this.state.locationName }/>
                }
            </div>
        )
    }
}

export default WeatherApp;