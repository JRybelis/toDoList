import { Ajax } from '../ajax/ajax.js' ;


class Todo {
    constructor(params) {
        this.selector = params.selector;
        this.DOM = null;
        this.taskList = [];
        this.lastCreatedID = 0;
        this.DeadlineDOM = null; // šito ar reikia? 
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
            time: {
                days: this.deadline().timeLeftDays,
                hours: this.deadline().timeLeftHours,
                minutes: this.deadline().timeLeftMinutes,
                seconds: this.deadline().timeLeftSeconds
            },
            isCompleted: false
        }

        this.taskList.push(task);
        this.renderList();

        sessionStorage.setItem(task.id, JSON.stringify(task));
        sessionStorage.setItem('last-id', this.lastCreatedID);

        return true;
    }

    generateItem(task) {
        console.log(this.lastCreatedID);
        console.log(setDeadline.value);
        if (setDeadline.value !== '') {
            do {
                console.log('No deadline supplied for this task.');
                return `
                <div class="item">
                    <p>${task.text}</p>
                    <span>
                        <p class="deadlineSelection">${task.time.days} days </p>
                        <p class="deadlineSelection">${task.time.hours} hours </p>
                        <p class="deadlineSelection">${task.time.minutes} minutes </p>
                        <p class="deadlineSelection">${task.time.seconds} seconds </p>
                    </span>
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
            } while (setDeadline.value !== '');
        }
         else {
            if (setDeadline.value === '') {
                return `
                <div class="item">
                    <p>${task.text}</p>
                    <p class="deadlineSelection"> This task has no deadline. </p>
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
                `; }
        }
        
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
        // if (setDeadline.value === '') {
        //     console.log('No deadline supplied for this task.');
        // }

        let todayMs = Date.parse(today);
        let timeLeftS = (setDeadlineMs - todayMs) / 1000; 
        
        let timeLeftDays = Math.floor(timeLeftS / 60 / 60 / 24);
        timeLeftS -= timeLeftDays * 60 * 60 * 24;

        let timeLeftHours = Math.floor(timeLeftS /60 / 60);
        timeLeftS -= timeLeftHours * 60 * 60;

        let timeLeftMinutes = Math.floor(timeLeftS / 60);

        let timeLeftSeconds = Math.floor(timeLeftS - timeLeftMinutes * 60);
        
        
        // timeLeftDays = timeLeftDays < 10 ? '0' + timeLeftDays : timeLeftDays;
        // timeLeftHours = timeLeftHours < 10 ? '0' + timeLeftHours : timeLeftHours;
        // timeLeftMinutes = timeLeftMinutes < 10 ? '0' + timeLeftMinutes : timeLeftMinutes;
        // timeLeftSeconds = timeLeftSeconds < 10 ? '0' + timeLeftSeconds : timeLeftSeconds;

        
        // return setDeadline.value; -> original static one

        return {
        timeLeftDays: timeLeftDays < 10 ? '0' + timeLeftDays : timeLeftDays,
        timeLeftHours: timeLeftHours < 10 ? '0' + timeLeftHours : timeLeftHours,
        timeLeftMinutes: timeLeftMinutes < 10 ? '0' + timeLeftMinutes : timeLeftMinutes,
        timeLeftSeconds: timeLeftSeconds < 10 ? '0' + timeLeftSeconds : timeLeftSeconds,
        }

    }

    renderDeadline (selector) {
        if (typeof selector !== 'string') {
            console.error ('Error: selector must be string type.');
            return false;
        }
        if (selector == '') {
            console.error ('Error: selector may not be an empty string');
            return false;
        }
        const DeadlineDOM = document.querySelector(selector); // cia reikes nukreipti i <p> !!!!!!
        if (!DeadlineDOM) {
            console.error ('Error: the place for countdown timer HTML generation was not found.');
            return false;
        }
    
        const remainingTime = Todo.deadline(); // path reik patikrint
        console.log(remainingTime);

        const HTMLCounter = 
            `<div class="time-box">
                <div class="time">${remainingTime.timeLeftDays}</div>
                <span>Days</span>
            </div>
            <div class="time-box">
                <div class="time">${remainingTime.timeLeftHours}</div>
                <span>Hours</span>
            </div>
            <div class="time-box">
                <div class="time">${remainingTime.timeLeftMinutes}</div>
                <span>Minutes</span>
            </div>
            <div class="time-box">
                <div class="time">${remainingTime.timeLeftSeconds}</div>
                <span>Seconds</span>
            </div>`;
            
        DeadlineDOM.innerHTML = HTMLCounter;
        const countdownDOM = DeadlineDOM.querySelectorAll('.time');
        let timePassed = 0;

        setInterval(() => {
            const time = this.renderDeadline(); // gal sitos eilutes reikia
            countdownDOM[0].innerText = remainingTime.timeLeftDays;
            countdownDOM[1].innerText = remainingTime.timeLeftHours;
            countdownDOM[2].innerText = remainingTime.timeLeftMinutes;
            countdownDOM[3].innerText = remainingTime.timeLeftSeconds;
        }, 1000);
        
        return true;
        
        
    }

        
        
    
   
}

export { Todo };