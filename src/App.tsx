import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Admin from './pages/Admin'
import NetWorth from './pages/NetWorth'
import { WalletProvider } from './context/WalletContext'

function App() {
  return (
    <WalletProvider>
    <Router>
      <div className="min-h-screen bg-crypto-dark flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/net-worth" element={<NetWorth />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </WalletProvider>
  )
}

export default App
