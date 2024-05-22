const apiUrl = 'http://localhost:3000/turma_disciplinas'
const apiUrlTurma = 'http://localhost:3000/turmas'
const apiUrlDisciplina = 'http://localhost:3000/disciplinas'

function displayTurmaDisciplina(turmaDisciplina) {
  const turmaDisciplinaList = document.getElementById('turmaDisciplinaList')
  turmaDisciplinaList.innerHTML = ''
  turmaDisciplina.forEach(turmaDisciplina => {
    // TurmaとDisciplinaの名前を取得
    Promise.all([getTurmaName(turmaDisciplina.id_turma), getDisciplinaName(turmaDisciplina.id_disciplina)])
      .then(([turmaName, disciplinaName]) => {
        const turmaDisciplinaElement = document.createElement('tr')
        turmaDisciplinaElement.innerHTML = `
              <td>${turmaName}</td>
              <td>${disciplinaName}</td>
              <td>
                <button onclick="deleteTurmaDisciplina(${turmaDisciplina.id_turma}, ${turmaDisciplina.id_disciplina})">Excluir</button>
              </td>
          `
        turmaDisciplinaList.appendChild(turmaDisciplinaElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// 取得
function getTurmaDisciplinas() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayTurmaDisciplina(data))
    .catch(error => console.error('Erro:', error))
}

// Turmaの名前を取得
function getTurmaName(id_turma) {
  return fetch(`${apiUrlTurma}/${id_turma}`)
    .then(response => response.json())
    .then(data => data.nome_turma)
    .catch(error => console.error('Erro:', error))
}

// Disciplinaの名前を取得
function getDisciplinaName(id_disciplina) {
  return fetch(`${apiUrlDisciplina}/${id_disciplina}`)
    .then(response => response.json())
    .then(data => data.disciplina)
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addTurmaDisciplinaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const turmaId = document.getElementById('turmaId').value
  const id_turma = parseInt(turmaId)
  const disciplinaId = document.getElementById('disciplinaId').value
  const id_disciplina = parseInt(disciplinaId)

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_turma: id_turma,
      id_disciplina: id_disciplina
    })
  })
    .then(response => response.json())
    .then(data => {
      getTurmaDisciplinas()
      document.getElementById('addTurmaDisciplinaForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 削除
function deleteTurmaDisciplina(turmaId, disciplinaId) {
  fetch(`${apiUrl}/${turmaId}/${disciplinaId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getTurmaDisciplinas())
    .catch(error => console.error('Erro:', error))
}

getTurmaDisciplinas()

// Turmasを取得
function getTurmas() {
  return fetch(apiUrlTurma)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}

// Disciplinaを取得
function getDisciplina() {
  return fetch(apiUrlDisciplina)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}

document.addEventListener('DOMContentLoaded', function () {
  const turmaSelect = document.getElementById('turmaId')
  const disciplinaSelect = document.getElementById('disciplinaId')

  getTurmas().then(turmas => {
    turmas.forEach(turma => {
      const option = document.createElement('option')
      option.value = turma.id_turma
      option.textContent = turma.nome_turma
      turmaSelect.appendChild(option)
    })
  })

  getDisciplina().then(disciplina => {
    disciplina.forEach(disciplina => {
      const option = document.createElement('option')
      option.value = disciplina.id_disciplina
      option.textContent = disciplina.disciplina
      disciplinaSelect.appendChild(option)
    })
  })
})
