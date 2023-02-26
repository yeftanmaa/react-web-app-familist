import React, { useState } from "react";
import { Button, Typography, Box, TextField } from "@mui/material";
import css from "./style.css"
import { Container } from "@mui/system";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const Registration = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegistration = async() => {

        if (email === "" || password === "" || confirmPassword === "") {
            alert("Field cannot left empty!");
        }

        if (password === confirmPassword) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert ("Your account is Created!");
                navigate('/auth');
            } catch(err) {
                console.error(err);
            }
        } else {
            alert("Please confirm your password correctly!");
        }
        
    }

    return (
        <div>
            <div className="navbar" style={css}>
                 <a href="/auth"><img src="/logo-only.png" alt="familist" width={45} style={{border: "1px solid white"}} /></a>

                 <Box style={{display: "flex", alignItems: "center"}}>
                    <Typography>Have an account?</Typography>
                    <Button sx={{color: "black",border: "1px solid rgba(0, 0, 0, 0.21)", padding: "5px 20px", marginLeft: "10px"}} href="/auth">Log in</Button>
                 </Box>
            </div>

            <Container>
                <div className="regis-box" style={css}>
                    <Typography variant="h4" sx={{marginBottom: '10px'}}>Registration</Typography>

                    {/* Email Input */}
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Email address"
                            type="email"
                            size="small"
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
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

                    {/* Access Token Field
                    <Box>
                        <TextField
                            id="outlined-password-input"
                            label="Access Token"
                            helperText="Token will be generated soon"
                            type="text"
                            disabled
                            autoComplete="current-password"
                            size="small"
                            style={{width: '300px', margin: '10px 0'}}
                            inputProps={{style: {fontSize: 15}}}
                        />
                    </Box> */}

                    <Button onClick={handleRegistration} variant="contained" sx={{width: '300px', backgroundColor: '#1E8CF1'}} disableElevation>Create an account</Button>

                    <p style={{opacity: 0.3, position: 'fixed', bottom: 0}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
            </Container>
            
        </div>
    );
}
 
export default Registration;