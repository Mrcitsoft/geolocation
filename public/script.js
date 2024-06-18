document.addEventListener("DOMContentLoaded", () => {
  const addressElement = document.getElementById('address');
  const changeAddressBtn = document.getElementById('changeAddressBtn');
  const addressForm = document.getElementById('addressForm');
  const countryInput = document.getElementById('country');
  const stateInput = document.getElementById('state');
  const cityInput = document.getElementById('city');

  const OPEN_CAGE_API_KEY = '9999a50e679941b3b51248db20de83ec';

  // Function to fetch location using Geolocation API
  function fetchLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
          });
      } else {
          addressElement.textContent = "Geolocation is not supported by this browser.";
      }
  }

  // Function to show position and get address using OpenCage Geocoding API
  async function showPosition(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
          const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPEN_CAGE_API_KEY}`);
          const data = await response.json();

          if (data.results && data.results.length > 0) {
              const components = data.results[0].components;
              console.log(components); // Log the components to understand its structure
              const country = components.country || 'Unknown';
              const state = components.state || components.province || 'Unknown';
              const city = components.city || components.town || components.village || components.hamlet || 'Unknown';

              countryInput.value = country;
              stateInput.value = state;
              cityInput.value = city;

              addressElement.textContent = `${city}, ${state}, ${country}`;
          } else {
              addressElement.textContent = "Unable to retrieve the address.";
          }
      } catch (error) {
          console.error('Error fetching address:', error);
          addressElement.textContent = "Unable to retrieve the address.";
      }
  }

  // Function to handle errors
  function showError(error) {
      switch (error.code) {
          case error.PERMISSION_DENIED:
              addressElement.textContent = "User denied the request for Geolocation.";
              break;
          case error.POSITION_UNAVAILABLE:
              addressElement.textContent = "Location information is unavailable.";
              break;
          case error.TIMEOUT:
              addressElement.textContent = "The request to get user location timed out.";
              break;
          case error.UNKNOWN_ERROR:
              addressElement.textContent = "An unknown error occurred.";
              break;
      }
  }

  // Fetch the location when the page loads
  fetchLocation();

  // Show the form to change the address
  changeAddressBtn.addEventListener('click', () => {
      addressForm.style.display = 'block';
      changeAddressBtn.style.display = 'none';
  });

  // Handle form submission to update the address
  addressForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const newCountry = countryInput.value;
      const newState = stateInput.value;
      const newCity = cityInput.value;
      if (newCity) {
          addressElement.textContent = `${newCity}, ${newState}, ${newCountry}`;
          addressForm.style.display = 'none';
          changeAddressBtn.style.display = 'block';
      }
  });
});
