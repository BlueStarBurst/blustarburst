import React, { useRef, useState, useEffect, useCallback } from 'react'
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

var timeout = ''


function Web(props) {

    const [page, setPage] = useState(0);
    const [isReady, setReady] = useState(true);
    const [children, setChildren] = useState(React.Children.toArray(props.children));

    var timeout = ''

    useEffect(() => {
        var temp = React.Children.toArray(props.children);
        temp[0] = React.cloneElement(temp[0], { open: true })
        setChildren(temp);
    }, [])

    function detect(e) {

        //console.log(children[page]);

        const window = e.target;

        if (!isReady) {
            window.scrollTo(0, 1);
            return;
        }

        console.log(window.scrollTop);
        if (window.scrollTop < 1) {
            if (page != 0) {
                var temp = React.Children.toArray(props.children);
                temp[page] = React.cloneElement(temp[page], { open: false })
                console.log("scrolling up");
                setPage(page - 1);
                setReady(false);
                temp[page - 1] = React.cloneElement(temp[page - 1], { open: true })
                setChildren(temp);
                timeout = setTimeout(() => { setReady(true) }, 2000);
            }
        } else if (window.scrollTop > 1) {
            if (page != children.length - 1) {
                var temp = React.Children.toArray(props.children);
                temp[page] = React.cloneElement(temp[page], { open: false })
                console.log("scrolling down");
                setPage(page + 1);
                setReady(false);
                temp[page + 1] = React.cloneElement(temp[page + 1], { open: true })
                setChildren(temp);
                timeout = setTimeout(() => { setReady(true) }, 2000);
            }
        }

        window.scrollTo(0, 1);
    }

    return <>
        <div onScroll={detect} style={{ height: "100vh", width: "100vw", overflow: "scroll", position: "fixed", top: 0, left: 0, zIndex: 10000 }} >
            {children}
            <div style={{ height: "101vh" }}></div>
        </div>
    </>;
}

