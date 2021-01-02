// new Date().toLocaleDateString()


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
today = year + ' - ' + month + ' - ' + day + ' ' + hour + ":" + minute;

const setDeadline = document.querySelector('#setDeadline');
setDeadline.setAttributeNS('setDeadline', 'min', today);    
setDeadline.addEventListener('change', (e) => {
    let deadlineSelection = document.querySelector('.deadlineSelection');
    deadlineSelection.textContent = e.target.value;
    console.log(deadlineSelection);
})

export {setDeadline};

