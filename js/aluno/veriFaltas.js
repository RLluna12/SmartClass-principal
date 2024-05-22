const apiUrlNotasFaltas = 'http://localhost:3000/notas_faltas'
const apiUrlDisciplina = 'http://localhost:3000/disciplinas'
const apiUrlAluno = 'http://localhost:3000/alunos'


function populateAnoSelect(data_matricula) {
  const selectAno = document.getElementById('selectAno');
  const currentYear = new Date().getFullYear(); // 現在の年を取得
  const startYear = new Date(data_matricula).getFullYear();

  // 選択肢を生成
  for (let year = startYear; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    selectAno.appendChild(option);
  }
}

function displayNota(nota) {
  const notaList = document.getElementById('notaList')
  notaList.innerHTML = ''
  nota.forEach(nota => {
    // Escolaの情報を取得
    fetch(`${apiUrlDisciplina}/${nota.id_disciplina}`)
      .then(response => response.json())
      .then(disciplina => {
        const notaElement = document.createElement('tr')
        notaElement.innerHTML = `
              <td>${disciplina.disciplina}</td>
              <td>${nota.faltas !== null ? nota.faltas : 0}</td>
              <td>${nota.academic_year}</td>
              <td>${nota.semestre}</td>
          `
        notaList.appendChild(notaElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

function getNotasByAluno() {
  // ログインした生徒のIDを取得する処理が必要 loginUserID
  const id_aluno = 1

  fetch(`${apiUrlAluno}/${id_aluno}`)
    .then(response => response.json())
    .then(aluno => {
      // ログインした生徒のIDを使用して、その生徒の成績や欠席情報を取得するリクエストを送信
      fetch(`${apiUrlAluno}/${id_aluno}/notas_faltas`)
        .then(response => response.json())
        .then(data => {
          notas = data;
          displayNota(notas);
          populateAnoSelect(aluno.data_matricula); 
        })
        .catch(error => console.error('Erro:', error))
    })
    .catch(error => console.error('Erro:', error))
}

function filterNotas() {
  const ano = document.getElementById('selectAno').value;
  const semestre = document.getElementById('selectSemestre').value;
  const id_aluno = 1; // ログインした生徒のIDをここに設定

  fetch(`${apiUrlAluno}/${id_aluno}/notas_faltas`)
    .then(response => response.json())
    .then(data => {
      const filteredNotas = data.filter(nota => nota.academic_year == ano && nota.semestre == semestre);
      displayNota(filteredNotas);
    })
    .catch(error => console.error('filter Erro:', error));
}

document.getElementById('filterButton').addEventListener('click', filterNotas);

/* function populateAnoOptions() {
  const selectAno = document.getElementById('selectAno');
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    selectAno.appendChild(option);
  }
} */



// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

getNotasByAluno()


/* function getNotas() {
  fetch(apiUrlNotasFaltas)
    .then(response => response.json())
    .then(data => displayNota(data))
    .catch(error => console.error('Erro:', error));
} 
getNotas()*/

