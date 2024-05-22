const apiUrlAlunoResp = 'http://localhost:3000/resps_aluno'
const apiUrlAluno = 'http://localhost:3000/alunos'
const apiUrlResp = 'http://localhost:3000/responsaveis'

// リストを表示
function displayAlunoResp(alunoResp) {
  const alunoRespList = document.getElementById('alunoRespList')
  alunoRespList.innerHTML = ''
  alunoResp.forEach(alunoResp => {
    // RespとAlunoの名前を取得
    Promise.all([getAlunoName(alunoResp.id_aluno), getProfName(alunoResp.id_resp)])
      .then(([alunoName, respName]) => {
        const alunoRespElement = document.createElement('tr')
        alunoRespElement.innerHTML = `
              <td>${alunoName}</td>
              <td>${respName}</td>
              <td>
                <button onclick="deleteAlunoResp(${alunoResp.id_resp_aluno})">Excluir</button>
              </td>
          `
        alunoRespList.appendChild(alunoRespElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// 取得
function getAlunoResp() {
  fetch(apiUrlAlunoResp)
    .then(response => response.json())
    .then(data => displayAlunoResp(data))
    .catch(error => console.error('Erro:', error))
}

// Alunoの名前を取得
function getAlunoName(id_aluno) {
  return fetch(`${apiUrlAluno}/${id_aluno}`)
    .then(response => response.json())
    .then(data => data.nome_aluno)
    .catch(error => console.error('Erro:', error))
}
// Respの名前を取得
function getProfName(id_resp) {
  return fetch(`${apiUrlResp}/${id_resp}`)
    .then(response => response.json())
    .then(data => data.nome_resp)
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addAlunoRespForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const alunoId = parseInt(document.getElementById('alunoId').value)
  const respId = parseInt(document.getElementById('respId').value)
  
  fetch(apiUrlAlunoResp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_aluno: alunoId,
      id_resp: respId
    })
  })
    .then(response => response.json())
    .then(data => {
      getAlunoResp()
      document.getElementById('addAlunoRespForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 削除
function deleteAlunoResp(id_resp_aluno) {
  fetch(`${apiUrlAlunoResp}/${id_resp_aluno}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getAlunoResp())
    .catch(error => console.error('Erro:', error))
}

getAlunoResp()

// Alunosを取得
function getAlunos() {
  return fetch(apiUrlAluno)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}
// Turmasを取得
function getResp() {
  return fetch(apiUrlResp)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}

document.addEventListener('DOMContentLoaded', function () {
  const alunoSelect = document.getElementById('alunoId')
  const respSelect = document.getElementById('respId')

  getAlunos().then(alunos => {
    alunos.forEach(aluno => {
      const option = document.createElement('option')
      option.value = aluno.id_aluno
      option.textContent = aluno.nome_aluno
      alunoSelect.appendChild(option)
    })
  })

  getResp().then(resp => {
    resp.forEach(resp => {
      const option = document.createElement('option')
      option.value = resp.id_resp
      option.textContent = resp.nome_resp
      respSelect.appendChild(option)
    })
  })
})
