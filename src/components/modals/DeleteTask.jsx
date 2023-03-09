import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { deleteDoc, doc } from "firebase/firestore";
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

const ModalDeleteTask = ({open, handleClose, onCloseClick, docID}) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const deleteTask = async () => {
        const paymentRef = doc(db, 'payments', docID);

        try {   
            await deleteDoc(paymentRef);
            setSnackbarMessage('Payment has been deleted!');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
                window.location.reload();
            }, 1500);
        } catch(err) {
            console.error("Error!", err);
            setSnackbarMessage('Error! Could not delete the payment.');
            setSnackbarSeverity('error');
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
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '500', fontSize: 30, marginBottom: 1}}>Are you sure</Typography>
                    <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '400', fontSize: 17, color: 'rgba(0, 0, 0, 0.61)'}} >want to delete this task?</Typography>

                    <Box className="box-delete-scheduler" sx={css}>
                        <Button onClick={deleteTask} className="btn-group-delete-scheduler" sx={css} color="primary" variant="contained">Yes</Button>
                        <Button onClick={onCloseClick} className="btn-group-delete-scheduler" sx={css} color="cancel" variant="outlined">No</Button>
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
 
export default ModalDeleteTask;