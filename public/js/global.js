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

function validateFormGetCandidato(form, message) {
  const formData = new FormData(form);

  const cedula = formData.get('cedula');
  const nombres = formData.get('nombres');
  const apellidos = formData.get('apellidos');
  const email = formData.get('email');
  const dob = formData.get('dob');
  const age = calculateAgeFromDOB(dob);
  const candidateExp = formData.get('candidateExp');
  const currentlyWorking = formData.get('currentlyWorking') ? true : false;
  const exp_salario = Number(formData.get('exp_salario'));
  const perfilCandidato = formData.get('perfilCandidato');
  const imgUrl = '/res/img/user.png';
  const nivelAcademico = formData.get('nivelAcademico');
  const country = formData.get('country');
  const region = formData.get('region');
  const notas = formData.get('notas');

  console.log(country);
  console.log(region);
  // const country_region_data = {
  //   country: countrySelector.value,
  //   selectedIndex: countrySelector.selectedIndex - 1,
  //   selectedRegion: regionSelector.value,
  // };

  // console.log(`Country: ${countrySelector.value}`);
  // console.log(`Index: ${countrySelector.selectedIndex - 1}`);
  // console.log(`Region: ${regionSelector.value}`);
  // console.log(
  //   `Country_Region: ${country_region[countrySelector.selectedIndex - 1][0]}`
  // );

  // should validate that the cedula has a valid format
  if (!validaCedula(cedula)) {
    message.textContent = 'Por favor introduzca una cedula valida!';
    message.style.display = '';
    return;
  }

  if (nombres.trim() === '') {
    // show alert message when nombres is empty
    return;
  }

  if (apellidos.trim() === '') {
    // show alert message when apellidos is empty
    return;
  }

  // should validate that the dob has a valid date format
  if (dob.trim() === '') {
    // show alert message when date of birth (dob) is empty
    return;
  }

  if (Number.isNaN(exp_salario)) {
    message.textContent =
      'Debe introducir un valor númerico para la Expectativa Salarial';
    message.style.display = '';
    return;
  }

  // should also convert dob from YYYY-MM-DD to valid database date format

  const candidato = {
    cedula,
    nombres,
    apellidos,
    email,
    dob,
    age,
    candidateExp,
    currentlyWorking,
    job_actual: formData.get('job_actual') ? formData.get('job_actual') : '',
    exp_salario,
    perfilCandidato,
    imgUrl,
    nivelAcademico,
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
