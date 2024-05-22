const apiUrlAluno = 'http://localhost:3000/alunos'
const apiUrlTurma = 'http://localhost:3000/turmas'

// リストを表示
function displayAluno(aluno) {
  const alunoList = document.getElementById('alunoList')

  alunoList.innerHTML = ''
  aluno.forEach(aluno => {
    // Escolaの情報を取得
    fetch(`${apiUrlTurma}/${aluno.id_turma}`)
      .then(response => response.json())
      .then(turma => {
        // 画像を表示するためのimg要素を作成
        const img = document.createElement('img');
        img.src = aluno.foto ? `../../upload/${aluno.foto}` : '../../upload/semFotos.png'; // 画像のURLを設定
        img.alt = `Aluno Photo ${aluno.nome_aluno}`; // 画像の代替テキストを設定
        img.classList.add('img-alunoMini'); // クラスを追加

        const alunoElement = document.createElement('tr')
        alunoElement.innerHTML = `
              <td>${img.outerHTML}</td>
              <td>${aluno.id_aluno}</td>
              <td>${aluno.nome_aluno}</td>
              <td>${aluno.cpf_aluno}</td>
              <td>${aluno.endereco_aluno}</td>
              <td>${aluno.telefone_aluno}</td>
              <td>${aluno.email_aluno}</td>
              <td>${formatDate(aluno.nascimento_aluno)}</td>
              <td>${aluno.ra_aluno}</td>
              <td>${formatDate(aluno.data_matricula)}</td>
              <td>${turma.nome_turma}</td>
              <td>
                <button onclick="updateAluno(${aluno.id_aluno})">Editar</button>
                <button onclick="deleteAluno(${aluno.id_aluno})">Excluir</button>
              </td>
          `
        alunoList.appendChild(alunoElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// 取得
function getAluno() {
  fetch(apiUrlAluno)
    .then(response => response.json())
    .then(data => displayAluno(data))
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addAlunoForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const alunoName = document.getElementById('alunoName').value
  const alunoCpf = document.getElementById('alunoCpf').value
  const alunoEndereco = document.getElementById('alunoEndereco').value
  const alunoTelefone = document.getElementById('alunoTelefone').value
  const alunoEmail = document.getElementById('alunoEmail').value
  const alunoNascimento = document.getElementById('alunoNascimento').value
  const alunoRa = document.getElementById('alunoRa').value
  const alunoDateMatricula = document.getElementById('alunoDateMatricula').value
  const alunoTurma = document.getElementById('alunoTurma').value

  fetch(apiUrlAluno, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_aluno: alunoName,
      cpf_aluno: alunoCpf,
      endereco_aluno: alunoEndereco,
      telefone_aluno: alunoTelefone,
      email_aluno: alunoEmail,
      nascimento_aluno: alunoNascimento,
      ra_aluno: alunoRa,
      data_matricula: alunoDateMatricula,
      id_turma: alunoTurma
    })
  })
    .then(response => response.json())
    .then(data => {
      getAluno()
      document.getElementById('addAlunoForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 更新
function updateAluno(id) {
  fetch(`${apiUrlAluno}/${id}`)
    .then(response => response.json())
    .then(data => {
      // 日付のフォーマット
      const formattedBirthDate = formatDate(data.nascimento_aluno)
      const formattedMatricDate = formatDate(data.data_matricula)

      // フォームにデータを設定
      document.getElementById('editAlunoId').value = data.id_aluno
      document.getElementById('editAlunoName').value = data.nome_aluno
      document.getElementById('editAlunoCpf').value = data.cpf_aluno
      document.getElementById('editAlunoEndereco').value = data.endereco_aluno
      document.getElementById('editAlunoTelefone').value = data.telefone_aluno
      document.getElementById('editAlunoEmail').value = data.email_aluno
      document.getElementById('editAlunoNascimento').value = formattedBirthDate
      document.getElementById('editAlunoRa').value = data.ra_aluno
      document.getElementById('editAlunoDateMatricula').value = formattedMatricDate
      document.getElementById('editAlunoTurma').value = data.id_turma
    })
    .catch(error => console.error('Erro:', error))
}

// 実際に更新
document.getElementById('updateAlunoForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const alunoId = document.getElementById('editAlunoId').value
  const alunoName = document.getElementById('editAlunoName').value
  const alunoCpf = document.getElementById('editAlunoCpf').value
  const alunoEndereco = document.getElementById('editAlunoEndereco').value
  const alunoTelefone = document.getElementById('editAlunoTelefone').value
  const alunoEmail = document.getElementById('editAlunoEmail').value
  const alunoNascimento = document.getElementById('editAlunoNascimento').value
  const alunoRa = document.getElementById('editAlunoRa').value
  const alunoDateMatricula = document.getElementById('editAlunoDateMatricula').value
  const alunoTurma = document.getElementById('editAlunoTurma').value

  // 日付のフォーマット
  const formattedNascimento = formatDate(alunoNascimento)
  const formattedDateMatricula = formatDate(alunoDateMatricula)

  fetch(`${apiUrlAluno}/${alunoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_aluno: alunoName,
      cpf_aluno: alunoCpf,
      endereco_aluno: alunoEndereco,
      telefone_aluno: alunoTelefone,
      email_aluno: alunoEmail,
      nascimento_aluno: formattedNascimento,
      ra_aluno: alunoRa,
      data_matricula: formattedDateMatricula,
      id_turma: alunoTurma
    })
  })
    .then(response => response.json())
    .then(data => {
      getAluno() // データを再読み込み
      document.getElementById('editAlunoForm').style.display = 'none' // フォームを非表示にする
    })
    .catch(error => console.error('Erro:', error))
})

// 削除ボタン
function deleteAluno(id_aluno) {
  fetch(`${apiUrlAluno}/${id_aluno}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getAluno())
    .catch(error => console.error('Erro:', error))
}

// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

getAluno()

// 編集キャンセル
function cancelEdit() {
  document.getElementById('updateAlunoForm').reset()
}

// サーバーからETurmaの情報を取得してセレクトボックスに追加する関数
function populateTurmas() {
  fetch(apiUrlTurma)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('alunoTurma')
      data.forEach(turma => {
        const option = document.createElement('option')
        option.value = turma.id_turma
        option.textContent = turma.nome_turma
        selectElement.appendChild(option)
      })
    })
    .catch(error => console.error('Error fetching schools:', error))

  fetch(apiUrlTurma)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('editAlunoTurma')
      data.forEach(turma => {
        const option = document.createElement('option')
        option.value = turma.id_turma
        option.textContent = turma.nome_turma
        selectElement.appendChild(option)
      })
    })
    .catch(error => console.error('Error fetching turmas:', error))
}

// ページが読み込まれたらturmaの情報を取得してセレクトボックスを更新する
document.addEventListener('DOMContentLoaded', populateTurmas)
