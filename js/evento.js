const apiUrl = 'http://localhost:3000/eventos'

function displayEvento(evento) {
  const eventoList = document.getElementById('eventoList')
  eventoList.innerHTML = ''
  evento.forEach(evento => {
    const eventoElement = document.createElement('tr')
    eventoElement.innerHTML = `
              <td>${evento.id_evento}</td>
              <td>${evento.nome_evento}</td>
              <td>${evento.link_evento}</td>
              <td>${formatDate(evento.data_evento)}</td>
              <td>
                <button onclick="updateEvento(${evento.id_evento})">Editar</button>
                <button onclick="deleteEvento(${evento.id_evento})">Excluir</button>
              </td>
          `
    eventoList.appendChild(eventoElement)
  })
}

function getEventos() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayEvento(data))
    .catch(error => console.error('Erro:', error))
}

document.getElementById('addEventoForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const eventoNome = document.getElementById('eventoNome').value
  const eventoLink = document.getElementById('eventoLink').value
  const eventoDate = document.getElementById('eventoDate').value

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_evento: eventoNome,
      link_evento: eventoLink,
      data_evento: eventoDate
    })
  })
    .then(response => response.json())
    .then(data => {
      getEventos()
      document.getElementById('addEventoForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

function updateEvento(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      // 日付のフォーマット
      const formattedBirthDate = formatDate(data.data_evento)

      document.getElementById('editEventoId').value = data.id_evento
      document.getElementById('editEventoNome').value = data.nome_evento
      document.getElementById('editEventoLink').value = data.link_evento
      document.getElementById('editEventoDate').value = formattedBirthDate
    })
    .catch(error => console.error('Erro:', error))
}

document.getElementById('updateEventoForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const eventoId = document.getElementById('editEventoId').value
  const eventoNome = document.getElementById('editEventoNome').value
  const eventoLink = document.getElementById('editEventoLink').value
  const eventoDate = document.getElementById('editEventoDate').value

  fetch(`${apiUrl}/${eventoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_evento: eventoNome,
      link_evento: eventoLink,
      data_evento: eventoDate
    })
  })
    .then(response => response.json())
    .then(data => {
      getEventos()
      document.getElementById('editEventoForm').style.display = 'none'
    })
    .catch(error => console.error('Erro:', error))
})

function deleteEvento(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getEventos())
    .catch(error => console.error('Erro:', error))
}

getEventos()

function cancelEdit() {
  document.getElementById('updateEventoForm').reset()
}

// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
