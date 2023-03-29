// ****** SELECT ITEMS **********
const getByQuery = idClass => {
    return (idClass)
};

const errorAlert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
const grocery = document.getElementById('grocery');

// edit option

let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;

    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createListItems(id, value)
        displayAlert('item added to the list', 'success');
        container.classList.add('show-container');
        addToLocalStorage(id,value)
        setBackToDefault()
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        editLocalStorage(editID, value)
        setBackToDefault()
    } else {
        displayAlert('please enter value', "danger")
    }
}

const displayAlert = (text, action) => {
    errorAlert.textContent = text;
    errorAlert.classList.add(`alert-${action}`);

    setTimeout(() => {
        errorAlert.textContent = '';
        errorAlert.classList.remove(`alert-${action}`)
    }, 1500);
}


function clearItems() {
    const items = document.querySelectorAll('.grocery-item');

    if (items.length > 0) {
        items.forEach(item => {
            list.removeChild(item)
        });
    }
    container.classList.remove('show-container');
    displayAlert('empty list', 'success');
    setBackToDefault()
    localStorage.removeItem("list");
}


function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element)
    list.children.length || container.classList.remove('show-container');
    displayAlert('item removed', 'success');
    setBackToDefault();
    removeFromLocalStorage(id)
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit"
}


const setBackToDefault = () => {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = 'Submit';
}
// ****** LOCAL STORAGE **********

const addToLocalStorage = (id, value) => {
    const grocery = {id, value};
    const items = getLocalStorage()

    console.log(items);
    
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items))
}

const editLocalStorage = (id, value) => {
    let items = getLocalStorage();

    items = items.map(item => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    })
    localStorage.setItem("list", JSON.stringify(items))
}

const removeFromLocalStorage = id => {
    let items = getLocalStorage();

    items = items.filter(item => item.id !== id)
    localStorage.setItem("list", JSON.stringify(items))
}

function getLocalStorage() {
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")) : [];
}

// ****** SETUP ITEMS **********

function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(item => {
            createListItems(item.id, item.value)
        });
        container.classList.add('show-container');
    }
}


function createListItems(id, value) {
    const element = document.createElement('article');
        element.classList.add('grocery-item');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button class="edit-btn"><i class="fas fa-edit"></i></button>
          <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
        `
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');

        deleteBtn.addEventListener('click', deleteItem)
        editBtn.addEventListener('click', editItem)
        

        list.appendChild(element);
}