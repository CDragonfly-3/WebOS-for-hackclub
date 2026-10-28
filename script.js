const SUPABASE_URL = "https://zrvwvgodluawyghxhsut.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DJGByYF7yjviUxRalKP0Yg_n3lsXJmz";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// async function testSupabaseConnection() {
//     const { data, error } = await supabaseClient
//         .from("suggestions")
//         .select("*");

//     if (error) {
//         console.error("Supabase error:", error.message);
//         return;
//     }

//     console.log("Connection successful!");
//     console.log(data);
// }

// testSupabaseConnection();

async function loadSuggestions() {
    const { data, error } = await supabaseClient
        .from("suggestions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load suggestions:", error.message);
        return;
    }

    document.getElementById("suggestionList").innerHTML = "";

    for (var item of data) {
        createSuggestionCard(item.name, item.title, item.category, item.description)
    }
}

var userId = localStorage.getItem("shiteos-user-id");

if (userId === null) {
    userId = crypto.randomUUID();
    localStorage.setItem("shiteos-user-id", userId);
}

// --------------------------------------------------
// CLOCK
// --------------------------------------------------

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

        //boundaries
        var newLeft = startElementX + movementX;
        var newTop = startElementY + movementY;

        newLeft = Math.max(0, Math.min((window.innerWidth - element.offsetWidth), newLeft));
        newTop = Math.max(0, Math.min((window.innerHeight - header.offsetHeight-44), newTop));

        // Move the window by exactly that amount
        element.style.left = newLeft + "px";
        element.style.top = newTop + "px";
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
dragElement(document.getElementById("suggestions"));

// --------------------------------------------------
// OPEN / CLOSE
// --------------------------------------------------

var welcomeScreen = document.getElementById("welcome");
var aboutmeScreen = document.getElementById("info");
var notesScreen = document.getElementById("notes");
var notesMessage = document.getElementById("notesmessage");
var welcomePagesToggle = document.getElementById("welcome-pages-toggle");
var welcomePagesMenu = document.getElementById("welcome-pages-menu");
var suggestionsScreen = document.getElementById("suggestions");

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
    element.style.display = "flex";
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

// Notes message
document.getElementById("notesclose").addEventListener("click", function() {
    closeWindow(notesScreen);
    deselectIcon(document.querySelector("#notesopen .app"));
});


document.getElementById("notesmessageclose").addEventListener("click", function() {
    closeWindow(notesMessage);
});

//suggestions window
document.getElementById("suggestionsClose").addEventListener("click", function() {
    closeWindow(suggestionsScreen);
    deselectIcon(document.querySelector("#suggestionsOpen .app"));
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
addWindowTapHandling(suggestionsScreen);

function handleIconTap(element, windowElement) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
    closeWindow(windowElement);
  } else {
    selectIcon(element);
    openWindow(windowElement);
    handleWindowTap(windowElement);
  }
}

document.querySelector("#notesopen .app").addEventListener("click", function() {
    handleIconTap(this, notesScreen);
});

document.querySelector("#suggestionsOpen .app").addEventListener("click", function() {
    handleIconTap(this, suggestionsScreen);

    if (suggestionsScreen.style.display !== "none") {
        loadSuggestions();
    }
});

