const apiUrlProf = 'http://localhost:3000/professores'

document.addEventListener('DOMContentLoaded', function () {
  const id_prof = 2 // 表示したい学生のID
  const url = `${apiUrlProf}/${id_prof}`

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(prof => {

      // profの情報をHTMLに表示する
      document.getElementById('prof-name').textContent = prof.nome_prof
      document.getElementById('prof-cpf').textContent = prof.cpf_prof
      document.getElementById('prof-phone').textContent = prof.telefone_prof
      document.getElementById('prof-consti-email').textContent = prof.email_consti_prof
      document.getElementById('prof-email').textContent = prof.email_prof
      document.getElementById('prof-dod').textContent = formatDate(prof.nascimento_prof)
      document.getElementById('prof-address').textContent = prof.endereco_prof

    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error)
    })
})

// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
