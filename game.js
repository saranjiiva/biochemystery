let scene, camera, renderer, controls;
let player = { speed: 0.1, velocity: new THREE.Vector3() };
let keys = { forward:false, backward:false, left:false, right:false };

function initGame() {
  // Scene and Camera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,1.6,5); // Eye height

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Room (simple box)
  let roomGeometry = new THREE.BoxGeometry(10,5,10);
  let roomMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.BackSide });
  let room = new THREE.Mesh(roomGeometry, roomMaterial);
  scene.add(room);

  // Floor
  let floorGeometry = new THREE.PlaneGeometry(10,10);
  let floorMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI/2;
  scene.add(floor);

  // Lights
  let light = new THREE.PointLight(0xffffff,1);
  light.position.set(0,4,0);
  scene.add(light);

  // Touch Controls
  document.addEventListener("touchstart", touchStart);
  document.addEventListener("touchmove", touchMove);
  document.addEventListener("touchend", touchEnd);

  // Keyboard Controls (optional for desktop)
  document.addEventListener("keydown", e => { if(e.key==="w") keys.forward=true; if(e.key==="s") keys.backward=true; if(e.key==="a") keys.left=true; if(e.key==="d") keys.right=true; });
  document.addEventListener("keyup", e => { if(e.key==="w") keys.forward=false; if(e.key==="s") keys.backward=false; if(e.key==="a") keys.left=false; if(e.key==="d") keys.right=false; });

  animate();
}

// Basic touch navigation
let touchX, touchY;
function touchStart(e){ 
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
}
function touchMove(e){
  let deltaX = e.touches[0].clientX - touchX;
  let deltaY = e.touches[0].clientY - touchY;
  camera.rotation.y -= deltaX * 0.002;
  camera.rotation.x -= deltaY * 0.002;
  camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
}
function touchEnd(e){}

// Update player movement
function updatePlayer() {
  let dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  dir.y = 0; // lock Y
  dir.normalize();

  if(keys.forward) camera.position.add(dir.clone().multiplyScalar(player.speed));
  if(keys.backward) camera.position.add(dir.clone().multiplyScalar(-player.speed));

  let strafe = new THREE.Vector3();
  strafe.crossVectors(camera.up, dir).normalize();
  if(keys.left) camera.position.add(strafe.clone().multiplyScalar(player.speed));
  if(keys.right) camera.position.add(strafe.clone().multiplyScalar(-player.speed));
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  renderer.render(scene, camera);
}

// Resize
window.addEventListener("resize", ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
