import { Ajax } from '../ajax/ajax.js' ;

class Todo {
    constructor(params) {
        this.selector = params.selector;
        this.DOM = null;
        this.taskList = [];
        this.lastCreatedID = 0;
    }
    init() {
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
        return `
        <div class="item">
            <p>${task.text}</p>
            <div class="actions">
                <div class="btn delete small">Delete note</div>
                <span>
                    <label class="check" for="check"> Complete task </label>
                    <input class="check" type="checkbox" id="complete">
                </span>
                <div class="confirmation">
                    <p>Are you sure you wish to permanently delete this task?</p>
                    <button class="btn delete confirm">Yes</button>
                    <button class="btn cancel revoke" type="submit">No</button>
                </div>
                </div>
        </div>
    `;
    }

    // Read
    renderList() {
        let HTML = '';
        for (let item of this.taskList) {
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
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const deletePopUp = item.querySelector('.confirmation');
            const deleteBtn = item.querySelector('.btn.delete.small');
            const confirmDelete = deletePopUp.querySelector('.btn.delete.confirm');
            const cancelDelete = deletePopUp.querySelector('.btn.cancel.revoke');
            console.log(cancelDelete);
                        
            confirmDelete.addEventListener ('click', () => {
                this.deleteTask(i);
                deletePopUp.classList.remove('show'); 
            })

            deleteBtn.addEventListener('click', () => {
                deletePopUp.classList.add('show');   
                // this.deleteTask(i);   
            })

            cancelDelete.addEventListener ('click', () => {
                deletePopUp.classList.remove('show');
            })
            
            // const completeBox = item.querySelector('.check');
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