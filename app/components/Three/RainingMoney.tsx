import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

// MoneyBill component
function MoneyBill({ texture }: any) {
  const mesh = useRef<any>(null);
  const [x, y, z] = useMemo(() => [Math.random() * 5 - 2.5, Math.random() * 5, Math.random() * 5 - 2.5], []);
  const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];

  useFrame(() => {
    if (mesh && mesh.current) {
      mesh.current.position.y -= 0.02;
      if (mesh.current.position.y < -5) {
        mesh.current.position.y = 5;
      }
    }
  });

  return (
    <mesh ref={mesh} position={[x, y, z]} rotation={rotation}>
      <planeGeometry args={[0.5, 0.25]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
}

// RainingMoneyBackground component
export default function RainingMoneyBackground() {
  const moneyTexture = useLoader(TextureLoader, 'moneyTexture.png');
  const billsCount = 200; // Number of money bills you want to rain

  return (
    <>
      {Array.from({ length: billsCount }).map((_, i) => (
        <MoneyBill key={i} texture={moneyTexture} />
      ))}
    </>
  );
}