const apiUrlTurma = 'http://localhost:3000/turmas'
const apiUrlAluno = 'http://localhost:3000/alunos'

// Turmaの選択肢を追加する関数
function populateTurmas() {
  // リクエストを送信してTurmaを取得
  fetch(apiUrlTurma)
    .then(response => response.json())
    .then(turmas => {
      const selectTurma = document.getElementById('selectTurma')

      // すでに選択肢があればクリア
      selectTurma.innerHTML = '<option value="" disabled selected>Escolha a Turma</option>'

      // 取得したTurmaを選択肢として追加
      turmas.forEach(turma => {
        const option = document.createElement('option')
        option.value = turma.id_turma
        option.textContent = `${turma.nome_turma} - Ano ${turma.ano} - Semestre ${turma.semestre}`
        selectTurma.appendChild(option)
      })
    })
    .catch(error => console.error('Turmasの取得エラー:', error))
}

// Turmaを選択した際に生徒リストを更新する関数
function populateAlunos() {
  const selectedTurmaId = document.getElementById('selectTurma').value
  if (!selectedTurmaId) return

  fetch(`${apiUrlAluno}?id_turma=${selectedTurmaId}`)
    .then(response => response.json())
    .then(alunos => {
      const alunosList = document.getElementById('alunosList')
      alunosList.innerHTML = ''

      alunos.forEach(aluno => {
        const listItem = document.createElement('li')
        listItem.classList.add('list-group-item')
        listItem.textContent = `${aluno.nome_aluno} - ${aluno.ra_aluno}`
        alunosList.appendChild(listItem)
      })
    })
    .catch(error => console.error('Alunosの取得エラー:', error))
}

// ページ読み込み時にTurmaを取得して選択肢を追加
document.addEventListener('DOMContentLoaded', populateTurmas)
