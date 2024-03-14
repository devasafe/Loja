// script.js

// Lista de produtos simulada (pode ser substituída por uma chamada à API)
const products = [
    { id: 1, name: "Produto 1", price: 19.99 },
    { id: 2, name: "Produto 2", price: 29.99 },
    // Adicione mais produtos conforme necessário
];

// Carrinho de compras
let cart = [];

// Adicione esta função ao seu script.js
function addToCart(name, price) {
    // Verifique se o produto já está no carrinho
    const existingProduct = cart.find(product => product.name === name);

    if (existingProduct) {
        // Se o produto já está no carrinho, apenas aumente a quantidade
        existingProduct.quantity++;
    } else {
        // Se o produto não está no carrinho, adicione-o com quantidade 1
        cart.push({ name, price, quantity: 1 });
    }

    // Log para verificar o carrinho
    console.log('Carrinho atualizado:', cart);

    // Atualize a interface do carrinho
    updateCartUI();
}

// Função para atualizar a interface do carrinho
function updateCartUI() {
    // Esta é uma função de exemplo; você pode personalizá-la conforme necessário
    const cartElement = document.getElementById("cart");
    if (cartElement) {
        cartElement.innerHTML = "<h2>Carrinho de Compras</h2>";

        if (cart.length === 0) {
            cartElement.innerHTML += "<p>O carrinho está vazio.</p>";
        } else {
            cart.forEach(item => {
                cartElement.innerHTML += `<p>${item.name} - Quantidade: ${item.quantity} - Preço: ${(item.price * item.quantity).toFixed(2)}</p>`;
            });

            const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
            cartElement.innerHTML += `<p>Total: ${totalPrice}</p>`;
        }
    }
}

// Função para abrir o popup
function openPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "block";
}

// Função para fechar o popup e redirecionar para a página desejada
function closePopup(redirect) {
    const popup = document.getElementById("popup");
    popup.style.display = "none";

    if (redirect) {
        window.location.href = redirect;
    }
}
