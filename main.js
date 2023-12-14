const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filterItem = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemFromStorage = getItemFromStorage();
  itemFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const itemName = itemInput.value;

  //Validate Input
  if (itemName === "") {
    alert("Please add an item");
    return;
  }

  //Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  }

  //Add item to DOM
  addItemToDOM(itemName);

  //Add Item to Local Storage
  addItemToStorage(itemName);

  //Checking the UI State
  checkUI();

  itemInput.value = "";
}

function addItemToDOM(item) {
  //Create list Item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  //Add li to DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  let itemFromStorage = getItemFromStorage();
  //Add new item to the array
  itemFromStorage.push(item);

  //Convert array to strings and set data to local storage
  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function getItemFromStorage() {
  let itemFromStorage;

  if (localStorage.getItem("items") === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemFromStorage;
}

//Targeting the x mark or x icon to remove the li element
function onclickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  //item.style.color = '#ccc'; or item.classList.add("edit-mode");
  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

//Remove Items
function removeItem(item) {
  if (confirm("Are you sure?")) {
    //Remove item from DOm
    item.remove();

    //Remove item from Storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

//Remove Items from local storage
function removeItemFromStorage(item) {
  let itemFromStorage = getItemFromStorage();

  //Filter out items to be removed
  itemFromStorage = itemFromStorage.filter((i) => i !== item);

  //Reset to local storage
  localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

//clear items
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  //Clear from local storage
  localStorage.removeItem("items");
  checkUI();
}

//Filter Items
function filterItems(e) {
  const items = document.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

//Check UI state
function checkUI() {
  itemInput.value = "";

  const items = document.querySelectorAll("li");
  if (items.length === 0) {
    filterItem.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    filterItem.style.display = "block";
    clearBtn.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

//Initialize App
function init() {
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onclickItem);
  clearBtn.addEventListener("click", clearItems);
  filterItem.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
