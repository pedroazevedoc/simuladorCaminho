'use client'

import type { TipoLocal } from '@/types/city'
import { CONFIG_TELHADO, type VisualTipo } from '../config/visuals'

interface TelhadoProps {
  tipo: TipoLocal;
  dimensoes: VisualTipo['dimensoes'];
}

export function Telhado({ tipo, dimensoes }: TelhadoProps) {
  const config = CONFIG_TELHADO[tipo];
  const { largura, altura, profundidade } = dimensoes;

  return (
    <group position={[0, altura, 0]}>
      {/* Telhado em pirâmide (duas águas) para residências */}
      {config.tipo === 'piramide' && (
        <mesh
          position={[0, config.altura / 2, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <coneGeometry
            args={[Math.hypot(largura, profundidade) / 2, config.altura, 4]}
          />
          <meshStandardMaterial
            color={config.cor}
            roughness={config.rugosidade}
            metalness={config.metalness}
          />
        </mesh>
      )}

      {/* Laje plana sobre as paredes (comércios) */}
      {config.tipo === 'laje' && (
        <mesh position={[0, config.altura / 2, 0]} castShadow>
          <boxGeometry
            args={[
              largura + config.saliencia * 2,
              config.altura,
              profundidade + config.saliencia * 2,
            ]}
          />
          <meshStandardMaterial
            color={config.cor}
            roughness={config.rugosidade}
            metalness={config.metalness}
          />
        </mesh>
      )}

      {/* Laje com bloco central elevado (claraboia) para shoppings */}
      {config.tipo === 'laje-elevada' && (
        <>
          <mesh position={[0, config.altura / 2, 0]} castShadow>
            <boxGeometry
              args={[
                largura + config.saliencia * 2,
                config.altura,
                profundidade + config.saliencia * 2,
              ]}
            />
            <meshStandardMaterial
              color={config.cor}
              roughness={config.rugosidade}
              metalness={config.metalness}
            />
          </mesh>
          <mesh
            position={[0, config.altura + config.alturaElevada / 2, 0]}
            castShadow
          >
            <boxGeometry
              args={[
                largura * 0.45,
                config.alturaElevada,
                profundidade * 0.45,
              ]}
            />
            <meshStandardMaterial
              color={config.cor}
              roughness={config.rugosidade}
              metalness={config.metalness}
            />
          </mesh>
        </>
      )}
    </group>
  );
}