var content = [
    {
        title: "All my notes (a collection of every note, organized and updated) <s>I abandoned this. Including and after 24/10/2026 there will no longer be any more notes going here except for the first one I made that day.</s> - I changed my mind.",
        date: "Some date fr",
        content: `
            <div class="notescontent">
                <span><strong style="font-size: 75px;">MY NOTES:</strong></span>
                <p><u style="font-size: 24px;">To Do:</u></p>
                <ul>
                    <li><s>Make it so there two different tabs, one that displays my notes, and one that the user can type in (the text saying 'MY NOTES' is just a placeholder pretty much for what will be a tab on this window)</s></li>
                    <li><s>Make it so the user can write their notes - whatever they want - and they will be saved for next time</s></li>
                    <li><s>Make it so you can scroll on the notes page</s></li>
                    <li><s>Make it so that windows can be freely resized</s></li>
                    <li>Make it so that the user can customize the background of the WebOS (maybe even make it so they can upload their own image) or that they can choose the colour of the background of a window, the outline of a window, etc...</li>
                    <li><s>Make it so that the notes message thing doesn't get affected by the sidebar and just sits at the top of the notes window</s> This point is irrelevant as I will no longer be doing it.</li>
                    <li><s>Make it so that you can't drag a window outside of the screen - ts is dumb because I dont think I can anyway</s> - I am dumb I could do this but I fixed it now so it's chill</li>
                    <li><s>Make it so that the WebOS has a fixed size so that when you drag a window down to the bottom of the screen, it doesn't create extra space that you can scroll down</s></li>
                    <li>Make a calculator app</li>
                    <li><s>FIX ISSUES - make no notes appear in the main area to begin with, only when you click on a tab in the sidebar(I'm lowk not doing this anymore), make the cursor different when hovering over an option in the sidebar, fix the issue that makes everything break  when I add another note</s></li>
                </ul>
                <br>
                <p><u style="font-size: 24px;">Thoughts:</u></p>
                <div style="margin-left: 16px">
                    <li>After Stardance is over (which I'm doing this project for), I want to try other Hackclub programs and events like Phantom, Folktale, Terra, Crescent or Half Life or others. Because I do want to do so many though I probably won't have time to do or properly try all of them but It'll definitely be fun to do some. Check some of them out on <a href="https://hackclub.com/programs" style="color: blue">Hackclub</a>!</li>
                    <li>I should probably start working on my To-Do list xD.</li>
                    <li>Man ChatGPT is really useful.</li>
                    <li>AHHHHHHHH I DON'T KNOW WHAT TO DOOOOOOOO. WHY'S THIS SO HARD. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO.</li>
                    <li>Apologies for that last note, things just got a bit out of hand XD.</li>
                    <li>Yippe I made this so much better :)</li>
                    <li><s>Hmmmm what to do, what to do... I need an idea for an app for the final part of the tutorial but I'll make the calculator later becaise that's too basic I feel like and I need to do something STRONGER!</s> Nvm I'll do a calc it's lowk more complicated than it sounds I think.</li>
                    <li>Wahoo we made the windows resizeable thanks to the one, the only, ChatGPT!!!</li>
                    <li>Tommorow lets make the whole thing only 1 size and other random stuff maybe.</li>
                    <li>I'm not making just any normal calculator. NO! I will make a proper calculator with pie, squares, ETC...!</li>
                    <li>I actually love ChatGPT sm omg they're literally carrying me on their shoulders man (nah I'd win. sorry whats wrong with me)</li>
                    <li>I think it'd be cool to make a word and character count</li>
                    <li>Lets go I made the word and character count. Idk if I want to make it so that when you highlight text it displays the stats for the text you highlighted but we'll see.</li>
                    <li>I finished the feature that displays the counts for highlighted text! :D</li>
                    <li>Idk why I haven't made a note in ages. Maybe nothing significant to note on happened</li>
                    <li><s>Yk what I'm not going to add anything anymore to the 'all my notes in one place' bit because who's looking at these anyway.</s> - I changed my mind</li>
                    <li>Yoooooo I finished the second appppp!! Now Ima ship.</li>
                </div>
            </div>
        `
    },
    {
    title: "My First Notes I'm Putting in this JS Thing",
    date: "08/10/2026 - 13/10/2026",
    content: `
        <div class="notescontent">
          <span><strong style="font-size: 75px;">MY NOTES:</strong></span>
          <p><u style="font-size: 24px;">To Do:</u></p>
          <ul>
            <li>Make it so there two different tabs, one that displays my notes, and one that the user can type in (the text saying 'MY NOTES' is just a placeholder pretty much for what will be a tab on this window)</li>
            <li>Make it so the user can write their notes - whatever they want - and they will be saved for next time</li>
            <s><li>Make it so you can scroll on the notes page</li></s>
            <li>Make it so that windows can be freely resized</li>
            <li>Make it so that the user can customize the background of the WebOS (maybe even make it so they can upload their own image) or that they can choose the colour of the background of a window, the outline of a window, etc...</li>
            <li><s>Make it so that the notes message thing doesn't get affected by the sidebar and just sits at the top of the notes window</s> This point is irrelevant as I will no longer be doing it.</li>
            <li>Make it so that you can't drag a window outside of the screen</li>
            <li>Make it so that the WebOS has a fixed size so that when you drag a window down to the bottom of the screen, it doesn't create extra space that you can scroll down</li>
            <li>Make a calculator app</li>
            <li>FIX ISSUES - make no notes appear in the main area to begin with, only when you click on a tab in the sidebar, make the cursor different when hovering over an option in the sidebar, fix the issue that makes everything break  when I add another note</li>
          </ul>
          <br>
          <p><u style="font-size: 24px;">Thoughts:</u></p>
          <div style="margin-left: 16px">
            <li>After Stardance is over (which I'm doing this project for), I want to try other Hackclub programs and events like Phantom, Folktale, Terra, Crescent or Half Life or others. Because I do want to do so many though I probably won't have time to do or properly try all of them but It'll definitely be fun to do some. Check some of them out on <a href="https://hackclub.com/programs" style="color: blue">Hackclub</a>!</li>
            <li>I should probably start working on my To-Do list xD.</li>
            <li>Man ChatGPT is really useful.</li>
            <li>AHHHHHHHH I DON'T KNOW WHAT TO DOOOOOOOO. WHY'S THIS SO HARD. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO. I DON'T KNOW WHAT TO DOOOOOOOO.</li>
            <li>Apologies for that last note, things just got a bit out of hand XD.</li>
          </div>
        </div>
    `
  },
  {
    title: "Finally fixed this so I can add more notes in this bit and not just putting everything in the same area",
    date: "14/10/2026",
    content: `
        <div class="notescontent">
            <s>fix the issue that makes everything break  when I add another note</s><br>
            Yippe I made this so much better :)<br>
            Make it so that when I add new notes they automatically filter into their respective places ont the page with all of my notes on and I don't have to manually type them in each section each time.<br>
            <s>make the cursor different when hovering over an option in the sidebar</s><br>
            Hmmmm what to do, what to do... I need an idea for an app for the final part of the tutorial but I'll make the calculator later becaise that's too basic I feel like and I need to do something STRONGER!
        </div>
    `
  },
  {
    title: "Notes from my small sesh today",
    date: "15/10/2026",
    content: `
        <div class="notescontent">
            Wahoo we made the windows resizeable thanks to the one, the only, ChatGPT!!!<br>
            <s>Make it so that windows can be freely resized</s><br>
            Tommorow lets make the whole thing only 1 size and other random stuff maybe.<br>
            Nvm I'll do a calc it's lowk more complicated than it sounds I think.<br>
        </div>
    `
  },
  {
    title: "Today",
    date: "16/10/2026",
    content: `
        <div class="notescontent">
            <s>Make it so that the WebOS has a fixed size so that when you drag a window down to the bottom of the screen, it doesn't create extra space that you can scroll down</s>
        </div>
    `
  },
  {
    title: "Larger session today",
    date: "17/10/2026",
    content: `
        <div class="notescontent">
            <s>make no notes appear in the main area to begin with, only when you click on a tab in the sidebar</s> - I'm lowk not doing this anymore<br>
            I'm not making just any normal calculator. NO! I will make a proper calculator with pie, squares, ETC...!<br>
            <s>Make it so that you can't drag a window outside of the screen</s> - ts is dumb because i dont think i can anyway<br>
            <s>Make it so there two different tabs, one that displays my notes, and one that the user can type in (the text saying 'MY NOTES' is just a placeholder pretty much for what will be a tab on this window)</s><br>
            <s>Make it so the user can write their notes - whatever they want - and they will be saved for next time</s><br>
            I actually love ChatGPT sm omg they're literally carrying me on their shoulders man (nah I'd win. sorry whats wrong with me)<br>
            I think it'd be cool to make a word and character count
        </div>
    `
  },
  {
    title: "FINISHED THE NOTES APP (for now) LETS GOOO (nvm I keep adding features)",
    date: "18/10/2026",
    content: `
        <div class="notescontent">
            Yo I wanna make a character count excluding spaces too that'd be cool I think.<br>
            Lets go I made the word and character count. Idk if I want to make it so that when you highlight text it displays the stats for the text you highlighted but we'll see.
        </div>
    `
  },
  {
    title: "I finished the highlight bit",
    date: "20/10/2026",
    content: `
        <div class="notescontent">
            I finished the feature that displays the counts for highlighted text! :)
        </div>
    `
  },
  {
    title: "Next app in progress + longest session yet 🤯 (2h 30m - ikr kinda buns but whatever) - I want to get this done lol Stardance ends on the 31st of Oct",
    date: "24/10/2026",
    content: `
        <div class="notescontent">
            Idk why I haven't made a note in ages. Maybe nothing significant to note on happened<br>
            <s>Yk what I'm not going to add anything anymore to the 'all my notes in one place' bit because who's looking at these anyway.</s><br>
            Yippe I made it so you can't drag windows out of the screen - turns out I could!
        <div>
    `
  },
  {
    title: "Done (I'll probably add more features at some point) with the app lets goo! and damn this was a long session (4h []m)!",
    date: "27/10/2026",
    content: `
        <div class="notescontent">
            Yoooooo I finished the second appppp!! Now Ima ship.
        </div>
    `
  },
  {
    title: "TEST NOTE",
    date: "TEST DATE",
    content: `
        <div class="notescontent">
            <span><strong style="font-size: 75px;">TEST TEST TEST TEST TEST</strong></span><br>
            my test was unsuccessful but then successful
        </div>
    `
  },
]

