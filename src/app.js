import React, {
	useRef,
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
	Suspense,
} from "react";
import { render } from "react-dom";

import "./style.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import firebase from "firebase/app";
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

import bryant from "./img/new/amy2.png";
import github from "./img/new/github.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	solid,
	regular,
	brands,
	icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";

// import * as THREE from 'three'

import { TextField } from "@mui/material";
import getHangul from "./hangul";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

var mobile = false;
if (navigator.userAgent.match(/(iPhone|Android|BlackBerry|Windows Phone)/)) {
	// do something for mobile devices
	console.log("mobile");
	mobile = true;
} else {
	// do something for non-mobile devices
	console.log("not mobile");
}

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

var timeout = "";

function Model(props) {
	const scene = useLoader(OBJLoader, props.url);
	const { nodes, materials } = useGraph(scene);
	console.log(nodes[Object.keys(nodes)[0]]);
	return (
		<mesh
			geometry={nodes[Object.keys(nodes)[0]].geometry}
			material={materials.metal}
		/>
	);
}

function ImportFBX(props) {
	const [model, setModel] = useState();

	useEffect(() => {
		new MTLLoader().load(props.matUrl, (materials) => {
			materials.preload();
			console.log(materials);
			//materials.Material.side = THREE.DoubleSide;
			console.log("Loaded Materials");
			var objLoader = new OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.load(
				props.url,
				(object) => {
					// create phong material for the object
					console.log(object);
					// object.children[0].material = new THREE.MeshPhongMaterial({
					//     color: 0x000000,
					//     specular: 0x111111,
					//     shininess: 200
					// });

					setModel(object);
				},
				(xhr) => {
					console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
				},
				// called when loading has errors
				(error) => {
					console.log("An error happened" + error);
				}
			);
		});
	}, [props.url, props.matUrl]);

	return (
		<mesh>
			{model && <primitive object={model} />}
			<meshPhongMaterial attach="material" color="red" />
		</mesh>
	);
}

