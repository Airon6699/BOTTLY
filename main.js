document.addEventListener("DOMContentLoaded", () => {
    const productsBox = document.querySelector(".products");
    const products = [...document.querySelectorAll(".product")];
    const categoryButtons = document.querySelectorAll(".category-btn");
    const searchBox = document.querySelector(".search-box");
    const searchInput = document.querySelector("#search");
    const searchOpen = document.querySelector(".search-open");
    const searchClose = document.querySelector(".search-close");
    const sort = document.querySelector("#sort");
    const hearts = document.querySelectorAll(".heart");
    const favoriteCount = document.querySelector(".favorite-count");
    const cart = document.querySelector(".cart");
    const cartOpen = document.querySelector(".cart-open");
    const cartClose = document.querySelector(".cart-close");
    const overlay = document.querySelector(".overlay");
    const cartItems = document.querySelector(".cart-items");
    const cartCount = document.querySelector(".cart-count");
    const total = document.querySelector(".total");
    const cartEmpty = document.querySelector(".cart-empty");
    const checkout = document.querySelector(".checkout");
    const modal = document.querySelector(".product-modal");
    const modalClose = document.querySelector(".modal-close");
    const modalImg = document.querySelector("#modal-img");
    const modalType = document.querySelector("#modal-type");
    const modalName = document.querySelector("#modal-name");
    const modalDesc = document.querySelector("#modal-desc");
    const modalPrice = document.querySelector("#modal-price");
    const modalAdd = document.querySelector("#modal-add");
    const questions = document.querySelectorAll(".question");
    const newsletter = document.querySelector("#newsletter");

    let activeCategory = "all";
    let favorites = 0;
    let bag = [];
    let currentProduct = null;

    searchOpen.addEventListener("click", () => {
        searchBox.classList.add("active");
        searchInput.focus();
    });

    searchClose.addEventListener("click", () => {
        searchBox.classList.remove("active");
    });

    searchInput.addEventListener("input", filterProducts);

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            activeCategory = button.dataset.type;
            filterProducts();
        });
    });

    sort.addEventListener("change", () => {
        const value = sort.value;
        const sorted = [...products];

        if (value === "low") {
            sorted.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
        }

        if (value === "high") {
            sorted.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
        }

        if (value === "name") {
            sorted.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
        }

        sorted.forEach(product => productsBox.appendChild(product));
    });

    function filterProducts() {
        const search = searchInput.value.toLowerCase().trim();
        let visible = 0;

        products.forEach(product => {
            const type = product.dataset.type;
            const name = product.dataset.name.toLowerCase();

            const categoryMatch =
                activeCategory === "all" || type === activeCategory;

            const searchMatch =
                name.includes(search) ||
                type.includes(search);

            if (categoryMatch && searchMatch) {
                product.style.display = "block";
                visible++;
            } else {
                product.style.display = "none";
            }
        });

        document.querySelector(".empty").style.display =
            visible === 0 ? "block" : "none";
    }

    hearts.forEach(heart => {
        heart.addEventListener("click", event => {
            event.stopPropagation();

            heart.classList.toggle("active");

            if (heart.classList.contains("active")) {
                heart.textContent = "♥";
                favorites++;
            } else {
                heart.textContent = "♡";
                favorites--;
            }

            favoriteCount.textContent = favorites;
        });
    });

    document.querySelectorAll(".product-img").forEach(image => {
        image.addEventListener("click", event => {
            if (event.target.classList.contains("heart")) return;

            const product = image.closest(".product");
            openModal(product);
        });
    });

    function openModal(product) {
        currentProduct = product;

        modalImg.src = product.querySelector("img").src;
        modalImg.alt = product.dataset.name;
        modalType.textContent = product.querySelector(".product-info > span").textContent;
        modalName.textContent = product.dataset.name;
        modalDesc.textContent = product.querySelector(".product-info p").textContent;
        modalPrice.textContent = "$" + product.dataset.price;

        modal.classList.add("active");
        document.body.classList.add("lock");
    }

    modalClose.addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove("active");
        document.body.classList.remove("lock");
    }

    document.querySelectorAll(".add").forEach(button => {
        button.addEventListener("click", event => {
            event.stopPropagation();

            const product = button.closest(".product");
            addToBag(product);

            button.textContent = "Added ✓";

            setTimeout(() => {
                button.textContent = "Add to bag";
            }, 1000);
        });
    });

    modalAdd.addEventListener("click", () => {
        if (currentProduct) {
            addToBag(currentProduct);
            closeModal();
            openCart();
        }
    });

    function addToBag(product) {
        const name = product.dataset.name;
        const existing = bag.find(item => item.name === name);

        if (existing) {
            existing.quantity++;
        } else {
            bag.push({
                name: name,
                price: Number(product.dataset.price),
                image: product.querySelector("img").src,
                quantity: 1
            });
        }

        renderBag();
    }

    function renderBag() {
        cartItems.innerHTML = "";


        bag.forEach((item, index) => {
            items += item.quantity;
            price += item.price * item.quantity;

            const element = document.createElement("div");
            element.className = "cart-item";

            element.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <button class="remove" data-index="${index}">×</button>
            `;

            cartItems.appendChild(element);
        });

        cartCount.textContent = items;
        total.textContent = "$" + price.toFixed(2);

        cartEmpty.style.display = bag.length ? "none" : "flex";

        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                if (bag[index].quantity > 1) {
                    bag[index].quantity--;
                } else {
                    bag.splice(index, 1);
                }

                renderBag();
            });
        });
    }

    cartOpen.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);

    overlay.addEventListener("click", closeCart);

    function openCart() {
        cart.classList.add("active");
        overlay.classList.add("active");
        document.body.classList.add("lock");
    }

    function closeCart() {
        cart.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("lock");
    }

    checkout.addEventListener("click", () => {
        if (!bag.length) {
            alert("Your bag is empty.");
            return;
        }

        alert("Demo checkout — your order has been prepared.");
    });

    questions.forEach(question => {
        const button = question.querySelector("button");

        button.addEventListener("click", () => {
            questions.forEach(item => {
                if (item !== question) {
                    item.classList.remove("active");
                    item.querySelector("button span").textContent = "+";
                }
            });

            question.classList.toggle("active");

            question.querySelector("button span").textContent =
                question.classList.contains("active") ? "−" : "+";
        });
    });

    newsletter.addEventListener("submit", event => {
        event.preventDefault();

        const button = newsletter.querySelector("button");
        const input = newsletter.querySelector("input");

        button.innerHTML = "Joined ✓";
        input.value = "";

        setTimeout(() => {
            button.innerHTML = 'Join <span>→</span>';
        }, 1800);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeCart();
            closeModal();
            searchBox.classList.remove("active");
        }
    });
});