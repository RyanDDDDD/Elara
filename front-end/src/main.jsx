import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"

// Wait for DOM to be fully loaded before mounting React
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root")

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
  } else {
    // Create a root element if it doesn't exist
    const appRoot = document.createElement("div")
    appRoot.id = "root"
    document.body.appendChild(appRoot)

    console.log("Root element created dynamically")

    // Now mount React to the newly created element
    ReactDOM.createRoot(appRoot).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
  }
})

// Also attempt immediate mounting in case DOMContentLoaded has already fired
const rootElement = document.getElementById("root")
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
} else if (document.body) {
  // If body exists but root doesn't, create the root element
  const appRoot = document.createElement("div")
  appRoot.id = "root"
  document.body.appendChild(appRoot)

  ReactDOM.createRoot(appRoot).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}

