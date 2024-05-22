const apiUrlAluno = 'http://localhost:3000/alunos'
const apiUrlTurma = 'http://localhost:3000/turmas'

document.addEventListener('DOMContentLoaded', function () {
  const id_aluno = 1 // 表示したい学生のID
  const url = `${apiUrlAluno}/${id_aluno}`

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(aluno => {
      if (aluno.id_turma === null) {
        document.getElementById('aluno-turma').textContent = 'Sem turma'
      } else {
        fetch(`${apiUrlTurma}/${aluno.id_turma}`)
          .then(response => response.json())
          .then(turma => {
            // 取得したデータをHTMLに表示する
            document.getElementById('aluno-turma').textContent = turma.nome_turma
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error)
          })
      }

      // Alunoの情報をHTMLに表示する
      document.getElementById('aluno-name').textContent = aluno.nome_aluno
      document.getElementById('aluno-cpf').textContent = aluno.cpf_aluno
      document.getElementById('aluno-address').textContent = aluno.endereco_aluno
      document.getElementById('aluno-phone').textContent = aluno.telefone_aluno
      document.getElementById('aluno-email').textContent = aluno.email_aluno
      document.getElementById('aluno-dob').textContent = formatDate(aluno.nascimento_aluno)
      document.getElementById('aluno-ra').textContent = aluno.ra_aluno
      document.getElementById('aluno-registration-date').textContent = formatDate(aluno.data_matricula)

      // 画像の表示
      const alunoPhoto = document.getElementById('aluno-photo')
      if (aluno.foto === null) {
        alunoPhoto.src = '../../upload/semfoto.png' // デフォルト画像のパスを指定
      } else {
        alunoPhoto.src = `../../upload/${aluno.foto}` // サーバー上のファイルパスを指定
      }
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