function Space(props) {

    const container = useRef(null)
    const page = useRef(null)
    const overlay = useRef(null)
    const [show, setShow] = useState("none");
    const delay = props.delay || 1.5;

    useEffect(() => {
        clearTimeout(timeout);
        console.log(props.open);
        if (props.open) {
            setShow("block")
            container.current.style.display = "none";
            overlay.current.style.display = "block";
            page.current.className = "page1";
            timeout = setTimeout(() => {
                container.current.style.display = "flex";
            }, delay * 1000)
        } else if (props.open == false) {
            overlay.current.style.display = "none";
            page.current.className = "page1c";
            timeout = setTimeout(() => {
                container.current.style.display = "none";
                setShow("none")
            }, 5000)
        }
    }, [props])

    function closeOut() {
        return (
            <>
                <div className="overlayHolder space1c">
                    <img src={horizonex} className="pageimg overlay" style={{ transform: "translate(36%, 28%) rotate(12deg)", width: "700px" }} />
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
                    <img src={horizonex} className="pageimg overlay" style={{ transform: "translate(36%, 28%) rotate(12deg)", width: "700px" }} />
                </div>
                <img src={space1} className="pageimg space12" />
                <img src={space2} className="pageimg space2" />
                <img src={space3} className="pageimg space1" />
                <img src={space4} className="pageimg space3" />
            </>
        )
    }

    return (
        <div ref={page} style={{ display: show }}>
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

function Title(props) {

    const container = useRef(null)
    const overlay = useRef(null)
    const [show, setShow] = useState("none");
    const delay = props.delay || 0;


    useEffect(() => {
        clearTimeout(timeout)
        console.log(props.open);
        if (props.open) {
            setShow("block")
            overlay.current.style.display = "block";
            container.current.style.display = "flex";
        } else if (props.open == false) {
            overlay.current.style.display = "none";
            timeout = setTimeout(() => {
                container.current.style.display = "none";
                setShow("none")
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

    return (
        <div className={"page0"} style={{ display: show }}>
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

    </Web>

</>, document.getElementById("root"));






/*



//positions
var spots = [];
var tempRows = document.getElementsByClassName("myRow");
var index = 0;
var minDistance = 99999;
for (var i = 0; i < tempRows.length; i++) {
    if (Math.abs(document.documentElement.scrollTop - tempRows[i].offsetTop) < minDistance) {
        index = i;
        minDistance = Math.abs(document.documentElement.scrollTop - tempRows[i].offsetTop);
    }
    spots.push(tempRows[i]);
}
var hash = ['home', 'webrtc'];

var pos = index;




function preventDefault(e) {
    e.preventDefault();
}


// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


var isMobile = false;
var toggle = true;

var mouseY = 0;
function check() {

    mobile();

    if (isMobile) {
        return;
    }

    if (mouseY < 80 || (window.scrollY == 0 || pos == 0) || (up && isMobile)) {
        toggle = true;
    } else {
        toggle = false;
    }
}

document.onmousemove = (e) => {
    mouseY = e.clientY;
    check();
}

var lastScrollTop = 0;
var up = false;





var timeout = ''
var lastpos = pos;

function scrollToPos() {
    //window.location.hash = hash[pos];

    if (lastpos != pos) {
        document.getElementById("overfun").style.display = "none";
        document.getElementById("overfun2").style.display = "none";
    }

    if (pos == 0) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    } else {
        var height = (innerHeight - spots[pos].style.height) / 2;
        window.scrollTo({
            top: spots[pos].offsetTop,
            behavior: 'smooth'
        })
    }

    if (lastpos > pos) {
        document.getElementById("overfun2").style.display = "flex";
    } else if (lastpos < pos) {
        document.getElementById("overfun").style.display = "flex";
    }

    lastpos = pos;


    clearTimeout(timeout);
    timeout = setTimeout(function () {
        check();
    }, 100);

}




var scrolling = false;
var isStatic = true;
var staticVal = 0;

window.scroll({
    left: 0
});




function tempScroll(event) {
    event.preventDefault();

    if (event.deltaY < 0) {
        up = true;
    } else {
        up = false;
    }

    adjustPos();
    scrollToPos();

    staticVal = 0;
    isStatic = true;
}

document.addEventListener('wheel', tempScroll, { passive: false });

function swipe(e) {
    e.preventDefault();
}

window.addEventListener('touchmove', swipe, { passive: false });

var clientX, clientY;

window.addEventListener('touchstart', function (e) {
    // Cache the client X/Y coordinates
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
}, false);

window.addEventListener('touchend', function (e) {
    var deltaX, deltaY;

    deltaX = e.changedTouches[0].clientX - clientX;
    deltaY = e.changedTouches[0].clientY - clientY;

    var dist = 60

    if (deltaY > 60) {
        up = true;
    } else if (deltaY < -60) {
        up = false;
    } else if (!e.target.classList.contains("headerTap")) {
        if (!toggle) {
            toggle = true;
            document.getElementById("flag").classList.add("flagSlide");
            document.getElementById("header").classList.remove("slideUp");
            document.getElementById("header").style.display = "inline-flex";
            document.getElementById("header").classList.add("slideDown");
            if (isMobile) {
                document.getElementById("flag").style.marginTop = "10vh";
            } else {
                document.getElementById("flag").style.marginTop = "75px";
            }
        } else {
            toggle = false;
            document.getElementById("flag").style.marginTop = "0";
            document.getElementById("flag").classList.remove("flagSlide");
            document.getElementById("header").classList.remove("slideDown");
            document.getElementById("flag").style.marginTop = "0";
            document.getElementById("header").classList.add("slideUp");

        }
        return;
    } else {
        return;
    }

    adjustPos();
    scrollToPos();


}, false);


function adjustPos() {
    scrolling = true;
    if (up) {
        pos--;
        if (pos < 0) {
            pos = 0;
        }
    } else {
        pos++;
        if (pos >= spots.length) {
            pos = spots.length - 1;
        }
    }
    check();

}



function mobile() {

    return;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
        //console.log(navigator.userAgent);
        document.getElementById("header").style.height = "10vh";
        document.getElementById("header").style.fontSize = 'larger';
        document.getElementById("content").style.fontSize = '360%';
        if (toggle) {
            document.getElementById("flag").style.marginTop = "10vh";
        } else {
            document.getElementById("flag").style.marginTop = "0";
        }
        document.getElementById("content").style.width = 'min-content';
        document.getElementById("flag").style.width = "105vw";
        document.getElementById("flag").style.fontSize = "175%";

        var titles = document.getElementsByClassName("h1")
        for (var i = 0; i < titles.length; i++) {
            titles[i].style.fontSize = "10vw"
        }
        titles = document.getElementsByClassName("p")
        for (var i = 0; i < titles.length; i++) {
            titles[i].style.fontSize = "5vw"
        }
        titles = document.getElementsByClassName("link")
        for (var i = 0; i < titles.length; i++) {
            titles[i].style.width = "35vw";
        }
        document.getElementById("sponsors").style.width = "105vw";

        document.getElementById("cover1").style.width = "105vw";
        document.getElementById("cover1").style.padding = "10vw 0";
        document.getElementById("desc1").style.maxWidth = "80vw";
        return;
    }
    else if (window.innerHeight > window.innerWidth) {
        isMobile = false;
        document.getElementById("content").style.fontSize = '30px';
        document.getElementById("header").style.fontSize = '60%';
        document.getElementById("content").style.width = 'min-content';
    }
    else {
        isMobile = false;
        document.getElementById("content").style.fontSize = '40px';
        document.getElementById("content").style.width = 'max-content';
        document.getElementById("header").style.fontSize = '60%';
    }

    document.getElementById("sponsors").style.width = "100vw";
    document.getElementById("flag").style.fontSize = "unset";
    var titles = document.getElementsByClassName("h1")
    for (var i = 0; i < titles.length; i++) {
        titles[i].style.fontSize = "45px"
    }
    titles = document.getElementsByClassName("p")
    for (var i = 0; i < titles.length; i++) {
        titles[i].style.fontSize = "28px"
    }
    titles = document.getElementsByClassName("link")
    for (var i = 0; i < titles.length; i++) {
        titles[i].style.width = "15vw";
    }

    document.getElementById("cover1").style.width = "100vw";
    document.getElementById("cover1").style.padding = "75px 0";
    document.getElementById("desc1").style.maxWidth = "750px";

}

mobile();


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 38: 1, 40: 2, 32: 2, 33: 1, 34: 2, 35: 3, 36: 3 };


function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);

        if (keys[e.keyCode] == 1) {
            up = true;
        } else if (keys[e.keyCode] == 2) {
            up = false;
        } else if (e.keyCode == 35) {
            up = false;
            pos = spots.length - 1;
        } else if (e.keyCode == 36) {
            up = true;
            pos = 0;
        }



        adjustPos();
        scrollToPos();

        return false;
    }
}

var samePage = { 1: 1, 2: 1, 4: 1 }
function scrollToSetPos(tempPos) {
    if (samePage[tempPos]) {
        pos = tempPos;
        scrollToPos();
    }


}

disableScroll();

*/