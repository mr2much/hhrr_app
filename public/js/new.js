let p5Canvas;
let imgInput;
let imgProfile;

const checkboxHasJob = document.querySelector('#candidato-empleado');

checkboxHasJob.addEventListener('change', (e) => {
  const inputCurrentJob = document.querySelector('#job_actual');

  inputCurrentJob.toggleAttribute('disabled');
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
  const res = await fetch('/api/v1/candidatos/', options);

  return res.json();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newCandidato = validateFormGetCandidato(form);

  p5Canvas.loadPixels();

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

    newCandidato.image = image;
  }

  if (newCandidato) {
    createNewCandidato(newCandidato).then((result) => {
      if (result.status === 500) {
        console.log(result);

        // errorMessage.textContent = 'Ya existe un candidato con esta cedula!';
        // errorMessage.style.display = '';
      } else {
        window.location = `/api/v1/candidatos/${result._id}`;
      }
    });
  }
});

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
  imgInput.addClass('p-1');
  imgInput.elt.name = 'imgUrl';

  imgInput.parent(profileFieldset);

  pixelDensity(1);
  background(0);
}
