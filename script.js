const form = document.getElementById('my-form');
const itemList = document.getElementById('items');
const msg = document.querySelector('.msg');

form.addEventListener('submit', addItem);

function addItem(e) {
    e.preventDefault();

    const newItem = document.getElementById('ItemName');
    const newDescription = document.getElementById('Description');
    const newPrice = document.getElementById('Price');
    const newQuantity = document.getElementById('Quantity');

    if (newItem.value === '' || newDescription.value === '' || newPrice.value === '' || newQuantity.value === '') {
        msg.classList.add('error');
        msg.textContent = 'Please enter all fields';

        setTimeout(() => {
            msg.classList.remove('error');
            msg.textContent = '';
        }, 3000);
    } else {
        const newEntity = {
            ItemName: newItem.value,
            Description: newDescription.value,
            Price: newPrice.value,
            Quantity: newQuantity.value
        };

        axios.post("https://crudcrud.com/api/3310d6441888477a91278e09d5c38154/addItems", newEntity)
            .then(response => {
                const newItemData = response.data;
                showNewUserOnScreen(newItemData);
                clearFormFields();
            })
            .catch(err => {
                console.error(err);
            });
    }
}

function clearFormFields() {
    document.getElementById('ItemName').value = '';
    document.getElementById('Description').value = '';
    document.getElementById('Price').value = '';
    document.getElementById('Quantity').value = '';
}

function showNewUserOnScreen(item) {
    const li = document.createElement('li');
    li.dataset.id = item._id;
    li.className = "list-group-item";

    const labelItemName = document.createElement('strong');
    labelItemName.appendChild(document.createTextNode("Item: "));
    li.appendChild(labelItemName);
    li.appendChild(document.createTextNode(item.ItemName + "        "));

    const labelDescription = document.createElement('strong');
    labelDescription.appendChild(document.createTextNode("Description: "));
    li.appendChild(labelDescription);
    li.appendChild(document.createTextNode(item.Description + "        "));

    const labelPrice = document.createElement('strong');
    labelPrice.appendChild(document.createTextNode("Price: "));
    li.appendChild(labelPrice);
    li.appendChild(document.createTextNode(item.Price + "      "));

    const labelQuantity = document.createElement('strong');
    labelQuantity.appendChild(document.createTextNode("Quantity: "));
    li.appendChild(labelQuantity);

    const quantitySpan = document.createElement('span');
    quantitySpan.className = 'quantity';
    quantitySpan.textContent = item.Quantity;
    li.appendChild(quantitySpan);

    const buyContainer = document.createElement('div');
    buyContainer.className = "buy-buttons"; // Apply CSS class for styling

    const buy1 = createBuyButton(item, 1);
    const buy2 = createBuyButton(item, 2);
    const buy3 = createBuyButton(item, 3);

    buyContainer.appendChild(buy1);
    buyContainer.appendChild(buy2);
    buyContainer.appendChild(buy3);

    li.appendChild(buyContainer);
    itemList.appendChild(li);
}

function createBuyButton(item, quantityToBuy) {
    const { ItemName, Description, Price, Quantity, _id } = item;
    const buyButton = document.createElement('button');
    buyButton.classList = "btn btn-primary btn-sm edit";
    buyButton.textContent = `Buy: ${quantityToBuy}`;

    buyButton.addEventListener('click', () => buyItems(item, quantityToBuy));

    return buyButton;
}

function buyItems(item, quantityToBuy) {
    const updatedQuantity = parseInt(item.Quantity) - quantityToBuy;

    if (updatedQuantity < 0) {
        alert('Not enough quantity available.');
        return;
    }

    updateQuantityOnServer(item.ItemName, item.Description, item.Price, item.Quantity, item._id, updatedQuantity)
        .then(() => {
            updateDisplayedQuantity(item, updatedQuantity);
            item.Quantity = updatedQuantity; // Update the local item quantity
        })
        .catch(error => {
            console.error('Error updating quantity:', error);
        });
}

async function updateQuantityOnServer(uItemName, uDescription, uPrice, uQuantity, _id, newQuantity) {
    const url = `https://crudcrud.com/api/3310d6441888477a91278e09d5c38154/addItems/${_id}`;
    const data = { ItemName: uItemName, Description: uDescription, Price: uPrice, Quantity: newQuantity };

    try {
        const response = await axios.put(url, data);
        console.log('Quantity updated on the server:', response.data);
    } catch (error) {
        throw error;
    }
}

function updateDisplayedQuantity(item, updatedItem) {
    const listItem = document.querySelector(`li[data-id="${item._id}"]`);
    if (listItem) {
        const quantitySpan = listItem.querySelector('.quantity');
        if (quantitySpan) {
            quantitySpan.textContent = updatedItem;
        }
    }
}

// Fetch and display initial data on page load
window.addEventListener("DOMContentLoaded", () => {
    axios.get("https://crudcrud.com/api/3310d6441888477a91278e09d5c38154/addItems")
        .then(res => {
            const data = res.data;
            data.forEach(item => {
                showNewUserOnScreen(item);
            });
        })
        .catch(err => {
            console.error(err);
        });
});
