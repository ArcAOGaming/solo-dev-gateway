import { useRef, useMemo } from 'react';
import { useFrame, Canvas, extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BufferAttribute, ShaderMaterial } from 'three';
import './Portal.css';

// Custom shader for the portal effect
const portalShader = {
    vertexShader: `
        varying vec2 vUv;
        varying float vDistance;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vPosition = position;
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            // Calculate distance from center
            vDistance = length(position.xy);
            
            gl_Position = projectedPosition;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying float vDistance;
        varying vec3 vPosition;
        uniform float uTime;

        // Noise function
        float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
        
        float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);
            
            float res = mix(
                mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
                mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
            return res*res;
        }
        
        float getSwirlPattern(float angle, float dist, float time) {
            float speed = -1.0 - dist; // Faster in center
            float twist = 8.0 + dist * 4.0; // More twists near center
            float slowdownFactor = 1.0 / (1.0 + pow(max(0.0, abs(time) - 5.0), 2.0));
            return sin(angle * 2.0 + dist * twist + time * speed * slowdownFactor) * 0.5 + 0.5;    
        }

        float getPortalMask(float dist) {
            // Smooth exponential falloff
            float mask = exp(-dist * dist * 1.5);
            return mask;
        }

        float getCoreMask(float dist) {
            float core = 1.0 - smoothstep(0.0, 0.7, dist);
            return pow(core, 0.8); // Softer core falloff
        }

        void main() {
            float dist = vDistance / 2.5; // Larger scale for softer edges
            vec2 center = vUv - 0.5;
            float angle = atan(center.y, center.x);
            
            // Base masks with smooth falloff
            float portalMask = getPortalMask(dist);
            float coreMask = getCoreMask(dist);
            
            // Enhanced swirl pattern
            float mainSwirl = getSwirlPattern(angle, dist, uTime);
            float secondarySwirl = getSwirlPattern(angle * 1.5, dist, -uTime * 0.7);
            float swirl = mix(mainSwirl, secondarySwirl, 0.3);
            
            // Multi-layered noise with movement
            float baseNoise = noise(vec2(angle * 3.0 + uTime * 0.2, dist * 6.0));
            float detailNoise = noise(vec2(angle * 5.0 - uTime * 0.3, dist * 12.0));
            float noiseVal = baseNoise * 0.7 + detailNoise * 0.3;
            
            // Core glow with swirl influence
            float coreGlow = coreMask * (0.8 + swirl * 0.4 + noiseVal * 0.2);
            
            // Outer swirl with smooth fade
            float outerSwirl = (1.0 - coreMask) * swirl * portalMask * 0.8;
            
            // Combine effects with stronger swirl visibility
            float finalMask = coreGlow + outerSwirl;
            
            // Adjusted colors for better contrast
            vec3 coreColor = vec3(0.95, 0.95, 1.0); // Slightly blue-tinted white
            vec3 midColor = vec3(0.4, 0.7, 1.0);
            vec3 outerColor = vec3(0.1, 0.3, 0.8);
            
            // Enhanced color blending
            vec3 color;
            float colorDist = dist * (1.0 + swirl * 0.2); // Swirl affects color distribution
            if (colorDist < 0.3) {
                color = mix(coreColor, midColor, smoothstep(0.0, 0.3, colorDist));
            } else {
                color = mix(midColor, outerColor, smoothstep(0.3, 0.8, colorDist));
            }
            
            // Add swirl-based variation
            color = mix(color, color * (0.7 + swirl * 0.6), 1.0 - coreMask);
            
            // Smooth alpha falloff
            float alpha = finalMask * portalMask;
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const PortalEffect = () => {
    const portalRef = useRef<THREE.Group>(null);
    const time = useRef(0);

    // Create a large high-resolution triangulated plane for the portal
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(12, 12, 256, 256); // Much larger plane to avoid visible edges
        return geo;
    }, []);

    // Create custom shader material
    const material = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: portalShader.vertexShader,
            fragmentShader: portalShader.fragmentShader,
            uniforms: {
                uTime: { value: 0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true,
        });
    }, []);

    useFrame((state, delta) => {
        if (material) {
            time.current += delta;
            material.uniforms.uTime.value = time.current;
        }
        if (portalRef.current) {
            portalRef.current.rotation.z += delta * 0.08; // Slightly slower rotation
        }
    });

    return (
        <group ref={portalRef}>
            <mesh geometry={geometry} material={material} />
        </group>
    );
};

export const Portal = () => {
    return (
        <div className="portal-wrapper">
            <div className="portal-container">
                <Canvas
                    className="portal-canvas"
                    camera={{ position: [0, 0, 5], fov: 45 }} // Narrower FOV
                    dpr={window.devicePixelRatio}
                >
                    <color attach="background" args={['#000000']} />
                    <ambientLight intensity={0.5} />
                    <PortalEffect />
                    <EffectComposer>
                        <Bloom
                            intensity={1.2}
                            luminanceThreshold={0.3}
                            luminanceSmoothing={0.8}
                            mipmapBlur
                            radius={0.7}
                        />
                    </EffectComposer>
                </Canvas>
            </div>
        </div>
    );
};