function Box(props) {
	// This reference will give us direct access to the mesh
	const mesh = useRef();

	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	// Rotate mesh every frame, this is outside of React without overhead
	useFrame(() => {
		mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
	});

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
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

function Train() {
	return (
		<div className="page">
			<h1>bryant hargreaves</h1>
			<Canvas className="canvas">
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				{/* <Box position={[-1.2, 0, 0]} /> */}
				{/* <Box position={[1.2, 0, 0]} /> */}
				<Suspense fallback={null}>
					<group scale={[0.1, 0.1, 0.1]}>
						<ImportFBX url={loco} matUrl={locoMtl} />
					</group>
					<group scale={[0.1, 0.1, 0.1]} position={[0, 0, -14]}>
						{/* <ImportFBX url={passenger} matUrl={passengerMtl} /> */}
					</group>
				</Suspense>
				<OrbitControls />
			</Canvas>
		</div>
	);
}

function Letter(props) {
	// this function makes the letter draggable

	const [isDragging, setIsDragging] = useState(false);
	const [timeout, setTimeouts] = useState(false);
	const ref = useRef(null);

	function dragStuff(e) {
		clearTimeout(timeout);
		setTimeouts(
			setTimeout(() => {
				setIsDragging(false);
				ref.current.style.transform = `translate(0px, 0px)`;
			}, 1000)
		);
		setIsDragging(true);
		var x = 0,
			y = 0;
		var card = e.target;
		props.onMouseMove(e, false);
		x += e.movementX;
		y += e.movementY;
		card.style.transform = `translate(${x}px, ${y}px)`;
	}

	function onLeave(e) {
		e.target.style.setProperty("--is-off", `1`);
	}

	function onEnter(e) {
		e.target.style.setProperty("--is-off", `0`);
	}

	useEffect(() => {
		if (isDragging) {
		}
	}, [isDragging]);

	return (
		<div
			onMouseMove={dragStuff}
			onMouseEnter={onEnter}
			onMouseLeave={onLeave}
			ref={ref}
			className={mobile ? "text-m" : "text"}
		>
			{props.letter}
		</div>
	);
}

var scrolling = false;
var timeScroll = 0;
var timeId = 0;
var addScroll = 0;

var scrollPos = 0;
var tempTop = 0;
var lastTouch = 0;

function App() {
	const [letters, setLetters] = useState("BryantHargreaves");
	const [mousedown, setMousedown] = useState(false);

	function hoverEffect(e, isRoot = false) {
		var card = e.target;
		if (!isRoot) {
			// card = e.target.parentElement;
			card = ref.current;
		}
		// const rectTarget = e.target.getBoundingClientRect(),
		//     xT = e.clientX - rectTarget.left,
		//     yT = e.clientY - rectTarget.top;

		const rect = card.getBoundingClientRect(),
			x = e.clientX - rect.left,
			y = e.clientY - rect.top;

		card.style.setProperty("--mouseX", `${x}px`);
		card.style.setProperty("--mouseY", `${y}px`);
	}

	const ref = useRef();
	const wack = useRef();
	const pt = useRef();
	const circle = useRef();
	const whiteText = useRef();
	const slow = useRef();

	useEffect(() => {
		if (mobile) {
			setLetters("BRYANTHARGREAVES");
		}

		document.getElementById("root").addEventListener("mousemove", function (e) {
			circle.current.style.top = e.pageY - 25 + scrollPos + "px";
			circle.current.style.left = e.pageX - 25 + "px";
			pt.current.style.top = e.pageY - 4 + scrollPos + "px";
			pt.current.style.left = e.pageX - 4 + "px";
			tempTop = e.pageY;
		});
		document.addEventListener("mousedown", function () {
			circle.current.classList.add("active");
			setMousedown(true);
		});
		document.addEventListener("mouseup", function () {
			circle.current.classList.remove("active");
			setMousedown(false);
		});

		document.getElementById("root").addEventListener("wheel", function (e) {
			e.preventDefault();
			e.stopPropagation();
			var elem = document.getElementById("root");
			console.log(e.deltaY);
			addScroll += e.deltaY;

			clearTimeout(timeScroll);
			timeScroll = setTimeout(() => {
				scrollToC(elem, elem.scrollTop, elem.scrollTop + addScroll, 500);
				addScroll = 0;
				timeId = timeId++;
			}, 200);
		});

		document.getElementById("root").addEventListener("touchmove", function (e) {
			e.preventDefault;
			e.stopPropagation();
			var elem = document.getElementById("root");
			console.log(e);
			console.log(e.touches[0].screenY);
			// addScroll += e.deltaY;

			if (lastTouch == 0) {
				lastTouch = e.touches[0].screenY;
			}
			addScroll = (lastTouch - e.touches[0].screenY) * 2;
			console.log(addScroll);
			// elem.scrollTop = elem.scrollTop + addScroll;
			scrollToC(elem, elem.scrollTop, elem.scrollTop + addScroll, 1);
			lastTouch = e.touches[0].screenY;

			// clearTimeout(timeScroll);
			// timeScroll = setTimeout(() => {
			//     scrollToC(elem, elem.scrollTop, elem.scrollTop + addScroll, 500);
			//     addScroll = 0;
			//     timeId = timeId++;
			// }, 200);
			// console.log(e);
			circle.current.style.top = e.touches[0].pageY - 25 + scrollPos + "px";
			circle.current.style.left = e.touches[0].pageX - 25 + "px";
			pt.current.style.top = e.touches[0].pageY - 4 + scrollPos + "px";
			pt.current.style.left = e.touches[0].pageX - 4 + "px";
			tempTop = e.touches[0].pageY;
		});

		document.getElementById("root").addEventListener("touchend", function (e) {
			lastTouch = 0;
		});
	}, []);

	function shrinkSize() {
		// ref.current.className = 'hoverEffect background backSize';
		circle.className = "circle circleSz";
	}

	function growSize() {
		// ref.current.className = 'hoverEffect background';
		circle.className = "circle";
	}

	// Element to move, element or px from, element or px to, time in ms to animate
	function scrollToC(element, from, to, duration) {
		console.log(element, from, to, duration);
		if (duration <= 0) return;
		if (typeof from === "object") from = from.offsetTop;
		if (typeof to === "object") to = to.offsetTop;

		currentId = timeScroll;
		scrollToX(element, from, to, 0, 1 / duration, 10, easeOutCuaic);
	}

	function scrollToX(element, xFrom, xTo, t01, speed, step, motion) {
		if (currentId !== timeScroll) {
			scrolling = false;
			return;
		}
		if (t01 < 0 || t01 > 1 || speed <= 0) {
			element.scrollTop = xTo;
			scrolling = false;
			return;
		}
		element.scrollTop = xFrom - (xFrom - xTo) * motion(t01);
		t01 += speed * step;

		wack.current.style.transform =
			"translateY(" +
			Math.max(-element.scrollTop * 2, (-window.innerHeight * 3) / 4) +
			"px)";
		whiteText.current.style.opacity =
			(element.scrollTop - window.innerHeight / 8) / (window.innerHeight / 6);

		console.log(slow.current.clientHeight);
		var offsetHeight = window.innerHeight * 1.15;
		slow.current.style.transform =
			"translateY(" +
			((-50 * Math.abs(element.scrollTop - offsetHeight)) / offsetHeight + 10) +
			"%)";
		slow.current.style.opacity =
			(element.scrollTop - (window.innerHeight * 4) / 5) /
			(window.innerHeight / 4);

		scrollPos = element.scrollTop;

		circle.current.style.top = tempTop - 25 + scrollPos + "px";
		pt.current.style.top = tempTop - 4 + scrollPos + "px";

		// debugger;
		setTimeout(function () {
			scrollToX(element, xFrom, xTo, t01, speed, step, motion);
		}, step);
	}

	function hoverEffect2(e) {
		const card = e.target;
		const rect = card.getBoundingClientRect(),
			x = e.clientX - rect.left,
			y = e.clientY - rect.top;

		card.style.setProperty("--mouseX", `${x}px`);
		card.style.setProperty("--mouseY", `${y}px`);
	}

	// var makeItRain = function () {
	//     //clear out everything
	//     $('.rain').empty();

	//     var increment = 0;
	//     var drops = "";
	//     var backDrops = "";

	//     while (increment < 100) {
	//         //couple random numbers to use for various randomizations
	//         //random number between 98 and 1
	//         var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
	//         //random number between 5 and 2
	//         var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
	//         //increment
	//         increment += randoFiver;
	//         //add in a new raindrop with various randomizations to certain CSS properties
	//         drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
	//         backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
	//     }

	//     $('.rain.front-row').append(drops);
	//     $('.rain.back-row').append(backDrops);
	// }

	// $('.splat-toggle.toggle').on('click', function () {
	//     $('body').toggleClass('splat-toggle');
	//     $('.splat-toggle.toggle').toggleClass('active');
	//     makeItRain();
	// });

	// $('.back-row-toggle.toggle').on('click', function () {
	//     $('body').toggleClass('back-row-toggle');
	//     $('.back-row-toggle.toggle').toggleClass('active');
	//     makeItRain();
	// });

	// $('.single-toggle.toggle').on('click', function () {
	//     $('body').toggleClass('single-toggle');
	//     $('.single-toggle.toggle').toggleClass('active');
	//     makeItRain();
	// });

	// makeItRain();

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div className="page">
				<div
					ref={ref}
					onMouseDown={shrinkSize}
					onMouseUp={growSize}
					onMouseMove={(e) => {
						hoverEffect(e, true);
					}}
					className="hoverEffect background"
				>
					{/* <div onMouseMove={(e) => { hoverEffect(e, true) }} className='text'>
                    Bryant Hargreaves
                </div> */}
					{mobile ? (
						<div className="rows-start">
							<div className="col">
								{letters.split("").map((letter, index) => {
									if (index >= 6) return;
									return (
										<Letter
											onMouseMove={(e) => {
												hoverEffect(e, false);
											}}
											letter={letter}
										/>
									);
								})}
							</div>
							<div className="col">
								{letters.split("").map((letter, index) => {
									if (index < 6) return;
									return (
										<Letter
											onMouseMove={(e) => {
												hoverEffect(e, false);
											}}
											letter={letter}
										/>
									);
								})}
							</div>
						</div>
					) : (
						<div className="rows">
							{letters.split("").map((letter, index) => {
								return (
									<Letter
										onMouseMove={(e) => {
											hoverEffect(e, false);
										}}
										letter={letter}
									/>
								);
							})}
						</div>
					)}

					<p
						className={mobile ? "text2-m text2" : "text2"}
						onMouseMove={(e) => {
							hoverEffect(e, false);
						}}
					>
						Software Engineer
					</p>
				</div>

				<div className="circle" ref={circle}></div>
				<div className="pt" ref={pt}></div>
			</div>
			<div className={mobile ? "page white white-m" : "page white"} ref={wack}>
				<div className={mobile ? "col" : "rows2"} ref={whiteText}>
					<img src={bryant} />
					<div className="textcol">
						<h1>About</h1>
						<p>
							Hello, internet! My name is Bryant Hargreaves and I am a Software
							Engineering student at the University of Texas at Dallas! I am
							currently looking for an internship for Summer 2023. I am
							interested in pretty much anything that has to do with software
							development, but I am especially interested in web development,
							mobile development, computer vision, and machine learning. Here's
							my{" "}
							<a
								href="https://docs.google.com/document/d/1gNtBx9HQ1rqoOxBJM1lZkK_z0mCp0dszh4dDvM4uYwQ/edit?usp=sharing"
								target="_blank"
							>
								resume
							</a>
							!
						</p>
						<div className="btns">
							<a href="https://github.com/BlueStarBurst" target="_blank">
								<FontAwesomeIcon icon={brands("github-square")} />
							</a>
							<a
								href="https://www.linkedin.com/in/bryant-hargreaves/"
								target="_blank"
							>
								<FontAwesomeIcon icon={brands("linkedin")} />
							</a>

							<a
								href="https://www.instagram.com/bryant_hargreaves/"
								target="_blank"
							>
								<FontAwesomeIcon icon={brands("instagram-square")} />
							</a>

							<a
								href="https://apps.apple.com/us/developer/bryant-hargreaves/id1640595525?uo=4&at=11l6hc&app=itunes&ct=fnd"
								target="_blank"
							>
								<FontAwesomeIcon icon={brands("app-store")} />
							</a>
						</div>
					</div>
				</div>
			</div>

			<div className="page third" ref={slow}>
				<h1>
					<b>Projects</b>
				</h1>
				<div className="rows3">
					<div className="relative">
						<a
							onMouseMove={hoverEffect2}
							className="output"
							href="https://bluestarburst.github.io/ARWorld/"
							target="_blank"
						>
							<div onMouseMove={hoverEffect2} className="output-content">
								<FontAwesomeIcon icon={solid("globe-americas")} />
								<h3>
									<b>ourworlds!</b>
								</h3>
								<p>
									A comprehensive AR IOS app that involves SwiftUI, Firebase
									Auth, Firestore, Unity AR Foundation, ARKit, React.js, and
									Three.js. It is free to download on the App Store.
								</p>
							</div>
						</a>
					</div>
					<div className="relative">
						<a
							onMouseMove={hoverEffect2}
							className="output"
							href="https://github.com/BlueStarBurst/storyboard"
							target="_blank"
						>
							<div onMouseMove={hoverEffect2} className="output-content">
								<FontAwesomeIcon icon={solid("location-dot")} />
								<h3>
									<b>storyboard!</b>
								</h3>
								<p>
									A proof of concept for IOS app development with SwiftUI,
									MapKit, and Firebase firestore, auth, and storage. I
									experimented with cloud computing and overall project
									management.
								</p>
							</div>
						</a>
					</div>
					<div className="relative">
						<a
							onMouseMove={hoverEffect2}
							className="output"
							href="https://github.com/BlueStarBurst/project-horizon"
							target="_blank"
						>
							<div onMouseMove={hoverEffect2} className="output-content">
								<FontAwesomeIcon icon={solid("cube")} />
								<h3>
									<b>webrtc+three.js</b>
								</h3>
								<p>
									A proof of concept exploring the uses of webRTC's data
									streaming in applications other than video and audio sharing.
								</p>
							</div>
						</a>
					</div>
				</div>

				<div className="rows3">
					<div className="relative">
						<a
							onMouseMove={hoverEffect2}
							className="output"
							href="https://bluestarburst.github.io/CSPSchedule/"
							target="_blank"
						>
							<div onMouseMove={hoverEffect2} className="output-content">
								<FontAwesomeIcon icon={solid("phone")} />
								<h3>
									<b>webrtc meeting</b>
								</h3>
								<p>
									A scheduler that allows students to plan and create online
									study sessions. This was created over the COVID-19 lockdown
									and submitted as my AP Computer Science Principles project.
								</p>
							</div>
						</a>
					</div>
					<div className="relative">
						<a
							onMouseMove={hoverEffect2}
							className="output"
							href="https://bluestarburst.github.io/korean/"
							target="_blank"
						>
							<div onMouseMove={hoverEffect2} className="output-content">
								<FontAwesomeIcon icon={solid("language")} />
								<h3>
									<b>hangul</b>
								</h3>
								<p>
									A simple website that turns English phonetics into Hangul
									(Korean). This helps create flashcards, search for words, and
									learn the Korean alphabet.
								</p>
							</div>
						</a>
					</div>
					<div className="relative">
						<a
							onMouseMove={hoverEffect2}
							className="output"
							href="https://dragons4dragons.github.io/"
							target="_blank"
						>
							<div onMouseMove={hoverEffect2} className="output-content">
								<FontAwesomeIcon icon={solid("graduation-cap")} />
								<h3>
									<b>dragons4dragons</b>
								</h3>
								<p>
									Created the website for a non-profit organization that granted
									scholarships to deserving students. THe organization was
									founded by my friend and I managed the technical aspects of
									it.
								</p>
							</div>
						</a>
					</div>
				</div>
				<p className={mobile ? "misc-m" : "misc"}>
					and more on{" "}
					<a href="https://github.com/BlueStarBurst" target="_blank">
						github
					</a>
					!
				</p>
			</div>

			<div className="page behind strip">
				{/* <div class="back-row-toggle splat-toggle">
                    <div class="rain front-row"></div>
                    <div class="rain back-row"></div>
                    <div class="toggles">
                        <div class="splat-toggle toggle active">SPLAT</div>
                        <div class="back-row-toggle toggle active">BACK<br />ROW</div>
                        <div class="single-toggle toggle">SINGLE</div>
                    </div>
                </div> */}
			</div>
			<div className="page behind"></div>
		</ThemeProvider>
	);
}

