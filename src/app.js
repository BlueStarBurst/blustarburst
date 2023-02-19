import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { render } from 'react-dom'

import "./style.css"
import 'bootstrap/dist/css/bootstrap.min.css';

import firebase from 'firebase/app';

var timeout = ''

function App() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1>React App</h1>
                </div>
            </div>
        </div>
    )
}

render(<App />, document.getElementById('root'))