function setNotesContent(index) {

  var notesContent = document.querySelector("#notescontent")

  notesContent.innerHTML = content[index].content
}

setNotesContent(0)

function addToSideBar(index) {

    var sidebar = document.querySelector("#sidebar");

    var note = content[index];

    var newDiv = document.createElement("div");
    newDiv.style.cursor = "pointer";
    newDiv.style.marginBottom = "3em";

    newDiv.innerHTML = `
        <p style="margin: 0px;">
            ${note.title}
        </p>
        <p style="font-size: 12px; margin: 0px;">
            ${note.date}
        </p>
    `;

    newDiv.addEventListener("click", function() {
        setNotesContent(index);
    });

    sidebar.appendChild(newDiv);
}

for (let i = 0; i < content.length; i++) {
    addToSideBar(i);
}

function makeResizable(element) {

    // The four edges and four corners
    var directions = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];

    directions.forEach(function(direction) {

        // Create a resize handle
        var handle = document.createElement("div");

        handle.className = "resize-handle resize-" + direction;

        // Put the handle inside the window
        element.appendChild(handle);

        // Start resizing when the handle is pressed
        handle.addEventListener("mousedown", function(event) {
            
            event.preventDefault();

            // Remember the mouse position
            var startX = event.clientX;
            var startY = event.clientY;

            // Remember the window's original size and position
            var startWidth = element.offsetWidth;
            var startHeight = element.offsetHeight;
            var startLeft = element.offsetLeft;
            var startTop = element.offsetTop;

            // Get the minimum dimensions from the CSS
            var minWidth = parseFloat(getComputedStyle(element).minWidth) || 350;
            var minHeight = parseFloat(getComputedStyle(element).minHeight) || 200;

            // Keep the resize cursor visible while dragging
            var oldCursor = document.body.style.cursor;
            document.body.style.cursor = getComputedStyle(handle).cursor;

            function resizeWindow(event) {

                var changeX = event.clientX - startX;
                var changeY = event.clientY - startY;

                // Begin with the original dimensions
                var newWidth = startWidth;
                var newHeight = startHeight;
                var newLeft = startLeft;
                var newTop = startTop;

                // Resize from the right
                if (direction.includes("e")) {
                    newWidth = Math.max(minWidth, startWidth + changeX);
                }

                // Resize from the left
                if (direction.includes("w")) {
                    newWidth = Math.max(minWidth, startWidth - changeX);
                    newLeft = startLeft + startWidth - newWidth;
                }

                // Resize from the bottom
                if (direction.includes("s")) {
                    newHeight = Math.max(minHeight, startHeight + changeY);
                }

                // Resize from the top
                if (direction.includes("n")) {
                    newHeight = Math.max(minHeight, startHeight - changeY);
                    newTop = startTop + startHeight - newHeight;
                }

                // Apply the new size and position
                element.style.width = newWidth + "px";
                element.style.height = newHeight + "px";
                element.style.left = newLeft + "px";
                element.style.top = newTop + "px";
            }

            function stopResizing() {
                document.removeEventListener("mousemove", resizeWindow);
                document.removeEventListener("mouseup", stopResizing);

                // Restore the previous cursor
                document.body.style.cursor = oldCursor;
            }

            // Keep resizing while the mouse moves
            document.addEventListener("mousemove", resizeWindow);
            document.addEventListener("mouseup", stopResizing);

        });
    });
}

