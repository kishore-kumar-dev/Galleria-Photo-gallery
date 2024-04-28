import React from 'react';

import HomePage from './components/HomePage/HomePage';
import UploadPage from './components/UploadPage/UploadPage';
import BinPage from './components/BinPage/BinPage';
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Routes>
      
        <Route path="/" element={<HomePage/>} />
        <Route path="/upload" element={<UploadPage/>} />
        <Route path="/bin" element={<BinPage/>} />
      
    </Routes>
  );
}

export default App;