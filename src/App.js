import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';

// page import
import Login from './components/pages/login/Login';
import Registration from './components/pages/registration/Registration';
import Profile from './components/pages/profile/Profile';
import TabsComponent from './components/TabsComponent';
import Dashboard from './components/pages/dashboard/Dashboard';
import Scheduler from './components/pages/scheduler/Scheduler';
import LiveBoard from './components/pages/live-board/LiveBoard';

// route import
import PrivateRoute from './components/routes/PrivateRoute';


// make all mui typography components is lowercase
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    allVariants: {
      textTransform: 'none',
      letterSpacing: '0px',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontSize: '16px'
        },
      },
    },
    MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "none"
          },
        },
    },
  },
  palette: {
    primary: {
      main: '#1E8CF1',
    },
    cancel: {
      main: '#F11E1E',
      contrastText: '#fff',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <TabsComponent />
        <Routes>
          <Route path='/' element={ <Login />} />
          <Route path='/register' element={<Registration />} />

          {/* automatically redirect user if they not logged in */}
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/live-board' element={<LiveBoard />} />
            <Route path='/scheduler' element={<Scheduler />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
