import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

// IMPORTS
import Login from './pages/Login';
import Register from './pages/Register';
import CreateService from './pages/CreateService';
import Home from './pages/Home';
import ServiceDetails from './pages/ServiceDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profil';


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-service" element={<CreateService />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
         
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;