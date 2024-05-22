const apiUrlProfessor = 'http://localhost:3000/professores'
// リストを表示
function displayProfessor(professor) {
  const professorList = document.getElementById('professorList')

  professorList.innerHTML = ''
  professor.forEach(professor => {
    const professorElement = document.createElement('tr')
    professorElement.innerHTML = `
          <td>${professor.id_prof}</td>
          <td>${professor.nome_prof}</td>
          <td>${professor.cpf_prof}</td>
          <td>${professor.telefone_prof}</td>
          <td>${professor.email_consti_prof}</td>
          <td>${professor.email_prof}</td>
          <td>${formatDate(professor.nascimento_prof)}</td>
          <td>${professor.endereco_prof}</td>
          <td>
            <button onclick="updateProfessor(${professor.id_prof})">Editar</button>
            <button onclick="deleteProfessor(${professor.id_prof})">Excluir</button>
          </td>
      `
    professorList.appendChild(professorElement)
  })
}

// 取得
function getProfessor() {
  fetch(apiUrlProfessor)
    .then(response => response.json())
    .then(data => displayProfessor(data))
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addProfessorForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const professorName = document.getElementById('professorName').value
  const professorCPF = document.getElementById('professorCPF').value
  const professorPhone = document.getElementById('professorPhone').value
  const professorEmail = document.getElementById('professorEmail').value
  const professorPersonalEmail = document.getElementById('professorPersonalEmail').value
  const professorBirthdate = document.getElementById('professorBirthdate').value
  const professorAddress = document.getElementById('professorAddress').value

  fetch(apiUrlProfessor, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_prof: professorName,
      cpf_prof: professorCPF,
      telefone_prof: professorPhone,
      email_consti_prof: professorEmail,
      email_prof: professorPersonalEmail,
      nascimento_prof: professorBirthdate,
      email_pass: professorAddress,
      endereco_prof: professorAddress
    })
  })
    .then(response => response.json())
    .then(data => {
      getProfessor()
      document.getElementById('addProfessorForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 更新
function updateProfessor(id) {
  fetch(`${apiUrlProfessor}/${id}`)
    .then(response => response.json())
    .then(data => {
      // 日付のフォーマット
      const formattedProfessorBirthdate = formatDate(professorBirthdate)
      document.getElementById('editProfessorId').value = data.id_prof
      document.getElementById('editProfessorName').value = data.nome_prof
      document.getElementById('editProfessorCPF').value = data.cpf_prof
      document.getElementById('editProfessorPhone').value = data.telefone_prof
      document.getElementById('editProfessorConstEmail').value = data.email_consti_prof
      document.getElementById('editProfessorPersonalEmail').value = data.email_prof
      document.getElementById('editProfessorBirthdate').value = data.formattedProfessorBirthdate
      document.getElementById('editProfessorAddress').value = data.endereco_prof
    })
    .catch(error => console.error('Erro:', error))
}

// 実際に更新
document.getElementById('updateProfessorForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const professorId = document.getElementById('editProfessorId').value
  const professorName = document.getElementById('editProfessorName').value
  const professorCPF = document.getElementById('editProfessorCPF').value
  const professorPhone = document.getElementById('editProfessorPhone').value
  const professorConstiEmail = document.getElementById('editProfessorConstEmail').value
  const professorPersonalEmail = document.getElementById('editProfessorPersonalEmail').value
  const professorBirthdate = document.getElementById('editProfessorBirthdate').value
  const professorAddress = document.getElementById('editProfessorAddress').value
  // 他のフィールドを取得する必要があります

  // 日付のフォーマット
  const formattedProfessorBirthdate = formatDate(professorBirthdate)

  fetch(`${apiUrlProfessor}/${professorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_prof: professorName,
      cpf_prof: professorCPF,
      telefone_prof: professorPhone,
      email_consti_prof: professorConstiEmail,
      email_prof: professorPersonalEmail,
      nascimento_prof: formattedProfessorBirthdate,
      endereco_prof: professorAddress
    })
  })
    .then(response => response.json())
    .then(data => {
      getProfessor()
      cancelEdit()
    })
    .catch(error => console.error('Erro:', error))
})

// 削除ボタン
function deleteProfessor(id_prof) {
  fetch(`${apiUrlProfessor}/${id_prof}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getProfessor())
    .catch(error => console.error('Erro:', error))
}

getProfessor()

function cancelEdit() {
  document.getElementById('updateProfessorForm').reset()
}
// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// サーバーからEscolaの情報を取得してセレクトボックスに追加する関数
/* function populateSchools() {
  fetch(apiUrlEscolas)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('professorEscola')
      data.forEach(escola => {
        const option = document.createElement('option')
        option.value = escola.id_escola
        option.textContent = escola.nome_escola
        selectElement.appendChild(option)
      })
    })
    .catch(error => console.error('Error fetching schools:', error))

  fetch(apiUrlEscolas)
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('editProfessorEscola')
      data.forEach(escola => {
        const option = document.createElement('option')
        option.value = escola.id_escola
        option.textContent = escola.nome_escola
        selectElement.appendChild(option)
      })
    })
    .catch(error => console.error('Error fetching schools:', error))
}

// ページが読み込まれたらEscolaの情報を取得してセレクトボックスを更新する
document.addEventListener('DOMContentLoaded', populateSchools)
 */
