const apiUrlTurma = 'http://localhost:3000/turmas'
const apiUrlProfessor = 'http://localhost:3000/professores'

// リストを表示
function displayTurma(turma) {
  const turmaList = document.getElementById('turmaList')
  turmaList.innerHTML = ''
  turma.forEach(turma => {
    const turmaElement = document.createElement('tr')
    turmaElement.innerHTML = `
          <td>${turma.id_turma}</td>
          <td>${turma.nome_turma}</td>
          <td>${turma.ano}</td>
          <td>${turma.semestre}</td>
          <td>
            <button onclick="updateTurma(${turma.id_turma})">Editar</button>
            <button onclick="deleteTurma(${turma.id_turma})">Excluir</button>
          </td>
      `
    turmaList.appendChild(turmaElement)

    // Escolaの情報を取得
    /* fetch(`${apiUrlProfessor}/${turma.id_prof}`)
      .then(response => response.json())
      .then(professor => {
        const turmaElement = document.createElement('tr')
        turmaElement.innerHTML = `
              <td>${turma.id_turma}</td>
              <td>${turma.nome_turma}</td>
              <td>${turma.periodo}</td>
              <td>${professor.nome_prof}</td>
              <td>
                <button onclick="updateTurma(${turma.id_turma})">Editar</button>
                <button onclick="deleteTurma(${turma.id_turma})">Excluir</button>
              </td>
          `
        turmaList.appendChild(turmaElement)
      })
      .catch(error => console.error('Erro:', error)) */
  })
}

// 取得
function getTurma() {
  fetch(apiUrlTurma)
    .then(response => response.json())
    .then(data => displayTurma(data))
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addTurmaForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const turmaName = document.getElementById('turmaName').value;
  const turmaAno = document.getElementById('turmaAno').value;
  const turmaAnoINT = parseInt(turmaAno);
  const turmaSemestre = document.getElementById('turmaSemestre').value;
  const turmaSemestreINT = parseInt(turmaSemestre);

  
  // MySQLのYEAR型に合わせて年をフォーマットする
  const formattedYear = new Date(turmaAnoINT, 0).toISOString().substring(0, 4);

  fetch(apiUrlTurma, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_turma: turmaName,
      ano: formattedYear, // ここを修正
      semestre: turmaSemestreINT
    })
  })
    .then(response => response.json())
    .then(data => {
      getTurma();
      document.getElementById('addTurmaForm').reset();
    })
    .catch(error => console.error('Erro:', error));
});

// 更新
function updateTurma(id) {
  fetch(`${apiUrlTurma}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editTurmaId').value = data.id_turma
      document.getElementById('editTurmaName').value = data.nome_turma
      document.getElementById('editTurmaAno').value = parseInt(data.ano)
      document.getElementById('editTurmaSemestre').value = parseInt(data.semestre)
    })
    .catch(error => console.error('Erro:', error))
}

// 実際に更新
document.getElementById('updateTurmaForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const turmaId = document.getElementById('editTurmaId').value;
  const turmaName = document.getElementById('editTurmaName').value;
  const turmaAno = document.getElementById('editTurmaAno').value;
  const turmaAnoINT = parseInt(turmaAno);
  const turmaSemestre = document.getElementById('editTurmaSemestre').value;
  const turmaSemestreINT = parseInt(turmaSemestre);
  
  // MySQLのYEAR型に合わせて年をフォーマットする
  const formattedYear = new Date(turmaAnoINT, 0).toISOString().substring(0, 4);
  const formattedYear2 = parseInt(formattedYear);


  fetch(`${apiUrlTurma}/${turmaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_turma: turmaName,
      ano: formattedYear2, // ここを修正
      semestre: turmaSemestreINT
    })
  })
    .then(response => response.json())
    .then(data => {
      getTurma();
      /* document.getElementById('editTurmaForm').style.display = 'none'; */
    })
    .catch(error => console.error('Erro:', error));
});

// 削除ボタン
function deleteTurma(id_turma) {
  fetch(`${apiUrlTurma}/${id_turma}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getTurma())
    .catch(error => console.error('Erro:', error))
}

getTurma()

function cancelEdit() {
  document.getElementById('updateTurmaForm').reset()
}

// サーバーからEscolaの情報を取得してセレクトボックスに追加する関数
/* function populateProf() {
  fetch(apiUrlProfessor)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('turmaAno')
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
      const selectElement = document.getElementById('editTurmaAno')
      data.forEach(prof => {
        const option = document.createElement('option')
        option.value = prof.id_prof
        option.textContent = prof.nome_prof
        selectElement.appendChild(option)
      })
    })
    .catch(error => console.error('Error fetching schools:', error))
} */

// ページが読み込まれたらEscolaの情報を取得してセレクトボックスを更新する
/* document.addEventListener('DOMContentLoaded', populateProf) */





