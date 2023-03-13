import React, { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../../config/firebase";
import { Button, Typography, Box, TextField, Link, InputAdornment, IconButton } from "@mui/material";
import css from "../../styles/global-style.css";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import SnackbarComponent from '../../snackbar';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(true);
    }

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
        setShowPassword(false);
    }

    const loginHandler = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
              );
              if (userCredential.user) {
                navigate("/scheduler");
              }
        } catch (err) {
            setSnackbarMessage('Error! Please enter correct email and password!');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000);
        }
    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            // save email to database if not exist
            const userCollectionRef = collection(db, "users");

            const q = query(userCollectionRef, where("email", "==", result.user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(userCollectionRef, {
                    name: result.user.displayName,
                    email: result.user.email
                })
            };

            navigate("/scheduler");
        } catch (err) {
            setSnackbarMessage('Error! Could not logged in with Google');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000);
        }
    }

    const TriggerResetEmail = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setSnackbarMessage('Sent password reset to your email');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000);
        } catch(err) {
            setSnackbarMessage('Please provide correct email!');
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
    
    return (
        <div>
            <div className="navbar" style={css}>
                 <img src="/logo-only.png" alt="familist" width={45} style={{border: "1px solid white"}} />

                 <Box style={{display: "flex", alignItems: "center"}}>
                    <Typography>New to Familist?</Typography>
                    <Button sx={{color: "black",border: "1px solid rgba(0, 0, 0, 0.21)", padding: "5px 20px", marginLeft: "10px"}} href="/register">Create an account</Button>
                 </Box>
            </div>

            <Container>
                <div className="regis-box" style={css}>
                    <Typography variant="h4" fontWeight={500} sx={{marginBottom: '10px'}}>Sign In</Typography>

                    {/* Email Input */}
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Email address"
                            type="email"
                            size="small"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </Box>

                    {/* Password Input */}
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            size="small"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{ style: {fontSize: 15}}}
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Access Token Field */}
                    {/* <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Access Token"
                            placeholder="Enter your access token"
                            type="text"
                            autoComplete="current-password"
                            size="small"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </Box> */}
                    
                    <Box width={"300px"} sx={{display: 'flex', gap: "10px"}}>
                        <Button onClick={loginHandler} variant="contained" sx={{width: '150px', backgroundColor: '#1E8CF1'}} disableElevation>Sign In</Button>
                        <Button onClick={signInWithGoogle} variant="outlined" color="secondary" sx={{width: '150px'}} startIcon={<GoogleIcon />}>Use Google</Button>
                    </Box>
                    
                    <Link onClick={TriggerResetEmail} sx={{fontSize: '15px', marginTop: '10px', cursor: "pointer", fontWeight: 400}}>Forgot password?</Link>

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
 
export default Login;