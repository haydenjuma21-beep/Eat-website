//lets create a place to store cart items
let cart = [];

//Connecting JavaScript to HTML elements (DOM)
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

//Listening for “Add to Cart” clicks
document.querySelectorAll(".add-to-cart")//query finds all elments with add-to-cart 
    .forEach(button => { //loops through all one by one
        //Detecting the click event
        button.addEventListener("click", function () {
            //Finding the correct food item
            const card = this.closest(".card");
            //Reading food data (name & price)
            const item = card.querySelector(".food-item");

            const name = item.dataset.name;
            const price = parseInt(item.dataset.price);

            //adds item into the cart
            cart.push({ name, price });
            updateCart();
        });
    });

//updates carts display in ui
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";
        li.innerHTML = `
            ${item.name}
            <span>Ksh ${item.price}</span>
        `;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = `Total: Ksh ${total}`;
    checkoutBtn.disabled = cart.length === 0;
}


checkoutBtn.addEventListener("click", () => {
    const phone = prompt("Enter your M-Pesa phone number (07XXXXXXXX)");

    if (!phone) {
        alert("Phone number is required");
        return;
    }

    const orderData = {
        phone: phone,
        items: cart
    };

    fetch("php/stkpush.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => {
            console.error(err);
            alert("Payment failed");
        });
});