makeResizable(welcomeScreen);
makeResizable(aboutmeScreen);
makeResizable(notesScreen);
makeResizable(suggestionsScreen);

function showNotesTab(showYourNotes) {
    var myNotesPanel = document.getElementById("myNotesPanel");
    var yourNotesPanel = document.getElementById("yourNotesPanel");

    var myNotesButton = document.getElementById("myNotesButton");
    var yourNotesButton = document.getElementById("yourNotesButton");

    // Show one panel and hide the other
    myNotesPanel.hidden = showYourNotes;
    yourNotesPanel.hidden = !showYourNotes;

    // Highlight whichever tab is active
    myNotesButton.classList.toggle("active", !showYourNotes);
    yourNotesButton.classList.toggle("active", showYourNotes);
}

// Click My Notes
document.getElementById("myNotesButton").addEventListener("click", function() {
    showNotesTab(false);
});

// Click Your Notes
document.getElementById("yourNotesButton").addEventListener("click", function() {
    showNotesTab(true);
});

// Start on My Notes
showNotesTab(false);

//---------------------------------------------------------------------------------------------------------------
// SUGGESTIONS WINDOW
//---------------------------------------------------------------------------------------------------------------

function showSuggestionsTab(showForm) {
    var browsePanel = document.getElementById("browsePanel");
    var formPanel = document.getElementById("formPanel");

    var browseButton = document.getElementById("browseButton");
    var formButton = document.getElementById("formButton");

    // Show one panel and hide the other
    browsePanel.hidden = showForm;
    formPanel.hidden = !showForm;

    // Highlight whichever tab is active
    browseButton.classList.toggle("active", !showForm);
    formButton.classList.toggle("active", showForm);
}

