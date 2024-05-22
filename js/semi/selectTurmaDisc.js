const apiUrlTurma = 'http://localhost:3000/turmas'
const apiUrlDisciplina = 'http://localhost:3000/disciplinas'

// Turmaの選択肢を追加する関数
function populateTurmas() {
  fetch(apiUrlTurma)
    .then(response => response.json())
    .then(turmas => {
      const selectTurma = document.getElementById('selectTurma')
      selectTurma.innerHTML = '<option value="" disabled selected>Escolha a Turma</option>'

      turmas.forEach(turma => {
        const option = document.createElement('option')
        option.value = turma.id_turma
        option.textContent = `${turma.nome_turma} - Ano ${turma.ano} - Semestre ${turma.semestre}`
        selectTurma.appendChild(option)
      })
    })
    .catch(error => console.error('Turmasの取得エラー:', error))
}

// Turmaを選択した際にDisciplinaリストを更新する関数
function populateDisciplinas() {
  const selectedTurmaId = document.getElementById('selectTurma').value
  if (!selectedTurmaId) return

  fetch(`${apiUrlDisciplina}?id_turma=${selectedTurmaId}`)
    .then(response => response.json())
    .then(disciplinas => {
      const disciplinasList = document.getElementById('disciplinasList')
      disciplinasList.innerHTML = ''

      disciplinas.forEach(disciplina => {
        const listItem = document.createElement('li')
        listItem.classList.add('list-group-item')

        // Disciplinaのテキスト表示
        listItem.textContent = `${disciplina.disciplina} - Horário ${disciplina.horario}`
        // 編集ボタンの追加
        const editButton = document.createElement('button')
        editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'ms-2')
        editButton.textContent = 'Aplicar Notas'
        editButton.addEventListener('click', () => {
          // 編集ページに飛ぶ処理を追加する
          // ページに必要な情報をURLパラメーターとして渡す
          window.location.href = `../pages/disciplina_aplicarNota.html?id_disciplina=${disciplina.id_turma}}`
        })
        listItem.appendChild(editButton)

        disciplinasList.appendChild(listItem)
      })
    })
    .catch(error => console.error('Disciplinasの取得エラー:', error))
}

document.addEventListener('DOMContentLoaded', populateTurmas)
