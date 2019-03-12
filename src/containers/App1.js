import React, { Component } from 'react';
import './App.css';

class App extends Component {

componentDidMount() {
    fetch("http://api.openweathermap.org/data/2.5/weather?q=London&appid=1a538957190ec76ba18ff83fef95d442")
        .then(response =>  {
            console.log(response);
            return response.json()
        })
        .then(data => {
          console.log(data);
         })
        .catch(error => console.log(error));
    }
    
    render() {
        return (
            <div>
              
            </div>
            
        )
    }
}

export default App;
