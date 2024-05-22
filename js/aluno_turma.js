const apiUrlTurmaAlunos = 'http://localhost:3000/turma_alunos';
const apiUrlAluno = 'http://localhost:3000/alunos';
const apiUrlTurma = 'http://localhost:3000/turmas';

// リストを表示
function displayTurmaAlunos(turmaAlunos) {
  const turmaAlunosList = document.getElementById('turmaAlunosList');
  turmaAlunosList.innerHTML = '';
  turmaAlunos.forEach(turmaAluno => {
    // TurmaとAlunoの名前を取得
    Promise.all([getTurmaName(turmaAluno.id_turma), getAlunoName(turmaAluno.id_aluno)])
      .then(([turmaName, alunoName]) => {
        const turmaAlunoElement = document.createElement('tr');
        turmaAlunoElement.innerHTML = `
          <td>${alunoName}</td>
          <td>${turmaName}</td>
          <td>
            <button onclick="deleteTurmaAluno(${turmaAluno.id_aluno}, ${turmaAluno.id_turma})">Excluir</button>
          </td>
        `;
        turmaAlunosList.appendChild(turmaAlunoElement);
      })
      .catch(error => console.error('Erro:', error));
  });
}

// 取得
function getTurmaAlunos() {
  fetch(apiUrlTurmaAlunos)
    .then(response => response.json())
    .then(data => displayTurmaAlunos(data))
    .catch(error => console.error('Erro:', error));
}

// Turmaの名前を取得
function getTurmaName(id_turma) {
  return fetch(`${apiUrlTurma}/${id_turma}`)
    .then(response => response.json())
    .then(data => data.nome_turma)
    .catch(error => console.error('Erro:', error));
}

// Alunoの名前を取得
function getAlunoName(id_aluno) {
  return fetch(`${apiUrlAluno}/${id_aluno}`)
    .then(response => response.json())
    .then(data => data.nome_aluno)
    .catch(error => console.error('Erro:', error));
}

// 追加
document.getElementById('addTurmaAlunoForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const id_aluno1 = document.getElementById('alunoId').value;
  id_aluno = parseInt(id_aluno1)
  const id_turma1 = document.getElementById('turmaId').value;
  id_turma = parseInt(id_turma1)

  fetch(apiUrlTurmaAlunos, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_aluno: id_aluno,
      id_turma: id_turma
    })
  })
    .then(response => response.json())
    .then(data => {
      getTurmaAlunos();
      document.getElementById('addTurmaAlunoForm').reset();
    })
    .catch(error => console.error('Erro:', error));
});

// 削除
function deleteTurmaAluno(id_aluno, id_turma) {
  fetch(`${apiUrlTurmaAlunos}/${id_aluno}/${id_turma}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getTurmaAlunos())
    .catch(error => console.error('Erro:', error));
}

getTurmaAlunos();

// Turmasを取得
function getTurmas() {
  return fetch(apiUrlTurma)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error));
}

// Alunosを取得
function getAlunos() {
  return fetch(apiUrlAluno)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error));
}

document.addEventListener('DOMContentLoaded', function() {
  const alunoSelect = document.getElementById('alunoId');
  const turmaSelect = document.getElementById('turmaId');

  getAlunos()
    .then(alunos => {
      alunos.forEach(aluno => {
        const option = document.createElement('option');
        option.value = aluno.id_aluno;
        option.textContent = aluno.nome_aluno;
        alunoSelect.appendChild(option);
      });
    });

  getTurmas()
    .then(turmas => {
      turmas.forEach(turma => {
        const option = document.createElement('option');
        option.value = turma.id_turma;
        option.textContent = turma.nome_turma;
        turmaSelect.appendChild(option);
      });
    });
});
