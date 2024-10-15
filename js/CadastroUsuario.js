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
  


  // Função para buscar e exibir usuários cadastrados
function carregarUsuarios() {
  fetch('http://localhost:3000/usuarios')
    .then(response => response.json())
    .then(usuarios => {
      const usuariosTableBody = document.getElementById('usuariosTableBody');
      usuariosTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

      usuarios.forEach(usuario => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${usuario.id_usuario}</td>
          <td>${usuario.nome_usuario}</td>
          <td>${usuario.cpf_usuario}</td>
          <td>${usuario.email_usuario}</td>
           <td>${usuario.telefone_usuario}</td>
           
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id_usuario})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deletarUsuario(${usuario.id_usuario})">Deletar</button>
          </td>
        `;

        usuariosTableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Erro ao carregar usuários:', error));
}

// Chama a função para carregar os usuários assim que a página for carregada
window.onload = carregarUsuarios;


function deletarUsuario(id_usuario) {
  if (confirm('Tem certeza que deseja deletar este usuário?')) {
    fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        carregarUsuarios(); // Atualiza a lista de usuários após a exclusão
      })
      .catch(error => console.error('Erro ao deletar usuário:', error));
  }
}
function editarUsuario(id_usuario) {
  fetch(`http://localhost:3000/usuarios/${id_usuario}`)
    .then(response => response.json())
    .then(usuario => {
      // Preenche o formulário com os dados do usuário
      document.getElementById('nome_usuario').value = usuario.nome_usuario;
      document.getElementById('cpf_usuario').value = usuario.cpf_usuario;
      document.getElementById('endereco_usuario').value = usuario.endereco_usuario;
      document.getElementById('telefone_usuario').value = usuario.telefone_usuario;
      document.getElementById('email_usuario').value = usuario.email_usuario;
      document.getElementById('nascimento_usuario').value = usuario.nascimento_usuario;
      document.getElementById('senha').value = ''; // Senha não pode ser preenchida automaticamente
      document.getElementById('id_perfil').value = usuario.id_perfil;

      // Atualiza o comportamento do botão de enviar para atualizar o usuário
      document.getElementById('cadastroUsuarioForm').onsubmit = function (event) {
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

        fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            document.getElementById('cadastroUsuarioForm').reset();
            carregarUsuarios(); // Atualiza a lista de usuários
            // Reseta o formulário para cadastro normal
            document.getElementById('cadastroUsuarioForm').onsubmit = cadastrarUsuario;
          })
          .catch(error => console.error('Erro ao atualizar usuário:', error));
      };
    })
    .catch(error => console.error('Erro ao buscar usuário:', error));
}
