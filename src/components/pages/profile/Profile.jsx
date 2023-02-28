import { TextField, Typography, Button, Box } from "@mui/material";
import { Container } from "@mui/system";
import { signOut } from "firebase/auth";
import { React, useEffect, useRef, useState } from "react";
import { auth, db } from "../../../config/firebase";
import css from "../../styles/global-style.css";
import { collection, getDocs, query, where } from "firebase/firestore";

const Profile = () => {
    const getDataName = useRef(null);
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceDesc, setWorkspaceDesc] = useState("This is Nathan workspace with his family.");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const userCollectionRef = collection(db, "users");
                const q = query(userCollectionRef, where("email", "==", user?.email));

                getDocs(q).then((querySnapshot) => {
                    querySnapshot.docs.forEach((doc) => {
                        getDataName.current = doc.data().name + "'s Family";
                        setWorkspaceName(doc.data().name + "'s Family");
                    });
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                });

            } else {
              console.log("No user is currently signed in.");
            }
          });
        return unsubscribe;
        
    }, [])

    

    const handleBlur = (e) => {
        if (e.target.value === '') {
            setWorkspaceName(getDataName.current);
        }
    };

    const handleLogout =() => {
        signOut(auth);
    }

    return (
        <div>
            <Container>
                <div className="profile-box" style={css}>
                    <Typography variant="h3" marginBottom={2}>Profile</Typography>
                    
                    <div className="profile-details" style={css}>
                        <Typography variant="body">Workspace Name:</Typography>

                        <br />

                        <TextField
                            
                            value={workspaceName} // get real value from firestore db
                            onBlur={handleBlur}
                            onChange={(event) => setWorkspaceName(event.target.value)}
                            id="outlined-password-input"
                            placeholder="Put your workspace name"
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
                        <Button className="btn-group" sx={css} color="primary" disabled={workspaceName === '' || workspaceName === getDataName.current} variant="contained">Edit</Button>
                        <Button onClick={handleLogout} className="btn-group" sx={css} color="cancel" variant="contained" href="/">Logout</Button>
                    </Box>

                    <p style={{opacity: 0.3, position: 'fixed', bottom: 0}}>Copyright 2023. Thesis Project Purposes.</p>
                </div>
            </Container>
        </div>
    );
}
 
export default Profile;