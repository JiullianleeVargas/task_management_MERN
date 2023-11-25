import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Admins from './pages/Admins';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path="/"element={<Admins/>}/>
          <Route path="/Admins"element={<Admins/>}/>
          <Route path="/Reports"element={<Reports/>}/>
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
