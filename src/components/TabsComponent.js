import { React } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import css from './styles/global-style.css';
import { Link, useLocation } from 'react-router-dom';

function TabsComponent() {
  const location = useLocation();


  // Map the route path to the corresponding tab index
  const pathToTabIndex = {
    '/dashboard': 0,
    '/live-board': 1,
    '/scheduler': 2,
    '/profile': 3
  };

  // Set the active tab based on the current route
  const activeTab = pathToTabIndex[location.pathname];

  // hide this tabs inside auth or registration page
  if(location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  return (
    <div>
        <div className="navbar" style={css}>
            <a href="/"><img style={{backgroundColor: 'white', padding: '7px', borderRadius: '8px'}} src="/logo_familist.png" alt="familist with text" width={120} /></a>

            <Box sx={{ width: '100%', color: 'white' }}>
                <Box>
                    <Tabs
                      value={activeTab}
                      centered
                      TabIndicatorProps={{
                        style: {
                          backgroundColor: "white",
                          color: 'white'
                        }
                      }}
                      >
                        <Tab label="Dashboard"  component={Link} to="/dashboard" sx={{ textTransform: 'capitalize', fontSize: '17px', color: 'white' }} />
                        <Tab label="Live Board" component={Link} to="/live-board" sx={{ textTransform: 'capitalize', fontSize: '17px', color: 'white' }} />
                        <Tab label="Scheduler" component={Link} to="/scheduler" sx={{ textTransform: 'capitalize', fontSize: '17px', color: 'white' }} />
                        <Tab label="Profile" component={Link} to="/profile" sx={{ textTransform: 'capitalize', fontSize: '17px', color: 'white' }} />
                    </Tabs>
                </Box>                    
            </Box>
        </div>
    </div>
    
  );
}

export default TabsComponent;
