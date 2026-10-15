
import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./AntigravityBackground.css";

export default function AntigravityBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    let animationFrame;
    let resizeObserver;
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error("Unable to initialize particle animation:", error);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const colors = [0xffffff, 0xffffff, 0xe32936, 0x242424];
    const particleCount = window.innerWidth < 700 ? 1800 : 3600;
    const positions = new Float32Array(particleCount * 3);
    const origins = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);

    const rand = (min, max) => min + Math.random() * (max - min);

    // Several overlapping, irregular particle clouds.
    const centers = [
      { x: -4.2, y: 0.4, z: -0.7, r: 1.6 },
      { x: -1.7, y: 1.3, z: -1.5, r: 1.35 },
      { x: 0.7, y: -0.9, z: -0.4, r: 1.55 },
      { x: 3.1, y: 0.6, z: -1.3, r: 1.7 },
      { x: 4.8, y: -1.1, z: -0.8, r: 1.25 },
    ];

    for (let i = 0; i < particleCount; i++) {
      const center = centers[Math.floor(Math.random() * centers.length)];
      const u = Math.random() * 2 - 1;
      const angle = Math.random() * Math.PI * 2;
      const shell = Math.pow(Math.random(), 0.6) * center.r;
      const ring = Math.sqrt(1 - u * u);

      const index = i * 3;
      const x = center.x + Math.cos(angle) * ring * shell;
      const y = center.y + u * shell;
      const z = center.z + Math.sin(angle) * ring * shell;

      origins[index] = x;
      origins[index + 1] = y;
      origins[index + 2] = z;

      positions[index] = x;
      positions[index + 1] = y;
      positions[index + 2] = z;

      sizes[i] = rand(0.012, 0.038);

      const color = new THREE.Color(
        Math.random() > 0.91
          ? colors[2]
          : Math.random() > 0.76
            ? colors[3]
            : colors[0]
      );

      particleColors[index] = color.r;
      particleColors[index + 1] = color.g;
      particleColors[index + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );
    geometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1)
    );

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const cloud = new THREE.Points(geometry, material);
    scene.add(cloud);

    // Additional fine dust creates depth and motion.
    const dustCount = window.innerWidth < 700 ? 300 : 800;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeeds = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = rand(-9, 9);
      dustPositions[i * 3 + 1] = rand(-5, 5);
      dustPositions[i * 3 + 2] = rand(-4, 2);
      dustSpeeds[i] = rand(0.3, 1.5);
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );

    const dustMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;
    let previousTime = 0;

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect();

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      pointerActive = inside;

      if (inside) {
        targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const handlePointerLeave = () => {
      pointerActive = false;
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    container.addEventListener("pointerleave", handlePointerLeave);

    const clock = new THREE.Clock();

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height || disposed) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    function animate() {
      if (disposed) return;

      animationFrame = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.04);
      const frameScale = Math.min(delta * 60, 2);

      pointerX += (targetX - pointerX) * 0.12;
      pointerY += (targetY - pointerY) * 0.12;

      const positionAttribute = geometry.attributes.position;
      const currentPositions = positionAttribute.array;

      // Faster organic swirling plus mouse-driven particle repulsion.
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;

        const ox = origins[index];
        const oy = origins[index + 1];
        const oz = origins[index + 2];

        let x = currentPositions[index];
        let y = currentPositions[index + 1];
        let z = currentPositions[index + 2];

        const phase = i * 0.017;

        // Animated target position: flowing and twisting clouds.
        const waveX =
          Math.sin(elapsed * 1.45 + phase + oy) * 0.19;
        const waveY =
          Math.cos(elapsed * 1.7 + phase + ox * 0.7) * 0.24;
        const waveZ =
          Math.sin(elapsed * 1.2 + phase + oz) * 0.16;

        let tx = ox + waveX;
        let ty = oy + waveY;
        let tz = oz + waveZ;

        // Mouse repulsion in the visible hero area.
        if (pointerActive) {
          const mouseWorldX = pointerX * 5.5;
          const mouseWorldY = pointerY * 3.0;

          const dx = x - mouseWorldX;
          const dy = y - mouseWorldY;
          const distanceSquared = dx * dx + dy * dy;
          const radius = 2.3;

          if (distanceSquared < radius * radius) {
            const distance = Math.sqrt(distanceSquared) + 0.001;
            const force =
              Math.pow(1 - distance / radius, 2) * 1.5;

            tx += (dx / distance) * force;
            ty += (dy / distance) * force;
            tz += force * 0.45;
          }
        }

        // Spring-like movement toward each moving target.
        const spring = 0.075 * frameScale;
        const drag = Math.pow(0.88, frameScale);

        velocities[index] =
          (velocities[index] + (tx - x) * spring) * drag;
        velocities[index + 1] =
          (velocities[index + 1] + (ty - y) * spring) * drag;
        velocities[index + 2] =
          (velocities[index + 2] + (tz - z) * spring) * drag;

        currentPositions[index] += velocities[index] * frameScale;
        currentPositions[index + 1] += velocities[index + 1] * frameScale;
        currentPositions[index + 2] += velocities[index + 2] * frameScale;
      }

      positionAttribute.needsUpdate = true;

      // Dust drifts quickly through the depth of the scene.
      const dustAttribute = dustGeometry.attributes.position;
      const dp = dustAttribute.array;

      for (let i = 0; i < dustCount; i++) {
        const index = i * 3;
        dp[index] += Math.sin(elapsed * 1.8 + i) * 0.002 * dustSpeeds[i] * frameScale;
        dp[index + 1] += dustSpeeds[i] * 0.012 * frameScale;

        if (dp[index + 1] > 5) dp[index + 1] = -5;
      }

      dustAttribute.needsUpdate = true;

      // Global movement responds to the cursor.
      camera.position.x +=
        (pointerX * 1.25 - camera.position.x) * 0.055;
      camera.position.y +=
        (pointerY * 0.7 - camera.position.y) * 0.055;
      camera.position.z = 12 + Math.sin(elapsed * 0.45) * 0.18;
      camera.lookAt(pointerX * 0.45, pointerY * 0.25, 0);

      cloud.rotation.y = elapsed * 0.13;
      cloud.rotation.z = Math.sin(elapsed * 0.55) * 0.045;
      dust.rotation.z = elapsed * 0.035;

      renderer.render(scene, camera);
      previousTime = elapsed;
    }

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver?.disconnect();

      geometry.dispose();
      material.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="antigravity-background"
      aria-hidden="true"
    />
  );
}
