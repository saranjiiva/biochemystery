/* =========================================
   MEDICAL LECTURE VIEWER ENGINE
========================================= */

let slides = []
let currentSlide = 0



/* =========================================
   LOAD SLIDES
========================================= */

function loadSlides(){

slides = [

"slides/tca/slide1.html",
"slides/tca/slide2.html",
"slides/tca/slide3.html",
"slides/tca/slide4.html",
"slides/tca/slide5.html"

]

loadSlide(0)

updateCounter()

}



/* =========================================
   LOAD SINGLE SLIDE
========================================= */

function loadSlide(index){

const frame = document.getElementById("slideFrame")

frame.src = slides[index]

updateCounter()

}



/* =========================================
   NEXT SLIDE
========================================= */

function nextSlide(){

if(currentSlide < slides.length - 1){

currentSlide++

loadSlide(currentSlide)

}

}



/* =========================================
   PREVIOUS SLIDE
========================================= */

function prevSlide(){

if(currentSlide > 0){

currentSlide--

loadSlide(currentSlide)

}

}



/* =========================================
   SLIDE COUNTER
========================================= */

function updateCounter(){

const counter = document.getElementById("counter")

counter.innerText =
(currentSlide + 1) + " / " + slides.length

}



/* =========================================
   BUTTON CONTROLS
========================================= */

document
.getElementById("nextBtn")
.addEventListener("click", nextSlide)

document
.getElementById("prevBtn")
.addEventListener("click", prevSlide)



/* =========================================
   CLICK SLIDE TO ADVANCE
========================================= */

document
.getElementById("slideStage")
.addEventListener("click",(e)=>{

if(e.target.id !== "drawingCanvas")
nextSlide()

})



/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener("keydown",(e)=>{

if(e.key === "ArrowRight") nextSlide()

if(e.key === "ArrowLeft") prevSlide()

if(e.key === "f") toggleFullscreen()

if(e.key === "Escape") document.exitFullscreen()

})



/* =========================================
   FULLSCREEN MODE
========================================= */

function toggleFullscreen(){

const slideStage =
document.getElementById("slideStage")

if(!document.fullscreenElement){

slideStage.requestFullscreen()

}else{

document.exitFullscreen()

}

}

document
.getElementById("fullscreenBtn")
.addEventListener("click",toggleFullscreen)



/* =========================================
   SIDEBAR TOGGLE
========================================= */

document
.getElementById("menuToggle")
.addEventListener("click",()=>{

document
.getElementById("sidebar")
.classList.toggle("collapsed")

})



/* =========================================
   PRESENTER MODE
========================================= */

document
.getElementById("presenterMode")
.addEventListener("click",()=>{

document
.getElementById("presenterPanel")
.classList.toggle("active")

})



/* =========================================
   LASER POINTER
========================================= */

let laserActive = false

const laser =
document.getElementById("laserPointer")

document
.getElementById("laserToggle")
.addEventListener("click",()=>{

laserActive = !laserActive

laser.style.display =
laserActive ? "block" : "none"

})



document
.getElementById("slideStage")
.addEventListener("mousemove",(e)=>{

if(!laserActive) return

laser.style.left = e.clientX + "px"
laser.style.top = e.clientY + "px"

})



/* =========================================
   DRAWING MODE
========================================= */

let drawing = false

const canvas =
document.getElementById("drawingCanvas")

const ctx =
canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

document
.getElementById("drawToggle")
.addEventListener("click",()=>{

drawing = !drawing

canvas.style.pointerEvents =
drawing ? "auto" : "none"

})



canvas.addEventListener("mousedown",()=>{

if(!drawing) return

ctx.beginPath()

canvas.addEventListener("mousemove",draw)

})



canvas.addEventListener("mouseup",()=>{

canvas.removeEventListener("mousemove",draw)

})



function draw(e){

ctx.lineWidth = 3
ctx.strokeStyle = "red"
ctx.lineCap = "round"

ctx.lineTo(e.clientX,e.clientY)

ctx.stroke()

ctx.beginPath()

ctx.moveTo(e.clientX,e.clientY)

}



/* =========================================
   RESET SLIDE DRAWING
========================================= */

document
.getElementById("resetSlide")
.addEventListener("click",()=>{

ctx.clearRect(0,0,canvas.width,canvas.height)

})



/* =========================================
   AUTOPLAY
========================================= */

let autoPlay = false
let autoInterval

document
.getElementById("autoPlay")
.addEventListener("click",()=>{

autoPlay = !autoPlay

if(autoPlay){

autoInterval = setInterval(()=>{

nextSlide()

},5000)

}else{

clearInterval(autoInterval)

}

})



/* =========================================
   START VIEWER
========================================= */

window.onload = loadSlides
