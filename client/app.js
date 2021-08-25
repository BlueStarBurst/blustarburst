import React, { useRef, useState, useEffect } from 'react'
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

function Card(props) {

    const top = useRef(null);
    const bot = useRef(null);
    const card = useRef(null);
    const overlay = useRef(null);

    const [isReady, setReady] = useState(true);
    const [content, setContent] = useState(null);

    var timeout = '';

    useEffect(() => {
        console.log(props);
    }, [props])

    if (props.sm) {
        if (props.l) {
            return (
                <div className={(props.hidden) ? "myCard smCard sml slideOutLeft" : "myCard smCard sml slideInLeft"} ref={card}>
                    {props.children}
                </div>
            );
        } else {
            return (
                <div className={(props.hidden) ? "myCard smCard smr slideOutRight" : "myCard smCard smr slideInRight"} ref={card}>
                    {props.children}
                    <img src={topL} ref={top} className="top overlay topIdle3" draggable="false" />
                    <img src={bottomL} ref={bot} className="bottom overlay bottomIdle3" draggable="false" />
                </div>
            );
        }


    }

    if (props.expandable) {
        function open() {
            if (!isReady) {
                return;
            }
            props.setFocus(true);

            setReady(false);
            setContent(props.children);
            console.log("hi")
            overlay.current.className = "cover hide";
            card.current.className = "myCard wideCard";
            timeout = setTimeout(() => {
                setReady(true);
            }, 2000)
        }

        function close() {
            if (!isReady) {
                return;
            }
            props.setFocus(false);

            setContent('');
            setReady(false);
            card.current.className = "myCard smallCard openable";
            overlay.current.className = "cover show";
            timeout = setTimeout(() => {
                setReady(true);
            }, 2000)
        }

        return (

            <div className="myCard smallCard openable" ref={card} onClick={open} onMouseLeave={close}>
                {content}
                <img src={props.coverImg} className="show cover" ref={overlay} />
            </div>

        );
    }

    return (

        <div className="myCard wideCard" ref={card}>
            {props.children}
        </div>

    );


}

Card.defaultProps = {
    coverImg: placeHolder
}

function Row(props) {

    const [isFocused, setFocus] = useState(false);

    function createChildren() {
        var children = React.Children.map(props.children, child => {
            // Checking isValidElement is the safe way and avoids a typescript
            // error too.
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { hidden: isFocused, setFocus: setFocus });
            }
            return child;
        });
        return children;
    }

    return (
        <div className="myRow display" id={props.id}>
            <div className="aspectRatio">
                <div className="myCardRow">
                    {createChildren()}
                </div>
            </div>
        </div>
    );
}





render(<>
    <Row id="home">
        <Card>
            <h1>Good Evening こんばんは！ </h1>
        </Card>
    </Row>
    <Row id="webrtc">
        <Card sm l>
            <h2>webrtc + three.js</h2>
            <p>(wip) An online chatroom where users can interact with each other in a 3D environment </p>
        </Card>
        <Card expandable coverImg={horizonex}>
            <iframe id="webrtcFrame" src="https://bluestarburst.github.io/project-horizon/"></iframe>
        </Card>
        <Card sm>
            <h2>smol!</h2>
        </Card>
    </Row>
    <Row id="next">
        <Card>
            <h1>Hello!</h1>
        </Card>
    </Row>
    <Row id="schedule">
        <Card sm l>
            <h2>yay!</h2>
        </Card>
        <Card expandable coverImg={tutorialscheduleex}>
            <iframe id="webrtcFrame" src="https://bluestarburst.github.io/CSPSchedule/"></iframe>
        </Card>
        <Card sm>
            <h2>Tutorial Schedule!</h2>
            <p>
                A virtual calendar that allows students to plan study sessions.
            </p>
        </Card>
    </Row>
</>, document.getElementById("root"));












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

function scrollToPos() {
    //window.location.hash = hash[pos];
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