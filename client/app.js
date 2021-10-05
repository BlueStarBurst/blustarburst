import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { render } from 'react-dom'

import "./style.css"
import 'bootstrap/dist/css/bootstrap.min.css';

import firebase from 'firebase/app';

import topR from './img/topR.png'
import topL from './img/topL.png'
import bottomL from './img/bottomL.png'
import bottomR from './img/bottomR.png'

import placeHolder from './img/download.jpg'
import horizonex from './img/projecthorizonex.gif'
//var horizonex = 'https://media.githubusercontent.com/media/BlueStarBurst/BlueStarBurst.github.io/master/client/img/horizonex.gif'
import tutorialscheduleex from './img/tutorialscheduleex.gif'
//var tutorialscheduleex = 'https://media.githubusercontent.com/media/BlueStarBurst/BlueStarBurst.github.io/master/client/img/tutorialscheduleex.gif'

import clouds from './img/clouds.png'
import clouds2 from './img/clouds2.png'
import clouds3 from './img/clouds3.png'


import space1 from './img/new/space12.png'
import space2 from './img/new/space2.png'
import space3 from './img/new/space3.png'
import space4 from './img/new/space4.png'

import city1 from './img/new/city1.png'
import city2 from './img/new/city2.png'
import city3 from './img/new/city3.png'
import city4 from './img/new/city4.png'
import city5 from './img/new/city5.png'

var timeout = ''

function Web(props) {

    const [page, setPage] = useState(JSON.parse(localStorage.getItem("page")) || 0);
    const [isReady, setReady] = useState(true);
    const [children, setChildren] = useState(React.Children.toArray(props.children));

    const scroller = useRef(null)

    var timeout = ''

    const arrowDown = useKeyPress("ArrowDown");
    const arrowUp = useKeyPress("ArrowUp");

    useLayoutEffect(() => {
        scroller.current.scrollTop = 1
    }, [])

    useEffect(() => {
        detectKey();
    }, [arrowDown, arrowUp])

    useEffect(() => {
        var temp = React.Children.toArray(props.children);
        temp[page] = React.cloneElement(temp[page], { open: true })
        setChildren(temp);
    }, [])

    function nextPage() {

        if (page != children.length - 1) {
            var temp = React.Children.toArray(props.children);
            temp[page] = React.cloneElement(temp[page], { open: false })
            console.log("scrolling down");
            localStorage.setItem("page", JSON.stringify(page + 1))
            setPage(page + 1);
            setReady(false);
            temp[page + 1] = React.cloneElement(temp[page + 1], { open: true })
            setChildren(temp);
            timeout = setTimeout(() => { setReady(true) }, 5000);
        }

    }

    function prevPage() {
        if (page != 0) {
            var temp = React.Children.toArray(props.children);
            temp[page] = React.cloneElement(temp[page], { open: false })
            console.log("scrolling up");
            localStorage.setItem("page", JSON.stringify(page - 1))
            setPage(page - 1);
            setReady(false);
            temp[page - 1] = React.cloneElement(temp[page - 1], { open: true })
            setChildren(temp);
            timeout = setTimeout(() => { setReady(true) }, 5000);
        }
    }

    function detectKey() {
        if (!isReady) {
            return;
        }

        if (arrowUp) {
            prevPage();
        } else if (arrowDown) {
            nextPage();
        }
    }

    function detectWheel(e) {
        if (!isReady) {
            return;
        }

        if (e.deltaY < 0) {
            prevPage();
        } else if (e.deltaY > 0) {
            nextPage();
        }

        window.scrollTo(0, 1);
    }

    var swipeY = 0;

    function onSwipeStart(e) {
        swipeY = e.touches[0].clientY;
    }

    function onSwipeEnd(e) {
        if (!isReady) {
            return;
        }

        var deadband = 100;

        console.log(e);

        if (e.changedTouches[0].clientY > swipeY + deadband) {
            prevPage();
        } else if (e.changedTouches[0].clientY < swipeY - deadband) {
            nextPage();
        }
    }

    return <>
        <div onWheel={detectWheel} onKeyPress={detectKey} onTouchStart={onSwipeStart} onTouchEnd={onSwipeEnd} ref={scroller} style={{ height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0, zIndex: 10000 }} >
            {children}
        </div>
    </>;
}

