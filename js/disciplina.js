const apiUrlDisciplina = 'http://localhost:3000/disciplinas'

// リストを表示
function displayDisciplina(disciplina) {
  const disciplinaList = document.getElementById('disciplinaList')
  disciplinaList.innerHTML = ''
  disciplina.forEach(disciplina => {
    const disciplinaElement = document.createElement('tr')
    disciplinaElement.innerHTML = `
          <td>${disciplina.id_disciplina}</td>
          <td>${disciplina.disciplina}</td>
          <td>${disciplina.horario}</td>
          <td>
            <button onclick="updateDisciplina(${disciplina.id_disciplina})">Editar</button>
            <button onclick="deleteDisciplina(${disciplina.id_disciplina})">Excluir</button>
          </td>
      `
    disciplinaList.appendChild(disciplinaElement)
  })
}

// 取得
function getDisciplina() {
  fetch(apiUrlDisciplina)
    .then(response => response.json())
    .then(data => displayDisciplina(data))
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addDisciplinaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const disciplinaName = document.getElementById('disciplinaName').value
  const disciplinaHorario = document.getElementById('disciplinaHorario').value

  fetch(apiUrlDisciplina, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      disciplina: disciplinaName,
      horario: disciplinaHorario
    })
  })
    .then(response => response.json())
    .then(data => {
      getDisciplina()
      document.getElementById('addDisciplinaForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 更新
function updateDisciplina(id) {
  fetch(`${apiUrlDisciplina}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editDisciplinaId').value = data.id_disciplina
      document.getElementById('editDisciplinaName').value = data.disciplina
      document.getElementById('editDisciplinaHorario').value = data.horario
    })
    .catch(error => console.error('Erro:', error))
}

// 実際に更新
document.getElementById('updateDisciplinaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const disciplinaId = document.getElementById('editDisciplinaId').value
  const disciplinaName = document.getElementById('editDisciplinaName').value
  const disciplinaHorario = document.getElementById('editDisciplinaHorario').value

  fetch(`${apiUrlDisciplina}/${disciplinaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      disciplina: disciplinaName,
      horario: disciplinaHorario
    })
  })
    .then(response => response.json())
    .then(data => {
      getDisciplina()
      document.getElementById('editDisciplinaForm').style.display = 'none'
    })
    .catch(error => console.error('Erro:', error))
})

// 削除ボタン
function deleteDisciplina(id_disciplina) {
  fetch(`${apiUrlDisciplina}/${id_disciplina}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getDisciplina())
    .catch(error => console.error('Erro:', error))
}

getDisciplina()

// 編集キャンセル
function cancelEdit() {
  document.getElementById('updateDisciplinaForm').reset()
}

// サーバーからEscolaの情報を取得してセレクトボックスに追加する関数
/* function populateProf() {
  fetch(apiUrlProfessor)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('disciplinaIdProf')
      data.forEach(prof => {
        const option = document.createElement('option')
        option.value = prof.id_prof
        option.textContent = prof.nome_prof
        selectElement.appendChild(option)
      })
    })
    .catch(error => console.error('Error fetching schools:', error))

  fetch(apiUrlProfessor)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('editDisciplinaIdProf')
      data.forEach(prof => {
        const option = document.createElement('option')
        option.value = prof.id_prof
        option.textContent = prof.nome_prof
        selectElement.appendChild(option)
      })
    })
    .catch(error => console.error('Error fetching schools:', error))
}

// ページが読み込まれたらEscolaの情報を取得してセレクトボックスを更新する
document.addEventListener('DOMContentLoaded', populateProf)
 */