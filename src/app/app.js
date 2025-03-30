
const productList = document.getElementById("product-list");

async function fetchProducts() {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    renderProducts(products);
}

function renderProducts(products) {
    productList.innerHTML = "";
    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-text">
                <span>${product.title}</span>
                <p>price: <span>$${product.price}</span></p>
                <div class="quantity-text">
                    <input type="number" class="quantity" min="0" value="0" data-id="${product.id}">
                    <button class="remove-btn" data-id="${product.id}">remove</button>
                </div>
            </div>
        `;
        productList.appendChild(div);
    });
}

fetchProducts();