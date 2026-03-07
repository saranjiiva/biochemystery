let slides = [

"slides/adipose/slide1.html",
"slides/adipose/slide2.html",
"slides/adipose/slide3.html",
"slides/adipose/slide4.html",
"slides/adipose/slide5.html"

]

let currentSlide = 0



function loadSlide(index){

const frame = document.getElementById("slideFrame")

frame.src = slides[index]

updateCounter()

}



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



function goSlide(index){

currentSlide = index

loadSlide(currentSlide)

}



function updateCounter(){

document.getElementById("counter")
.innerText = (currentSlide+1)+" / "+slides.length

}



/* BUTTONS */

document.getElementById("nextBtn")
.addEventListener("click",nextSlide)

document.getElementById("prevBtn")
.addEventListener("click",prevSlide)



/* KEYBOARD */

document.addEventListener("keydown",(e)=>{

if(e.key==="ArrowRight") nextSlide()

if(e.key==="ArrowLeft") prevSlide()

})



/* FULLSCREEN */

const stage = document.getElementById("slideStage")

document.getElementById("fullscreenBtn")
.addEventListener("click",()=>{

if(!document.fullscreenElement){

stage.requestFullscreen()

}else{

document.exitFullscreen()

}

})



/* COLLAPSIBLE TOPICS */

document.querySelectorAll(".topic-header")
.forEach(header=>{

header.addEventListener("click",()=>{

const list = header.nextElementSibling

list.style.display =
list.style.display === "none" ? "block" : "none"

})

})



/* LOAD FIRST SLIDE */

window.onload = () => {

loadSlide(0)

}
