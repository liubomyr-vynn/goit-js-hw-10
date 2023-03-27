import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const RESULT = 1;
const MAX_RESULT = 10;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleTextInput, DEBOUNCE_DELAY));

function handleTextInput(event) {
  const inputValue = event.target.value.trim();
  if (inputValue.length < 1) {
    clearInterface();
    return;
  }
  fetchCountries(inputValue)
    .then(renderCountryList)
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function getCountryListMarkup(country) {
  return `
    <li class="country-item">
      <img class="country-img" src="${country.flags.svg}" alt="${country.name.common}" width="30" height="auto">
      <p>${country.name.common}</p>
    </li>
  `;
}

function getCountryInfoMarkup(country) {
  return `
    <div class="country-title">
      <img class="country-img" src="${country.flags.svg}" alt="${
    country.name.common
  }" width="30" height="auto">
      <p><span>${country.name.common}</span></p>
    </div>
    <p>Capital: <span>${country.capital}</span></p>
    <p>Population: <span>${country.population}</span></p>
    <p>Languages: <span>${Object.values(country.languages).join(
      ', '
    )}</span></p>
  `;
}

function renderCountryList(results) {
  clearInterface();
  if (results.length > MAX_RESULT) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  const listMarkup = results.map(getCountryListMarkup).join('');
  const infoMarkup = results.map(getCountryInfoMarkup).join('');

  if (results.length === RESULT) {
    countryListEl.innerHTML = '';
    countryListEl.style.visibility = 'none';
    countryInfoEl.style.visibility = 'block';
    countryInfoEl.innerHTML = infoMarkup;
  }
  if (results.length > RESULT && results.length <= MAX_RESULT) {
    countryInfoEl.innerHTML = '';
    countryInfoEl.style.visibility = 'none';
    countryListEl.style.visibility = 'block';
    countryListEl.innerHTML = listMarkup;
  }
}

function clearInterface() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}