// Click browse suggestions
document.getElementById("browseButton").addEventListener("click", function() {
    showSuggestionsTab(false);
});

// Click form
document.getElementById("formButton").addEventListener("click", function() {
    showSuggestionsTab(true);
});

// Start on browse suggestions
showSuggestionsTab(false);

var yourNotesMessage = document.getElementById("yourNotesMessage");
document.getElementById("yourNotesMessageClose").addEventListener("click", function() {
    closeWindow(yourNotesMessage);
});

// Find the user's notes text box
var userNotesInput = document.getElementById("userNotesInput");

// Load previously saved notes when ShiteOS starts
userNotesInput.value = localStorage.getItem("shiteOSUserNotes") || "";

// Save the notes whenever the user types
userNotesInput.addEventListener("input", function() {
    localStorage.setItem("shiteOSUserNotes", userNotesInput.value);
});

var wordCount = document.getElementById("Words");
var charsCount = document.getElementById("Chars");
var charsNoSpacesCount = document.getElementById("Chars-Spaces");

function updateCounters() {
    var text = userNotesInput.value.trim();
    var words;
    if (text === "") {
        words = 0;
    } else {
        words = text.split(/\s+/).length;
    }
    wordCount.textContent = "Words: " + words;
    charsCount.textContent = "Characters: " + userNotesInput.value.length;
    charsNoSpacesCount.textContent = "Characters excluding spaces: " + userNotesInput.value.replace(/\s/g, "").length;
}

