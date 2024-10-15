const apiUrl = 'http://localhost:3000/publicacoes';

function displaypublicacao(publicacao) {
  const publicacaoList = document.getElementById('publicacaoList');
  publicacaoList.innerHTML = '';
  publicacao.forEach(publicacao => {
    const publicacaoElement = document.createElement('tr');
    publicacaoElement.innerHTML = `
      <td>${publicacao.id_pub}</td>
      <td>${publicacao.comentario}</td>
      <td>${formatDate(publicacao.data_pub)}</td>
      <td>
        <button onclick="updatepublicacao(${publicacao.id_pub})">Editar</button>
        <button onclick="deletepublicacao(${publicacao.id_pub})">Excluir</button>
      </td>
    `;
    publicacaoList.appendChild(publicacaoElement);
  });
}

function getpublicacao() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displaypublicacao(data))
    .catch(error => console.error('Erro:', error));
}

document.getElementById('addPublicacaoForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const publicacaoNome = document.getElementById('publicacaoNome').value;
  const publicacaoDate = document.getElementById('publicacaoDate').value;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comentario: publicacaoNome,
      data_pub: publicacaoDate
    })
  })
    .then(response => response.json())
    .then(() => {
      getpublicacao();
      document.getElementById('addPublicacaoForm').reset();
    })
    .catch(error => console.error('Erro:', error));
});

function updatepublicacao(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editPublicacaoId').value = data.id_pub;
      document.getElementById('editPublicacaoNome').value = data.comentario;
      document.getElementById('editPublicacaoDate').value = formatDate(data.data_pub);
      document.getElementById('updatePublicacaoForm').style.display = 'block';
    })
    .catch(error => console.error('Erro:', error));
}

document.getElementById('updatePublicacaoForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const publicacaoId = document.getElementById('editPublicacaoId').value;
  const publicacaoNome = document.getElementById('editPublicacaoNome').value;
  const publicacaoDate = document.getElementById('editPublicacaoDate').value;

  fetch(`${apiUrl}/${publicacaoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comentario: publicacaoNome,
      data_pub: publicacaoDate
    })
  })
    .then(response => response.json())
    .then(() => {
      getpublicacao();
      document.getElementById('updatePublicacaoForm').style.display = 'none';
    })
    .catch(error => console.error('Erro:', error));
});

function deletepublicacao(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(() => getpublicacao())
    .catch(error => console.error('Erro:', error));
}

function cancelEdit() {
  document.getElementById('updatePublicacaoForm').reset();
  document.getElementById('updatePublicacaoForm').style.display = 'none';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

getpublicacao();
