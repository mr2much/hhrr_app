/* eslint-disable linebreak-style */
const countriesDropdown = document.querySelector('#countries');
const lang = countriesDropdown.dataset.lan;
const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/all';

fetch(REST_COUNTRIES_URL)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    data.sort((a, b) => {
      if (a.name.common < b.name.common) {
        return -1;
      }

      if (a.name.common > b.name.common) {
        return 1;
      }

      return 0;
    });
    let countryOptions = '';
    data.forEach((country) => {
      let countryName = lang
        ? country.translations[lang].common
        : country.name.common;

      countryOptions += `<option>${countryName}</option>`;
    });

    countriesDropdown.innerHTML = countryOptions;
  })
  .catch((error) => {
    console.log(error);
  });
