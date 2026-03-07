// Animation Engine

let animationTimeline



/* ---------------------------
   INITIALIZE ANIMATIONS
---------------------------- */

function initAnimations(){

    animationTimeline = gsap.timeline({ paused:true })

}



/* ---------------------------
   FADE IN ELEMENT
---------------------------- */

function fadeIn(element){

    gsap.fromTo(
        element,
        {opacity:0, y:30},
        {opacity:1, y:0, duration:0.8, ease:"power2.out"}
    )

}



/* ---------------------------
   ZOOM IN EFFECT
---------------------------- */

function zoomIn(element){

    gsap.fromTo(
        element,
        {opacity:0, scale:0.8},
        {opacity:1, scale:1, duration:0.7}
    )

}



/* ---------------------------
   SLIDE TITLE ANIMATION
---------------------------- */

function animateTitle(){

    const title = document.querySelector("#slide-content h1")

    if(!title) return

    gsap.from(title,{
        y:-80,
        opacity:0,
        duration:1,
        ease:"power3.out"
    })

}



/* ---------------------------
   BULLET CASCADE
---------------------------- */

function animateList(){

    const items = document.querySelectorAll("#slide-content li")

    gsap.from(items,{
        opacity:0,
        y:20,
        stagger:0.2,
        duration:0.6
    })

}



/* ---------------------------
   PATHWAY FLOW ANIMATION
---------------------------- */

function animatePathway(pathSelector){

    const steps = document.querySelectorAll(pathSelector)

    gsap.from(steps,{
        opacity:0,
        scale:0.6,
        stagger:0.4,
        duration:0.7
    })

}



/* ---------------------------
   ENZYME GLOW EFFECT
---------------------------- */

function enzymeGlow(element){

    gsap.to(element,{
        boxShadow:"0 0 20px #4fa3ff",
        repeat:-1,
        yoyo:true,
        duration:0.8
    })

}



/* ---------------------------
   MOLECULE FLOATING EFFECT
---------------------------- */

function floatingMolecule(element){

    gsap.to(element,{
        y:15,
        repeat:-1,
        yoyo:true,
        duration:2,
        ease:"sine.inOut"
    })

}



/* ---------------------------
   TRANSITION BETWEEN SLIDES
---------------------------- */

function cinematicTransition(){

    const slide = document.getElementById("slide-content")

    gsap.fromTo(
        slide,
        {opacity:0, scale:0.95},
        {opacity:1, scale:1, duration:0.8}
    )

}



/* ---------------------------
   AUTO ANIMATE SLIDE
---------------------------- */

function autoAnimateSlide(){

    animateTitle()

    animateList()

    cinematicTransition()

}
