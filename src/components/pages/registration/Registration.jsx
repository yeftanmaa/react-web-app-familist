import React, { useState } from "react";
import { Button, Typography, Box, TextField, Snackbar } from "@mui/material";
import css from "../../styles/global-style.css";
import { Container } from "@mui/system";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { GenerateToken } from "../../utils/tokenGenerator";
import SnackbarComponent from "../../snackbar";

const Registration = () => {

    // navigation component
    const navigate = useNavigate();

    const [getToken, setToken] = useState("");
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const userCollectionRef = collection(db, "users");

    const handleRegistration = async() => {

        // not allowing empty input
        if (newName === "" || newEmail === "" || newPassword === "" || confirmPassword === "") {
            setSnackbarMessage('Field cannot left empty!');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                    navigate('/');
                }, 3000);
        };

        // check if password and confirmPassword are matched
        if (newPassword === confirmPassword) {
            try {
                // create a new user in Firebase Auth
                await createUserWithEmailAndPassword(auth, newEmail, newPassword);
                
                // Add user's name, email and password to Firestore
                await addDoc(userCollectionRef, {
                    name: newName,
                    email: newEmail,
                    password: newPassword,
                    token: getToken
                });

                // confirm to user and navigate to login
                setSnackbarMessage('Your account successfully created!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                    navigate('/');
                }, 3000);
            } catch(err) {
                setSnackbarMessage('Error! Could not create your account.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } else {
            setSnackbarMessage('Please confirm your password correctly');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000);
        }
    };

    const handleCLoseSnackbar = () => {
        setSnackbarOpen(false);
    }

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);

        // generate token
        const generateToken = GenerateToken();
        setToken(generateToken);

        navigator.clipboard.writeText(generateToken);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }

    return (
        <div>
            <div className="navbar" style={css}>
                 <a href="/"><img src="/logo-only.png" alt="familist" width={45} style={{border: "1px solid white"}} /></a>

                 <Box style={{display: "flex", alignItems: "center"}}>
                    <Typography>Have an account?</Typography>
                    <Button sx={{color: "black",border: "1px solid rgba(0, 0, 0, 0.21)", padding: "5px 20px", marginLeft: "10px"}} href="/">Log in</Button>
                 </Box>
            </div>

            <Container>
                <div className="regis-box" style={css}>
                    <Typography variant="h4" fontWeight={500} sx={{marginBottom: '10px'}}>Registration</Typography>

                    {/* Name Input */}
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Full Name"
                            type="text"
                            size="small"
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Set your full name"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </Box>

                    {/* Email Input */}
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Email address"
                            type="email"
                            size="small"
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Set your email address"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </Box>

                    {/* Password Input */}
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            size="small"
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Set your password"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </Box>

                    {/* Confirm Password Input */}
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Confirm password"
                            type="password"
                            autoComplete="current-password"
                            size="small"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </Box>

                    {/* Access Token Field */}
                    <Box display={"flex"} alignItems="center" justifyContent={"flex-start"} gap="10px">
                        <TextField
                            id="outlined-password-input"
                            label="Access Token"
                            type="text"
                            disabled
                            value={getToken}
                            autoComplete="current-password"
                            size="small"
                            style={{width: '160px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />

                        <Button onClick={handleClick} sx={{fontSize: 15}} color="secondary">Generate Token</Button>

                        <Snackbar
                            open={open}
                            autoHideDuration={2000}
                            onClose={handleClose}
                            message="Text copied"
                        />
                    </Box>

                    <Button onClick={handleRegistration} disabled={getToken === ''}  variant="contained" sx={{width: '300px', backgroundColor: '#1E8CF1', marginTop: '5px'}} disableElevation>Create an account</Button>

                    <p style={{opacity: 0.3, position: 'fixed', bottom: 0}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
            </Container>
            
            {snackbarOpen && (
                <SnackbarComponent
                    open={snackbarOpen}
                    handleClose={handleCLoseSnackbar}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                />
            )}

        </div>
    );
}
 
export default Registration;