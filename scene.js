/* scene.js — Three.js r128 particles + scroll camera */
(function() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  let renderer, scene, camera, particles, animId;
  let mouseX = 0, mouseY = 0;
  let targetCamX = 0, targetCamY = 0;
  let scrollProgress = 0;

  function init() {
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      camera.position.set(0, 0, 5);

      buildParticles();
      buildConnections();
      animate();

      window.addEventListener('resize', onResize);
      document.addEventListener('mousemove', onMouse);
      window.addEventListener('scroll', onScroll);

      // hide fallback
      const fb = document.querySelector('.hero-fallback');
      if (fb) fb.style.display = 'none';

    } catch(e) {
      console.warn('WebGL not available, using CSS fallback');
      canvas.style.display = 'none';
    }
  }

  function buildParticles() {
    const count = 220;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - .5) * 18;
      pos[i * 3 + 1] = (Math.random() - .5) * 14;
      pos[i * 3 + 2] = (Math.random() - .5) * 8;
      sizes[i] = Math.random() * 3 + 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0x00D4FF,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  function buildConnections() {
    const lineGeo = new THREE.BufferGeometry();
    const pts = [];
    const n = 60;
    for (let i = 0; i < n; i++) {
      const x1 = (Math.random() - .5) * 16;
      const y1 = (Math.random() - .5) * 12;
      const z1 = (Math.random() - .5) * 6;
      const x2 = x1 + (Math.random() - .5) * 4;
      const y2 = y1 + (Math.random() - .5) * 4;
      const z2 = z1 + (Math.random() - .5) * 2;
      pts.push(x1,y1,z1, x2,y2,z2);
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1B6EF3, transparent: true, opacity: 0.18 });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    // lerp camera toward mouse
    targetCamX = mouseX * 0.8;
    targetCamY = -mouseY * 0.5;
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;

    // scroll moves camera Z
    const scrollZ = 5 + scrollProgress * 3;
    camera.position.z += (scrollZ - camera.position.z) * 0.05;

    if (particles) {
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;
    }

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function onResize() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function onMouse(e) {
    mouseX = (e.clientX / window.innerWidth - .5) * 2;
    mouseY = (e.clientY / window.innerHeight - .5) * 2;
  }

  function onScroll() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = window.scrollY / maxScroll;
    // update progress bar
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = (scrollProgress * 100) + '%';
  }

  // wait for Three.js to load
  if (typeof THREE !== 'undefined') {
    init();
  } else {
    window.addEventListener('three-ready', init);
  }
})();
