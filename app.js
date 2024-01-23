// elements
const parentResultElement = document.querySelector(
    ".search-results-section .container"
  );
const loadingAnimation = document.querySelector(
    ".search-results-section .loading-animation"
  );
const searchInput = document.querySelector(
    ".searchInputSection .container input"
)
const searchBtn = document.querySelector(
    ".searchInputSection .container button"
)
const nextPageBtn = document.querySelector(
    ".search-results-section .pageIndicator .next"
);
const prevPageBtn = document.querySelector(
    ".search-results-section .pageIndicator .prev"
)
const alertEl = document.querySelector(
    ".search-results-section .alert"
)
const expandBtn = document.querySelectorAll(
    "search-results-section .container .result .expandBtn"
);
const apiKey = "PvfC32oFlxKT8LGECEclhDDyH3y9h43IlPvdGOSR_m0";
// elements end


//slideshow ---------------------------------------------------------------------------------------------------
const slide = document.querySelectorAll(".img-slideshow .container .slide");
const dots = document.querySelectorAll(".img-slideshow .container .dots .dot");
let slideInd = 0;
function scrollFunc(n) {
  for (let i = 0; i < slide.length; i++) {
    slide[i].classList.remove("active");
    dots[i].classList.remove("active");
  }
  slideInd += n;
  if (slideInd > slide.length - 1) {
    slideInd = 0;
  }
  if (slideInd < 0) {
    slideInd = slide.length - 1;
  }
  slide[slideInd].classList.add("active");
  dots[slideInd].classList.add("active");
}
//slideshow ends



// image generate ----------------------------------------------------------------------------------------------
async function generateRandomPhotos() {
    let url = `https://api.unsplash.com/photos/random?count=9&client_id=${apiKey}`;
    loadingAnimation.style.display = "block";
    try {
      let response = await fetch(url);
      let data = await response.json();
      for (let el of data) {
        let element = document.createElement("div");
        element.classList.add("result");
        element.innerHTML = `
              <ion-icon name="expand-outline" class="expandBtn"></ion-icon>
              <img src="${el.urls.small}" draggable="false" title="${el.alt_description}" alt="img">
              `;
        parentResultElement.appendChild(element);
      }
    } catch (error) {
      console.error("Something occured: ", error);
    } finally {
      loadingAnimation.style.display = "none";
    }
  }
  generateRandomPhotos();
//image generate ends 



//search engine ----------------------------------------------------------------------------------------------
let page = 1 ;
async function searchEngine(){
    let query = searchInput.value.trim();
    if(query !== searchInput.dataset.lastQuery){
        page = 1;
    }
    searchInput.dataset.lastQuery = query;
    if(page === 1){
        prevPageBtn.style.display = "none"
    }
    if(query === ""){
        document.querySelector(".search-results-section .pageIndicator").style.display = "none"
        return ;
    }
    parentResultElement.innerHTML = "";
    loadingAnimation.style.display = "block";
    try{
        let  url = `https://api.unsplash.com/search/photos?page=${page}&per_page=9&query=${query}&client_id=${apiKey}`;
        let  response = await fetch(url);
        let  data = await response.json();
        if(data.results.length == 0){
            document.querySelector(".search-results-section .pageIndicator").style.display = "none"
            alertEl.style.display = "block";
            return;
        }
        for(let el of data.results){
            alertEl.style.display = "none";
            let element = document.createElement("div");
            element.classList.add("result");
            element.innerHTML = `
                  <ion-icon name="expand-outline" class="expandBtn"></ion-icon>
                  <img src="${el.urls.small}" draggable="false" title="${el.alt_description}" alt="img">
                  `;
            parentResultElement.appendChild(element);
        }
        document.querySelector(".search-results-section .pageIndicator").style.display = "flex"

    }catch(error){
        console.error("Something wrong : " , error);
    }finally{
        loadingAnimation.style.display = "none";
    }
}
searchBtn.addEventListener('click' , searchEngine);
nextPageBtn.addEventListener('click' , ()=>{
    page++;
    document.querySelector(".search-results-section .pageIndicator .prev").style.display = "block"
    searchEngine();
})
prevPageBtn.addEventListener('click' , ()=>{
    page--;
    searchEngine();
    if(page === 1){
        prevPageBtn.style.display = "none"
    }
})
//search engine ends

//full screen
parentResultElement.addEventListener('click' , (event)=>{
    if(event.target.classList.contains("expandBtn")){
        let siblingImg = event.target.closest(".result").querySelector("img");
        siblingImg.classList.add('active');
        let element = document.createElement("div");
        element.classList.add("fullScreenEl");
        element.style.display = "flex";
        element.innerHTML = `
            <img src="${siblingImg.getAttribute("src")}" alt="img">
        `
        document.querySelector("body").appendChild(element);
    }
})
document.addEventListener("click" , (event)=>{
    if(event.target.classList.contains("fullScreenEl")){
        let elem = event.target;
        document.body.removeChild(elem)
    }
})


//full screen end