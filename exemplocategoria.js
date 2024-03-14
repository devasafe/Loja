//Rota para mostrar produtos de uma categoria específica
app.get('/tabacaria/:tabacaria', (req, res) => {
    const categoryName = req.params.categoryName;
    const categoryProducts = products.filter(product => product.category === categoryName);
    res.render('tabacaria.ejs', { categoryProducts, categoryName });
});

//* Exemplo de página category.ejs
<!-- category.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- restante do cabeçalho -->
</head>
<body>
    <header>
        <!-- cabeçalho -->
    </header>
    <div class="container">
        <h2><%= categoryName %> - Produtos</h2>
        <ul>
            <% categoryProducts.forEach(product => { %>
                <li><%= product.name %> - <%= product.price %></li>
            <% }); %>
        </ul>
    </div>
    <a href="/index" class="back">Back</a>
    <h2>ola</h2>
    <!-- restante do corpo -->
    <footer>
        <p>&copy; 2024 GOING. All rights reserved.</p>
    </footer>
</body>
</html>
