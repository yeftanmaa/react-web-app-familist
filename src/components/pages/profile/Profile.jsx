import { TextField, Typography, Button, Box } from "@mui/material";
import { Container } from "@mui/system";
import { React, useState } from "react";
import css from './style.css';

const Profile = () => {

    const [workspaceName, setWorkspaceName] = useState("Nathan's Family");
    const [workspaceDesc, setWorkspaceDesc] = useState("This is Nathan workspace with his family.");

    const handleBlur = (e) => {
        if (e.target.value === '') {
            setWorkspaceName("Nathan's Family");
        }
    };

    return (
        <div>
            <Container>
                <div className="profile-box" style={css}>
                    <Typography variant="h4" marginBottom={2}>Profile</Typography>
                    
                    <div className="profile-details" style={css}>
                        <Typography variant="body">Workspace Name:</Typography>

                        <br />

                        <TextField
                            
                            value={workspaceName} // get real value from firestore db
                            onChange={(event) => setWorkspaceName(event.target.value)}
                            id="outlined-password-input"
                            placeholder="Put your workspace name"
                            // defaultValue="Nathan's Family" 
                            type="text"
                            size="small"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </div>

                    <div className="profile-details" style={css}>
                        <Typography variant="body">Workspace Description:</Typography>

                        <br />
                        
                        <TextField
                            onBlur={handleBlur}
                            onChange={(event) => setWorkspaceDesc(event.target.value)}
                            multiline
                            id="outlined-password-input"
                            placeholder="Put your workspace description"
                            value={workspaceDesc} // get real value from firestore db
                            type="text"
                            size="small"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </div>
                        

                    <Box className="box" sx={css}>
                        <Button className="btn-group" sx={css} color="primary" disabled={workspaceName === '' || workspaceName === "Nathan's Family"} variant="contained" disableElevation>Edit</Button>
                        <Button className="btn-group" sx={css} color="cancel" variant="contained" disableElevation href="/auth">Logout</Button>
                    </Box>

                    <p style={{opacity: 0.3, position: 'fixed', bottom: 0}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
            </Container>
        </div>
    );
}
 
export default Profile;