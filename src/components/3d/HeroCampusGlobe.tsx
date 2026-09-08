"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCampusGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Core Sphere Wireframe
    const sphereGeo = new THREE.SphereGeometry(1, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // Inner Glowing Core
    const innerGeo = new THREE.SphereGeometry(0.96, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0a2540,
      transparent: true,
      opacity: 0.4,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // Atmospheric Glow Points (Star particles around globe)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.0 + Math.random() * 0.45;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      // Gold and Cyan accents
      if (Math.random() > 0.5) {
        colors[i] = 0.95; // R (Gold)
        colors[i + 1] = 0.71; // G
        colors[i + 2] = 0.0; // B
      } else {
        colors[i] = 0.0; // R (Azure)
        colors[i + 1] = 0.55; // G
        colors[i + 2] = 1.0; // B
      }
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // Himalayan / Mandi Focus Marker (Glowing Pin)
    const markerGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xf4b400 });
    const mandiMarker = new THREE.Mesh(markerGeo, markerMat);
    // Position approx representing Himachal / North India
    mandiMarker.position.set(0.45, 0.55, 0.7);
    globeGroup.add(mandiMarker);

    // Orbital Rings
    const ringGeo = new THREE.RingGeometry(1.2, 1.22, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf4b400,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    globeGroup.add(ring);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      globeGroup.rotation.y = elapsedTime * 0.15 + targetX * 0.4;
      globeGroup.rotation.x = 0.2 + targetY * 0.3;
      ring.rotation.z = elapsedTime * 0.2;

      // Pulse the Mandi Marker
      const scale = 1 + Math.sin(elapsedTime * 4) * 0.3;
      mandiMarker.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Badge Overlays */}
      <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center space-x-2.5 animate-bounce">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          📍 Mandi Campus: Active
        </span>
      </div>

      <div className="absolute bottom-6 left-6 bg-slate-900 text-white p-3 rounded-xl border border-slate-700 max-w-[200px] text-xs shadow-2xl hidden sm:block">
        <p className="font-semibold text-amber-400">Global Cambridge Standard</p>
        <p className="text-[11px] text-slate-300 mt-0.5">Blended with CBSE Affiliation No. 630198</p>
      </div>
    </div>
  );
}
