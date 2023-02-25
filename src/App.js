import React from 'react';
import Login from './components/pages/login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/pages/registration/Registration';

// firebase import
import handleSubmit from './handler/handleSubmit';
import { useRef } from 'react';

function App() {

  const dataRef = useRef()

  const submithandler = (e) => {
    e.preventDefault();
    handleSubmit(dataRef.current.value);
    dataRef.current.value = "";
  }

  return (
    <Router>
      <Routes>

        <Route path='/auth' exact element={ <Login />} />

        <Route path='/registration' element={<Registration />} />

        <Route path='/test' element = {
          <div>
            <form onSubmit={submithandler}>
              <input type="text" ref={dataRef} />
              <button type='submit'>Save</button>
            </form>
          </div>
        }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
