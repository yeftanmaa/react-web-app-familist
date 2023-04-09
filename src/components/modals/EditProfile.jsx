import { Button, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../config/firebase";
import css from "../styles/global-style.css";
import SnackbarComponent from "../snackbar";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const ModalEditProfile = ({open, handleClose, onCloseClick, name, desc, email, phone}) => {

    const [getName, setName] = useState(name);
    const [getDesc, setDesc] = useState(desc);
    const [getEmail] = useState(email);
    const [getPhone, setPhone] = useState(phone);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const HandleEditprofile = async () => {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", email));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            
            try {
                await updateDoc(doc.ref, {
                    description: getDesc,
                    name: getName,
                    phone: getPhone
                })
                setSnackbarMessage('User profile has been updated!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                    window.location.reload();
                }, 1500);
            } catch(err) {
                console.error("Error!", err);
                setSnackbarMessage('Error! Could not update user profile.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                }, 1500);
            }
        }
    };

    const handleCLoseSnackbar = () => {
        setSnackbarOpen(false);
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '500', fontSize: 30}}>Edit Profile</Typography>

                    <TextField
                        label="Profile Name"
                        id="outlined-multiline-static"
                        sx={{ marginTop: '25px', marginBottom: '25px'}}
                        fullWidth
                        type="text"
                        value={getName}
                        onChange={(e) => setName(e.target.value)}
                        size="small"
                        placeholder="Set your new profile name"
                        InputProps={{
                            style: {fontSize: 15}
                        }}
                    />

                    <TextField
                        id="outlined-multiline-static"
                        label="About Me"
                        type="text"
                        multiline
                        value={getDesc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows={4}
                        size="small"
                        fullWidth
                        placeholder="Tell us more about yourself"
                        inputProps={{style: {fontSize: 15}}}
                    />

                    <TextField
                        id="outlined-multiline-static"
                        label="My Email"
                        sx={{ marginTop: '25px', marginBottom: '25px'}}
                        type="text"
                        value={getEmail}
                        disabled
                        size="small"
                        fullWidth
                        placeholder="Your current email"
                        helperText="Email can not be changed"
                        inputProps={{style: {fontSize: 15}}}
                    />

                    <TextField
                        id="outlined-multiline-static"
                        label="Phone Number"
                        type="text"
                        value={getPhone}
                        onChange={(e) => setPhone(e.target.value)}
                        size="small"
                        fullWidth
                        placeholder="Changes your phone number"
                        inputProps={{style: {fontSize: 15}}}
                    />

                    <Box className="box-income-modal" sx={css}>
                        <Button onClick={HandleEditprofile} className="btn-group-income-modal" sx={css} color="primary" variant="contained">Save changes</Button>
                        <Button onClick={onCloseClick} className="btn-group-income-modal" sx={css} color="cancel" variant="outlined">Cancel</Button>
                    </Box>
                </Box>
            </Modal>

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
 
export default ModalEditProfile;