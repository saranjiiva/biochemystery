// Lecture Engine Core

let currentSlide = 0
let slides = []
let animationStep = 0



// INITIALIZE ENGINE

window.addEventListener("load", () => {

    slides = getSlides()

    loadSlide(currentSlide)

    setupControls()

    setupKeyboard()

})



/* -----------------------------
   LOAD SLIDE
-------------------------------- */

function loadSlide(index){

    const slideArea = document.getElementById("slide-content")

    slideArea.classList.remove("slide-active")
    slideArea.classList.add("slide-exit")

    setTimeout(()=>{

        slideArea.innerHTML = slides[index]

        slideArea.classList.remove("slide-exit")
        slideArea.classList.add("slide-enter")

        setTimeout(()=>{
            slideArea.classList.remove("slide-enter")
            slideArea.classList.add("slide-active")
        },50)

        animationStep = 0
        prepareAnimations()

    },300)

}



/* -----------------------------
   NEXT / PREVIOUS SLIDES
-------------------------------- */

function nextSlide(){

    if(currentSlide < slides.length-1){

        currentSlide++

        loadSlide(currentSlide)

    }

}



function prevSlide(){

    if(currentSlide > 0){

        currentSlide--

        loadSlide(currentSlide)

    }

}



/* -----------------------------
   CLICK TO REVEAL ANIMATION
-------------------------------- */

document.addEventListener("click", ()=>{

    runNextAnimation()

})



function runNextAnimation(){

    const elements = document.querySelectorAll("[data-step]")

    elements.forEach(el => {

        if(parseInt(el.dataset.step) === animationStep){

            gsap.to(el,{
                opacity:1,
                y:0,
                scale:1,
                duration:0.6
            })

        }

    })

    animationStep++

}



/* -----------------------------
   PREPARE ELEMENTS
-------------------------------- */

function prepareAnimations(){

    const elements = document.querySelectorAll("[data-step]")

    elements.forEach(el => {

        el.style.opacity = 0
        el.style.transform = "translateY(20px)"

    })

}



/* -----------------------------
   BUTTON CONTROLS
-------------------------------- */

function setupControls(){

document
.getElementById("next-slide")
.addEventListener("click",nextSlide)

document
.getElementById("prev-slide")
.addEventListener("click",prevSlide)

document
.getElementById("draw-toggle")
.addEventListener("click",toggleDrawing)

document
.getElementById("ai-generate")
.addEventListener("click",generateSlides)

}



/* -----------------------------
   KEYBOARD CONTROLS
-------------------------------- */

function setupKeyboard(){

document.addEventListener("keydown",(e)=>{

    if(e.key === "ArrowRight") nextSlide()

    if(e.key === "ArrowLeft") prevSlide()

    if(e.key === "f") toggleFullscreen()

    if(e.key === "d") toggleDrawing()

})

}



/* -----------------------------
   FULLSCREEN MODE
-------------------------------- */

function toggleFullscreen(){

    document.body.classList.toggle("fullscreen")

}



/* -----------------------------
   TOPIC NAVIGATION
-------------------------------- */

function jumpToSlide(index){

    currentSlide = index

    loadSlide(currentSlide)

}
