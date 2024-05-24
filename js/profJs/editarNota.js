const apiUrlNota = 'http://localhost:3000/notas_faltas';
const apiUrlAluno = 'http://localhost:3000/alunos'

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alunoId = urlParams.get('alunoId');
  const disciplinaId = urlParams.get('disciplinaId');
  const idNotasFaltas = urlParams.get('idNotasFaltas');

  fetchAlunoInfo(idNotasFaltas);
  fetchNotaInfo(idNotasFaltas);

  const editNotaForm = document.getElementById('editNotaForm');
  editNotaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const n1Input = document.getElementById('n1Input').value;
    const aiInput = document.getElementById('aiInput').value;
    const apInput = document.getElementById('apInput').value;
    const faltas = document.getElementById('faltasAluno').value;
    const academic_year = document.getElementById('anoAluno').value;
    const data_matricula = document.getElementById('matriculaAluno').value;
    const semestre = document.getElementById('semestreAluno').value;
    const data = {
      id_disciplina: disciplinaId,
      id_aluno: alunoId,
      n1: n1Input,
      AI: aiInput,
      AP: apInput,
      faltas: faltas,
      academic_year: academic_year,
      data_matricula: formatDate(data_matricula),
      semestre: semestre
    };
    updateNota(idNotasFaltas, data);
  });
});

function fetchAlunoInfo(alunoId) {
  fetch(`http://localhost:3000/alunos/${alunoId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('nomeAluno').value = data.nome_aluno;
    })
    .catch(error => console.error('Error fetching Aluno:', error));
}

function fetchNotaInfo(idNotasFaltas) {
  fetch(`${apiUrlNota}/${idNotasFaltas}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('faltasAluno').value = data.faltas;
      document.getElementById('n1Input').value = data.N1;
      document.getElementById('apInput').value = data.AP;
      document.getElementById('aiInput').value = data.AI;
      document.getElementById('anoAluno').value = data.academic_year;
      document.getElementById('matriculaAluno').value = formatDate(data.data_matricula);
      document.getElementById('semestreAluno').value = data.semestre;
    })
    .catch(error => console.error('Error fetching Nota:', error));
}

function updateNota(idNotasFaltas, data) {
  fetch(`${apiUrlNota}/${idNotasFaltas}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Nota updated:', data);
    alert('Nota atualizada com sucesso.');
  })
  .catch(error => console.error('Error updating Nota:', error));
}

// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}