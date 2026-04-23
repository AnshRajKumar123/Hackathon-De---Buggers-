import React from 'react'
import Navbar from './ComponentJSX/Navbar'
import Home from './ComponentJSX/Home'
import Footer from './ComponentJSX/Footer'
import { Route, Routes } from 'react-router-dom'
import BookCenter from './ComponentJSX/BookCenter'

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bookcenter' element={<BookCenter />} />
        <Route path='/bookedhistory' element={<BookedHistory />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App