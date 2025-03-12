import LoginFrm from './pages/LoginFrm'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
function App() {
  return (
    <>
        <Router>
      <Routes>
        <Route path="/" element={<LoginFrm />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router> 
    </>
  )
}
export default App
