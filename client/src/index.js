import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import { sendHttpRequest } from './utils';
import './style.css'

function App() {
    useEffect(() => {
        sendHttpRequest('GET', '/api', true)
            .then(res => {
                if (res.error) {
                    console.error(res.error)
                } else {
                    console.log(res.data)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    return 'hello world!'
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
