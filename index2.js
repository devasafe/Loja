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
    await connection.connect();
    console.log('Conectado ao MySQL!');
} catch (err) {
    console.error('Erro ao conectar ao MySQL:', err);
}


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

// Iniciando o servidor
app.listen(port, () => {
    console.log('Servidor iniciado em ' + date);
});
