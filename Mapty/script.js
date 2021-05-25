'use strict';

// main work out class that accept common data from for running and cycling
class Workout {
  date = new Date();
  // to create unique ids for each workout
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, duration, distance) {
    //this.date = ...
    //this.id = ...
    this.coords = coords;
    this.duration = duration; // in min
    this.distance = distance; // in km
  }

  // set date for each workout and where its unique description will be created
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  // an example to show that when an object is converted to string then converted back to object it will loss all the inherited methods from and will only have objects built in methods
  click() {
    this.clicks++;
  }
}

// The extends keyword is used in class declarations or class expressions to create a class that is a child of another class.
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    // super keyword is used to access and call functions on an object's parent.
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  // method inside running class that can be access when the running type is selectd
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////////////////
//APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// main app
class App {
  // # - created private variables inside an object
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 13;

  constructor() {
    // Get user position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    // Get geolocation API
    //Navigator.geolocation read-only property returns a Geolocation object that gives Web content access to the location of the device. This allows a Web site or app to offer customized results based on the user's location.
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        // .bind() is used to refer the 'this' keyword to the App class
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        },
        { timeout: 1000 }
      );
  }

  // pass the current location that get from navigator.geolocation
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    // set array for leaflet setview variable that need coordinate of lat and long
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handle click on Map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  // show form once click on map
  _showForm(mapEv) {
    this.#mapEvent = mapEv;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  // hide and clear form once new workout created
  _hideForm() {
    //empty inputs
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  // will hide elevation or cadence div based on select form of running and cycling
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // method that is passed when the form is submitted
  _newWorkout(e) {
    // check first if the inputed data is valid
    // method to check if number
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    // method to check if positive
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form / Inputed datas
    const type = inputType.value;
    // positive sign to convert the value type to number
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    console.log(this.#mapEvent.latlng);

    // if activity is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        // will check if the return value for data validation is true. if false will return alert
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');

      // if data validation is true will create new Running workout
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if activity is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      // if data validation is true will create new Cycling workout
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(this.#workouts);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // render workout
    this._renderWorkout(workout);

    // Hide form and Clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  // will render marker from leaflet api. will be called inside _newWorkout method
  _renderWorkoutMarker(workout) {
    // will put marker based on workout coords. all used method are based on leaflet api
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )

      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  // html that will be added to the form once new work out is created
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          
        `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
        </div>
    </li>
        `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
        </div>
    </li>
        `;

    form.insertAdjacentHTML('afterend', html);
  }

  // will set focus on the activity that the user click
  _moveToPopup(e) {
    // BUGFIX: When we click on a workout before the map has loaded, we get an error. But there is an easy fix:
    if (!this.#map) return;

    // closest is used to target the parent where class workout is located
    const workoutEl = e.target.closest('.workout');

    // if not click on the div that contains the workout class will just return
    if (!workoutEl) return;

    // get the specific workout based on the id of the workEl variable
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    // will focus on specific location based on the id
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using the publick interface
    // an example to show that when an object is converted to string then converted back to object it will loss all the inherited methods from and will only have objects built in methods
    // workout.click();
  }

  // set the local storage and save data that is being converted to string
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  // get the data on the local storage, converted it back to object and show it on UI
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    // will iterate on data and render it on the map
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  // To clear storage
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
