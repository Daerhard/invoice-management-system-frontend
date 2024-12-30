import React from 'react'
import Layout from '../containers/Layout'
import { BrowserRouter as Router } from 'react-router-dom'

function App() {

    return (
        <div>
            <Router>
                <Layout></Layout>
            </Router>
        </div>
    )
}

export default App
