import "./LoadingScreen.css"

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="loading-logo">
          <path d="M12 2L2 19.5H22L12 2Z" fill="#4CAF4F" />
        </svg>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  )
}

export default LoadingScreen

