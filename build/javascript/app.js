//Load DOM first
window.addEventListener('DOMContentLoaded', () => {
  //DOM selection
  const tempDescription = document.querySelector('.temp-description');
  const tempDegree = document.querySelector('.temp-degree');
  const locLocation = document.querySelector('.loc-location');

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
    
    //Quick solve for the cross origin problem
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const weatherAPI = `${proxy}https://api.darksky.net/forecast/1c9aa3f4a39a987be8e736bd3a9764e1/${lat},${lng}`;
    
    //Fetch API and display data to user
    fetch(weatherAPI)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataToUser(data);
      });
  }

  // Error Function --------------------------------
  //If geolocation is not allowed advert user
  const error = () => {
    noDecision = false;
    tempDescription.innerHTML = 'For this app work properly, you need to allow your location access!';
  }

  const dataToUser = (data) => {
    console.log(data);
    temp = data.currently.temperature;
    temperatureScaleToggler(temp);
    tempDescription.innerHTML = data.hourly.summary;
    locLocation.innerHTML = data.timezone;
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
