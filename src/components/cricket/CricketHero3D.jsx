
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import "./CricketHero3D.css";

function CricketBall() {
  const ballRef = useRef(null);
  const seamRef = useRef(null);

  const seamGeometry = useMemo(() => {
    const radius = 1.015;
    const points = [];
    const count = 160;
    const tilt = 0.62;

    for (let i = 0; i <= count; i += 1) {
      const t = (i / count) * Math.PI * 2;

      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t) * Math.cos(tilt);
      const z = radius * Math.sin(t) * Math.sin(tilt);

      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, false);
    return new THREE.TubeGeometry(curve, 180, 0.018, 8, false);
  }, []);

  const stitchGeometry = useMemo(() => {
    const positions = [];
    const radius = 1.025;
    const tilt = 0.62;

    for (let i = 0; i < 40; i += 1) {
      const t = (i / 40) * Math.PI * 2;
      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t) * Math.cos(tilt);
      const z = radius * Math.sin(t) * Math.sin(tilt);

      const direction = new THREE.Vector3(x, y, z).normalize();
      const tangent = new THREE.Vector3(
        -Math.sin(t),
        Math.cos(t) * Math.cos(tilt),
        Math.cos(t) * Math.sin(tilt)
      ).normalize();

      const start = direction.clone().multiplyScalar(radius);
      const end = start.clone().addScaledVector(tangent, 0.035);

      positions.push(start.x, start.y, start.z);
      positions.push(end.x, end.y, end.z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (!ballRef.current) return;

    const time = state.clock.elapsedTime;

    ballRef.current.rotation.y += delta * 0.25;
    ballRef.current.rotation.x = Math.sin(time * 0.35) * 0.12;
    ballRef.current.rotation.z = Math.sin(time * 0.24) * 0.08;

    // Subtle mouse parallax, without blocking existing Home page buttons.
    ballRef.current.rotation.y += state.pointer.x * delta * 0.12;
    ballRef.current.rotation.x += -state.pointer.y * delta * 0.08;

    if (seamRef.current) {
      seamRef.current.rotation.y = Math.sin(time * 0.25) * 0.06;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.18}
      floatIntensity={0.55}
      floatingRange={[-0.18, 0.18]}
    >
      <group ref={ballRef} scale={1.15}>
        {/* Main leather ball */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial
            color="#8f1018"
            roughness={0.29}
            metalness={0.04}
            clearcoat={0.85}
            clearcoatRoughness={0.22}
          />
        </mesh>

        {/* Raised red seam */}
        <mesh
          ref={seamRef}
          geometry={seamGeometry}
          castShadow
        >
          <meshStandardMaterial
            color="#ffb3a1"
            emissive="#7f101a"
            emissiveIntensity={0.6}
            roughness={0.55}
          />
        </mesh>

        {/* Stitch marks */}
        <lineSegments geometry={stitchGeometry}>
          <lineBasicMaterial color="#ffd1bd" />
        </lineSegments>

        {/* Fine leather grain */}
        <mesh scale={1.002}>
          <sphereGeometry args={[1, 40, 40]} />
          <meshStandardMaterial
            color="#a51c25"
            roughness={0.72}
            wireframe
            transparent
            opacity={0.035}
          />
        </mesh>
      </group>
    </Float>
  );
}

function SceneContents() {
  const particlesRef = useRef(null);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.018;
      particlesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.12) * 0.035;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={2.2}
        color="#fff0e5"
      />

      <pointLight
        position={[-4, 1, 3]}
        intensity={45}
        distance={10}
        color="#ff263d"
      />

      <pointLight
        position={[3, -2, -3]}
        intensity={30}
        distance={9}
        color="#e9f3ff"
      />

      <group ref={particlesRef}>
        <Sparkles
          count={100}
          scale={[8, 5, 5]}
          size={2.2}
          speed={0.28}
          opacity={0.7}
          color="#ffb2a0"
        />

        <Sparkles
          count={55}
          scale={[10, 6, 7]}
          size={1.2}
          speed={0.12}
          opacity={0.35}
          color="#ffffff"
        />
      </group>

      <CricketBall />
    </>
  );
}

export default function CricketHero3D() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const element = sceneRef.current;
    if (!element) return;

    const handlePointerMove = (event) => {
      const rect = element.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      element.style.setProperty(
        "--pointer-x",
        `${(x - 0.5) * 2}`
      );
      element.style.setProperty(
        "--pointer-y",
        `${(y - 0.5) * 2}`
      );
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="bcl-3d-scene"
      aria-hidden="true"
    >
      <div className="bcl-3d-glow" />

      <div className="bcl-3d-ball">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 0);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
          }}
        >
          <SceneContents />
        </Canvas>
      </div>

      <div className="bcl-3d-vignette" />
    </div>
  );
}
