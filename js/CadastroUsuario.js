const apiUrl = 'http://localhost:3000/usuarios'

document.getElementById('cadastroUsuarioForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const formData = {
      nome_usuario: document.getElementById('nome_usuario').value,
      cpf_usuario: document.getElementById('cpf_usuario').value,
      endereco_usuario: document.getElementById('endereco_usuario').value,
      telefone_usuario: document.getElementById('telefone_usuario').value,
      email_usuario: document.getElementById('email_usuario').value,
      nascimento_usuario: document.getElementById('nascimento_usuario').value,
      senha: document.getElementById('senha').value,
      id_perfil: document.getElementById('id_perfil').value,
      ra_aluno: document.getElementById('ra_aluno').value,
      data_matricula: document.getElementById('data_matricula').value
    };
  
    fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      document.getElementById('cadastroUsuarioForm').reset(); // Limpar o formulário após cadastro
    })
    .catch(error => console.error('Erro ao cadastrar usuário:', error));
  });
  