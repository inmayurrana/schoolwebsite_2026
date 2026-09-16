"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Faculty3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry: Floating 3D Geometric Ring / Torus & Particles
    const group = new THREE.Group();
    scene.add(group);

    // Torus Wireframe (Golden Ring of Knowledge)
    const torusGeo = new THREE.TorusGeometry(32, 4, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Amber
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    group.add(torus);

    // Secondary Blue Orbital Ring
    const ringGeo = new THREE.TorusGeometry(42, 1.5, 12, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Sky blue
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.y = Math.PI / 4;
    group.add(ring);

    // Starfield Particle Constellation
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 160;
      positions[i + 1] = (Math.random() - 0.5) * 120;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfcd34d,
      size: 1.8,
      transparent: true,
      opacity: 0.45,
    });

    const particles = new THREE.Points(geometry, particleMat);
    group.add(particles);

    // Interactive mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 0.4;
      mouseY = (e.clientY / innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      torus.rotation.z += 0.002;
      ring.rotation.x += 0.0015;
      ring.rotation.z -= 0.001;

      group.rotation.y += (mouseX - group.rotation.y) * 0.04;
      group.rotation.x += (-mouseY - group.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      geometry.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-80"
      style={{ zIndex: 0 }}
    />
  );
}