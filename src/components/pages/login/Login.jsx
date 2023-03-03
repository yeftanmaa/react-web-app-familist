import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../../../config/firebase";
import { Button, Typography, Box, TextField, Link } from "@mui/material";
import css from "../../styles/global-style.css";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
              );
              if (userCredential.user) {
                navigate("/dashboard");
              }
        } catch (err) {
            alert("Please enter correct email and password!");
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

            navigate("/dashboard");
        } catch (err) {
            alert(err);
        }
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
                            type="password"
                            autoComplete="current-password"
                            size="small"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
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
                        <Button onClick={signInWithGoogle} variant="contained" color="secondary" sx={{width: '150px'}} startIcon={<GoogleIcon />}>Use Google</Button>
                    </Box>
                    
                    <Link sx={{fontSize: '15px', marginTop: '10px', cursor: "pointer", fontWeight: 400}}>Forgot password?</Link>

                    <p style={{opacity: 0.3, position: 'fixed', bottom: 0}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
            </Container>
            
        </div>
    );
}
 
export default Login;