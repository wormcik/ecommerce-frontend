API_URL = window.location.origin.includes("localhost")
  ? "http://localhost:3000/api"
  : "https://ecommerce-backend-x6ce.onrender.com/api";


let allItems = [];

function goToHomePage() {
    window.location.href = 'index.html'; 
}

document.addEventListener("DOMContentLoaded", () => {
    fetchItems();
});

async function fetchItems() {
    try {
        const res = await fetch(`${API_URL}/items`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        allItems = await res.json(); 
        showTabItem('all');
    } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to load items. Please try again later.");
    }
}

function showTabItem(category) {
    const categoryContainer = document.getElementById(category);
    if (!categoryContainer) {
        console.error(`Category container with id '${category}' not found.`);
        return;
    }

    document.querySelectorAll('.tabItem-content').forEach(tab => {
        tab.style.display = 'none';
    });

    categoryContainer.style.display = 'block';

    document.querySelectorAll('.category-container .category-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.category-container .category-button[onclick="showTabItem('${category}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    filterItems(category);
}

function filterItems(category) {
    const container = document.getElementById("items-container");
    container.innerHTML = '';
    const filteredItems = category === 'all' ? allItems : allItems.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.classList.add("item-card");
        itemCard.onclick = () => showItemDetails(item._id);

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

        itemCard.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Price: $${item.price}</p>
            <p>Seller: ${item.seller}</p>
            <img src="${item.image}" alt="${item.name}" width="100">
            ${additionalDetails}
            <p>Rating: ${item.rating || 'Not rated yet'}</p>
            <p>Reviews: ${item.reviews ? item.reviews.length : 0} reviews</p>
        `;

        container.appendChild(itemCard);
    });
}

function showItemDetails(itemId) {
    const item = allItems.find(i => i._id === itemId);
    if (!item) return;
    
    currentItem = item;

    document.getElementById("modalItemName").textContent = item.name;
    document.getElementById("modalItemDescription").textContent = item.description;
    document.getElementById("modalItemPrice").textContent = `Price: $${item.price}`;
    document.getElementById("modalItemSeller").textContent = `Seller: ${item.seller}`;
    document.getElementById("modalItemImage").src = item.image;

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
    document.getElementById("modalItemAdditionalDetails").innerHTML = additionalDetails;

    document.getElementById("modalItemRating").textContent = item.rating || 'Not rated yet';
    const avgRating = item.rating || 0;
    document.getElementById("modalItemRatingStars").innerHTML = getStarRating(avgRating);
    document.getElementById("modalItemReviewsCount").textContent = item.reviews ? item.reviews.length : 0;

    const reviewsContainer = document.getElementById("modalItemReviews");
    reviewsContainer.innerHTML = '';

    if (item.reviews && item.reviews.length > 0) {
        item.reviews.forEach(review => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");
            reviewElement.setAttribute("rating", review.rating);
            reviewElement.innerHTML = `
                <p>Rating: ${review.rating}</p>
                <p>Review: ${review.review}</p>
                <p>Date: ${new Date(review.date).toLocaleString()}</p>
                <hr>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    } else {
        reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    }

    const user_id = window.localStorage.getItem("_id");
    const existingReview = item.reviews ? item.reviews.find(review => review.userId.toString() === user_id.toString()) : null;

    document.getElementById("ratingInput").value = existingReview ? existingReview.rating : '';
    document.getElementById("reviewInput").value = existingReview ? existingReview.review : '';
    setRating(existingReview ? existingReview.rating : 0);

    document.getElementById("itemModal").style.display = "block";
}


function closeModal() {
    document.getElementById("itemModal").style.display = "none";
}

function createStarRating() {
    const starContainer = document.getElementById("starRatingContainer");
    starContainer.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        let star = document.createElement("span");
        star.innerHTML = "\u2605";
        star.classList.add("star");
        star.dataset.value = i;
        star.addEventListener("click", function() {
            setRating(i);
        });
        starContainer.appendChild(star);
    }
}

function setRating(value) {
    document.getElementById("ratingInput").value = value;
    const stars = document.querySelectorAll(".star");
    stars.forEach(star => {
        if (parseInt(star.dataset.value) <= value) {
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }
    });
}

document.addEventListener("DOMContentLoaded", createStarRating);


async function submitRatingAndReview() {
    const rating = parseInt(document.getElementById("ratingInput").value);
    const reviewText = document.getElementById("reviewInput").value;

    if (rating < 1 || rating > 10) {
        alert("Please enter a valid rating between 1 and 10.");
        return;
    }

    if (!reviewText) {
        alert("Please enter a review.");
        return;
    }

    const item_id = currentItem._id;
    const user_id = window.localStorage.getItem("_id");

    try {
        const res = await fetch(`${API_URL}/rate`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, review: reviewText, item_id, user_id })
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        await fetchItems();
        closeModal();
        showTabItem(currentItem.category);
        filterItems(currentItem.category);

    } catch (error) {
        console.error("Error submitting rating and review:", error);
        alert("Failed to submit rating and review. Please try again later.");
    }
}

function getStarRating(rating) {
    const fullStar = "★"; 
    const emptyStar = "☆"; 
    const maxStars = 10; 

    let starRating = "";
    const filledStars = Math.round(rating); 

    for (let i = 1; i <= maxStars; i++) {
        starRating += i <= filledStars ? fullStar : emptyStar;
    }

    return starRating;
}