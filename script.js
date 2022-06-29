// Mini jquery haha
$ = element => {return document.querySelector(element);}
all = element => {return document.querySelectorAll(element);}

// Onload
window.onload = function(e) {
    // Variables
    grid_n = 3;
    punct = 0;
    emoji_number_start = 127761;
    emoji_number_end = 128512;
    array_emojis = [];
    emoji_sel_1 = "";
    emoji_sel_2 = "";
    time = 10;
    first_touch = false;

    // --------------
    
    fillArrayEmojisWithCode();
    createSecondaryEmoji();
    $(".grid").innerHTML = "";
    updateContent($(".time"), time);
    updateContent($(".punct"), punct);

    // Functions call
    for (i = 0; i < (grid_n*grid_n); i++) {
        createElement("div", $(".grid"), "item-grid", selEmojis);
    }
    
    all(".item-grid").forEach(item => {
        fillGridWithEmojis(item);
    });
    // --------------

    // Events
    $(".restart-btn").onclick = restartGame;
    // --------------
    
}

// Functions

// This function create the second emoji in the array
function createSecondaryEmoji() {
    let random_number = Math.floor(Math.random() * array_emojis.length);
    var random_number_2 = Math.floor(Math.random() * array_emojis.length);
    
    while (random_number_2 == random_number)
        random_number_2 = Math.floor(Math.random() * array_emojis.length);

    array_emojis[random_number] = array_emojis[random_number_2];
}

// This function fill the array with the code of emojis
function fillArrayEmojisWithCode() {
    array_emojis = [];
    for (i = 0; i < (grid_n*grid_n); i++) {
        var num = generateRandomNumber(emoji_number_start, emoji_number_end);

        // Checking that array haven't any same emoji code 
        while (!checkNumArray("&#"+num, array_emojis))
            num = generateRandomNumber(emoji_number_start, emoji_number_end);
        

        array_emojis.push("&#" + num);
    }
}

// This function create a element HTML
function createElement(element, parentElement, className="", funct = null) {
    let el = document.createElement(element);
    el.className = className != "" ? className : "";
    el.onclick = funct != null ? funct : null;
    parentElement.appendChild(el);
}

// This function fill the panel with all emojis
function fillGridWithEmojis(item) {
    let random_number = Math.floor(Math.random() * array_emojis.length);
    item.innerHTML = "<span class='emoji'>" + array_emojis[random_number] + "</span>";
    array_emojis.splice(random_number,1);
}

// This function generate a random namber between two numbers
function generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min) + min);
}

// This functions return true if array doesn't contain number 
function checkNumArray(num, array) {
    array.forEach(el => {
        if (el == num)
            return false;
    });

    return true;
}

// This functions save the emojis that you clicked
function selEmojis(e) {
    let code = this.innerText;
    toggleItemAnim(e);
    
    if (!first_touch) {
        updateTime();
        first_touch = true;
    }
        
    if (emoji_sel_1 == "" && emoji_sel_2 == "")
        emoji_sel_1 = code;
    else if (emoji_sel_1 != "" && emoji_sel_2 == "") {
        emoji_sel_2 = code;
        checkCodeEmoji();
    }
    
}

// This funcction check if the first emoji selected are the same that se second's one 
function checkCodeEmoji() {
    if (emoji_sel_1 == emoji_sel_2) {
        clearVarEmojis();

        grid_n++;
        punct++;
        time+=10;

        updateContent($(".punct"), punct);

        $(".grid").style.gridTemplateColumns = "repeat("+ grid_n + "," + "1fr)"; 
        $(".grid").style.gridTemplateRows = "repeat("+ grid_n + "," + "1fr)"; 

        
        toggleClassAnim($(".check"), "info-img-active-anim", 350);

        fillArrayEmojisWithCode();
        createSecondaryEmoji();

        $(".grid").innerHTML = "";
        for (i = 0; i < (grid_n*grid_n); i++) {
            createElement("div", $(".grid"), "item-grid", selEmojis);
        }

        all(".item-grid").forEach(item => {
            fillGridWithEmojis(item);
        });

    } else{
        toggleClassAnim($(".remove"), "info-img-active-anim", 350);
        clearVarEmojis();
    }
    

    removeItemAnim(".emoji", "active");
}


// This function clear the value of two vars
function clearVarEmojis() {
    emoji_sel_1 = "";
    emoji_sel_2 = "";
}

// This function Update the text of a HTML content
function updateContent(element, value) {
    element.innerText = value;
}

// This function update the time
function updateTime() {
    if (time == 0)
        endGame();
    else {
        time--;
        updateContent($(".time"), time);
        setTimeout("updateTime()", 1000);
    }
}

// This function save the score and show the finish panel
function endGame() { 
    saveScore();
    setDataToPanel();
    $(".end-game-panel").classList.remove("hidden");
}

// This function save score in the localstorage
function saveScore() {
    let best = localStorage.getItem("scoreEmojiFinder_best");

    if (best < punct) 
        localStorage.setItem("scoreEmojiFinder_best", punct);    
    
    localStorage.setItem("scoreEmojiFinder", punct);
}

// This function get data from localstorage and set in the defeat panel
function setDataToPanel() {
    var best_punct = localStorage.getItem("scoreEmojiFinder_best");
    var last_punct = localStorage.getItem("scoreEmojiFinder_last");
    var punct = localStorage.getItem("scoreEmojiFinder");

    $(".best-punct-span").innerText = best_punct != undefined ? best_punct : "X"; 
    $(".last-punct-span").innerText = last_punct != undefined  ? last_punct : "X";
    $(".actual-punct-span").innerText = punct;
    localStorage.setItem("scoreEmojiFinder_last", punct);
    
}

// This function is executed when the restart button is clicked 
// and restart all values
function restartGame() {
    time = 10;
    punct = 0;
    grid_n = 3;
    first_touch = false;

    $(".grid").style.gridTemplateColumns = "repeat("+ grid_n + "," + "1fr)"; 
    $(".grid").style.gridTemplateRows = "repeat("+ grid_n + "," + "1fr)"; 

    clearVarEmojis();
    $(".grid").innerHTML = "";
    updateContent($(".time"), time);
    updateContent($(".punct"), punct);
    
    $(".end-game-panel").classList.add("hidden");
    
    fillArrayEmojisWithCode();
    createSecondaryEmoji();


    // Functions call
    for (i = 0; i < (grid_n*grid_n); i++) {
        createElement("div", $(".grid"), "item-grid", selEmojis);
    }
    
    all(".item-grid").forEach(item => {
        fillGridWithEmojis(item);
    }); 
}

// Styles JS
function removeItemAnim(el, className) {
    all(el).forEach(emoji => {
        emoji.classList.remove(className);
    });
}

function toggleItemAnim(event) {
    event.target.classList.toggle("active");
}

function toggleClassAnim(element, className, time) {
    element.classList.add(className);
    setTimeout(()=>{
        element.classList.remove(className);    
    }, time);
}