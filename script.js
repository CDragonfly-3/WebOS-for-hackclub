function updateTime() {
    var WordsOfTime = document.getElementById("timeElement");
    WordsOfTime.innerHTML = new Date().toLocaleString();
}

updateTime();
setInterval(updateTime, 1000);


// --------------------------------------------------
// DRAGGING
// --------------------------------------------------

function dragElement(element) {
    var startMouseX = 0;
    var startMouseY = 0;
    var startElementX = 0;
    var startElementY = 0;

    var header = document.getElementById(element.id + "header");

    if (header) {
        header.onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e.preventDefault();

        // Remember where the mouse and window were when dragging started
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        startElementX = element.offsetLeft;
        startElementY = element.offsetTop;

        document.onmousemove = elementDrag;
        document.onmouseup = stopDragging;
    }

    function elementDrag(e) {
        e.preventDefault();

        // How far the mouse has moved
        var movementX = e.clientX - startMouseX;
        var movementY = e.clientY - startMouseY;

        // Move the window by exactly that amount
        element.style.left = (startElementX + movementX) + "px";
        element.style.top = (startElementY + movementY) + "px";
    }

    function stopDragging() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}


// Make both windows draggable
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("info"));


// --------------------------------------------------
// OPEN / CLOSE
// --------------------------------------------------

var welcomeScreen = document.getElementById("welcome");
var aboutmeScreen = document.getElementById("info");

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
}


// Welcome window
document.getElementById("welcomeclose").addEventListener("click", function() {
    closeWindow(welcomeScreen);
});

document.getElementById("welcomeopen").addEventListener("click", function() {
    openWindow(welcomeScreen);
});


// About Me window
document.getElementById("infoclose").addEventListener("click", function() {
    closeWindow(aboutmeScreen);
});

document.getElementById("infoopen").addEventListener("click", function() {
    openWindow(aboutmeScreen);
});