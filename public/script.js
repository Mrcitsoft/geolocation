document.addEventListener("DOMContentLoaded", () => {
    const addressElement = document.getElementById('address');
    const changeAddressBtn = document.getElementById('changeAddressBtn');
    const addressForm = document.getElementById('addressForm');
    const countryInput = document.getElementById('country');
    const stateInput = document.getElementById('state');
    const specificAddressInput = document.getElementById('specificAddress');

    // Function to fetch location using Geolocation API
    function fetchLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            addressElement.textContent = "Geolocation is not supported by this browser.";
        }
    }

    // Function to show position and get address using reverse geocoding
    function showPosition(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(data => {
                const addressParts = data.address;
                const country = addressParts.country;
                const state = addressParts.state;

                countryInput.value = country;
                stateInput.value = state;
                specificAddressInput.value = data.display_name.replace(`${state}, ${country}, `, '');

                addressElement.textContent = `${specificAddressInput.value}, ${state}, ${country}`;
            })
            .catch(error => {
                console.error('Error fetching address:', error);
            });
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
        const newSpecificAddress = specificAddressInput.value;
        if (newSpecificAddress) {
            addressElement.textContent = `${newSpecificAddress}, ${newState}, ${newCountry}`;
            addressForm.style.display = 'none';
            changeAddressBtn.style.display = 'block';
        }
    });

});
