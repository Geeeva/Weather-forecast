import React, { Component } from 'react';
import Spinner from '../UI/Spinner';
import './App.css';
import {TweenLite, TimelineLite} from "gsap/TweenMax";

class App extends Component {
    state = {
        cityData: null,
        cityName: '',
        confirmedCityName: '',
        error: '',
        searchNameString: '',
        woeid: '',
        weatherData: '',
        weatherForecast: '',
        weatherIcon: null,
        loading: false
    }

    validate = () => {
        let isError = false;
        let error = '';

        if(this.state.cityName.length === 0){
              isError = true;
              error = 'Pls.enter a valid city name';
          } else {
              error = ''
          }
          this.setState({
            error,
            confirmedCityName: '',
          })
          return isError
    }

    submitHandler = (event) => {
        event.preventDefault();
        const err = this.validate();

        if(err === false) {
            const searchString = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=';
            const searchNameString = searchString.concat(this.state.cityName);
            this.setState({
                searchNameString
            })
            fetch(searchNameString)
                .then(response =>  {
                  console.log(response);
                  return response.json()
                })
                .then(data => {
                    if(data.length === 0) {
                        let error = 'You have entered invalid city name or name that not exist in our database of cities, pls.enter existent city name';
                        this.setState({
                            error,
                            confirmedCityName: ''
                        }) 
                    } else {
                        const woeid = data[0].woeid;
                        this.setState({
                            loading: true,
                            confirmedCityName: this.state.cityName,
                            cityData: data,
                            woeid
                        })
                        const searchString = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/';
                        const searchWoeidString = searchString.concat(`${this.state.woeid}/`);
                        return fetch(searchWoeidString)
                    }
                    console.log(this.state.cityData, this.state.woeid);
                })
                .then(response => {
                    return response.json()
                    }              
                )
                .then(data => {
                    const today = data.consolidated_weather[0];
                    const country = data.parent.title;
                    const weatherForecast = 
                    <div>Today in <strong>{this.state.cityName}, {country}</strong> weather will be with <strong>{today.weather_state_name}</strong>, 
                        min temperature <strong>{parseInt(today.min_temp)}°C</strong>,  
                        max temperature <strong>{parseInt(today.max_temp)}°C</strong>,
                        and humidity will be <strong>{today.humidity}%</strong></div>;
                    const weatherIcon = `https://www.metaweather.com/static/img/weather/png/${today.weather_state_abbr}.png`;                    
                    this.setState({
                        loading: false, 
                        weatherData: data,
                        weatherForecast,
                        weatherIcon,
                        cityName: ''
                    })
                    console.log(this.state.weatherData);
                })
                .catch(error => console.log(error));

                this.setState({
                    weatherData: '',
                    weatherForecast: '',
                })
        }
    }

    nameChangeHandler = input => event => {
        this.setState({
          [input]: event.target.value
        })
    }

    componentDidMount(){
        let animation = new TimelineLite();
        TweenLite.ticker.useRAF(false);
        TweenLite.lagSmoothing(0);

        const spinningPic = document.getElementById('spinning-pic');
        animation.to(spinningPic, 1, {rotation: "+=360", transformOrigin:"center center"});
    }

    render() {
        let weatherOutput = null;
        if(this.state.loading) {
            weatherOutput = (
                <React.Fragment>
                    {/*Spinner*/}
                    <Spinner />
                    {/*Content-forecast-empty*/}
                    <div className="container-fluid content-forecast">
                          <div className="container"> 
                              <p className="forecast"></p>
                          </div>
                    </div>
                </React.Fragment>
            )
        } else {
            weatherOutput = (
              <React.Fragment>
                  {/*Weather Icon got from server*/}
                  <div className={"container-fluid content" + (this.state.weatherIcon !== null ? ' visible' : ' nonvisible')}>
                      <div className="container"> 
                          <div className="img-wrapper"><img src={this.state.weatherIcon} alt=""/></div>
                      </div>
                  </div>
                  {/*Forecast string empty*/}
                  <div className="container-fluid content-forecast">
                      <div className="container"> 
                          <div className="forecast">{this.state.weatherForecast}</div>
                      </div>
                  </div>
              </React.Fragment>
            )
        }
        return (
            <div className="App">
                <div className="container-fluid title-background">
                    <div className="container">
                        <h1>Weather forecast app</h1>
                    </div>
                </div>
                <div className="container-fluid header-background">
                    <div className="container">
                        <h3>Search Weather data for {this.state.confirmedCityName}</h3>
                        <form>
                          <input 
                              type="text"
                              placeholder="Pls.enter city name"
                              value={this.state.cityName}
                              onChange={this.nameChangeHandler('cityName')}
                          />
                          <button
                              type="submit"
                              onClick={this.submitHandler}
                          >
                              ENTER
                          </button>
                        </form>
                        <p className="error-message">{this.state.error}</p>
                    </div>
                </div>
                <div className="container-fluid">
                    {/*Opening pic*/}  
                    <div className="container">
                        <div className="spinning-pic-wrapper"><img id="spinning-pic" src="https://www.metaweather.com/static/img/weather/png/c.png" 
                        className={(this.state.weatherIcon !== null || this.state.loading === true ? 'nonVisible' : '')} alt="sun"/></div>  
                    </div>
                    {/*Weather Icon got from server, Forecast string empty*/}
                    <div className="weatherOutputWrapper">
                      {weatherOutput} 
                    </div>
                </div> 
                <div className="container-fluid footer-background">
                    <div className="container">
                        <h3>Getting today's weather forecast</h3>
                        <div className="icon-wrapper"><img src="https://www.metaweather.com/static/img/weather/lc.svg" alt="weather Icon"/></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
