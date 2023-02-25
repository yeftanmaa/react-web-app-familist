import { TextField, Typography, Button } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import css from './style.css';

const Profile = () => {
    return (
        <div>
            <Container>
                <div className="profile-box" style={css}>
                    <Typography variant="h4">Profile</Typography>
                    <TextField
                        id="outlined-password-input"
                        placeholder="Herman's Family"
                        type="text"
                        size="small"
                        style={{width: '300px', margin: '10px 0'}}
                        inputProps={{style: {fontSize: 15}}}
                    />
                    <TextField
                        multiline
                        id="outlined-password-input"
                        placeholder="This is a little description about your family workspace"
                        type="text"
                        size="small"
                        style={{width: '300px', margin: '10px 0'}}
                        inputProps={{style: {fontSize: 15}}}
                    />

                    <Button className="logout-btn" variant="contained" sx={{position: 'fixed', bottom: '7%', backgroundColor: '#F11E1E'}} disableElevation>Logout</Button>

                    <p style={{opacity: 0.3, position: 'fixed', bottom: 0}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
            </Container>
        </div>
    );
}
 
export default Profile;