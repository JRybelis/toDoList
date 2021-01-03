import { Todo } from '../toDo/toDo.js';

function renderDeadline (selector) {
    if (typeof selector !== 'string') {
        console.error ('Error: selector must be string type.');
        return false;
    }
    if (selector == '') {
        console.error ('Error: selector may not be an empty string');
        return false;
    }
    const DeadlineDOM = document.querySelector(selector);
    if (!DeadlineDOM) {
        console.error ('Error: the place for countdown timer HTML generation was not found.');
        return false;
    }

    const remainingTime = Todo.deadline();
    console.log(remainingTime);

    // reik viska sukelti i todo.js
}

export {renderDeadline}; 