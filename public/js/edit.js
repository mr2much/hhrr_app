/* eslint-disable linebreak-style */
let p5Canvas;
let imgInput;
let imgProfile;

const idCandidato = parseIDFromURL();
const form = document.querySelector('form');

const errorMessage = document.querySelector('#errorMessage');

errorMessage.style.display = 'none';

// const btnCancel = document.querySelector('form #cancel-btn');

function imageFileHandler(file) {
  if (file.type.includes('image')) {
    imgProfile = createImg(file.data, '');
    imgProfile.hide();
  } else {
    console.log(file.type);
  }
}

function setup() {
  const profileFieldset = document.querySelector('#profile-pic');
  p5Canvas = createCanvas(1, 1);

  imgInput = createFileInput(imageFileHandler);
  imgInput.id('foto-perfil');
  imgInput.class('form-control');
  imgInput.elt.name = 'imgUrl';

  imgInput.parent(profileFieldset);

  pixelDensity(1);
  background(0);

  // getCandidato(idCandidato).then(prepopulateFormWithCandidatoInfo);
}

// btnCancel.addEventListener('click', (e) => {
//   window.location = `/candidato.html?id=${idCandidato}`;
// });

function prepopulateFormWithCandidatoInfo(candidato) {
  // We don't use FormData because formData.set() doesn't update the info on the page
  document.querySelector('#cedula').value = candidato.cedula;
  document.querySelector('#nombres').value = candidato.nombres;
  document.querySelector('#apellidos').value = candidato.apellidos;
  document.querySelector('#email').value = candidato.email;
  document.querySelector('#dob').value = candidato.dob;

  const age = calculateAgeFromDOB(dob);

  document.querySelector('#job_actual').value = candidato.job_actual;

  // Select checkbox matching the value saved, set it to true (checked)
  document.querySelector(
    `input[value="${candidato.candidateExp}"]`
  ).checked = true;
  document.querySelector('#candidato-empleado').checked =
    candidato.currentlyWorking;
  document.querySelector('#job_actual').value = candidato.job_actual;
  document.querySelector('#expectativa-salarial').value = candidato.exp_salario;

  document.querySelector('#perfil-candidato').value = candidato.perfilCandidato;

  document.querySelector('#nivel-academico').value = candidato.nivelAcademico;
  const countryInput = document.querySelector('#countries');

  countryInput.value = candidato.country ? candidato.country : '';

  const regionInput = document.querySelector('#gds-cr-region');
  regionInput.value = candidato.region ? candidato.region : '';

  // If country of origin changes, clear region value
  countryInput.addEventListener('input', () => {
    regionInput.value = '';
  });

  document.querySelector('#notas').value = candidato.notas;

  // If the checkbox for currently employed is checked, enable the
  // textbox for Trabajo Actual
  const checkboxHasJob = document.querySelector('#candidato-empleado');

  document.querySelector('#job_actual').disabled = !checkboxHasJob.checked;

  checkboxHasJob.addEventListener('change', (e) => {
    const inputCurrentJob = document.querySelector('#job_actual');

    inputCurrentJob.toggleAttribute('disabled');
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  p5Canvas.loadPixels();

  const modifiedCandidato = validateFormGetCandidato(form, errorMessage);

  if (imgInput.elt.files[0]) {
    const imgName = imgInput.elt.files[0].name;

    // convert image data to Encode 64
    const encode64 = imgProfile.elt.src.split(';base64,');

    // from data:image/format, split by :, then take the second
    // argument which should be image/format
    const type = encode64[0].split(':')[1];
    const imgTo64 = encode64[1];

    const { width, height } = imgProfile;

    // Create an image object with the encoded base 64 data
    const image = {
      type,
      width,
      height,
      imgName,
      imgTo64,
    };

    modifiedCandidato.image = image;
  }

  if (modifiedCandidato) {
    updateCandidato(modifiedCandidato).then((candidato) => {
      window.location = `/api/v1/candidatos/${candidato._id}`;

      return true;
    });
  }
});

async function updateCandidato(candidato) {
  const options = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(candidato),
  };

  const res = await fetch(`/api/v1/candidatos/${idCandidato}`, options);

  return res.json();
}
