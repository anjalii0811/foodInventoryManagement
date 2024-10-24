let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
const foodForm = document.getElementById('food-form');
const inventoryDiv = document.getElementById('inventory');
const expiringSoonDiv = document.getElementById('expiring-soon');

foodForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents form from refreshing the page
    
    const name = document.getElementById('food-name').value;
    const quantity = document.getElementById('quantity').value;
    const expirationDate = new Date(document.getElementById('expiration-date').value);
    
    const foodItem = {
        id: Date.now(),
        name: name,
        quantity: quantity,
        expirationDate: expirationDate
    };
    
    inventory.push(foodItem);
    saveToLocalStorage();
    updateInventoryDisplay();
    checkExpiringSoon();
    foodForm.reset();
});

function updateInventoryDisplay() {
    inventoryDiv.innerHTML = '';
    inventory.sort((a, b) => a.expirationDate - b.expirationDate);
    
    inventory.forEach(item => {
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food-item');
        if (new Date(item.expirationDate) < new Date()) {
            foodDiv.classList.add('expired'); // Highlight expired items
        }
        foodDiv.innerHTML = `
            ${item.name} - ${item.quantity} units (Expires: ${new Date(item.expirationDate).toDateString()})
            <button class="edit" onclick="editItem(${item.id})">Edit</button>
            <button class="delete" onclick="deleteItem(${item.id})">Delete</button>
        `;
        inventoryDiv.appendChild(foodDiv);
    });
}

function checkExpiringSoon() {
    const today = new Date();
    expiringSoonDiv.innerHTML = '';

    inventory.forEach(item => {
        const timeDifference = (new Date(item.expirationDate) - today) / (1000 * 3600 * 24);
        
        if (timeDifference <= 3 && timeDifference >= 0) {
            const expiringDiv = document.createElement('div');
            expiringDiv.classList.add('food-item');
            expiringDiv.textContent = `${item.name} (Expires: ${new Date(item.expirationDate).toDateString()})`;
            expiringSoonDiv.appendChild(expiringDiv);
        }
    });
}

function deleteItem(id) {
    inventory = inventory.filter(item => item.id !== id);
    saveToLocalStorage();
    updateInventoryDisplay();
    checkExpiringSoon();
}

function editItem(id) {
    const item = inventory.find(i => i.id === id);
    document.getElementById('food-name').value = item.name;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('expiration-date').value = item.expirationDate.toISOString().split('T')[0];

    deleteItem(id);
}

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

window.onload = function() {
    updateInventoryDisplay();
    checkExpiringSoon();
};
