import { Grid, Typography, Button, Paper, Box, Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { Container } from "@mui/system";
import { signOut } from "firebase/auth";
import { React, useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import ModalEditProfile from "../../modals/EditProfile";
import { GetFamilyMembers } from "../../utils/firestoreUtils";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: '20px 30px',
    textAlign: 'left',
    marginLeft: '10px',
    fontSize: '15px',
    color: theme.palette.text.secondary,
}));

function randomColor() {
    let hex = Math.floor(Math.random() * 0xFFFFFF);
    let color = "#" + hex.toString(16);

    return color;
}

const Profile = () => {
    const [userName, setUserName] = useState("");
    const [userDesc, setUserDesc] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [familyMembers, setFamilyMembers] = useState([]);

    useEffect(() => {
        const fetchFamilyMembersData = async () => {
            const memberData = await GetFamilyMembers();
            setFamilyMembers(memberData);
        }

        fetchFamilyMembersData();
    }, [])

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
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', height: '500px'}}>
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
                            <Button onClick={handleOpenEditModal} startIcon={<EditIcon />} variant="outlined" sx={{ width: '40%', marginLeft: '10px', marginRight: '10px'}}>Edit Profile</Button>
                            <Button onClick={handleLogout} endIcon={<LogoutIcon />} color="cancel" variant="contained" href="/">Sign Out</Button>
                            {openEditModal && (
                                <ModalEditProfile open={openEditModal} onclose={handleCloseEditModal} onCloseClick={handleCloseEditModal} name={userName} desc={userDesc} email={userEmail} phone={userPhone} />
                            )}
                        </Grid>
                    </Box>
                </Box>

            </Container>

            <Box component={Paper} display={"flex"} width="320px" justifyContent={"space-evenly"} alignItems={"center"} p={1} sx={{position: "absolute", bottom: '20px', margin: '0 100px'}}>
                <Typography variant="h6" sx={{fontSize: '16px'}}>Family Members:</Typography>
                <AvatarGroup max={4}>
                    {familyMembers.map((member) => (
                        <Tooltip title={member.name}>
                            <Avatar alt={member.name} style={{backgroundColor: randomColor()}}>{member.name[0]}</Avatar>
                        </Tooltip>
                        
                    ))}
                </AvatarGroup>
                    
            </Box>
        </div>
    );
}
 
export default Profile;