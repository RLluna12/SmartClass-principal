// 初期化
document.addEventListener('DOMContentLoaded', () => {
  fetchTurmas()
  populateYearSelect()
})

// Turmas を取得しセレクトボックスを更新
function fetchTurmas() {
  fetch('http://localhost:3000/turmas')
    .then(response => response.json())
    .then(data => {
      const turmaSelect = document.getElementById('turmaSelect')
      data.forEach(turma => {
        const option = document.createElement('option')
        option.value = turma.id_turma
        option.textContent = turma.nome_turma
        turmaSelect.appendChild(option)
      })
      turmaSelect.disabled = false
    })
    .catch(error => console.error('Error fetching Turmas:', error))
}

// 年を選択するためのセレクトボックスを初期化
function populateYearSelect() {
  const yearSelect = document.getElementById('yearSelect')
  const currentYear = new Date().getFullYear()
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    const option = document.createElement('option')
    option.value = year
    option.textContent = year
    yearSelect.appendChild(option)
  }
  yearSelect.disabled = false
}

// Turmaが選択された時に関係のあるDisciplinasを取得しセレクトボックスを更新
document.getElementById('turmaSelect').addEventListener('change', event => {
  const turmaId = event.target.value
  fetchDisciplinasByTurma(turmaId)
})

function fetchDisciplinasByTurma(turmaId) {
  fetch(`http://localhost:3000/turma_disciplinas/${turmaId}/disciplinas`)
    .then(response => response.json())
    .then(data => {
      const disciplinaSelect = document.getElementById('disciplinaSelect')
      disciplinaSelect.innerHTML = '<option value="" disabled selected>Escolha a Disciplina</option>'
      data.forEach(disciplina => {
        const option = document.createElement('option')
        option.value = disciplina.id_disciplina
        option.textContent = disciplina.disciplina
        disciplinaSelect.appendChild(option)
      })
      disciplinaSelect.disabled = false
    })
    .catch(error => console.error('Error fetching Disciplinas:', error))
}

// 検索ボタンのクリックイベント
document.getElementById('searchButton').addEventListener('click', () => {
  const turmaId = document.getElementById('turmaSelect').value
  const disciplinaId = document.getElementById('disciplinaSelect').value
  const year = document.getElementById('yearSelect').value
  const semestre = document.getElementById('semestreSelect').value

  if (turmaId && disciplinaId && year && semestre) {
    fetchNotasFaltas(turmaId, disciplinaId, year, semestre)
  } else {
    alert('Selecione todos')
  }
})

// notas_faltasを取得しリストを表示
function fetchNotasFaltas(turmaId, disciplinaId, year, semestre) {
  fetch(
    `http://localhost:3000/notas_faltasApri?turmaId=${turmaId}&disciplinaId=${disciplinaId}&year=${year}&semestre=${semestre}`
  )
    .then(response => response.json())
    .then(data => {
      const resultContainer = document.getElementById('resultContainer')
      resultContainer.innerHTML = ''
      if (data.length > 0) {
        const table = document.createElement('table')
        table.className = 'table'
        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')
        ;['Foto do Aluno', 'Nome do Aluno', 'N1', 'AP', 'AI', 'Ações'].forEach(text => {
          const th = document.createElement('th')
          th.textContent = text
          headerRow.appendChild(th)
        })
        thead.appendChild(headerRow)
        table.appendChild(thead)

        const tbody = document.createElement('tbody')
        data.forEach(item => {
          const row = document.createElement('tr')

          // 写真セル
          const photoCell = document.createElement('td')
          const photoImg = document.createElement('img')
          photoImg.src = item.foto ? `../../upload/${item.foto}` : '../../upload/semfoto.png'
          photoImg.alt = 'Sem Foto'
          photoImg.classList.add('img-alunoMini')
          photoCell.appendChild(photoImg)
          row.appendChild(photoCell)

          // 名前セル
          const nameCell = document.createElement('td')
          nameCell.textContent = item.nome_aluno
          row.appendChild(nameCell)

          // N1セル
          const n1Cell = document.createElement('td')
          n1Cell.textContent = item.N1
          row.appendChild(n1Cell)

          // APセル
          const apCell = document.createElement('td')
          apCell.textContent = item.AP
          row.appendChild(apCell)

          // AIセル
          const aiCell = document.createElement('td')
          aiCell.textContent = item.AI
          row.appendChild(aiCell)

          // アクションセル（ボタン）
          const actionCell = document.createElement('td')
          const editButton = document.createElement('button')
          editButton.textContent = 'Editar'
          editButton.classList.add('btn', 'btn-primary')
          editButton.addEventListener('click', () => {
            window.location.href = `editarNota.html?alunoId=${item.id_aluno}&disciplinaId=${disciplinaId}&idNotasFaltas=${item.id_notas_faltas}`
          })
          actionCell.appendChild(editButton)
          row.appendChild(actionCell)

          tbody.appendChild(row)
        })
        table.appendChild(tbody)
        resultContainer.appendChild(table)
      } else {
        resultContainer.textContent = '該当するデータが見つかりませんでした'
      }
    })
    .catch(error => console.error('Error fetching notas_faltas:', error))
}
