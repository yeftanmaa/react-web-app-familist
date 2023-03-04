import { Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Timestamp, updateDoc, doc } from "firebase/firestore";
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

const ModalEditScheduler = ({open, handleClose, onCloseClick, desc, title, type, id}) => {

    const [getDesc, setDesc] = useState(desc);
    const [getTitle, setTitle] = useState(title);
    const [getType, setType] = useState(type);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const EditScheduler = async () => {
        const schedulerRef = doc(db, 'scheduler', id);
        const newValue = {
            createdAt: Timestamp.fromDate(new Date()),
            desc: getDesc,
            title: getTitle,
            type: getType
        }

        try {
            updateDoc(schedulerRef, newValue);
            setSnackbarMessage('Scheduler has been edited!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                    window.location.reload();
                }, 3000);
            window.location.reload();
        } catch(err) {
            console.error("Error!", err);
            setSnackbarMessage('Error! Could not edit the scheduler.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000);
        }
    };

    const handleCLoseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '500', fontSize: 30}}>Edit Scheduler</Typography>

                    <TextField
                        label="Title"
                        id="outlined-multiline-static"
                        sx={{ marginTop: '25px', marginBottom: '15px'}}
                        fullWidth
                        type="text"
                        value={getTitle}
                        onChange={(e) => setTitle(e.target.value)}
                        size="small"
                        placeholder="Name of this scheduler"
                        InputProps={{
                            style: {fontSize: 15}
                        }}
                    />

                    <TextField
                        id="outlined-multiline-static"
                        label="Description"
                        type="text"
                        multiline
                        value={getDesc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows={4}
                        size="small"
                        fullWidth
                        placeholder="Add some details for your new scheduler"
                        inputProps={{style: {fontSize: 15}}}
                    />

                    <FormControl sx={{marginTop: '15px'}} fullWidth>
                        <InputLabel id="select-schedule-type-label">Scheduler Type</InputLabel>
                        <Select
                            labelId="select-schedule-type-label"
                            id="select-schedule-type"
                            label="Scheduler Type"
                            value={getType}
                            displayEmpty
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="Tagihan bulanan">Monthly</MenuItem>
                            <MenuItem value="Tagihan tahunan">Annual</MenuItem>
                        </Select>
                    </FormControl>

                    <Box className="box-income-modal" sx={css}>
                        <Button onClick={EditScheduler} className="btn-group-income-modal" sx={css} color="primary" variant="contained">Save changes</Button>
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
 
export default ModalEditScheduler;