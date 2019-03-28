//Load DOM first
window.addEventListener('DOMContentLoaded', () => {
  //DOM selection
  const tempDescription = document.querySelector('.temp-description');
  const tempDegree = document.querySelector('.temp-degree');
  const locLocation = document.querySelector('.loc-location');
  //Global Variables
  let noDecision = true;

  //If no decision advert user
  setTimeout(() => {
    if(noDecision) {
      tempDescription.innerHTML = 'Please click on allow location to see the current weather of your city!';
    }
  }, 5000)
  //Functions
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

  const error = () => {
    noDecision = false;
    tempDescription.innerHTML = 'For this app work properly, you need to allow your location access!';
  }

  const dataToUser = (data) => {
    console.log(data);
    tempDegree.innerHTML = data.currently.temperature;
    tempDescription.innerHTML = data.hourly.summary;
    locLocation.innerHTML = data.timezone;
  }



  navigator.geolocation.getCurrentPosition(success, error);
  //If geolocation is not allowed advert user

}); //___DOMContentLoaded
//Show current degree in celcius and Fahrenheit
//Show current city location