render(<App />, document.getElementById("root"));

var currentId = 0;

// Element to move, time in ms to animate
function scrollTo(element, duration) {
	var e = document.documentElement;
	if (e.scrollTop === 0) {
		var t = e.scrollTop;
		++e.scrollTop;
		e = t + 1 === e.scrollTop-- ? e : document.body;
	}
	scrollToC(e, e.scrollTop, element, duration);
}

// Element to move, element or px from, element or px to, time in ms to animate
function scrollToC(element, from, to, duration) {
	console.log(element, from, to, duration);
	if (duration <= 0) return;
	if (typeof from === "object") from = from.offsetTop;
	if (typeof to === "object") to = to.offsetTop;

	currentId = timeScroll;
	scrollToX(element, from, to, 0, 1 / duration, 10, easeOutCuaic);
}

function scrollToX(element, xFrom, xTo, t01, speed, step, motion) {
	if (currentId !== timeScroll) {
		scrolling = false;
		return;
	}
	if (t01 < 0 || t01 > 1 || speed <= 0) {
		element.scrollTop = xTo;
		scrolling = false;
		return;
	}
	element.scrollTop = xFrom - (xFrom - xTo) * motion(t01);
	t01 += speed * step;
	// debugger;
	setTimeout(function () {
		scrollToX(element, xFrom, xTo, t01, speed, step, motion);
	}, step);
}

function easeOutCuaic(t) {
	t--;
	return t * t * t + 1;
}
