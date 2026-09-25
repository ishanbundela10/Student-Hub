import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout'
import HomePage from './pages/Home';
import Rooms from './pages/Rooms';
import Hostels from './pages/Hostels';
import Tiffin from './pages/Tiffin';
import PropertyDetail from './pages/PropertyDetail';
import TiffinDetail from './pages/TiffinDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import AddTiffin from "./pages/AddTiffin";

export default function App() {
  return (

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/hostels" element={<Hostels />} />
      <Route path="/tiffin" element={<Tiffin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/tiffin/:id" element={<TiffinDetail />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/edit-property/:id" element={<EditProperty />} />
      <Route path="/add-tiffin" element={<AddTiffin />} />
    </Route>
    <Route path="*" element={<div>404 Not Found</div>} />
  </Routes>
</BrowserRouter>
  )
}