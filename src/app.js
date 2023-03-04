import React, { useRef, useState, useEffect, useCallback, useLayoutEffect, Suspense } from 'react'
import { render } from 'react-dom'

import "./style.css"
import 'bootstrap/dist/css/bootstrap.min.css';

import firebase from 'firebase/app';
//import react three fiber
// import { Canvas, useFrame, useThree, useGraph } from '@react-three/fiber'
// import { useLoader } from '@react-three/fiber'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
// import loco from './assets/3d/locomotive/material/locomotive.obj'
// import locoMtl from './assets/3d/locomotive/material/locomotive.mtl'
// // import passenger from './assets/3d/passenger/textured/passengerwagon.fbx'
// import passenger from './assets/3d/passenger/materials/passengerwagon.obj'
// import passengerMtl from './assets/3d/passenger/materials/passengerwagon.mtl'
// import { OrbitControls } from '@react-three/drei';
// import { OBJLoader } from 'three-stdlib';

// import * as THREE from 'three'

import { TextField } from '@mui/material';
import getHangul from './hangul';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

var timeout = ''

function Model(props) {
    const scene = useLoader(OBJLoader, props.url)
    const { nodes, materials } = useGraph(scene)
    console.log(nodes[Object.keys(nodes)[0]])
    return <mesh geometry={nodes[Object.keys(nodes)[0]].geometry} material={materials.metal} />
}

function ImportFBX(props) {
    const [model, setModel] = useState()

    useEffect(() => {
        new MTLLoader().load(props.matUrl, materials => {
            materials.preload();
            console.log(materials);
            //materials.Material.side = THREE.DoubleSide;
            console.log("Loaded Materials");
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                props.url,
                object => {
                    // create phong material for the object
                    console.log(object)
                    // object.children[0].material = new THREE.MeshPhongMaterial({ 
                    //     color: 0x000000,
                    //     specular: 0x111111,
                    //     shininess: 200
                    // });

                    setModel(object)
                },
                xhr => {
                    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                },
                // called when loading has errors
                error => {
                    console.log("An error happened" + error);
                }
            );
        })

    }, [props.url, props.matUrl])

    return (
        <mesh>
            {model && <primitive object={model} />}
            <meshPhongMaterial attach="material" color="red" />
        </mesh>
    )

}

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
        mesh.current.rotation.x = mesh.current.rotation.y += 0.01
    })

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
        >
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />

        </mesh>
    )
}

function Train() {
    return (
        <div className="page">
            <h1>bryant hargreaves</h1>
            <Canvas className='canvas'>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/* <Box position={[-1.2, 0, 0]} /> */}
                {/* <Box position={[1.2, 0, 0]} /> */}
                <Suspense fallback={null}>
                    <group scale={[0.1, 0.1, 0.1]}  >
                        <ImportFBX url={loco} matUrl={locoMtl} />
                    </group>
                    <group scale={[0.1, 0.1, 0.1]} position={[0, 0, -14]} >
                        {/* <ImportFBX url={passenger} matUrl={passengerMtl} /> */}
                    </group>
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    )
}

function App() {

    const [currentThing, setCurrentThing] = useState("")

    function onTextChange(e) {
        console.log(e.target.value)
        setCurrentThing(getHangul(e.target.value))
    }

    function copyElementText(e) {
        if (currentThing == "") {
            return
        }

        // get root element for variable scope
        var r = document.querySelector(':root');

        r.style.setProperty('--card-color', "#1a36a6");
        r.style.setProperty('--offset', "0px");
        setTimeout(() => {
            r.style.setProperty('--card-color', "#1d1d1d");
        }, 250);

        setTimeout(() => {
            r.style.setProperty('--offset', "100px");
        }, 2000);

        navigator.clipboard.writeText(currentThing).then(function () {
            console.log('Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    function hoverEffect(e) {
        const card = e.target;
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        card.style.setProperty("--mouseX", `${x}px`);
        card.style.setProperty("--mouseY", `${y}px`);
    }

    return (<div className='page'>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <TextField id="outlined-basic" label="Phonetic Korean" variant="standard" onChange={onTextChange} />

            <div className='relative'>
                <div onClick={copyElementText} onMouseMove={hoverEffect} className='output'>
                    <hi className="faketext" onClick={copyElementText}>{currentThing}</hi>
                    <h1 className='output-content' onClick={copyElementText}>{currentThing}</h1>
                </div>
            </div>

            <p className='info'>
                This is a tool to convert English Phonetic to Korean Characters. Ex: "ko" -{'>'} "코" <br/> (it's is for people who are too lazy to find a korean keyboard)

            </p>

            <div className='copied'>
                <h5>"{currentThing}" has been copied to your clipboard</h5>
            </div>


        </ThemeProvider>
    </div>
    )
}

render(<App />, document.getElementById('root'))