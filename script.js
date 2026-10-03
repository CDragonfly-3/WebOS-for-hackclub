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
dragElement(document.getElementById("notes"));

// --------------------------------------------------
// OPEN / CLOSE
// --------------------------------------------------

var welcomeScreen = document.getElementById("welcome");
var aboutmeScreen = document.getElementById("info");
var notesScreen = document.getElementById("notes");
var welcomePagesToggle = document.getElementById("welcome-pages-toggle");
var welcomePagesMenu = document.getElementById("welcome-pages-menu");

function setWelcomePagesOpen(isOpen) {
    welcomePagesToggle.setAttribute("aria-expanded", String(isOpen));
    welcomePagesMenu.hidden = !isOpen;
}

welcomePagesToggle.addEventListener("click", function() {
    setWelcomePagesOpen(welcomePagesMenu.hidden);
});

welcomePagesMenu.addEventListener("click", function() {
    setWelcomePagesOpen(false);
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".welcome-pages")) {
        setWelcomePagesOpen(false);
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !welcomePagesMenu.hidden) {
        setWelcomePagesOpen(false);
        welcomePagesToggle.focus();
    }
});

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

document.getElementById("notesclose").addEventListener("click", function() {
    closeWindow(notesScreen);
    deselectIcon(document.querySelector("#notesopen .app"));
});

var selectedIcon = undefined

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element
}

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined
}

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
    closeWindow(notesScreen);
  } else {
    selectIcon(element);
    openWindow(notesScreen);
  }
}

document.querySelector("#notesopen .app").addEventListener("click", function() {
    handleIconTap(this);
});

var biggestIndex = 1;

// Bring a window to the front when clicked
function addWindowTapHandling(element) {

  element.addEventListener("mousedown", () => {
    handleWindowTap(element);
  });

}

function handleWindowTap(element) {

  biggestIndex++;

  element.style.zIndex = biggestIndex;

}

addWindowTapHandling(welcomeScreen);
addWindowTapHandling(aboutmeScreen);
addWindowTapHandling(notesScreen);
