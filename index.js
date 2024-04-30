// Importando módulos
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const multer = require('multer');
const sharp = require('sharp');
const data = require('./data');

// Configurações
const port = 3009;
const app = express();
const date = new Date();
const registeredUsers = [];
let cart = [];

// Função para configurar o servidor
async function setupServer() {

// Configurações da conexão ao banco de dados
const connection = await mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Sam.samela321@',
    database: 'Going',
});

// Configuração do multer para upload de imagens
const storage = multer.memoryStorage(); // Salva a imagem em memória
const upload = multer({ storage });

// Middleware de CORS
const corsOptions = {
    origin: 'http://localhost:3009', // Substitua com a porta do seu cliente
    credentials: true,
};

app.use(cors(corsOptions));

// Configuração do express-session
app.use(session({
    secret: 'woip21b3jv$5c6b3@9#74l8ncpouBbikK',
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal, redireciona para a página de login
app.get('/', (req, res) => {
    res.render('login.ejs');
});

// Rota para adicionar produtos ao carrinho
app.post('/add_to_cart', (req, res) => {
    const { name, price } = req.body;
    const existingProduct = cart.find(product => product.name === name);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    res.sendStatus(200);
});

// Conectar ao banco de dados
try {
    await connection.connect(); // Use .connect() para conectar
    console.log('Conectado ao MySQL!');
} catch (err) {
    console.error('xundaErro ao conectar ao MySQL:', err);
}

// Array para armazenar os produtos
const products = [];

// Rota principal, redireciona para a página de login
app.get('/', (req, res) => {
    res.render('login.ejs');
});


// Rota para categorias
app.get('/tabacaria', (req, res) => {
    const tabacariaProducts = data.products.filter(product => product.category === 'tabacaria');
    res.render('tabacaria.ejs', { tabacaria: tabacariaProducts, products: data.products });
});

app.get('/eletronicos', (req, res) => {
    res.render('eletronicos.ejs');
});

app.get('/acessorios', (req, res) => {
    res.render('acessorios.ejs');
});

app.get('/papelaria', (req, res) => {
    res.render('papelaria.ejs');
});

app.get('/roupas', (req, res) => {
    res.render('roupas.ejs');
});

// Rota para cadastro de produto
app.get('/cadprod', (req, res) => {
    res.render('cadprod.ejs');
});

// Rota para processar o formulário de cadastro de produto
app.post('/submit_product', upload.single('productImage'), async (req, res) => {
    try {
        // Obtenha a imagem do buffer e faça o processamento necessário
        const imageBuffer = req.file.buffer;
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize(1500, 1500)
            .toBuffer();
        const resizedImageBase64 = resizedImageBuffer.toString('base64');

        // Dados do produto do formulário
        const { productName, productDescription, productPrice, productCategory } = req.body;

        // Crie um novo produto com os dados do formulário e a imagem processada
        const newProduct = {
            name: productName,
            description: productDescription,
            price: productPrice,
            category: productCategory,
            image: resizedImageBase64,
        };

        // Adicione o novo produto à lista de produtos
        data.products.push(newProduct);

        // Redirecione para a página de produtos
        res.redirect('/products');
    } catch (error) {
        console.error('Erro ao processar upload:', error);
        res.status(500).send('Erro ao processar upload');
    }
});

// Rota para renderizar a página de produtos
app.get('/products', (req, res) => {
    res.render('products.ejs', { products: data.products });
});

// Rota para renderizar a página inicial
app.get('/index', (req, res) => {
    res.render('index.ejs');
});

// Rota para renderizar a página do carrinho
app.get('/carrinho', (req, res) => {
    res.render('carrinho.ejs', { cart });
});

// Rota para renderizar a página "Sobre"
app.get('/sobre', (req, res) => {
    res.render('sobre.ejs');
});

// Rota para renderizar a página de login
app.get('/login', (req, res) => {
    const loginPage = req.session.login ? 'index' : 'login';
    res.render(loginPage);
});

// Rota para lidar com o POST do formulário de login
app.post('/', (req, res) => {
    const login = 'woip21b3jv$5c6b3@9#74l8ncpouBbikK';
    const password = 'woip21b3jv$5c6b3@9#74l8ncpouBbikK';

    console.log('Received login attempt:', req.body.login);
    console.log('Received password attempt:', req.body.password);

    if (req.body.password === password && req.body.login.toLowerCase() === login.toLowerCase()) {
        req.session.login = login;
        res.render('index.ejs');
    } else {
        res.render('login', { error: "Nome de usuário ou senha incorretos" });
    }
});

// Rota para lidar com o POST do formulário de registro
app.post('/register', (req, res) => {
    const newUsername = req.body.newUsername;

    if (registeredUsers.includes(newUsername)) {
        res.render('login', { error: "Usuário já existe" });
    } else {
        registeredUsers.push(newUsername);
        req.session.login = newUsername;
        res.redirect('/index');
    }
});

// Rota para renderizar a página de edição de produto
app.get('/edit_product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productToEdit = products.find(product => product.id === productId);

    if (!productToEdit) {
        return res.status(404).send('Produto não encontrado');
    }

    res.render('edit_product.ejs', { product: productToEdit });
});

// Rota para lidar com o envio do formulário de edição de produto
app.post('/edit_product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { productName, productDescription, productPrice, productImage, productType } = req.body;

    const updatedProduct = {
        id: productId,
        name: productName,
        description: productDescription,
        price: productPrice,
        image: productImage,
        type: productType,
    };

    const index = products.findIndex(product => product.id === productId);

    if (index === -1) {
        return res.status(404).send('Produto não encontrado');
    }

    products[index] = updatedProduct;

    res.redirect('/products');
});

// Rota para lidar com a exclusão de um produto
app.get('/delete_product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProducts = products.filter(product => product.id !== productId);

    if (products.length === updatedProducts.length) {
        return res.status(404).send('Produto não encontrado');
    }

    products.length = 0;
    Array.prototype.push.apply(products, updatedProducts);

    res.redirect('/products');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log('Servidor iniciado em ' + date);
})};

// Chama a função para configurar o servidor
setupServer();