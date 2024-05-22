document.addEventListener('DOMContentLoaded', function () {
  const alunosContainer = document.getElementById('alunosContainer')
  const turmaSelect = document.getElementById('turmaSelect')
  const disciplinaSelect = document.getElementById('disciplinaSelect')

  const apiUrlTurma = 'http://localhost:3000/turmas'
  let selectedDisciplinaId

  // Fetch Turmas from the server and populate the select box
  fetch(apiUrlTurma)
    .then(response => response.json())
    .then(data => {
      data.forEach(turma => {
        const turmaOption = document.createElement('option')
        turmaOption.value = turma.id_turma
        turmaOption.textContent = `${turma.nome_turma} - ${turma.ano} - Semestre ${turma.semestre}`
        turmaSelect.appendChild(turmaOption)
      })
    })
    .catch(error => console.error('Error fetching Turmas:', error))

  // Event listener for Turma select change
  turmaSelect.addEventListener('change', function () {
    const selectedTurmaId = turmaSelect.value
    const apiUrlTurmaDisciplina = `http://localhost:3000/turmas/${selectedTurmaId}/disciplinas`

    // Fetch Disciplinas for the selected Turma from the server
    fetch(apiUrlTurmaDisciplina)
      .then(response => response.json())
      .then(data => {
        // Clear previous Disciplinas
        disciplinaSelect.innerHTML = ''

        // Add default option
        const defaultOption = document.createElement('option')
        defaultOption.value = ''
        defaultOption.textContent = 'Escolha a Disciplina'
        disciplinaSelect.appendChild(defaultOption)

        // Populate the select box with Disciplinas
        data.forEach(disciplina => {
          const disciplinaOption = document.createElement('option')
          disciplinaOption.value = disciplina.id_disciplina
          disciplinaOption.textContent = disciplina.disciplina
          disciplinaSelect.appendChild(disciplinaOption)
        })
      })
      .catch(error => console.error('Error fetching Disciplinas:', error))
  })

  // Event listener for Disciplina select change
  disciplinaSelect.addEventListener('change', function () {
    selectedDisciplinaId = disciplinaSelect.value
    fetchAlunos(selectedDisciplinaId)
  })

  function fetchAlunos(disciplinaId) {
    // Fetch Alunos for the selected Disciplina from the server
    fetch(`http://localhost:3000/disciplinas/${disciplinaId}/alunos`)
      .then(response => response.json())
      .then(data => {
        // Clear previous Alunos
        alunosContainer.innerHTML = ''

        // Create a card for each Aluno and append it to the container
        data.forEach(aluno => {
          const card = document.createElement('div')
          card.classList.add('aluno-card')

          // Check if aluno.foto exists, if not use default image
          const fotoUrl = aluno.foto ? `../../upload/${aluno.foto}` : '../../upload/semfoto.png'

          // Create image element
          const img = document.createElement('img')
          img.src = fotoUrl
          img.classList.add('img-alunoMini') // Add img-alunoMini class
          card.appendChild(img)

          // Create ID element
          const idElement = document.createElement('span')
          idElement.textContent = `ID: ${aluno.id_aluno}`
          card.appendChild(idElement)

          // Create Name element
          const nameElement = document.createElement('span')
          nameElement.textContent = `Name: ${aluno.nome_aluno}`
          card.appendChild(nameElement)

          // Fetch Falta for the selected Aluno and Disciplina from the server
          fetch(`http://localhost:3000/alunos/${aluno.id_aluno}/disciplinas/${disciplinaId}/falta`)
            .then(response => response.json())
            .then(data => {
              // Create Falta element
              const faltaElement = document.createElement('span')
              faltaElement.textContent = `Faltas: ${data.faltas}`
              card.appendChild(faltaElement)
            })
            .catch(error => console.error('Error fetching Falta:', error))

          // Append card to container
          alunosContainer.appendChild(card)
        })
      })
      .catch(error => console.error('Error fetching Alunos:', error))
  }
})
