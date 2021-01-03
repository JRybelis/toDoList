import { Ajax } from '../ajax/ajax.js' ;


class Todo {
    constructor(params) {
        this.selector = params.selector;
        this.DOM = null;
        this.taskList = [];
        this.lastCreatedID = 0;
        // this.countTimeDiff();

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
            deadline: this.deadline(),
            isCompleted: false
        }

        this.taskList.push(task);
        this.renderList();

        sessionStorage.setItem(task.id, JSON.stringify(task));
        sessionStorage.setItem('last-id', this.lastCreatedID);

        return true;
    }

    generateItem(task) {
        let value = this.deadline();
        console.log(this.lastCreatedID);
        return `
        <div class="item">
            <p>${task.text}</p>
            <p class="deadlineSelection">${task.deadline}</p>
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
                        
            confirmDelete.addEventListener ('click', () => {
                this.deleteTask(i);
                deletePopUp.classList.remove('show'); 
            })

            deleteBtn.addEventListener('click', () => {
                deletePopUp.classList.add('show');   
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
    }


    deadline (){
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth()+1;
        let day = today.getDate();
        let hour = today.getHours();
        let minute = today.getMinutes();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        today = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;

        let setDeadline = document.querySelector('#setDeadline');
        setDeadline.setAttributeNS('setDeadline', 'min', today);

        
        let setDeadlineMs = Date.parse(setDeadline.value);
        if (setDeadline.value === '') {
            console.log('No deadline supplied for this task.');
        }

        let todayMs = Date.parse(today);
        let timeLeftS = (setDeadlineMs - todayMs) / 1000; 
        
        const timeLeftDays = Math.floor(timeLeftS / 60 / 60 / 24);
        timeLeftS -= timeLeftDays * 60 * 60 * 24;

        const timeLeftHours = Math.floor(timeLeftS /60 / 60);
        timeLeftS -= timeLeftHours * 60 * 60;

        const timeLeftMinutes = Math.floor(timeLeftS / 60);

        const timeLeftSeconds = Math.floor(timeLeftS - timeLeftMinutes * 60);
        
        return setDeadline.value,
        {
            timeLeftDays: timeLeftDays < 10 ? '0' + timeLeftDays : timeLeftDays,
            timeLeftHours: timeLeftHours < 10 ? '0' + timeLeftHours : timeLeftHours,
            timeLeftMinutes: timeLeftMinutes < 10 ? '0' + timeLeftMinutes : timeLeftMinutes,
            timeLeftSeconds: timeLeftSeconds < 10 ? '0' + timeLeftSeconds : timeLeftSeconds,
        }
        
    }

    // countTimeDiff() {
        
        // return countDown;
             
    // }
    
}

export { Todo };