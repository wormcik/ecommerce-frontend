API_URL = window.location.origin.includes("localhost")
  ? "http://localhost:3000/api"
  : "https://ecommerce-backend-x6ce.onrender.com/api";

function goToHomePage() {
    window.location.href = 'index.html'; 
}

function showTabItem(category) {
    document.querySelectorAll('.tabItem-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.getElementById(category).style.display = 'block';

    document.querySelectorAll('.tabsItem .tabItem-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.tabsItem .tabItem-button[onclick="showTabItem('${category}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    filterItems(category);
}
   

function updateFormFields() {
    const category = document.getElementById("category").value;

    document.querySelectorAll('.dynamic-field').forEach(field => field.style.display = 'none');

    switch (category) {
        case 'vinyls':
            document.getElementById('vinylsFields').style.display = 'block';
            break;
        case 'furniture':
            document.getElementById('furnitureFields').style.display = 'block';
            break;
        case 'watches':
            document.getElementById('watchesFields').style.display = 'block';
            break;
        case 'shoes':
            document.getElementById('shoesFields').style.display = 'block';
            break;
        case 'books':
            document.getElementById('booksFields').style.display = 'block';
            break;
        default:
            break;
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.getElementById(tabName).style.display = 'block';

    document.querySelectorAll('.tabs .tab-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.tabs .tab-button[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

}

async function removeItem(_id) {
    const confirmation = confirm("Are you sure you want to remove this item?");
    if (confirmation) {
        try {
            const res = await fetch(`${API_URL}/items/${_id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchItems(); 
            } else {
                alert("Failed to remove item.");
            }
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Error removing item. Please try again later.");
        }
    }
}

async function removeUser(_id) {
    const confirmation = confirm("Are you sure you want to remove this user?");
    if (confirmation) {
        try {
            const res = await fetch(`${API_URL}/users/${_id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchUsers();  
            } else {
                alert("Failed to remove user.");
            }
        } catch (error) {
            console.error("Error removing user:", error);
            alert("Error removing user. Please try again later.");
        }
    }
}
let allItems = [];

function filterItems(category) {
    const itemList = document.getElementById(category === 'all' ? 'itemList' : `${category}List`);
    if (!itemList) return;

    itemList.innerHTML = ''; 

    const filteredItems = category === 'all' ? allItems : allItems.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('item');

        let additionalDetails = '';
        switch (item.category) {
            case 'vinyls':
                additionalDetails = `<p>Age: ${item.age || ''}</p>`;
                break;
            case 'furniture':
                additionalDetails = `<p>Material: ${item.material || ''}</p>`;
                break;
            case 'watches':
                additionalDetails = `<p>Battery Life (days): ${item.batteryLife || ''}</p>`;
                break;
            case 'shoes':
                additionalDetails = `<p>Size: ${item.size || ''}</p>`;
                break;
            case 'books':
                additionalDetails = `<p>Author: ${item.author || ''}</p>`;
                break;
        }

        li.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Price: $${item.price}</p>
            <p>Seller: ${item.seller}</p>
            <img src="${item.image}" alt="${item.name}" width="100">
            ${additionalDetails}
            <p>Rating: ${item.rating ? `⭐ ${item.rating}/10` : 'Not rated yet'}</p>
            <p>Reviews: ${item.reviews ? item.reviews.length : 0} reviews</p>
            <ul>
            ${item.reviews
                ? item.reviews
                    .map(
                    (review) => `
                    <li>
                    <strong>User:</strong> ${review.userId} <br>
                    <strong>Rating:</strong> ⭐ ${review.rating}/10 <br>
                    <strong>Review:</strong> ${review.review} <br>
                    <strong>Date:</strong> ${new Date(review.date).toLocaleString()}
                    </li>`
                    )
                    .join('')
                : '<li>No reviews yet.</li>'}
            </ul>
            <button class="remove" onclick="removeItem('${item._id}')">Remove Item</button>
        `;

        itemList.appendChild(li);
    });
}


// Item Fetch
async function fetchItems() {
    try {
        const res = await fetch(`${API_URL}/items`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        allItems = await res.json(); 
        filterItems('all'); 
    } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to load items. Please try again later.");
    }
}

// User Fetch
async function fetchUsers() {
    userList.innerHTML = '';
    const res = await fetch(`${API_URL}/users`);
    const items = await res.json();

    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${item.username}</h3>
            <p>${item.role}</p>
            <button class="remove" onclick="removeUser('${item._id}')">Remove User</button>
        `;
        userList.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('addItemForm');
    const addUserForm = document.getElementById('addUserForm');
    showTab('items');
    showTabItem('all')
    document.addEventListener("DOMContentLoaded", updateFormFields);
    
    // Item Add
    if (addItemForm) {
        addItemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const name = document.getElementById('name').value;
            const category = document.getElementById('category').value;
            const description = document.getElementById('description').value;
            const price = parseFloat(document.getElementById('price').value);
            const seller = document.getElementById('seller').value;
            const image = document.getElementById('image').value;
    
            let age = null;
            let material = null;
            let batteryLife = null;
            let size = null;
            let author = null;
    
            if (category === 'vinyls' || category === 'furniture') {
                age = parseInt(document.getElementById('age').value);
            }
    
            if (category === 'furniture' ) {
                material = document.getElementById('material').value;
            }
    
            if (category === 'watches') {
                batteryLife =  document.getElementById('batteryLife').value;
            }
    
            if (category === 'shoes') {
                size = parseInt(document.getElementById('size').value);
            }

            if (category === 'books') {
                author = document.getElementById('author').value;
            }

            const newItem = { 
                name, 
                category, 
                description, 
                price, 
                seller, 
                image,
                age,
                material,
                batteryLife,
                author,
                size
            };
    
            const res = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
    
            if (res.ok) {
                addItemForm.reset();
                updateFormFields(); 
                fetchItems();
            } else {
                alert("Error adding item!");
            }
        });
    }

    // User Add
    if (addUserForm) {
        addUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            const newUser = { username, password, role };
            console.log(newUser);
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                addUserForm.reset();
                fetchUsers();
            } else {
                alert("Kullanıcı eklenirken hata oluştu!");
            }
        });
    }
    fetchItems();
    fetchUsers();
});
