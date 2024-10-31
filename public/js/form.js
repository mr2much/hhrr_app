const checkboxHasJob = document.querySelector('#candidato-empleado');

checkboxHasJob.addEventListener('change', (e) => {
  const inputCurrentJob = document.querySelector('#job_actual');

  inputCurrentJob.toggleAttribute('disabled');
});

// async function createNewCandidato(candidato, action, method) {
//   const options = {
//     method: method,
//     redirect: 'follow',
//     headers: {
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify({ candidato }),
//   };

//   try {
//     const res = await fetch(action, options);
//     if (res.status >= 300 && res.status < 400) {
//       console.log('Redirected', res.headers);

//       if (location) {
//         console.log(location);
//       }
//     } else {
//       return res.json();
//     }
//   } catch (error) {
//     console.error('Request failed', error);
//   }
// }

// document.querySelector('form').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const form = e.target;

//   const newCandidato = validateFormGetCandidato(form);

//   p5Canvas.loadPixels();

//   if (imgInput.elt.files[0]) {
//     const imgName = imgInput.elt.files[0].name;

//     // convert image data to Encode 64
//     const encode64 = imgProfile.elt.src.split(';base64,');

//     // from data:image/format, split by :, then take the second
//     // argument which should be image/format
//     const type = encode64[0].split(':')[1];
//     const imgTo64 = encode64[1];

//     const { width, height } = imgProfile;

//     // Create an image object with the encoded base 64 data
//     const image = {
//       type,
//       width,
//       height,
//       imgName,
//       imgTo64,
//     };

//     newCandidato.image = image;
//   }

//   const data = await createNewCandidato(
//     newCandidato,
//     form.action.split('5000')[1],
//     form.method
//   );

//   if (data.redirectURL) {
//     window.location = data.redirectURL;
//   }
// });

// function imageFileHandler(file) {
//   if (file.type.includes('image')) {
//     imgProfile = createImg(file.data, '');
//     imgProfile.hide();
//   } else {
//     console.log(file.type);
//   }
// }

// function setup() {
//   const profileFieldset = document.querySelector('#profile-pic');
//   p5Canvas = createCanvas(1, 1);

//   imgInput = createFileInput(imageFileHandler);
//   imgInput.id('foto-perfil');
//   imgInput.class('form-control');
//   imgInput.addClass('p-1');
//   imgInput.elt.name = 'imgUrl';

//   imgInput.parent(profileFieldset);

//   pixelDensity(1);
//   background(0);
// }
