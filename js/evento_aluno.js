const apiUrl = 'http://localhost:3000/evento_alunos'
const apiUrlAluno = 'http://localhost:3000/alunos'
const apiUrlEvento = 'http://localhost:3000/eventos'

// リストを表示
function displayEventoAluno(eventoAluno) {
  const eventoAlunoList = document.getElementById('eventoAlunoList')
  eventoAlunoList.innerHTML = ''
  eventoAluno.forEach(eventoAluno => {
    // EventoとAlunoの名前を取得
    Promise.all([getAlunoName(eventoAluno.id_aluno), getEventoName(eventoAluno.id_evento)])
      .then(([alunoName, eventoName]) => {
        const eventoAlunoElement = document.createElement('tr')
        eventoAlunoElement.innerHTML = `
              <td>${alunoName}</td>
              <td>${eventoName}</td>
              <td>
                <button onclick="deleteEventoAluno(${eventoAluno.id_aluno}, ${eventoAluno.id_evento})">Excluir</button>
              </td>
          `
        eventoAlunoList.appendChild(eventoAlunoElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// 取得
function getEventoAlunos() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayEventoAluno(data))
    .catch(error => console.error('Erro:', error))
}

// Alunoの名前を取得
function getAlunoName(id_aluno) {
  return fetch(`${apiUrlAluno}/${id_aluno}`)
    .then(response => response.json())
    .then(data => data.nome_aluno)
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
document.getElementById('addEventoAlunoForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const alunoId1 = document.getElementById('alunoId').value
  const id_aluno = parseInt(alunoId1)
  const eventoId1 = document.getElementById('eventoId').value
  const id_evento = parseInt(eventoId1)

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_aluno: id_aluno,
      id_evento: id_evento
    })
  })
    .then(response => response.json())
    .then(data => {
      getEventoAlunos()
      document.getElementById('addEventoAlunoForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 削除
function deleteEventoAluno(id_evento) {
  fetch(`${apiUrl}/${id_evento}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getEventoAlunos())
    .catch(error => console.error('Erro:', error))
}

getEventoAlunos()

// Alunosを取得
function getAlunos() {
  return fetch(apiUrlAluno)
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
  const alunoSelect = document.getElementById('alunoId')
  const eventoSelect = document.getElementById('eventoId')

  getAlunos().then(alunos => {
    alunos.forEach(aluno => {
      const option = document.createElement('option')
      option.value = aluno.id_aluno
      option.textContent = aluno.nome_aluno
      alunoSelect.appendChild(option)
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
