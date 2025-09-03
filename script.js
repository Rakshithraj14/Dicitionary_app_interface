const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
removeIcon = wrapper.querySelector(".search span"),
videoBg = document.querySelector(".video-bg");
let audio;
function data(result, word){
    if(result.title){
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }else{
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
        phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        
        // Hide the example section
        document.querySelector(".example").style.display = "none";
        
        audio = new Audio(result[0].phonetics[0].audio);

        if(definitions.synonyms[0] == undefined){
            synonyms.parentElement.style.display = "none";
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}

function search(word){
    fetchApi(word);
    searchInput.value = word;
}

function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `<span class="loading-spinner"></span>Searching the meaning of <span>"${word}"</span>`;
    
    // Add pulse animation to search input
    searchInput.classList.add("pulse");
    
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(response => response.json()).then(result => {
        // Remove pulse animation
        searchInput.classList.remove("pulse");
        data(result, word);
    }).catch(() =>{
        // Remove pulse animation
        searchInput.classList.remove("pulse");
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

searchInput.addEventListener("keyup", e =>{
    let word = e.target.value.replace(/\s+/g, ' ');
    if(e.key == "Enter" && word){
        fetchApi(word);
    }
});

// Add input focus/blur effects
searchInput.addEventListener("focus", () => {
    searchInput.parentElement.style.transform = "scale(1.02)";
});

searchInput.addEventListener("blur", () => {
    searchInput.parentElement.style.transform = "scale(1)";
});

// Add click animation to wrapper
wrapper.addEventListener("click", (e) => {
    if (e.target === wrapper) {
        wrapper.style.transform = "scale(0.98)";
        setTimeout(() => {
            wrapper.style.transform = "scale(1)";
        }, 150);
    }
});

volume.addEventListener("click", ()=>{
    // Add pulse animation
    volume.classList.add("pulse");
    
    // Play audio with enhanced visual feedback
    audio.play();
    
    // Remove pulse animation after audio duration
    setTimeout(() =>{
        volume.classList.remove("pulse");
    }, 800);
});

removeIcon.addEventListener("click", ()=>{
    // Add pulse animation
    removeIcon.classList.add("pulse");
    
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#7f8c8d";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
    
    // Show the example section again when clearing search
    document.querySelector(".example").style.display = "block";
    
    // Remove pulse animation
    setTimeout(() =>{
        removeIcon.classList.remove("pulse");
    }, 300);
});

// Video background handling
if (videoBg) {
    // Handle video loading
    videoBg.addEventListener('loadstart', () => {
        videoBg.classList.add('loading');
    });
    
    videoBg.addEventListener('canplay', () => {
        videoBg.classList.remove('loading');
    });
    
    // Ensure video plays on mobile devices
    videoBg.addEventListener('loadeddata', () => {
        videoBg.play().catch(e => {
            console.log('Video autoplay prevented:', e);
        });
    });
    
    // Handle video errors gracefully
    videoBg.addEventListener('error', () => {
        console.log('Video failed to load, falling back to static background');
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    });
}
