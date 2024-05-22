// Initialize datepicker
$(document).ready(function () {
  $('#professorBirthdate').datepicker({
    format: 'yyyy-mm-dd', // データベースに保存する形式に合わせて適切なフォーマットに設定します
    autoclose: true
  })
})
$(document).ready(function () {
  $('#editProfessorBirthdate').datepicker({
    format: 'yyyy-mm-dd', // データベースに保存する形式に合わせて適切なフォーマットに設定します
    autoclose: true
  })
})

const apiUrl = 'http://localhost:3000/professores'

// リストを表示
function displayProfessores(professor) {
  const professoresList = document.getElementById('professoresList')
  professoresList.innerHTML = ''
  professor.forEach(professor => {
    const professorElement = document.createElement('tr')
    professorElement.innerHTML = `
              <td>${professor.id_prof}</td>
              <td>${professor.nome}</td>
              <td>${professor.email_prof}</td>
              <td>${professor.CPF}</td>
              <td>${professor.materia_leci}</td>
              <td>${professor.telefone}</td>
              <td>${professor.data_de_nascimento}</td>
              <td>${professor.email_pass}</td>
              <td>${professor.endereco_prof}</td>
              <td>
                <button onclick="updateProfessor(${professor.id_prof})">Editar</button>
                <button onclick="deleteProfessor(${professor.id_prof})">Excluir</button>
              </td>
          `
    professoresList.appendChild(professorElement)
  })
}

// 取得
function getProfessores() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayProfessores(data))
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addProfessorForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const professorName = document.getElementById('professorName').value
  const professorEmail = document.getElementById('professorEmail').value
  const professorCPF = document.getElementById('professorCPF').value
  const professorSubject = document.getElementById('professorSubject').value
  const professorPhone = document.getElementById('professorPhone').value
  const professorBirthdate = document.getElementById('professorBirthdate').value
  const professorPersonalEmail = document.getElementById('professorPersonalEmail').value
  const professorAddress = document.getElementById('professorAddress').value

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: professorName,
      email_prof: professorEmail,
      CPF: professorCPF,
      materia_leci: professorSubject,
      telefone: professorPhone,
      data_de_nascimento: professorBirthdate,
      email_pass: professorPersonalEmail,
      endereco_prof: professorAddress
    })
  })
    .then(response => response.json())
    .then(data => {
      getProfessores()
      document.getElementById('addProfessorForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 更新
function updateProfessor(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editProfessorId').value = data.id_prof
      document.getElementById('editProfessorName').value = data.nome
      document.getElementById('editProfessorEmail').value = data.email_prof
      document.getElementById('editProfessorCPF').value = data.CPF
      document.getElementById('editProfessorSubject').value = data.materia_leci
      document.getElementById('editProfessorPhone').value = data.telefone
      // 文字列から Date オブジェクトを生成
      const birthDate = new Date(data.data_de_nascimento)
      // 年月日部分を取得
      const formattedBirthDate = `${birthDate.getFullYear()}-${(birthDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${birthDate.getDate().toString().padStart(2, '0')}`
      // フォーマットされた日付を設定
      document.getElementById('editProfessorBirthdate').value = formattedBirthDate
      document.getElementById('editProfessorPersonalEmail').value = data.email_pass
      document.getElementById('editProfessorAddress').value = data.endereco_prof
      document.getElementById('editProfessorForm').style.display = 'block'
    })
    .catch(error => console.error('Erro:', error))
}

// 実際に更新
document.getElementById('updateProfessorForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const professorId = document.getElementById('editProfessorId').value
  const professorName = document.getElementById('editProfessorName').value
  const professorEmail = document.getElementById('editProfessorEmail').value
  const professorCPF = document.getElementById('editProfessorCPF').value
  const professorSubject = document.getElementById('editProfessorSubject').value
  const professorPhone = document.getElementById('editProfessorPhone').value
  const professorBirthdate = document.getElementById('editProfessorBirthdate').value
  const professorPersonalEmail = document.getElementById('editProfessorPersonalEmail').value
  const professorAddress = document.getElementById('editProfessorAddress').value

  fetch(`${apiUrl}/${professorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: professorName,
      email_prof: professorEmail,
      CPF: professorCPF,
      materia_leci: professorSubject,
      telefone: professorPhone,
      data_de_nascimento: professorBirthdate,
      email_pass: professorPersonalEmail,
      endereco_prof: professorAddress
    })
  })
    .then(response => response.json())
    .then(data => {
      getProfessores()
      document.getElementById('editProfessorForm').style.display = 'none'
    })
    .catch(error => console.error('Erro:', error))
})

// 削除ボタン
function deleteProfessor(id_prof) {
  fetch(`${apiUrl}/${id_prof}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getProfessores())
    .catch(error => console.error('Erro:', error))
}

getProfessores()

function cancelEdit() {
  document.getElementById('updateProfessorForm').reset()
}