function City(props) {

    const container = useRef(null)
    const page = useRef(null)
    const overlay = useRef(null)
    const textRef = useRef(null)
    const [show, setShow] = useState("none");
    const delay = props.delay || 1.5;

    useEffect(() => {
        console.log(props.open);
        if (props.open) {
            page.current.style.display = "block";
            container.current.style.display = "none";
            overlay.current.style.display = "block";
            page.current.className = "page2";
            setTimeout(() => {
                container.current.style.display = "flex";
            }, delay * 1000)
        } else if (props.open == false) {
            mouseOut();
            overlay.current.style.display = "none";
            page.current.className = "page2c";
            setTimeout(() => {
                container.current.style.display = "none";
                page.current.style.display = "none";
            }, 5000)
        }
    }, [props])

    function closeOut() {
        return (
            <>
                <div className="overlayHolder overlayc">
                    <img src={tutorialscheduleex} className="pageimg overlay" style={{ transform: "translate(235%, 27%)", width: "460px", height: "480px" }} />
                </div>
                <img src={city5} className="pageimg city5c" />
                <img src={city4} className="pageimg city3c" />
                <img src={city3} className="pageimg city2c" />
                <img src={city1} className="pageimg city1c" />
                <img src={city2} className="pageimg city2c" />
            </>
        )
    }

    function openIn() {
        return (
            <>
                <div className="overlayHolder city1">
                    <img onMouseEnter={mouseIn} onMouseLeave={check} src={tutorialscheduleex} className="pageimg overlay" style={{ transform: "translate(235%, 27%)", width: "460px", height: "480px" }} />
                </div>
                <img src={city5} className="pageimg city1" />
                <img src={city4} className="pageimg city3" />
                <img src={city3} className="pageimg city2" />
                <img src={city1} className="pageimg city1" />
                <img src={city2} className="pageimg city2" />

            </>
        )
    }

    var timeout = '';

    function mouseIn() {
        textRef.current.className = "textIn text";
        clearTimeout(timeout);
    }

    function check() {
        timeout = setTimeout(() => {
            textRef.current.className = "textOut text";
            mouseOut();
        }, 3000);
    }

    function up() {
        clearTimeout(timeout);
    }

    function mouseOut() {
        if (textRef.current.className == "textIn text") {
            textRef.current.className = "textOut text";
        }
        setTimeout(() => {
            textRef.current.className = "hidden";
        }, 4000);
    }

    return (
        <div ref={page} style={{ display: "none" }}>
            <div ref={overlay} className="openAnim">
                <img src={clouds} className="pageimg cloudsRIn" />
                <img src={clouds2} className="pageimg cloudsLIn" />
            </div>
            <div ref={container} style={props.style} className={"page"}>
                <div className="hidden text" ref={textRef} onMouseEnter={up} onMouseLeave={check}>
                    <p>
                        This project is called CS Schedule and is a calendar and an online communication platform that allows students to study together. This was developed during the COVID-19 pandemic to prevent online students at my school from missing out from studying with others.
                    </p>
                </div>
                {(props.open) ? openIn() : closeOut()}
            </div>
        </div>
    )
}

