// scene.js — Three.js r128 particle scene with scroll-driven camera lerp
(function() {
  'use strict';

  var canvas, renderer, scene, camera, particles, animFrame;
  var mouseX = 0, mouseY = 0;
  var targetX = 0, targetY = 0;
  var scrollProgress = 0;
  var targetScrollProgress = 0;

  function init() {
    canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Detect WebGL
    try {
      var testCtx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!testCtx) throw new Error('no webgl');
    } catch(e) {
      document.getElementById('webgl-fallback').style.display = 'block';
      canvas.style.display = 'none';
      return;
    }

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Scene & camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);

    buildParticles();
    buildConnections();
    addLights();

    // Events
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);

    animate();
  }

  function buildParticles() {
    var count = 1200;
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var sizes = new Float32Array(count);

    for (var i = 0; i < count; i++) {
      var i3 = i * 3;
      pos[i3]     = (Math.random() - 0.5) * 160;
      pos[i3 + 1] = (Math.random() - 0.5) * 120;
      pos[i3 + 2] = (Math.random() - 0.5) * 80;

      var t = Math.random();
      colors[i3]     = t < 0.5 ? 0.1 + t * 0.3 : 0.0;
      colors[i3 + 1] = t < 0.5 ? 0.4 + t * 0.4 : 0.8 + t * 0.2;
      colors[i3 + 2] = 0.9 + Math.random() * 0.1;

      sizes[i] = Math.random() * 1.5 + 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var mat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });

    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  function buildConnections() {
    var lineGeo = new THREE.BufferGeometry();
    var linePositions = [];
    var n = 80;
    var pts = [];

    for (var i = 0; i < n; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40
      ));
    }

    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        if (pts[i].distanceTo(pts[j]) < 22) {
          linePositions.push(pts[i].x, pts[i].y, pts[i].z);
          linePositions.push(pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    var lineMat = new THREE.LineBasicMaterial({ color: 0x1B6EF3, transparent: true, opacity: 0.12 });
    var lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);
  }

  function addLights() {
    var amb = new THREE.AmbientLight(0x001a3a, 0.5);
    scene.add(amb);
    var point = new THREE.PointLight(0x00D4FF, 1.5, 200);
    point.position.set(30, 20, 30);
    scene.add(point);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onScroll() {
    var maxScroll = document.body.scrollHeight - window.innerHeight;
    targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  var clock = new THREE.Clock();

  function animate() {
    animFrame = requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    // Lerp mouse
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Lerp scroll
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

    // Rotate particles gently
    if (particles) {
      particles.rotation.y = t * 0.05 + targetX * 0.3;
      particles.rotation.x = t * 0.03 - targetY * 0.2;
    }

    // Camera responds to scroll with lerp
    camera.position.y = scrollProgress * -30;
    camera.position.x = targetX * 8;
    camera.lookAt(0, camera.position.y * 0.5, 0);

    renderer.render(scene, camera);
  }

  // Boot after THREE loaded
  function boot() {
    if (typeof THREE !== 'undefined') {
      init();
    } else {
      setTimeout(boot, 100);
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
