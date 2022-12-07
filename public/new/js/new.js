/* eslint-disable linebreak-style */
const errorMessage = document.querySelector('#errorMessage');

errorMessage.style.display = 'none';

const btnCancel = document.querySelector('form #cancel-btn');

btnCancel.addEventListener('click', (e) => {
  window.location = '/';
});

const form = document.querySelector('form');

async function createNewCandidato(candidato) {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(candidato),
  };
  const res = await fetch(`${API_URL}/`, options);

  return res.json();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newCandidato = validateFormGetCandidato(form, errorMessage);

  if (newCandidato) {
    createNewCandidato(newCandidato).then((result) => {
      if (result.status === 500) {
        errorMessage.textContent = 'Ya existe un candidato con esta cedula!';
        errorMessage.style.display = '';
      } else {
        window.location = `/candidato.html?id=${result._id}`;
      }
    });
  }
});
