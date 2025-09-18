import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS similar to the reference site
AOS.init({
  offset: 60,      // trigger a bit earlier
  delay: 0,
  duration: 500,   // little more faster
  easing: 'ease-out',
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
})

createRoot(document.getElementById("root")!).render(<App />);
