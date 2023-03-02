import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../../config/firebase";
import css from "../styles/global-style.css"

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

const ModalDeleteScheduler = ({open, handleClose, onCloseClick, docID}) => {

    const deleteScheduler = async () => {
        const schedulerDoc = doc(db, 'scheduler', docID);

        try {   
            await deleteDoc(schedulerDoc);
            alert("Scheduler deleted!");
            handleClose();
        } catch(err) {
            console.error("Error!", err);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '500', fontSize: 30, marginBottom: 1}}>Are you sure</Typography>
                <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '400', fontSize: 17, color: 'rgba(0, 0, 0, 0.61)'}} >want to delete this scheduler?</Typography>

                <Box className="box-delete-scheduler" sx={css}>
                    <Button onClick={deleteScheduler} className="btn-group-delete-scheduler" sx={css} color="primary" variant="contained">Yes</Button>
                    <Button onClick={onCloseClick} className="btn-group-delete-scheduler" sx={css} color="cancel" variant="outlined">No</Button>
                </Box>
            </Box>
        </Modal>
    );
}
 
export default ModalDeleteScheduler;