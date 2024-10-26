/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable linebreak-style */

const perfiles = [
  'IT',
  'Desarrollo',
  'DBA',
  'Telecomunicaciones',
  'Contabilidad',
  'Servicio al Cliente',
];

const academicLevels = [
  'Estudiante',
  'Nivel Tecnico',
  'Licenciatura',
  'Ingenieria',
  'Maestria',
  'Doctorado',
];

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/v1/candidatos'
    : 'https://managerhhrr.fly.dev/api/v1/candidatos';

const darkThemePath = 'https://bootswatch.com/5/darkly/bootstrap.min.css';
const lightThemePath = 'https://bootswatch.com/5/flatly/bootstrap.min.css';

const LOCAL_STORAGE_KEY = 'hhrr_app';
const styleSheetLink = document.querySelector('#theme-style-link');
const lightMode = document.querySelector('#light');
const darkMode = document.querySelector('#dark');
const storedTheme = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
const toggleMode = document.querySelector('#btn-check-outlined');

let isDark = storedTheme && storedTheme.isDark;

if (isDark) {
  activateLightTheme();
} else {
  activateDarkTheme();
}

function activateLightTheme() {
  styleSheetLink.setAttribute('crossorigin', 'anonymous');
  styleSheetLink.setAttribute('href', lightThemePath);
  darkMode.style.display = '';
  lightMode.style.display = 'none';
}

function activateDarkTheme() {
  styleSheetLink.setAttribute('crossorigin', 'anonymous');
  styleSheetLink.setAttribute('href', darkThemePath);
  lightMode.style.display = '';
  darkMode.style.display = 'none';
}

function setTheme() {
  isDark = !isDark;
  if (isDark) {
    activateLightTheme();
  } else {
    activateDarkTheme();
  }

  const themeValue = { isDark };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(themeValue));
}

toggleMode.addEventListener('click', (e) => {
  setTheme();
});

function parseIDFromURL() {
  const parts = window.location.href.match(/\/candidatos\/(.*)\/edit/);
  return parts[1].trim();
}

function parseAmountToDominicanPesos(amount) {
  return Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
  }).format(amount);
}

function getCandidato(id) {
  return fetch(`${API_URL}/${id}`).then((res) => res.json());
}

function validaCedula(cedula) {
  return (
    typeof cedula === 'string' &&
    cedula.trim() !== '' &&
    cedula.length === 13 &&
    cedula.match('^[0-9]{3}-?[0-9]{7}-?[0-9]{1}$') !== null
  );
}

function calculateAgeFromDOB(dob) {
  // Date difference in milliseconds
  const dateToday = new Date();
  const birthDate = new Date(dob);
  let age = dateToday.getFullYear() - birthDate.getFullYear();

  // Check month difference to improve age precision a little bit
  const monthDifference = dateToday.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && dateToday.getDate() < birthDate.getDate())
  ) {
    age--; // subtract one year
  }

  return age;
}

function validateFormGetCandidato(form) {
  const formData = new FormData(form);

  const cedula = formData.get('candidato[cedula]');
  const nombres = formData.get('candidato[nombres]');
  const apellidos = formData.get('candidato[apellidos]');
  const email = formData.get('candidato[email]');
  const dob = formData.get('candidato[dob]');
  const candidateExp = formData.get('candidato[candidateExp]');
  const currentlyWorking = formData.get('candidato[currentlyWorking]')
    ? true
    : false;
  const exp_salario = Number(formData.get('candidato[exp_salario]'));
  const perfilCandidato = formData.get('candidato[perfilCandidato]');
  const nivelAcademico = formData.get('candidato[nivelAcademico]');
  const country = formData.get('candidato[country]');
  const region = formData.get('candidato[region]');
  const notas = formData.get('candidato[notas]');

  const countrySelector = document.querySelector('#countries');
  const regionSelector = document.querySelector('#gds-cr-region');

  const countryRegionData = {
    country: countrySelector.value,
    selectedIndex: countrySelector.selectedIndex - 1,
    region: regionSelector.value,
  };

  // console.log(`Country: ${countrySelector.value}`);
  // console.log(`Index: ${countrySelector.selectedIndex - 1}`);
  // console.log(`Region: ${regionSelector.value}`);
  // console.log(
  //   `Country_Region: ${country_region[countrySelector.selectedIndex - 1][0]}`
  // );

  const candidato = {
    cedula,
    nombres,
    apellidos,
    email,
    dob,
    candidateExp,
    currentlyWorking,
    job_actual: formData.get('candidato[job_actual]')
      ? formData.get('candidato[job_actual]')
      : '',
    exp_salario,
    perfilCandidato,
    nivelAcademico,
    countryRegionData,
    country,
    region,
    notas,
  };

  return candidato;
}

function fixDateFormat(dateString, replaceChar) {
  return new Date(dateString.replace(`${replaceChar}`, '/')).toLocaleDateString(
    'es-DO'
  );
}
