import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Landing from './pages/Landing';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
// import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-textMain flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col  bg-gray-100">
          <Routes>
            {/* <Route path="/" element={<Landing />} /> */}
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:slug" element={<ProblemDetail />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div className="flex-grow flex items-center justify-center text-xl text-muted">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