function Space(props) {

    const container = useRef(null)
    const page = useRef(null)
    const overlay = useRef(null)
    const textRef = useRef(null)
    const [show, setShow] = useState("none");
    const [text, showText] = useState(false);
    const delay = props.delay || 1.5;

    useEffect(() => {
        console.log(props.open);
        if (props.open) {
            page.current.style.display = "block";
            container.current.style.display = "none";
            overlay.current.style.display = "block";
            page.current.className = "page1";
            setTimeout(() => {
                container.current.style.display = "flex";
            }, delay * 1000)
        } else if (props.open == false) {
            mouseOut();
            overlay.current.style.display = "none";
            page.current.className = "page1c";
            setTimeout(() => {
                container.current.style.display = "none";
                page.current.style.display = "none";
            }, 5000)
        }
    }, [props])

    function closeOut() {
        return (
            <>
                <div className="overlayHolder overlayc">
                    <img src={horizonex} className="pageimg overlay" style={{ transform: "translate(130%, 30%) rotate(12deg)", width: "700px" }} />
                </div>
                <img src={space1} className="pageimg space12c" />
                <img src={space2} className="pageimg space2c" />
                <img src={space3} className="pageimg space1c" />
                <img src={space4} className="pageimg space3c" />
            </>
        )
    }

    function openIn() {
        return (
            <>
                <div className="overlayHolder space1">
                    <img onMouseEnter={mouseIn} onMouseLeave={check} src={horizonex} className="pageimg overlay" style={{ transform: "translate(130%, 30%) rotate(12deg)", width: "700px" }} />
                </div>
                <img src={space1} className="pageimg space12" />
                <img src={space2} className="pageimg space2" />
                <img src={space3} className="pageimg space1" />
                <img src={space4} className="pageimg space3" />
            </>
        )
    }

    var timeout = '';

    function mouseIn() {
        textRef.current.className = "textIn text";
        clearTimeout(timeout)
    }

    function check() {
        timeout = setTimeout(() => {
            textRef.current.className = "textOut text";
            mouseOut();
        }, 3000);
    }

    function up() {
        clearTimeout(timeout);
    }

    function mouseOut() {
        if (textRef.current.className == "textIn text") {
            textRef.current.className = "textOut text";
        }
        setTimeout(() => {
            textRef.current.className = "hidden";
        }, 4000);
    }

    return (
        <div ref={page} style={{ display: "none" }} >
            <div ref={overlay} className="openAnim">
                <img src={clouds} className="pageimg cloudsRIn" />
                <img src={clouds2} className="pageimg cloudsLIn" />
            </div>
            <div ref={container} style={props.style} className={"page"}>
                <div className="hidden text" ref={textRef} onMouseEnter={up} onMouseLeave={check} >
                    <p>
                        This is my prototype for an online chatroom called WebRTC World! In this project, I used react-three-fiber in order to make a 3d environment for browsers. Position and rotation data are sent directly from peer to peer using WebRTC.
                    </p>
                </div>
                {(props.open) ? openIn() : closeOut()}

            </div>
        </div>
    )
}

function Title(props) {

    const container = useRef(null)
    const overlay = useRef(null)
    const page = useRef(null)
    const [show, setShow] = useState("none");
    const delay = props.delay || 0;


    useEffect(() => {
        console.log(props.open);
        if (props.open) {
            page.current.style.display = "block";
            overlay.current.style.display = "block";
            container.current.style.display = "flex";
        } else if (props.open == false) {
            overlay.current.style.display = "none";
            setTimeout(() => {
                container.current.style.display = "none";
                page.current.style.display = "none";
            }, 5000)
        }
    }, [props])

    function closeOut() {
        return (
            <>
                <h1>こんばんは</h1>
            </>
        )
    }

    function openIn() {
        return (
            <>
                <h1>こんばんは</h1>
            </>
        )
    }

    function onFullscreen() {
        document.documentElement.requestFullscreen();
    }

    return (
        <div className={"page0"} ref={page} style={{ display: "none" }}>
            <div className="topbar" onClick={onFullscreen}> Click here to enable fullscreen! </div>
            <div ref={overlay} className="openAnim">
                <img src={clouds} className="pageimg cloudsRIn" />
                <img src={clouds2} className="pageimg cloudsLIn" />
            </div>
            <div ref={container} style={props.style} className={"page"}>
                {(props.open) ? openIn() : closeOut()}
            </div>

        </div>
    )
}


render(<>

    <Web>
        <Title />
        <Space />
        <City />

    </Web>

</>, document.getElementById("root"));




// Hook
function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
    // If pressed key is our target key then set to true
    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };
    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return keyPressed;
}
