
const numProductsIncreaseShip = 4;
const minShip = 5;
const maxShip = 15;

document.addEventListener("DOMContentLoaded", function() {

    const productList = document.getElementById("product-list");
    let cart = loadCart();

    async function fetchProducts() {
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();
        renderProducts(products);
    }
    
    function renderProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            let item = cart.find(item => item.id == product.id);
            let quantity = item ? item.quantity : 0;

            const div = document.createElement("div");
            div.classList.add("product");
            div.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-text">
                    <span>${product.title}</span>
                    <p>price: <span>${product.price}</span></p>
                    <div class="quantity-text">
                        <input type="number" class="quantity" min="0" value="${quantity}" data-id="${product.id}">
                        <button class="remove-btn" data-id="${product.id}">remove</button>
                    </div>
                </div>
            `;
            productList.appendChild(div);
        });

        document.querySelectorAll(".quantity").forEach(input => {
            input.addEventListener("change", updateCart);
        });

        function updateCart(event) {
            const productId = event.target.dataset.id;
            const quantity = parseInt(event.target.value);
            
            if (quantity < 1) {
                removeFromCart(event);
                return;
            }
    
            let item = cart.find(item => item.id == productId);
            if (item) {
                item.quantity = quantity;
            } else {
                cart.push({ id: productId, quantity });
            }
    
            saveCart(cart);
            updateSummary();
        }

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", removeFromCart);
        }); 

        function removeFromCart(event) {
            const productId = event.target.dataset.id;
            cart = cart.filter(item => item.id != productId);
            saveCart(cart);
            fetchProducts();
            updateSummary();
        }
    }

    function loadCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateSummary() {
        let totalPrice = cart.reduce((sum, product) => sum + (product.quantity * product.price), 0);
        let cartLength = 0;
        cart.forEach(item => {
            cartLength += item.quantity;
        });
        let shipping = cartLength > numProductsIncreaseShip ? maxShip : minShip;
        let finalTotal = totalPrice + shipping;

        document.getElementById("total-price").textContent = `${totalPrice}`;
        document.getElementById("shipping").textContent = `${shipping}`;
        document.getElementById("final-total").textContent = `${finalTotal}`;
    }


    fetchProducts();
    updateSummary();
});


