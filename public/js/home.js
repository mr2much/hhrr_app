/* eslint-disable linebreak-style */

/* eslint-disable no-restricted-syntax */

const tableCandidatos = document.querySelector('table tbody');

async function loadEntries() {
  const res = await fetch(API_URL);
  return res.json();
}

function showCandidatos(listaCandidatos) {
  let rowCount = 0;
  listaCandidatos.forEach((candidato) => {
    const newRowCandidato = document.createElement('tr');
    tableCandidatos.appendChild(newRowCandidato);

    newRowCandidato.outerHTML = `<tr>
    <th scope="row">${++rowCount}</th>
    <td>
      ${candidato.cedula}
    </td>
    <td>
      ${candidato.nombres}
    </td>
    <td>
      ${candidato.apellidos}
    </td>
    <td>
      ${fixDateFormat(candidato.dob, '-')}
    </td>
    <td>
      ${candidato.job_actual}
    </td>
    <td>
      ${parseAmountToDominicanPesos(candidato.exp_salario)}
    </td>
    <td>
      <div>      
        <a style="color: inherit;" href="/candidato.html?id=${
          candidato._id
        }"><i class="fas fa-eye"></i></a>        
      </div>
    </td>
  </tr>`;
  });
}

loadEntries().then(showCandidatos);
