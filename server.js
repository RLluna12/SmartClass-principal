const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const crypto = require('crypto') // Importar módulo crypto para gerar token
const nodemailer = require('nodemailer') // Importar nodemailer para envio de email

//
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())
// MySQL接続設定
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smartclass'
})
connection.connect(err => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack)
    return
  }
  console.log('Connected to MySQL database')
})

// Middleware para analisar corpos de requisição
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors()) // Habilitar CORS para permitir requisições de diferentes origens

// 商品の配列をMySQLから読み込む
let alunos = []
let disciplinaAlunos = []
let disciplinas = []
let eventos = []
let eventoAlunos = []
let eventoProfessors = []
let notas = []
let professores = []
let profDisciplinas = []
let responsaveis = []
let alunoResps = []
let turmas = []
let turmaDisciplinas = []

// Professorのサーバー管理に関わる部分
// ProfessorTableのデータ取得
connection.query('SELECT * FROM Professor;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na ProfessorTable: ' + err)
  } else {
    professores = results
  }
})
// リスト化
app.get('/professores', (req, res) => {
  res.json(professores)
})
// 取得
app.get('/professores/:id_prof', (req, res) => {
  const professorID = parseInt(req.params.id_prof)
  const professor = professores.find(professor => professor.id_prof === professorID)
  if (professor) {
    res.json(professor)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/professores', (req, res) => {
  const newProfessor = req.body
  connection.query(
    'INSERT INTO Professor (nome_prof, cpf_prof, telefone_prof, email_consti_prof, email_prof, nascimento_prof, endereco_prof, senha, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newProfessor.nome_prof,
      newProfessor.cpf_prof,
      newProfessor.telefone_prof,
      newProfessor.email_consti_prof,
      newProfessor.email_prof,
      newProfessor.nascimento_prof,
      newProfessor.endereco_prof,
      newProfessor.senha,
      newProfessor.level
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Professor não foi possível adicionar' })
      } else {
        newProfessor.id_prof = result.insertId
        professores.push(newProfessor)
        res.status(201).json(newProfessor)
      }
    }
  )
})
// 更新
app.put('/professores/:id_prof', (req, res) => {
  const id_prof = parseInt(req.params.id_prof)
  const updatedProfessor = req.body
  const index = professores.findIndex(professor => professor.id_prof === id_prof)
  if (index !== -1) {
    connection.query(
      'UPDATE Professor SET nome_prof=?, cpf_prof=?, telefone_prof=?, email_consti_prof=?, email_prof=?, nascimento_prof=?, endereco_prof=?, senha=?, level=? WHERE id_prof=?',
      [
        updatedProfessor.nome_prof,
        updatedProfessor.cpf_prof,
        updatedProfessor.telefone_prof,
        updatedProfessor.email_consti_prof,
        updatedProfessor.email_prof,
        updatedProfessor.nascimento_prof,
        updatedProfessor.endereco_prof,
        updatedProfessor.senha,
        updatedProfessor.level,
        id_prof
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Professor não foi possível atualizar' })
        } else {
          professores[index] = { ...professores[index], ...updatedProfessor }
          res.json(professores[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Professor não encontrado' })
  }
})
// 削除
app.delete('/professores/:id_prof', (req, res) => {
  const id_prof = parseInt(req.params.id_prof)
  const index = professores.findIndex(professor => professor.id_prof === id_prof)
  if (index !== -1) {
    connection.query('DELETE FROM Professor WHERE id_prof=?', [id_prof], err => {
      if (err) {
        console.error('ProfessorTable - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedProfessor = professores.splice(index, 1)
        res.json(removedProfessor[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Turmaのサーバー管理に関わる部分
// TurmaTableのデータ取得
connection.query('SELECT * FROM Turma;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na Turma Table: ' + err)
  } else {
    turmas = results
  }
})
// リスト化
app.get('/turmas', (req, res) => {
  res.json(turmas)
})
// 取得
app.get('/turmas/:id_turma', (req, res) => {
  const turmaID = parseInt(req.params.id_turma)
  const turma = turmas.find(turma => turma.id_turma === turmaID)
  if (turma) {
    res.json(turma)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/turmas', (req, res) => {
  const newTurma = req.body
  connection.query(
    'INSERT INTO Turma (nome_turma, ano, semestre) VALUES (?, ?, ?)',
    [newTurma.nome_turma, newTurma.ano, newTurma.semestre],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Turma não foi possível adicionar' })
      } else {
        newTurma.id_turma = result.insertId
        turmas.push(newTurma)
        res.status(201).json(newTurma)
      }
    }
  )
})
// 更新
app.put('/turmas/:id_turma', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  const updatedTurma = req.body
  const index = turmas.findIndex(turma => turma.id_turma === id_turma)
  if (index !== -1) {
    connection.query(
      'UPDATE Turma SET nome_turma=?, ano=?, semestre=? WHERE id_turma=?',
      [updatedTurma.nome_turma, updatedTurma.ano, updatedTurma.semestre, id_turma],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Turma não foi possível atualizar' })
        } else {
          turmas[index] = { ...turmas[index], ...updatedTurma }
          res.json(turmas[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Turma não encontrado' })
  }
})
// 削除
app.delete('/turmas/:id_turma', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  const index = turmas.findIndex(turma => turma.id_turma === id_turma)
  if (index !== -1) {
    connection.query('DELETE FROM Turma WHERE id_turma=?', [id_turma], err => {
      if (err) {
        console.error('TurmaTable - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedTurma = turmas.splice(index, 1)
        res.json(removedTurma[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Disciplinaのサーバー管理に関わる部分
// DisciplinaTableのデータ取得
connection.query('SELECT * FROM Disciplina;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na Disciplina Table: ' + err)
  } else {
    disciplinas = results
  }
})
// リスト化
app.get('/disciplinas', (req, res) => {
  res.json(disciplinas)
})
// 取得
app.get('/disciplinas/:id_disciplina', (req, res) => {
  const disciplinaID = parseInt(req.params.id_disciplina)
  const disciplina = disciplinas.find(disciplina => disciplina.id_disciplina === disciplinaID)
  if (disciplina) {
    res.json(disciplina)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/disciplinas', (req, res) => {
  const newDisciplina = req.body
  connection.query(
    'INSERT INTO Disciplina (disciplina, horario) VALUES (?, ?)',
    [newDisciplina.disciplina, newDisciplina.horario],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Disciplina não foi possível adicionar' })
      } else {
        newDisciplina.id_disciplina = result.insertId
        disciplinas.push(newDisciplina)
        res.status(201).json(newDisciplina)
      }
    }
  )
})
// 更新
app.put('/disciplinas/:id_disciplina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_disciplina)
  const updatedDisciplina = req.body
  const index = disciplinas.findIndex(disciplina => disciplina.id_disciplina === id_disciplina)
  if (index !== -1) {
    connection.query(
      'UPDATE Disciplina SET disciplina=?, horario=? WHERE id_disciplina=?',
      [updatedDisciplina.disciplina, updatedDisciplina.horario, id_disciplina],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Disciplina não foi possível atualizar' })
        } else {
          disciplinas[index] = { ...disciplinas[index], ...updatedDisciplina }
          res.json(disciplinas[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Disciplina não encontrado' })
  }
})
// 削除
app.delete('/disciplinas/:id_disciplina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_disciplina)
  const index = disciplinas.findIndex(disciplina => disciplina.id_disciplina === id_disciplina)
  if (index !== -1) {
    connection.query('DELETE FROM Disciplina WHERE id_disciplina=?', [id_disciplina], err => {
      if (err) {
        console.error('DisciplinaTable - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedDisciplina = disciplinas.splice(index, 1)
        res.json(removedDisciplina[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Responsavelのサーバー管理に関わる部分
// ResponsavelTableのデータ取得
connection.query('SELECT * FROM Responsavel;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na Responsavel Table: ' + err)
  } else {
    responsaveis = results
  }
})
// リスト化
app.get('/responsaveis', (req, res) => {
  res.json(responsaveis)
})
// 取得
app.get('/responsaveis/:id_resp', (req, res) => {
  const responsavelID = parseInt(req.params.id_resp)
  const responsavel = responsaveis.find(responsavel => responsavel.id_resp === responsavelID)
  if (responsavel) {
    res.json(responsavel)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/responsaveis', (req, res) => {
  const newResponsavel = req.body
  connection.query(
    'INSERT INTO Responsavel (nome_resp, cpf_resp, endereco_resp, telefone_resp, email_resp, senha_resp) VALUES (?, ?, ?, ?, ?, ?)',
    [
      newResponsavel.nome_resp,
      newResponsavel.cpf_resp,
      newResponsavel.endereco_resp,
      newResponsavel.telefone_resp,
      newResponsavel.email_resp,
      newResponsavel.senha_resp
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Responsavel não foi possível adicionar' })
      } else {
        newResponsavel.id_resp = result.insertId
        responsaveis.push(newResponsavel)
        res.status(201).json(newResponsavel)
      }
    }
  )
})
// 更新
app.put('/responsaveis/:id_resp', (req, res) => {
  const id_resp = parseInt(req.params.id_resp)
  const updatedResponsavel = req.body
  const index = responsaveis.findIndex(responsavel => responsavel.id_resp === id_resp)
  if (index !== -1) {
    connection.query(
      'UPDATE Responsavel SET nome_resp=?, cpf_resp=?, endereco_resp=?, telefone_resp=?, email_resp=?, senha_resp=? WHERE id_resp=?',
      [
        updatedResponsavel.nome_resp,
        updatedResponsavel.cpf_resp,
        updatedResponsavel.endereco_resp,
        updatedResponsavel.telefone_resp,
        updatedResponsavel.email_resp,
        updatedResponsavel.senha_resp,
        id_resp
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Responsavel não foi possível atualizar' })
        } else {
          responsaveis[index] = { ...responsaveis[index], ...updatedResponsavel }
          res.json(responsaveis[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Responsavel não encontrado' })
  }
})
// 削除
app.delete('/responsaveis/:id_resp', (req, res) => {
  const id_resp = parseInt(req.params.id_resp)
  const index = responsaveis.findIndex(responsavel => responsavel.id_resp === id_resp)
  if (index !== -1) {
    connection.query('DELETE FROM Responsavel WHERE id_resp=?', [id_resp], err => {
      if (err) {
        console.error('ResponsavelTable - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedResponsavel = responsaveis.splice(index, 1)
        res.json(removedResponsavel[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Alunoのサーバー管理に関わる部分
// AlunoTableのデータ取得
connection.query('SELECT * FROM Aluno;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na Aluno Table: ' + err)
  } else {
    alunos = results
  }
})
// リスト化
app.get('/alunos', (req, res) => {
  res.json(alunos)
})
// 取得
app.get('/alunos/:id_aluno', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const aluno = alunos.find(aluno => aluno.id_aluno === alunoID)
  if (aluno) {
    res.json(aluno)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/alunos', (req, res) => {
  const newAluno = req.body
  connection.query(
    'INSERT INTO Aluno (nome_aluno, cpf_aluno, endereco_aluno, telefone_aluno, email_aluno, nascimento_aluno, ra_aluno, data_matricula, foto, senha, id_turma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newAluno.nome_aluno,
      newAluno.cpf_aluno,
      newAluno.endereco_aluno,
      newAluno.telefone_aluno,
      newAluno.email_aluno,
      newAluno.nascimento_aluno,
      newAluno.ra_aluno,
      newAluno.data_matricula,
      newAluno.foto,
      newAluno.senha,
      newAluno.id_turma
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Aluno não foi possível adicionar' })
      } else {
        newAluno.id_aluno = result.insertId
        alunos.push(newAluno)
        res.status(201).json(newAluno)
      }
    }
  )
})
// 更新
app.put('/alunos/:id_aluno', (req, res) => {
  const id_aluno = parseInt(req.params.id_aluno)
  const updatedAluno = req.body
  const index = alunos.findIndex(aluno => aluno.id_aluno === id_aluno)
  if (index !== -1) {
    connection.query(
      'UPDATE Aluno SET nome_aluno=?, cpf_aluno=?, endereco_aluno=?, telefone_aluno=?, email_aluno=?, nascimento_aluno=?, ra_aluno=?, data_matricula=?, foto=?, senha=?, id_turma=? WHERE id_aluno=?',
      [
        updatedAluno.nome_aluno,
        updatedAluno.cpf_aluno,
        updatedAluno.endereco_aluno,
        updatedAluno.telefone_aluno,
        updatedAluno.email_aluno,
        updatedAluno.nascimento_aluno,
        updatedAluno.ra_aluno,
        updatedAluno.data_matricula,
        updatedAluno.foto,
        updatedAluno.senha,
        updatedAluno.id_turma,
        id_aluno
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Aluno não foi possível atualizar' })
        } else {
          alunos[index] = { ...alunos[index], ...updatedAluno }
          res.json(alunos[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Aluno não encontrado' })
  }
})
// 削除
app.delete('/alunos/:id_aluno', (req, res) => {
  const id_aluno = parseInt(req.params.id_aluno)
  const index = alunos.findIndex(aluno => aluno.id_aluno === id_aluno)
  if (index !== -1) {
    connection.query('DELETE FROM Aluno WHERE id_aluno=?', [id_aluno], err => {
      if (err) {
        console.error('AlunoTable - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedAluno = alunos.splice(index, 1)
        res.json(removedAluno[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// AlunoTableのdata_matriculaの最小値と最大値を取得するエンドポイント
app.get('/alunos/data_matricula_range', (req, res) => {
  console.log('Received request for data matricula range') // ログ追加
  connection.query('SELECT MIN(data_matricula) as start, MAX(data_matricula) as end FROM Aluno', (err, results) => {
    if (err) {
      console.error('Ocorreu um erro na tabela Aluno: ' + err)
      res.status(500).json({ message: 'Ocorreu um erro' })
    } else {
      res.json(results[0])
    }
  })
})
// ターマに関連するアルノの取得
app.get('/turmas/:id_turma/alunos', (req, res) => {
  const turmaID = parseInt(req.params.id_turma)
  // Turmaに関連するAlunoをデータベースからクエリして取得
  connection.query('SELECT * FROM Aluno WHERE id_turma = ?', [turmaID], (err, results) => {
    if (err) {
      console.error('Ocorreu um erro ao recuperar Aluno relacionado a Turma: ' + err)
      res.status(500).json({ message: 'Falha ao recuperar Aluno relacionado a Turma' })
    } else {
      res.json(results)
    }
  })
})

// Responsavel_Alunoのサーバー管理に関わる部分
// Responsavel_AlunoTableのデータ取得
connection.query('SELECT * FROM responsavel_aluno;', (err, results) => {
  if (err) {
    console.error('Ocorreu erro na tabela Aluno_Resp: ' + err)
  } else {
    alunoResps = results
  }
})
// リスト化
app.get('/resps_aluno', (req, res) => {
  res.json(alunoResps)
})
// 取得
app.get('/resps_aluno/:id_resp_aluno', (req, res) => {
  const resps_alunoID = parseInt(req.params.id_resp_aluno)
  const alunoResp = alunoResps.find(alunoResp => alunoResp.id_resp_aluno === resps_alunoID)
  if (alunoResp) {
    res.json(alunoResp)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/resps_aluno', (req, res) => {
  const newAlunoResp = req.body
  connection.query(
    'INSERT INTO Responsavel_Aluno  (id_resp, id_aluno) VALUES (?, ?)',
    [newAlunoResp.id_aluno, newAlunoResp.id_resp],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Falha ao adicionar Aluno_Resp' })
      } else {
        newAlunoResp.id_resp_aluno = result.insertId
        alunoResps.push(newAlunoResp)
        res.status(201).json(newAlunoResp)
      }
    }
  )
})
// 削除
app.delete('/resps_aluno/:id_resp_aluno', (req, res) => {
  const id_resp_aluno = parseInt(req.params.id_resp_aluno)
  const index = alunoResps.findIndex(alunoResp => alunoResp.id_resp_aluno === id_resp_aluno)
  if (index !== -1) {
    connection.query('DELETE FROM Responsavel_Aluno WHERE id_resp_aluno=?', [id_resp_aluno], err => {
      if (err) {
        console.error('Tabela Aluno_Resp - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedAlunoResp = alunoResps.splice(index, 1)
        res.json(removedAlunoResp[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Notasのサーバー管理に関わる部分
// NotasTableのデータ取得
connection.query('SELECT * FROM Notas_faltas;', (err, results) => {
  if (err) {
    console.error('Ocorreu erro na tabela Notas: ' + err)
  } else {
    notas = results
  }
})
// リスト化
app.get('/notas_faltas', (req, res) => {
  res.json(notas)
})
// 取得
app.get('/notas_faltas/:id_notas_faltas', (req, res) => {
  const notasID = parseInt(req.params.id_notas_faltas)
  const nota = notas.find(nota => nota.id_notas_faltas === notasID)
  if (nota) {
    res.json(nota)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/notas_faltas', (req, res) => {
  const newNota = req.body
  connection.query(
    'INSERT INTO Notas_faltas (id_disciplina, id_aluno, n1, AI, AP, faltas, academic_year, data_matricula, semestre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newNota.id_disciplina,
      newNota.id_aluno,
      newNota.n1,
      newNota.AI,
      newNota.AP,
      newNota.faltas,
      newNota.academic_year,
      newNota.data_matricula,
      newNota.semestre
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível adicionar notas' })
      } else {
        newNota.id_notas_faltas = result.insertId
        notas.push(newNota)
        res.status(201).json(newNota)
      }
    }
  )
})
// 更新
app.put('/notas_faltas/:id_notas_faltas', (req, res) => {
  const id_notas_faltas = parseInt(req.params.id_notas_faltas)
  const updatedNota = req.body
  const index = notas.findIndex(nota => nota.id_notas_faltas === id_notas_faltas)
  if (index !== -1) {
    connection.query(
      'UPDATE Notas_faltas SET id_disciplina=?, id_aluno=?, n1=?, AI=?, AP=?, faltas=?, academic_year=?, data_matricula=?, semestre=? WHERE id_notas_faltas=?',
      [
        updatedNota.id_disciplina,
        updatedNota.id_aluno,
        updatedNota.n1,
        updatedNota.AI,
        updatedNota.AP,
        updatedNota.faltas,
        updatedNota.academic_year,
        updatedNota.data_matricula,
        updatedNota.semestre,
        id_notas_faltas
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Falha ao atualizar Notas' })
        } else {
          notas[index] = { ...notas[index], ...updatedNota }
          res.json(notas[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Notas não encontradas' })
  }
})
// 削除
app.delete('/notas_faltas/:id_notas_faltas', (req, res) => {
  const id_notas_faltas = parseInt(req.params.id_notas)
  const index = notas.findIndex(nota => nota.id_notas_faltas === id_notas_faltas)
  if (index !== -1) {
    connection.query('DELETE FROM Notas_faltas WHERE id_notas_faltas=?', [id_notas_faltas], err => {
      if (err) {
        console.error('Tabela Notas - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedNota = notas.splice(index, 1)
        res.json(removedNota[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 生徒IDに関連する成績や欠席情報を取得するエンドポイントを追加
app.get('/alunos/:id_aluno/notas_faltas', (req, res) => {
  const id_aluno = parseInt(req.params.id_aluno)
  // 生徒IDに関連する成績や欠席情報を取得するクエリを実行
  connection.query('SELECT * FROM Notas_faltas WHERE id_aluno = ?', [id_aluno], (err, results) => {
    if (err) {
      console.error('Ocorreu erro na tabela Notas: ' + err)
      res.status(500).json({ message: 'Ocorreu um erro' })
    } else {
      res.json(results)
    }
  })
})

// Eventoのサーバー管理に関わる部分
// EventoTableのデータ取得
connection.query('SELECT * FROM Evento;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na tabela Evento: ' + err)
  } else {
    eventos = results
  }
})
// リスト化
app.get('/eventos', (req, res) => {
  res.json(eventos)
})
// 取得
app.get('/eventos/:id_evento', (req, res) => {
  const eventoID = parseInt(req.params.id_evento)
  const evento = eventos.find(evento => evento.id_evento === eventoID)
  if (evento) {
    res.json(evento)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/eventos', (req, res) => {
  const newEvento = req.body
  connection.query(
    'INSERT INTO Evento (nome_evento, link_evento, data_evento) VALUES (?, ?, ?)',
    [newEvento.nome_evento, newEvento.link_evento, newEvento.data_evento],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível adicionar Evento' })
      } else {
        newEvento.id_evento = result.insertId
        eventos.push(newEvento)
        res.status(201).json(newEvento)
      }
    }
  )
})
// 更新
app.put('/eventos/:id_evento', (req, res) => {
  const id_evento = parseInt(req.params.id_evento)
  const updatedEvento = req.body
  const index = eventos.findIndex(evento => evento.id_evento === id_evento)
  if (index !== -1) {
    connection.query(
      'UPDATE Evento SET nome_evento=?, link_evento=?, data_evento=? WHERE id_evento=?',
      [updatedEvento.nome_evento, updatedEvento.link_evento, updatedEvento.data_evento, id_evento],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Evento não pôde ser atualizado' })
        } else {
          eventos[index] = { ...eventos[index], ...updatedEvento }
          res.json(eventos[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Evento não encontrado' })
  }
})
// 削除
app.delete('/eventos/:id_evento', (req, res) => {
  const id_evento = parseInt(req.params.id_evento)
  const index = eventos.findIndex(evento => evento.id_evento === id_evento)
  if (index !== -1) {
    connection.query('DELETE FROM Evento WHERE id_evento=?', [id_evento], err => {
      if (err) {
        console.error('Tabela de eventos - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedEvento = eventos.splice(index, 1)
        res.json(removedEvento[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// evento_alunoのサーバー管理に関わる部分
// evento_alunoTableのデータ取得
connection.query('SELECT * FROM evento_aluno;', (err, results) => {
  if (err) {
    console.error('Ocorreu erro na tabela evento_aluno: ' + err)
  } else {
    eventoAlunos = results
  }
})
// リスト化
app.get('/evento_alunos', (req, res) => {
  res.json(eventoAlunos)
})
// 取得
app.get('/evento_alunos/:id_evento_aluno', (req, res) => {
  const id_evento_alunoID = parseInt(req.params.id_evento_aluno)
  const eventoAluno = eventoAlunos.find(eventoAluno => eventoAluno.id_evento_aluno === id_evento_alunoID)
  if (eventoAluno) {
    res.json(eventoAluno)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/evento_alunos', (req, res) => {
  const newEventoAluno = req.body
  connection.query(
    'INSERT INTO evento_aluno (id_aluno, id_evento) VALUES (?, ?)',
    [newEventoAluno.id_evento, newEventoAluno.id_aluno],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível adicionar evento_aluno' })
      } else {
        newEventoAluno.id_evento_aluno = result.insertId
        eventoAlunos.push(newEventoAluno)
        res.status(201).json(newEventoAluno)
      }
    }
  )
})
// 更新
app.put('/eventos/:id_evento_aluno', (req, res) => {
  const id_evento_aluno = parseInt(req.params.id_evento_aluno)
  const updatedEventoAluno = req.body
  const index = eventoAlunos.findIndex(evento => evento.id_evento_aluno === id_evento_aluno)
  if (index !== -1) {
    connection.query(
      'UPDATE Evento SET id_evento=?, id_aluno=? WHERE id_evento_aluno=?',
      [updatedEventoAluno.id_evento, updatedEventoAluno.id_aluno, id_evento_aluno],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Falha ao atualizar EventoAluno' })
        } else {
          eventoAlunos[index] = { ...eventoAlunos[index], ...updatedEventoAluno }
          res.json(eventoAlunos[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Evento não encontrado' })
  }
})
// 削除
app.delete('/evento_alunos/:id_evento_aluno', (req, res) => {
  const id_evento_aluno = parseInt(req.params.id_evento_aluno)
  const index = eventoAlunos.findIndex(eventoAluno => eventoAluno.id_evento_aluno === id_evento_aluno)
  if (index !== -1) {
    connection.query('DELETE FROM evento_aluno WHERE id_evento_aluno=?', [id_evento_aluno], err => {
      if (err) {
        console.error('Tabela evento_aluno - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedEventoAluno = eventoAlunos.splice(index, 1)
        res.json(removedEventoAluno[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Disciplina_Alunoのサーバー管理に関わる部分
// Disciplina_AlunoTableのデータ取得
connection.query('SELECT * FROM Aluno_disciplina;', (err, results) => {
  if (err) {
    console.error('Ocorreu erro na tabela Disciplina_Aluno: ' + err)
  } else {
    disciplinaAlunos = results
  }
})
// リスト化
app.get('/Aluno_disciplina', (req, res) => {
  res.json(disciplinaAlunos)
})
// 取得
app.get('/Aluno_disciplina/:id_aluno_disc', (req, res) => {
  const id_aluno_discID = parseInt(req.params.id_aluno_disc)
  const disciplinaAluno = disciplinaAlunos.find(disciplinaAluno => disciplinaAluno.id_aluno_disc === id_aluno_discID)
  if (disciplinaAluno) {
    res.json(disciplinaAluno)
  } else {
    res.status(404).json({ message: 'Não encontrado' })
  }
})
// 追加
app.post('/Aluno_disciplina', (req, res) => {
  const newDisciplinaAluno = req.body
  connection.query(
    'INSERT INTO Aluno_disciplina (id_aluno, id_disciplina) VALUES (?, ?)',
    [newDisciplinaAluno.id_aluno, newDisciplinaAluno.id_disciplina],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Falha ao adicionar Disciplina_Aluno' })
      } else {
        newDisciplinaAluno.id_aluno_disc = result.insertId
        disciplinaAlunos.push(newDisciplinaAluno)
        res.status(201).json(newDisciplinaAluno)
      }
    }
  )
})
// 削除
app.delete('/Aluno_disciplina/:id_aluno_disc', (req, res) => {
  const id_aluno_discID = parseInt(req.params.id_aluno_disc)
  const index = disciplinaAlunos.findIndex(disciplinaAluno => disciplinaAluno.id_aluno_disc === id_aluno_discID)
  if (index !== -1) {
    connection.query('DELETE FROM Aluno_disciplina WHERE id_aluno_disc=?', [id_aluno_discID], err => {
      if (err) {
        console.error('Tabela Aluno_disciplina – Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedDisciplinaAluno = disciplinaAlunos.splice(index, 1)
        res.json(removedDisciplinaAluno[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// evento_professorのサーバー管理に関わる部分
// evento_professorTableのデータ取得
connection.query('SELECT * FROM evento_professor;', (err, results) => {
  if (err) {
    console.error('Ocorreu erro na tabela evento_professor: ' + err)
  } else {
    eventoProfessors = results
  }
})
// リスト化
app.get('/evento_professors', (req, res) => {
  res.json(eventoProfessors)
})
// 取得
app.get('/evento_professors/:id_evento_prof', (req, res) => {
  const id_evento_profID = parseInt(req.params.id_evento_prof)
  const eventoProfessor = eventoProfessors.find(eventoProfessor => eventoProfessor.id_evento_prof === id_evento_profID)
  if (eventoProfessor) {
    res.json(eventoProfessor)
  } else {
    res.status(404).json({ message: 'Não encontrado' })
  }
})
// 追加
app.post('/evento_professors', (req, res) => {
  const newEventoProfessor = req.body
  connection.query(
    'INSERT INTO evento_professor (id_evento, id_prof) VALUES (?, ?)',
    [newEventoProfessor.id_evento, newEventoProfessor.id_prof],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível adicionar evento_professor' })
      } else {
        newEventoProfessor.id_evento_prof = result.insertId
        eventoProfessors.push(newEventoProfessor)
        res.status(201).json(newEventoProfessor)
      }
    }
  )
})
// 削除
app.delete('/evento_professors/:id_evento_prof', (req, res) => {
  const id_evento_profID = parseInt(req.params.id_evento_prof)
  const index = eventoProfessors.findIndex(eventoProfessor => eventoProfessor.id_evento_prof === id_evento_profID)
  if (index !== -1) {
    connection.query('DELETE FROM evento_professor WHERE id_evento_prof=?', [id_evento_profID], err => {
      if (err) {
        console.error('Tabela evento_professor - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedEventoProfessor = eventoProfessors.splice(index, 1)
        res.json(removedEventoProfessor[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// turma_disciplinaのサーバー管理に関わる部分
// turma_disciplinaTableのデータ取得
connection.query('SELECT * FROM turma_disciplina;', (err, results) => {
  if (err) {
    console.error('Ocorreu erro na tabela turma_disciplina: ' + err)
  } else {
    turmaDisciplinas = results
  }
})
// リスト化
app.get('/turma_disciplinas', (req, res) => {
  res.json(turmaDisciplinas)
})
// 取得
app.get('/turma_disciplinas/:id_turma_disc', (req, res) => {
  const id_turma_discID = parseInt(req.params.id_turma_disc)
  const turmaDisciplina = turmaDisciplinas.find(turmaDisciplina => turmaDisciplina.id_turma_disc === id_turma_discID)
  if (turmaDisciplina) {
    res.json(turmaDisciplina)
  } else {
    res.status(404).json({ message: 'Não encontrado' })
  }
})
// 追加
app.post('/turma_disciplinas', (req, res) => {
  const newTurmaDisciplina = req.body
  connection.query(
    'INSERT INTO turma_disciplina (id_turma, id_disciplina) VALUES (?, ?)',
    [newTurmaDisciplina.id_turma, newTurmaDisciplina.id_disciplina],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Falha ao adicionar turma_disciplina' })
      } else {
        newTurmaDisciplina.id_turma_disc = result.insertId
        turmaDisciplinas.push(newTurmaDisciplina)
        res.status(201).json(newTurmaDisciplina)
      }
    }
  )
})
// 削除
app.delete('/turma_disciplinas/:id_turma_disc', (req, res) => {
  const id_turma_discID = parseInt(req.params.id_turma_disc)
  const index = turmaDisciplinas.findIndex(turmaDisciplina => turmaDisciplina.id_turma_disc === id_turma_discID)
  if (index !== -1) {
    connection.query('DELETE FROM turma_disciplina WHERE id_turma_disc=?', [id_turma_discID], err => {
      if (err) {
        console.error('Tabela turma_disciplina – Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedTurmaDisciplina = turmaDisciplinas.splice(index, 1)
        res.json(removedTurmaDisciplina[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// prof_disciplinaのサーバー管理に関わる部分
// prof_disciplinaTableのデータ取得
connection.query('SELECT * FROM prof_disciplina;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na tabela prof_disciplina: ' + err)
  } else {
    profDisciplinas = results
  }
})
// リスト化
app.get('/prof_disciplinas', (req, res) => {
  res.json(profDisciplinas)
})
// 取得
app.get('/prof_disciplinas/:id_prof_disc', (req, res) => {
  const id_prof_discID = parseInt(req.params.id_prof_disc)
  const profDisciplina = profDisciplinas.find(profDisciplina => profDisciplina.id_prof_disc === id_prof_discID)
  if (profDisciplina) {
    res.json(profDisciplina)
  } else {
    res.status(404).json({ message: 'Não encontrado' })
  }
})
// 追加
app.post('/prof_disciplinas', (req, res) => {
  const newProfDisciplina = req.body
  connection.query(
    'INSERT INTO prof_disciplina (id_prof, id_disciplina) VALUES (?, ?)',
    [newProfDisciplina.id_prof, newProfDisciplina.id_disciplina],
    (err, result) => {
      if (err) {
        console.error('Ocorreu um erro ao adicionar dados ao MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível adicionar prof_disciplina' })
      } else {
        newProfDisciplina.id_prof_disc = result.insertId
        profDisciplinas.push(newProfDisciplina)
        res.status(201).json(newProfDisciplina)
      }
    }
  )
})
// 削除
app.delete('/prof_disciplinas/:id_prof_disc', (req, res) => {
  const id_prof_discID = parseInt(req.params.id_prof_disc)
  const index = profDisciplinas.findIndex(profDisciplina => profDisciplina.id_prof_disc === id_prof_discID)
  if (index !== -1) {
    connection.query('DELETE FROM prof_disciplina WHERE id_prof_disc=?', [id_prof_discID], err => {
      if (err) {
        console.error('tabela prof_disciplina – Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedProfDisciplina = profDisciplinas.splice(index, 1)
        res.json(removedProfDisciplina[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// orgDisciTurmaで使用
// 選択されたTurmaのDisciplinaを取得
app.get('/turmas/:id_turma/disciplinas', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  connection.query(
    'SELECT d.id_disciplina, d.disciplina FROM Disciplina d INNER JOIN Turma_Disciplina td ON d.id_disciplina = td.id_disciplina WHERE td.id_turma = ?',
    [id_turma],
    (err, results) => {
      if (err) {
        console.error('Error fetching Disciplinas:', err)
        res.status(500).json({ message: 'Falha ao obter Disciplinas' })
      } else {
        res.json(results)
      }
    }
  )
})
// 選択されたTurmaのAlunoと複数のDisciplinaの間にNotas_faltasエントリを作成
app.post('/assign-disciplinas', (req, res) => {
  const { id_turma, id_disciplinas, academic_year, semestre } = req.body

  // Turmaに所属する全てのAlunoを取得
  connection.query('SELECT id_aluno FROM Aluno WHERE id_turma = ?', [id_turma], (err, alunos) => {
    if (err) {
      console.error('Error fetching Alunos:', err)
      res.status(500).json({ message: 'Falha ao obter Aluno' })
      return
    }

    // Notas_faltas criar
    const data_matricula = new Date().toISOString().slice(0, 10)

    id_disciplinas.forEach(id_disciplina => {
      alunos.forEach(aluno => {
        connection.query(
          'INSERT INTO Notas_faltas (id_disciplina, id_aluno, academic_year, data_matricula, semestre) VALUES (?, ?, ?, ?, ?)',
          [id_disciplina, aluno.id_aluno, academic_year, data_matricula, semestre],
          err => {
            if (err) {
              console.error('Error creating Notas_faltas entry:', err)
            }
          }
        )
      })
    })

    res.json({ message: 'Aplicado' })
  })
})

//para adaptar apricar faltas
//Pegue toda Turma
app.get('/turmasFaltas', (req, res) => {
  connection.query('SELECT * FROM Turma;', (err, results) => {
    if (err) {
      console.error('Ocorreu erro na tabela Turma: ' + err)
      res.status(500).json({ message: 'Não foi possível obter Turma' })
    } else {
      res.json(results)
    }
  })
})
// Obtenha Disciplinas relacionadas à Turma especificada
app.get('/turma_disciplinas/:id_turma/disciplinas', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  connection.query(
    `SELECT d.id_disciplina, d.disciplina 
     FROM Turma_Disciplina td 
     JOIN Disciplina d ON td.id_disciplina = d.id_disciplina 
     WHERE td.id_turma = ?`,
    [id_turma],
    (err, results) => {
      if (err) {
        console.error('Ocorreu erro na tabela Turma_Disciplina: ' + err)
        res.status(500).json({ message: 'Não foi possível obter Disciplina' })
      } else {
        res.json(results)
      }
    }
  )
})
// notas_faltas Tabela de pesquisa
app.get('/notas_faltasApri', (req, res) => {
  const { turmaId, disciplinaId, year, semestre } = req.query
  connection.query(
    `SELECT nf.id_notas_faltas, nf.faltas, nf.N1, nf.AI, nf.AP, nf.id_aluno, a.nome_aluno, a.foto
     FROM Notas_faltas nf
     JOIN Aluno a ON nf.id_aluno = a.id_aluno
     WHERE nf.id_disciplina = ? AND a.id_turma = ? AND nf.academic_year = ? AND nf.semestre = ?`,
    [disciplinaId, turmaId, year, semestre],
    (err, results) => {
      if (err) {
        console.error('Error fetching notas_faltas:', err)
        res.status(500).json({ message: 'Erro na pesquisa' })
      } else {
        res.json(results)
      }
    }
  )
})
// faltas atualizar
app.put('/notas_faltasApri/faltas', (req, res) => {
  const { ids } = req.body
  const placeholders = ids.map(() => '?').join(',')
  connection.query(
    `UPDATE Notas_faltas SET faltas = faltas + 1 WHERE id_notas_faltas IN (${placeholders})`,
    ids,
    (err, results) => {
      if (err) {
        console.error('Error updating faltas:', err)
        console.log('Conteúdo do erro:' + err)
        res.status(500).json({ success: false, message: 'Não foi possível atualizar' })
      } else {
        res.json({ success: true, message: 'Faltas foi apricada' })
      }
    }
  )
})

///////////////////////////ENVIO DE EMAIL///////////////////////

// Rota para verificar se o email está cadastrado no banco de dados
app.post('/verificarEmail', (req, res) => {
  const { email } = req.body
  const sql = 'SELECT * FROM users WHERE email = ?'
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erro ao consultar email no banco de dados:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
      return
    }

    console.log('Resultados da consulta:', results) // Exibe os resultados da consulta

    // Verificar se o email foi encontrado no banco de dados
    if (results.length > 0) {
      // Email encontrado
      res.json({ message: 'Email cadastrado' })
    } else {
      // Email não encontrado
      res.status(404).json({ message: 'Email não encontrado' })
    }
  })
})
// Rota para enviar o email de redefinição de senha
app.post('/enviarEmailRedefinicao', (req, res) => {
  const { email } = req.body

  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Provedor de email (exemplo: Gmail)
    auth: {
      user: 'teste.pim.uscs@gmail.com', // Seu email
      pass: 'ozpykegrfsynjaxs' // Sua senha do email
    }
  })
  // Consultar o ID do usuário pelo email
  const sqlGetUserId = 'SELECT id FROM users WHERE email = ?'
  connection.query(sqlGetUserId, [email], (err, results) => {
    if (err) {
      console.error('Erro ao consultar ID do usuário no banco de dados:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
      return
    }
    if (results.length === 0) {
      // Usuário com o email fornecido não encontrado
      res.status(404).json({ message: 'Usuário não encontrado com o email fornecido' })
      return
    }
    const userId = results[0].id
    // Gerar token único
    const token = crypto.randomBytes(20).toString('hex') // Token hexadecimal de 40 caracteres
    // Definir data de expiração para 30 minutos a partir de agora
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30)
    // Inserir o token no banco de dados
    const sqlInsertToken = 'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)'
    connection.query(sqlInsertToken, [userId, token, expiresAt], (err, insertResult) => {
      if (err) {
        console.error('Erro ao inserir token no banco de dados:', err)
        res.status(500).send('Erro ao enviar o email de redefinição.')
        return
      }
      // URL da página HTML para redefinir a senha com o token
      const resetPasswordURL = `http://127.0.0.1:5500/reset-password/reset-password.html?token=${token}`

      const mailOptions = {
        from: 'teste.pim.uscs@gmail.com',
        to: email,
        subject: 'Redefinição de Senha',
        html: `
              <p>Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
              <p><a href="${resetPasswordURL}">Redefinir Senha</a></p>
          `
      }
      // Enviar o email de redefinição de senha
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Erro ao enviar o email de redefinição:', error)
          res.status(500).send('Erro ao enviar o email de redefinição.')
        } else {
          console.log('Email enviado:', info.response)
          res.status(200).send('Email enviado com sucesso.')
        }
      })
    })
  })
})
// Rota para redefinir a senha
app.post('/redefinirSenha', (req, res) => {
  const { token, newPassword } = req.body

  // Consultar o token no banco de dados
  const sqlSelectToken = 'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()'
  connection.query(sqlSelectToken, [token], (err, results) => {
    if (err) {
      console.error('Erro ao consultar token no banco de dados:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
      return
    }

    if (results.length === 0) {
      // Token inválido ou expirado
      res.status(400).json({ message: 'Token inválido ou expirado' })
      return
    }
    const tokenInfo = results[0]
    const userId = tokenInfo.user_id
    // Atualizar a senha do usuário
    const sqlUpdatePassword = 'UPDATE users SET password = ? WHERE id = ?'
    connection.query(sqlUpdatePassword, [newPassword, userId], (err, updateResult) => {
      if (err) {
        console.error('Erro ao atualizar a senha no banco de dados:', err)
        res.status(500).json({ message: 'Erro interno do servidor' })
        return
      }
      // Remover o token do banco de dados após usar
      const sqlDeleteToken = 'DELETE FROM password_reset_tokens WHERE id = ?'
      connection.query(sqlDeleteToken, [tokenInfo.id], (err, deleteResult) => {
        if (err) {
          console.error('Erro ao excluir o token do banco de dados:', err)
        }
      })
      res.status(200).json({ message: 'Senha redefinida com sucesso' })
    })
  })
})
/////////////////////////LOGIN//////////////////////////////////
// Rota para autenticação de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  // Verifica se email e senha foram fornecidos
  if (!email || !password) {
    res.status(400).json({ message: 'Email e senha são obrigatórios' })
    return
  }
  // Consulta SQL para verificar as credenciais
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Erro ao executar consulta SQL:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
      return
    }
    // Verifica se encontrou um usuário com as credenciais fornecidas
    if (results.length > 0) {
      // Se as credenciais forem válidas, envia uma resposta de sucesso
      res.status(200).json({ success: true })
    } else {
      // Se as credenciais forem inválidas, envia uma resposta indicando isso
      res.status(401).json({ success: false, message: 'Credenciais inválidas' })
    }
  })
})

app.listen(port, () => {
  console.log(`ポート${port}でサーバーが開始されました / Servidor iniciado na porta ${port}`)
})
