//Load DOM first
window.addEventListener('DOMContentLoaded', () => {
  //DOM selection
  const tempDescription = document.querySelector('.temp-description');
  const tempDegree = document.querySelector('.temp-degree');
  const locLocation = document.querySelector('.loc-location');
  const tempPrecipitation = document.querySelector('.temp-precipitation')
  
  let noDecision = true;
  let temp;

  //If no decision advert user
  setTimeout(() => {
    if(noDecision) {
      tempDescription.innerHTML = 'Please click on allow location to see the current weather of your city!';
    }
  }, 5000)
  // Success Function --------------------------------
  const success = (pos) => {
    noDecision = false;

    let crd = pos.coords; 
    let lat = crd.latitude;
    let lng = crd.longitude;

    //Here API (reverse geolocation) needs an appID and a appCode key
    const appID = 'QADFRxDFnnKNTH6AxKQN';
    const appCode = 'UPX7SLsw_SDme3BEECAfWQ';

    
    //Quick solve for the cross origin problem
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const weatherAPI = `${proxy}https://api.darksky.net/forecast/1c9aa3f4a39a987be8e736bd3a9764e1/${lat},${lng}`;
    const locationAPI = `${proxy}https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${lat},${lng}&mode=retrieveAddresses&maxresults=1&app_id=${appID}&app_code=${appCode}`;
    //Fetch DarkSky API
    fetch(weatherAPI)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        weatherToUser(data);
      });
    //Fetch Here API
    fetch(locationAPI)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const address = data.Response.View[0].Result[0].Location.Address
        console.log(address);
        locLocation.innerHTML = `${address.District}, ${address.City}`;
      });
  }

  // Error Function --------------------------------
  //If geolocation is not allowed advert user
  const error = () => {
    noDecision = false;
    tempDescription.innerHTML = 'For this app work properly, you need to allow your location access!';
  }

  const weatherToUser = (data) => {
    console.log(data);
    temp = data.currently.temperature;
    temperatureScaleToggler(temp);
    tempDescription.innerHTML = data.hourly.summary;
    tempPrecipitation.innerHTML = `${data.currently.precipProbability * 100}% chance of ${data.currently.precipType}`;
  }

  //Toggles scale between C and F
  
  let tempIndex = 1;

  const temperatureScaleToggler = (temp) => {
    if(tempIndex % 2 == 0) {
      const f = temp.toFixed(1);
      //Show current Temperature in Fahrenheit
      return tempDegree.innerHTML = `${f} F`;
    } else {
      const c = ((temp - 32) * 5/9).toFixed(1);
      //Transforms and show temperature in Celsius
      return tempDegree.innerHTML = `${c}&#176 C`;
    }
  }

  document.addEventListener('click', () => {
    tempIndex++;
    temperatureScaleToggler(temp);
  });




  navigator.geolocation.getCurrentPosition(success, error);

}); //___DOMContentLoaded
//Show current city location
