import { createRoot } from 'react-dom/client'
import "./style.css"
// import Layout from './Layout'
import "./fontawesome-pro.css"
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'

createRoot(document.getElementById('root')).render(
    <Router /> 
)

