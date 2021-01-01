import { Ajax } from '../ajax/ajax.js' ;

class Todo {
    constructor(params) {
        this.selector = params.selector;
        this.DOM = null;
        this.taskList = [];
        this.lastCreatedID = 0;
    }
    init() {
        this.taskList = [];
        if (!this.isValidSelector()) {
            return false;
        }
        
        this.getInfoFromSessionStorage();
        this.renderList();

        const ajax = new Ajax ({
            targetFile: 'todos.json',
            callback: this.importDataFromServer
        });
        ajax.send();
    }

    isValidSelector() {
        const DOM = document.querySelector(this.selector);
        if(!DOM) {
            return false;
        }
        this.DOM = DOM;
        return true;
    }

   
    // Create
    addTask(text) {
        const task = {
            id: ++this.lastCreatedID,
            text: text,
            isCompleted: false
        }

        this.taskList.push(task);
        this.renderList();

        sessionStorage.setItem(task.id, JSON.stringify(task));
        sessionStorage.setItem('last-id', this.lastCreatedID);

        return true;
    }

    generateItem(task) {
        return `<div class="item">
                    <p>${task.text}</p>
                    <div class="actions">
                    <div class="btn small delete">Delete note</div>
                    <span>
                        <label class="check" for="check"> Complete task </label>
                        <input class="check" type="checkbox" id="complete">
                    </span>`;
    }

    // Read
    renderList() {
        let HTML = '';
        let tasks = [];
        this.taskList = tasks;
        console.log(this.tasklist);
        for (let item of this.taskList) {
            if (this.tasklist.length === 0) {
                return
            }
            HTML += this.generateItem(item);
            
        }
        this.DOM.innerHTML = HTML;
        this.addEvents();
    }

    // Delete
    deleteTask(taskIndex) {
        sessionStorage.removeItem(this.taskList[taskIndex].id);
        this.taskList = this.taskList.filter((item, index) => index !== taskIndex);
        this.renderList();
    }

    addEvents() {
        const items = this.DOM.querySelectorAll('.item');

        for (let i=0; i < items.length; i++) {
            const item = items[i];
            const deleteBtn = item.querySelector('.btn.delete');
            const completeBox = item.querySelectorAll('.check');

            // deleteBtn.addeventListener('click', () => {
            //     this.deleteTask(i);
            // })
            // completeBox.addeventListener('click', () => {
            //     this.completeTask(i);
            // })
        }
    }

    getInfoFromSessionStorage () {
        const keys = Object.keys(sessionStorage).sort();

        for(let key of keys) {
            const item = sessionStorage.getItem(key);
            const obj = JSON.parse(item);

            if (key === 'last-id') {
                this.lastCreatedID = obj;
            } else {
                this.taskList.push(obj);
            }
        }
    }
    importDataFromServer(data) {
        const serverInfo = JSON.parse(data);
        console.log(serverInfo);
    }
}


export { Todo };