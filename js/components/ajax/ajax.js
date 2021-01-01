class Ajax {
    constructor(params) {
        this.serverURL = 'https://jrybelis.github.io/toDoList/data/';
        this.requestType = 'GET';
        this.targetFile = params.targetFile || 'todos.json';
        this.callback = params.callback;
    }

    send() {
        const callback = this.callback;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        };
        xhttp.open(this.requestType, this.serverURL + this.targetFile, true);
        xhttp.send();
    }
}

export {Ajax}