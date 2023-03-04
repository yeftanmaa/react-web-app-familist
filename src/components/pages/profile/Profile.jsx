import { Grid, Typography, Button, Paper, Box } from "@mui/material";
import { Container } from "@mui/system";
import { signOut } from "firebase/auth";
import { React, useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";
import css from "../../styles/global-style.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import ModalEditProfile from "../../modals/EditProfile";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: '20px 30px',
    textAlign: 'left',
    marginLeft: '10px',
    fontSize: '15px',
    color: theme.palette.text.secondary,
}));

const Profile = () => {
    const [userName, setUserName] = useState("");
    const [userDesc, setUserDesc] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const userCollectionRef = collection(db, "users");
                const q = query(userCollectionRef, where("email", "==", user?.email));

                getDocs(q).then((querySnapshot) => {
                    querySnapshot.docs.forEach((doc) => {

                        setUserName(doc.data().name);
                        setUserDesc(doc.data().description);
                        setUserPhone(doc.data().phone);
                        setUserEmail(doc.data().email);
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

    const handleLogout = () => {
        signOut(auth);
    };

    const [openEditModal, setOpenEditModal] = useState(false);

    const handleOpenEditModal = () => {
        setOpenEditModal((prev) => !prev);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal((prev) => !prev);
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', height: '600px'}}>
            <Container>
                <Typography variant="h4" fontWeight={500} marginBottom={2}>Profile</Typography>
                <Box sx={{ display: 'flex', alignItems: "center", marginTop: '20px', justifyContent: 'center'}}>
                    
                    <Box display="grid" alignItems="center" textAlign="left" gridTemplateColumns="repeat(12, 1fr)" gap={2}>

                        <Grid gridColumn="span 2">
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Name:</Typography>
                        </Grid>
                        <Grid gridColumn="span 10">
                            <Item>{userName}</Item>
                        </Grid>

                        <Grid gridColumn="span 2">
                            <Typography variant="body1" sx={{fontWeight: '600'}}>About Me:</Typography>
                        </Grid>
                        <Grid gridColumn="span 10">
                            <Item>{userDesc}</Item>
                        </Grid>

                        <Grid gridColumn="span 2">
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Email: </Typography>
                        </Grid>
                        <Grid gridColumn="span 10">
                            <Item>{userEmail}</Item>
                        </Grid>
                        
                        <Grid gridColumn="span 2">
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Phone: </Typography>
                        </Grid>
                        <Grid gridColumn="span 10">
                            <Item>{userPhone}</Item>
                        </Grid>

                        <Grid gridColumn="span 2"></Grid>
                        <Grid gridColumn="span 10" justifyContent={"center"}>
                            <Button onClick={handleOpenEditModal} variant="outlined" sx={{ width: '30%', marginLeft: '10px'}}>Edit Profile</Button>
                            {openEditModal && (
                                <ModalEditProfile open={openEditModal} onclose={handleCloseEditModal} onCloseClick={handleCloseEditModal} name={userName} desc={userDesc} email={userEmail} phone={userPhone} />
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Container>

            <Box className="box" sx={css}>
                <Button onClick={handleLogout} endIcon={<LogoutIcon />} color="cancel" variant="contained" href="/">Sign Out</Button>
            </Box>

            <p style={{opacity: 0.3, position: 'fixed', bottom: '1%'}}>Copyright 2023. Thesis Project Purposes.</p>
        </div>
    );
}
 
export default Profile;