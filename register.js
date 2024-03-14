// register.js

function registerUser() {
    var newUsername = document.getElementById('newUsername').value;
    var newPassword = document.getElementById('newPassword').value;

    // Adicione aqui a lógica para enviar as informações ao servidor para criar uma conta
    // Você pode usar uma biblioteca como axios ou fetch para fazer uma chamada ao servidor.

    // Exemplo usando fetch
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newUsername: newUsername,
            newPassword: newPassword,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data);
        // Lógica adicional, se necessário
    })
    .catch(error => {
        console.error('Erro durante o registro:', error);
        alert('Erro durante o registro. Tente novamente.');
    });

    // Retorna false para impedir o envio do formulário tradicional
    return false;
}

// Adicione um evento de clique ao botão de registro
document.getElementById('registerButton').addEventListener('click', registerUser);
