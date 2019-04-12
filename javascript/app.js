//Load DOM first
window.addEventListener('DOMContentLoaded', () => {
  //DOM selection
  const tempDescription = document.querySelector('.temp-description');
  const tempDegree = document.querySelector('.temp-degree');
  const locLocation = document.querySelector('.loc-location');
  const tempPrecipitation = document.querySelector('.temp-precipitation');

  let noDecision = true;
  let temp;

  //If no decision advert user
  setTimeout(() => {
    if (noDecision) {
      tempDescription.innerHTML =
        'Please click on allow location to see the current weather of your city!';
    }
  }, 5000);

  // Add Default Icon by Skyconjs
  const icon = new Skycons({color: '#ededed'});
  icon.add('weather-icon', Skycons.PARTLY_CLOUDY_DAY);

  // Success Function --------------------------------
  const success = pos => {
    noDecision = false;

    let crd = pos.coords;
    let lat = crd.latitude;
    let lng = crd.longitude;

    //Here API (reverse geolocation) needs an hereID and a hereAppCode key
    const hereID = 'QADFRxDFnnKNTH6AxKQN';
    const hereAppCode = 'UPX7SLsw_SDme3BEECAfWQ';
    const darkSkyKey = '1c9aa3f4a39a987be8e736bd3a9764e1';

    //Quick solve for the cross origin problem
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const weatherAPI = `${proxy}https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;
    const locationAPI = `${proxy}https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${lat},${lng}&mode=retrieveAddresses&maxresults=1&app_id=${hereID}&app_code=${hereAppCode}`;
    //Fetch DarkSky API
    fetch(weatherAPI)
      .then(response => {
        return response.json();
      })
      .then(data => {
        weatherToUser(data);
      });
    //Fetch Here API
    fetch(locationAPI)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const address = data.Response.View[0].Result[0].Location.Address;
        locLocation.innerHTML =
          address.District !== 'undefined'
            ? `${address.District}, ${address.City}`
            : `${address.City}`;
      });
  };

  // Error Function --------------------------------
  //If geolocation is not allowed advert user
  const error = () => {
    noDecision = false;
    tempDescription.innerHTML =
      'For this app work properly, you need to allow your location access!';
  };

  const weatherToUser = data => {
    const {icon, temperature} = data.currently;

    setIcon(icon, 'weather-icon');
    temp = temperature;
    temperatureScaleToggler(temp);
    tempDescription.innerHTML = data.hourly.summary; //targeted by hour!
    if (typeof data.currently.precipType !== 'undefined') {
      tempPrecipitation.innerHTML = `${Math.round(
        data.currently.precipProbability * 100,
      )}% chance of ${data.currently.precipType}`;
    }
  };

  function setIcon(icon, iconID) {
    const skycons = new Skycons({color: '#ededed'});
    let currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
  //Toggles scale between C and F

  let tempIndex = 1;

  const temperatureScaleToggler = temp => {
    if (tempIndex % 2 == 0) {
      const f = temp.toFixed(1);
      //Show current Temperature in Fahrenheit
      return (tempDegree.innerHTML = `${f} F`);
    } else {
      const c = (((temp - 32) * 5) / 9).toFixed(1);
      //Transforms and show temperature in Celsius
      return (tempDegree.innerHTML = `${c}&#176 C`);
    }
  };

  document.addEventListener('click', () => {
    tempIndex++;
    temperatureScaleToggler(temp);
  });

  navigator.geolocation.getCurrentPosition(success, error);
}); //___DOMContentLoaded
//Show current city location