updateCounters();

userNotesInput.addEventListener("input", updateCounters);

var selectionPreview = document.getElementById("selectionPreview");

function updateSelection() {
    var highlighted = userNotesInput.value.slice(userNotesInput.selectionStart, userNotesInput.selectionEnd);

    if (userNotesInput.selectionStart === userNotesInput.selectionEnd) {
        highlighted = "none";
        updateCounters();
    } else {
        var text = highlighted.trim();
        var words;
        if (text === "") {
            words = 0;
        } else {
            words = text.split(/\s+/).length;
        }
        wordCount.textContent = "Words: " + words;
        charsCount.textContent = "Characters: " + highlighted.length;
        charsNoSpacesCount.textContent = "Characters excluding spaces: " + highlighted.replace(/\s/g, "").length;
    }

    selectionPreview.textContent = "Selected text: " + highlighted;
}

userNotesInput.addEventListener("select", updateSelection);
userNotesInput.addEventListener("mouseup", function() {
    setTimeout(updateSelection, 0);
});
userNotesInput.addEventListener("keyup", updateSelection);
userNotesInput.addEventListener("input", updateSelection);
userNotesInput.addEventListener("click", updateSelection);

function createSuggestionCard(suggestionName, suggestion, suggestionCategory, suggestionDescription) {
    var card = document.createElement("div");
   card.classList.add("suggestion-card");

   var name = document.createElement("h4");
   name.textContent = "Submitted by " + suggestionName + ":";
   card.appendChild(name);

   var title = document.createElement("h2");
   title.textContent = suggestion;
   card.appendChild(title);

   var category = document.createElement("h5");
   category.textContent = suggestionCategory;
   category.classList.add("suggestion-category");
   if (suggestionCategory === "App idea") {
    category.classList.add("category-app-idea");
   } else if (suggestionCategory === "New feature") {
    category.classList.add("category-new-feature");
   } else if (suggestionCategory === "UI improvement/change") {
    category.classList.add("category-ui-change");
   } else if (suggestionCategory === "Bug fix") {
    category.classList.add("category-bug-fix");
   } else if (suggestionCategory === "Other") {
    category.classList.add("category-other");
   }
   card.appendChild(category);

   var description = document.createElement("span");
   description.textContent = suggestionDescription;
   card.appendChild(description);

   document.getElementById("suggestionList").appendChild(card);
}

var form = document.getElementById("suggestionForm");
form.addEventListener("submit", async function(event) {
   event.preventDefault();
   var suggestionName = document.getElementById("suggestionName").value;
   var suggestion = document.getElementById("suggestion").value;
   var suggestionCategory = document.getElementById("category").value;
   var suggestionDescription = document.getElementById("suggestionDescription").value;
   if (suggestionName.trim() === "") {
    suggestionName = "Anonymous";
   }

    const { error } = await supabaseClient
        .from("suggestions")
        .insert({
            name: suggestionName,
            title: suggestion,
            category: suggestionCategory,
            description: suggestionDescription,
            user_id: userId
        });

    if (error) {
        console.error("Failed to save suggestion:", error.message);
        alert("Your suggestion couldn't be saved. Please try again!");
        return;
    }

    createSuggestionCard(
        suggestionName,
        suggestion,
        suggestionCategory,
        suggestionDescription
    );

    form.reset()
});

var meowScreen = document.getElementById("meow");

makeResizable(meowScreen);

dragElement(document.getElementById("meow"));

addWindowTapHandling(meowScreen);

document.getElementById("meowClose").addEventListener("click", function() {
    closeWindow(meowScreen);
});
document.getElementById("meowOpen").addEventListener("click", function() {
    openWindow(meowScreen);
});