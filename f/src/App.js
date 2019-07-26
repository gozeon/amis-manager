import React, { Component } from 'react'
import MyRouter from "./Router"
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.css'


class App extends Component {
    render() {
        return (
            <div>
                <MyRouter/>
                <ToastContainer/>
            </div>
        )
    }
}

export default App