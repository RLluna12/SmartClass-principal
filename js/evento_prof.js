const apiUrl = 'http://localhost:3000/evento_professors'
const apiUrlEvento = 'http://localhost:3000/eventos'
const apiUrlProfessor = 'http://localhost:3000/professores'

// リストを表示
function displayEventoProfessor(eventoProfessor) {
  const eventoProfessorList = document.getElementById('eventoProfessorList')
  eventoProfessorList.innerHTML = ''
  eventoProfessor.forEach(eventoProfessor => {
    // EventoとProfessorの名前を取得
    Promise.all([getProfName(eventoProfessor.id_prof), getEventoName(eventoProfessor.id_evento)])
      .then(([profName, eventoName]) => {
        const eventoProfessorElement = document.createElement('tr')
        eventoProfessorElement.innerHTML = `
              <td>${profName}</td>
              <td>${eventoName}</td>
              <td>
                <button onclick="deleteEventoProfessor(${eventoProfessor.id_prof}, ${eventoProfessor.id_evento})">Excluir</button>
              </td>
          `
        eventoProfessorList.appendChild(eventoProfessorElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// 取得
function getEventoProfessors() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayEventoProfessor(data))
    .catch(error => console.error('Erro:', error))
}

// Professorの名前を取得
function getProfName(id_prof) {
  return fetch(`${apiUrlProfessor}/${id_prof}`)
    .then(response => response.json())
    .then(data => data.nome_prof)
    .catch(error => console.error('Erro:', error))
}
// Eventoの名前を取得
function getEventoName(id_evento) {
  return fetch(`${apiUrlEvento}/${id_evento}`)
    .then(response => response.json())
    .then(data => data.nome_evento)
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addEventoProfessorForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const professorId = document.getElementById('eventoProfessorProfessorId').value
  console.log(professorId)
  const id_prof = parseInt(professorId)
  const eventoId = document.getElementById('eventoProfessorEventoId').value
  const id_evento = parseInt(eventoId)

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_prof: id_prof,
      id_evento: id_evento
    })
  })
    .then(response => response.json())
    .then(data => {
      getEventoProfessors()
      document.getElementById('addEventoProfessorForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 削除
function deleteEventoProfessor(id_evento) {
  fetch(`${apiUrl}/${id_evento}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getEventoProfessors())
    .catch(error => console.error('Erro:', error))
}

getEventoProfessors()

// Professorを取得
function getProf() {
  return fetch(apiUrlProfessor)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}
// Turmasを取得
function getEvento() {
  return fetch(apiUrlEvento)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}

document.addEventListener('DOMContentLoaded', function () {
  const profSelect = document.getElementById('eventoProfessorProfessorId')
  const eventoSelect = document.getElementById('eventoProfessorEventoId')

  getProf().then(prof => {
    prof.forEach(prof => {
      const option = document.createElement('option')
      option.value = prof.id_prof
      option.textContent = prof.nome_prof
      profSelect.appendChild(option)
    })
  })

  getEvento().then(evento => {
    evento.forEach(evento => {
      const option = document.createElement('option')
      option.value = evento.id_evento
      option.textContent = evento.nome_evento
      eventoSelect.appendChild(option)
    })
  })
})
