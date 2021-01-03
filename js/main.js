import {Todo} from './components/toDo/toDo.js';
// import { renderDeadline } from './components/dateTime/dateTime.js';


const addNewTask = document.querySelector('.add-new');
const lightbox = document.querySelector('.lightbox');
const deletePopUp = document.querySelector('.confirmation');
const formAdd = lightbox.querySelector('form.add');
const textarea = formAdd.querySelector('textarea');
const buttonCancel = formAdd.querySelector('button.cancel')
const buttonAdd = formAdd.querySelector('button.add');

     

// init objects
const todo = new Todo({
    selector: '.list'
});
todo.init();

// add events
addNewTask.addEventListener('click', () => {
    lightbox.dataset.form = 'add';
    lightbox.classList.add('show');
})


addEventListener('keyup', ({ key }) => {
    if (key === 'Escape') {
        lightbox.classList.remove('show'),
        deletePopUp.classList.remove('show');
    }
})

buttonCancel.addEventListener('click', e => {
    e.preventDefault();
    lightbox.classList.remove('show');
})

buttonAdd.addEventListener('click', e => {
    e.preventDefault();
    let setDeadline = document.querySelector('#setDeadline');
    if (textarea.textLength === 0) {
        alert ('The note cannot be created empty.');
        return false;
    } 
    
    todo.addTask(textarea.value);
    textarea.value = '';
    lightbox.classList.remove('show');
    setDeadline.value = '';
})


