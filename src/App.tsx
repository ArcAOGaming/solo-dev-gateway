import { useState, useEffect } from 'react'
import './App.css'
import { Portal } from './components/Portal'
import { CyberButton } from './components/CyberButton'

function App() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      <Portal />
    </div>
  )
}

export default App
