import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function FileCompressionScene() {
  const groupRef = useRef();
  const filesGroupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
    if (filesGroupRef.current) {
      filesGroupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group>
      {/* Central compression cube */}
      <group ref={groupRef}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.8, 1.8, 3, 3, 3]} />
          <meshStandardMaterial color="#4a7f6a" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Glowing center */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Rotating files */}
      <group ref={filesGroupRef}>
        {/* ZIP file */}
        <group position={[2.2, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 0.5, 0.1]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.13} color="white" anchorX="center" anchorY="middle">
            ZIP
          </Text>
        </group>

        {/* PDF file */}
        <group position={[-2.2, 0.4, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 0.5, 0.1]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.13} color="white" anchorX="center" anchorY="middle">
            PDF
          </Text>
        </group>

        {/* JPG file */}
        <group position={[0, 0.5, 2.2]}>
          <mesh>
            <boxGeometry args={[0.4, 0.5, 0.1]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.13} color="white" anchorX="center" anchorY="middle">
            JPG
          </Text>
        </group>

        {/* DOC file */}
        <group position={[0, 0.4, -2.2]}>
          <mesh>
            <boxGeometry args={[0.4, 0.5, 0.1]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.13} color="white" anchorX="center" anchorY="middle">
            DOC
          </Text>
        </group>

        {/* MP3 file */}
        <group position={[1.6, -0.3, 1.6]}>
          <mesh>
            <boxGeometry args={[0.35, 0.45, 0.1]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
            MP3
          </Text>
        </group>

        {/* PNG file */}
        <group position={[-1.6, -0.3, -1.6]}>
          <mesh>
            <boxGeometry args={[0.35, 0.45, 0.1]} />
            <meshStandardMaterial color="#14b8a6" />
          </mesh>
          <Text position={[0, 0, 0.08]} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
            PNG
          </Text>
        </group>
      </group>
    </group>
  );
}

export default function FileHero3D() {
  return (
    <div className="w-full h-80 md:h-96 lg:h-[450px]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]} intensity={1.2} color="#22c55e" />
        <pointLight position={[-6, -6, -6]} intensity={0.8} color="#a855f7" />
        <spotLight position={[0, 6, 4]} angle={0.4} penumbra={1} castShadow />

        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
          <FileCompressionScene />
        </Float>
      </Canvas>
    </div>
  );
}
