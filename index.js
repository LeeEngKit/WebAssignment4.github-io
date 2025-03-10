let currentMode = 'register';  // start in register mode

function switchForm(mode) {
    currentMode = mode;
    if (mode === 'login') {
        document.getElementById('formTitle').textContent = 'Login';
        document.querySelectorAll('.register-only').forEach(el => el.style.display = 'none');
    } else {
        document.getElementById('formTitle').textContent = 'Register';
        document.querySelectorAll('.register-only').forEach(el => el.style.display = 'block');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();  // stop actual form submission

    let name = document.getElementById('inputname').value.trim();
    let email = document.getElementById('inputemail').value.trim();
    let gender = document.querySelector('input[name="gender"]:checked');

    if (currentMode === 'register') {
        if (name === "" || email === "" || !gender) {
            alert("Please fill all fields for registration.");
            return false;
        }
        if (!validateEmail(email)) {
            alert("Invalid email format.");
            return false;
        }

        localStorage.setItem('inputname', name);
        localStorage.setItem('inputemail', email);
        localStorage.setItem('gender', gender.value);
        alert("Registered Successfully!");
    } 
    else if (currentMode === 'login') {
        if (email === "") {
            alert("Please enter your email for login.");
            return false;
        }

        let storedEmail = localStorage.getItem('inputemail');
        if (email !== storedEmail) {
            alert("User not found or incorrect email.");
            return false;
        }

        alert("Login Successful!");
    }

    window.location.href = "success.html";
    return false;
}

function validateEmail(email) {
    const at = email.indexOf("@");
    const dot = email.lastIndexOf(".");
    return at > 0 && dot > at + 1 && dot < email.length - 1;
}

function showSuccess() {
    let name = localStorage.getItem('inputname');
    document.getElementById('message').innerHTML = name ? `Welcome back, ${name}!` : "Login Success!";
}

let item = [
    {
        name:"HP lapTop 1",
        pic:"621bbe3e4131d20e3bbaeb7868578204",
        price:2300.00,
        id:0,
    },
    {
        name:"HP lapTop 2",
        pic:"c06588610",
        price:3300.00,
        id:1,
    },
    {
        name:"HP lapTop 3",
        pic:"images (1)",
        price:2500.00,
        id:2,
    },
    {
        name:"HP lapTop 4",
        pic:"images",
        price:3500.00,
        id:3,
    },
    {
        name:"HP lapTop 5",
        pic:"mhm",
        price:2300.00,
        id:5,
    },
    {
        name:"HP lapTop 6",
        pic:"SP41HP_Front Right View",
        price:3300.00,
        id:6,
    },
    {
        name:"HP lapTop 7",
        pic:"SP40BL_1",
        price:2500.00,
        id:7,
    },
    {
        name:"HP lapTop 8",
        pic:"MF50AL",
        price:3500.00,
        id:8,
    },
    
]

function indexdisplay() {
    let productlist = document.getElementById("indexproduct");
    let htmltag = "";
    item.forEach((item, i) => {
        htmltag = "<div class = 'col-lg-3'><div class = 'card'> <div class = 'card-header'> <img class = 'image' src = 'image/" + item.pic +
            ".jpg' alt = ''> </div><div class = 'card-body'><h4 class = 'card-title'>Brand : " + item.name +
            "</h4> <h4 class = 'card-text'> Price = " + item.price +
            "</h4> <a href = '#' class = 'btn btn-danger add-to-cart' data-index='" + i + "'>Add To Cart</a></div> </div></div>";
        productlist.innerHTML += htmltag; // add separate card for each
    });

    addtocartbtn = document.querySelectorAll('.add-to-cart');
    // Add event listener to add cart button
    for (let i = 0; i < addtocartbtn.length; i++) {
        // Add event listener for each button
        addtocartbtn[i].addEventListener('click', (event) => {
            let itemIndex = event.target.getAttribute('data-index');
            additem(itemIndex);
        });
    }
}

let itemincart = []; // Declare an array to keep item in cart

function additem(i) {
    let itemindex = localStorage.getItem('cartnumber');
    itemindex = parseInt(itemindex);

    if (itemindex) {
        // Get existing items in the cart
        itemincart = JSON.parse(localStorage.getItem('lsitemincart') || '[]');
        itemincart.push(item[i]);
        itemindex++;
        localStorage.setItem('lsitemincart', JSON.stringify(itemincart)); // Store object using JS inside localStorage
        localStorage.setItem('cartnumber', itemindex);
        cartdisplay();
    } else {
        // First item in cart
        itemincart[0] = item[i];
        localStorage.setItem('lsitemincart', JSON.stringify(itemincart));
        localStorage.setItem('cartnumber', 1);
        cartdisplay();
    }
}

function cartdisplay() {
    let cart = localStorage.getItem('cartnumber');
    cart = parseInt(cart);

    if (cart) {
        document.getElementById('cartdisplay').textContent = cart;
    } else {
        document.getElementById('cartdisplay').textContent = 0;
    }
}

// Maintain the cart number when reloading the page
window.addEventListener('load', () => {
    cartdisplay();
});

function cartpagedisplay() {
    let cartitems = localStorage.getItem('lsitemincart');
    cartitems = JSON.parse(cartitems);
    let productcontainer = document.querySelector(".product-container");

    if (cartitems && productcontainer) {
        let totalprice = 0;
        productcontainer.innerHTML = ''; // Clear previous cart content
        cartitems.forEach((item, i) => {
            let htm = "<div class = 'col-3'><img class='img-cart' src='image/" + item.pic + ".jpg'></img></div>" +
                "<div class='col-3'><p>" + item.name + "</p></div>" +
                "<div class='col-3'>" + item.price + "</div>" +
                "<div class='col-3'><a class='btn btn-dark delbtn' data-index='" + i + "'>Delete</a></div><br><hr>";
            productcontainer.innerHTML += htm;
            totalprice += item.price;
        });
        document.getElementById('totalprice').innerHTML = totalprice;
        localStorage.setItem('totalprice', totalprice);

        if (cartitems.length == 0) {
            document.getElementById("plobtn").style.visibility = 'hidden';
        }

        // Attach event listeners for delete buttons after the HTML is updated
        let delbtn = document.querySelectorAll('.delbtn');
        delbtn.forEach((button) => {
            button.addEventListener('click', (event) => {
                let itemIndex = event.target.getAttribute('data-index');
                removeitem(itemIndex);
            });
        });
    }
}

function removeitem(i) {
    let cartitems = localStorage.getItem('lsitemincart');
    cartitems = JSON.parse(cartitems);
    cartitems.splice(i, 1); // Delete array element using splice

    // Recalculate total price
    let totalprice = 0;
    cartitems.forEach((item) => {
        totalprice += item.price;
    });

    localStorage.setItem("totalprice", totalprice);
    localStorage.setItem("lsitemincart", JSON.stringify(cartitems));
    localStorage.setItem("cartnumber", cartitems.length);
    cartpagedisplay(); // Update cart display after removing item
}
