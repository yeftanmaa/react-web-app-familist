import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';

// page import
import Login from './components/pages/login/Login';
import Registration from './components/pages/registration/Registration';
import Profile from './components/pages/profile/Profile';
import TabsComponent from './components/TabsComponent';
import Dashboard from './components/pages/dashboard/Dashboard';
import Scheduler from './components/pages/scheduler/Scheduler';
import LiveBoard from './components/pages/live-board/LiveBoard';

// firebase import
import handleSubmit from './handler/handleSubmit';
import { useRef } from 'react';

// make all mui typography components is lowercase
const theme = createTheme({
  typography: {
    allVariants: {
      textTransform: 'none',
      letterSpacing: '0px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '16px'
        }
      }
    }
  }
});

function App() {

  const dataRef = useRef()

  const submithandler = (e) => {
    e.preventDefault();
    handleSubmit(dataRef.current.value);
    dataRef.current.value = "";
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <TabsComponent />
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

          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/live-board' element={<LiveBoard />} />
          <Route path='/scheduler' element={<Scheduler />} />
          <Route path='/profile' element={<Profile />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
