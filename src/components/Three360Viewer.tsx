
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Three360ViewerProps {
  imageUrl: string;
}

export const Three360Viewer: React.FC<Three360ViewerProps> = ({ imageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.target = new THREE.Vector3(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 128, 128);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    const texture = loader.load(imageUrl, () => {
        console.log("360 Texture Loaded Successfully");
    }, undefined, (err) => {
        console.error("Error loading texture:", err);
    });

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let isUserInteracting = false;
    let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
    let lon = 0, onPointerDownLon = 0;
    let lat = 0, onPointerDownLat = 0;
    let phi = 0, theta = 0;

    const onPointerDown = (event: PointerEvent) => {
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isUserInteracting) return;
      lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
    };

    const onWheel = (event: WheelEvent) => {
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.MathUtils.clamp(fov, 20, 95);
      camera.updateProjectionMatrix();
    };

    const onWindowResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onWindowResize);
    containerRef.current.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    containerRef.current.addEventListener('wheel', onWheel);

    const animate = () => {
      requestAnimationFrame(animate);
      
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      containerRef.current?.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      containerRef.current?.removeEventListener('wheel', onWheel);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [imageUrl]);

  return <div ref={containerRef} className="w-full h-full" />;
};
