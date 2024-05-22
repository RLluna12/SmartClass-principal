const apiUrl = 'http://localhost:3000/Aluno_disciplina'
const apiUrlAluno = 'http://localhost:3000/alunos'
const apiUrlDisciplina = 'http://localhost:3000/disciplinas'

// リストを表示
function displayDisciplinaAluno(disciplinaAluno) {
  const disciplinaAlunoList = document.getElementById('disciplinaAlunoList')
  disciplinaAlunoList.innerHTML = ''
  disciplinaAluno.forEach(disciplinaAluno => {
    // DisciplinaとAlunoの名前を取得
    Promise.all([getAlunoName(disciplinaAluno.id_aluno), getDisciName(disciplinaAluno.id_disciplina)])
      .then(([alunoName, disciName]) => {
        const disciplinaAlunoElement = document.createElement('tr')
        disciplinaAlunoElement.innerHTML = `
              <td>${alunoName}</td>
              <td>${disciName}</td>
              <td>
                <button onclick="deleteDisciplinaAluno(${disciplinaAluno.id_aluno_disc})">Excluir</button>
              </td>
          `
        disciplinaAlunoList.appendChild(disciplinaAlunoElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// 取得
function getDisciplinaAlunos() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayDisciplinaAluno(data))
    .catch(error => console.error('Erro:', error))
}

// Alunoの名前を取得
function getAlunoName(id_aluno) {
  return fetch(`${apiUrlAluno}/${id_aluno}`)
    .then(response => response.json())
    .then(data => data.nome_aluno)
    .catch(error => console.error('Erro:', error))
}
// disciplinaの名前を取得
function getDisciName(id_disciplina) {
  return fetch(`${apiUrlDisciplina}/${id_disciplina}`)
    .then(response => response.json())
    .then(data => data.disciplina)
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addDisciplinaAlunoForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const alunoId = document.getElementById('disciplinaAlunoAlunoId').value
  const id_aluno = parseInt(alunoId)
  const disciplinaId = document.getElementById('disciplinaAlunoDisciplinaId').value
  const id_disciplina = parseInt(disciplinaId)

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_aluno: id_aluno,
      id_disciplina: id_disciplina
    })
  })
    .then(response => response.json())
    .then(data => {
      getDisciplinaAlunos()
      document.getElementById('addDisciplinaAlunoForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

function deleteDisciplinaAluno(id_aluno_disc) {
  fetch(`${apiUrl}/${id_aluno_disc}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getDisciplinaAlunos())
    .catch(error => console.error('Erro:', error))
}

getDisciplinaAlunos()

// Alunosを取得
function getAlunos() {
  return fetch(apiUrlAluno)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}
// Turmasを取得
function getDisciplina() {
  return fetch(apiUrlDisciplina)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}

document.addEventListener('DOMContentLoaded', function () {
  const alunoSelect = document.getElementById('disciplinaAlunoAlunoId')
  const disciplinaSelect = document.getElementById('disciplinaAlunoDisciplinaId')

  getAlunos().then(alunos => {
    alunos.forEach(aluno => {
      const option = document.createElement('option')
      option.value = aluno.id_aluno
      option.textContent = aluno.nome_aluno
      alunoSelect.appendChild(option)
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
