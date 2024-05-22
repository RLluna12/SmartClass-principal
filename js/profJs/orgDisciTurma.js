document.addEventListener('DOMContentLoaded', () => {
  const turmaSelect = document.getElementById('turmaSelect')
  const disciplinaSelect = document.getElementById('disciplinaSelect')
  const academicYearInput = document.getElementById('academicYear')
  const semestreInput = document.getElementById('semestre')
  const assignDisciplinasButton = document.getElementById('assignDisciplinas')

  const apiUrlTurma = 'http://localhost:3000/turmas'
  const apiUrlAssign = 'http://localhost:3000/assign-disciplinas'

  // サーバーからTurmaのデータを取得する
  fetch(apiUrlTurma)
    .then(response => response.json())
    .then(data => {
      data.forEach(turma => {
        const option = document.createElement('option')
        option.value = turma.id_turma
        option.textContent = turma.nome_turma
        turmaSelect.appendChild(option)
      })
    })
    .catch(error => {
      console.error('Error fetching Turmas:', error)
    })

  // Turmaが選択されたときのイベントリスナーを追加
  turmaSelect.addEventListener('change', event => {
    const selectedTurmaId = event.target.value
    disciplinaSelect.innerHTML = '<option value="">--selecione--</option>'
    disciplinaSelect.disabled = true
    assignDisciplinasButton.disabled = true

    if (selectedTurmaId) {
      fetch(`${apiUrlTurma}/${selectedTurmaId}/disciplinas`)
        .then(response => response.json())
        .then(data => {
          data.forEach(disciplina => {
            const option = document.createElement('option')
            option.value = disciplina.id_disciplina
            option.textContent = disciplina.disciplina
            disciplinaSelect.appendChild(option)
          })
          disciplinaSelect.disabled = false
          assignDisciplinasButton.disabled = false
        })
        .catch(error => {
          console.error('Error fetching Disciplinas:', error)
        })
    }
  })

  // Disciplinaを適用ボタンのイベントリスナーを追加
  assignDisciplinasButton.addEventListener('click', () => {
    const selectedTurmaId = turmaSelect.value
    const selectedDisciplinas = Array.from(disciplinaSelect.selectedOptions).map(option => option.value)
    const academicYear = academicYearInput.value
    const semestre = semestreInput.value

    if (selectedTurmaId && selectedDisciplinas.length > 0 && academicYear && semestre) {
      fetch(apiUrlAssign, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_turma: selectedTurmaId,
          id_disciplinas: selectedDisciplinas,
          academic_year: academicYear,
          semestre: semestre
        })
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message)
        })
        .catch(error => {
          console.error('Error assigning Disciplina:', error)
        })
    } else {
      alert('Escreva todo')
    }
  })
})
