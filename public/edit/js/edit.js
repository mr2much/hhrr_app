/* eslint-disable linebreak-style */
const idCandidato = parseIDFromURL();
const form = document.querySelector('form');

const errorMessage = document.querySelector('#errorMessage');

errorMessage.style.display = 'none';

const btnCancel = document.querySelector('form #cancel-btn');

btnCancel.addEventListener('click', (e) => {
  window.location = `/candidato.html?id=${idCandidato}`;
});

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
  // document.querySelector('#foto-perfil').value = candidato.imgUrl;
  document.querySelector('#nivel-academico').value = candidato.nivelAcademico;
  document.querySelector('#notas').value = candidato.notas;
}

getCandidato(idCandidato).then(prepopulateFormWithCandidatoInfo);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const modifiedCandidato = validateFormGetCandidato(form, errorMessage);

  if (modifiedCandidato) {
    updateCandidato(modifiedCandidato).then((result) => {
      console.log(result);
      window.location = `/candidato.html?id=${idCandidato}`;
    });
  }
});

async function updateCandidato(candidato) {
  const options = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(candidato),
  };

  const res = await fetch(`${API_URL}/${idCandidato}`, options);

  return res.json();
}
