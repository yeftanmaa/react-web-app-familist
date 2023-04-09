import { Button, Modal, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import css from "../styles/global-style.css";
import SnackbarComponent from "../snackbar";
import { doc, updateDoc } from "firebase/firestore";
import { GetMemberOnCurrentToken } from "../utils/firestoreUtils";

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


function ModalEditTask({ open, handleClose, onCloseClick, desc, priceEstimation, title, assignee, id }) {
  
    const [getDesc, setDesc] = useState(desc);
    const [getTitle, setTitle] = useState(title);
    const [getPriceEstimation, setPriceEstimation] = useState(priceEstimation);
    const [getAssignee, setGetAssignee] = useState(assignee);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        const fetchMemberListData = async () => {
            const memberListData = await GetMemberOnCurrentToken('n4th4nSpace');
            setMemberList(memberListData);
        }

        fetchMemberListData();
    }, [])

    const EditTask = async () => {
        const paymentRef = doc(db, 'payments', id);
        const newValue = {
            desc: getDesc,
            title: getTitle,
            priceEstimation: Number(getPriceEstimation),
            assignee: getAssignee
        }

        try {
            updateDoc(paymentRef, newValue);
            setSnackbarMessage('Payment has been edited!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
                window.location.reload();
            }, 1500);
        } catch(err) {
            console.error("Error!", err);
            setSnackbarMessage('Error! Could not edit the payment.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 1500);
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
                <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '500', fontSize: 30}}>Edit Task</Typography>

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
                    rows={4}
                    value={getDesc}
                    onChange={(e) => setDesc(e.target.value)}
                    size="small"
                    fullWidth
                    placeholder="Add some details for your new scheduler"
                    inputProps={{style: {fontSize: 15}}}
                />

                <TextField
                    id="outlined-multiline-static"
                    label="Estimation Price"
                    sx={{ marginTop: '15px'}}
                    type="number"
                    value={getPriceEstimation}
                    onChange={(e) => setPriceEstimation(e.target.value)}
                    size="small"
                    fullWidth
                    placeholder="How much the estimation price?"
                    inputProps={{style: {fontSize: 15}}}
                />

                <FormControl sx={{marginTop: '15px'}} fullWidth>
                    <InputLabel id="select-schedule-type-label">Assignee</InputLabel>
                    <Select
                        labelId="select-schedule-type-label"
                        id="select-schedule-type"
                        label="Assignee"
                        value={getAssignee}
                        onChange={(e) => setGetAssignee(e.target.value)}
                        displayEmpty
                    >
                        {memberList.map((member) => (
                                <MenuItem value={member.name}>{member.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box className="box-income-modal" sx={css}>
                    <Button onClick={EditTask} className="btn-group-income-modal" sx={css} color="primary" variant="contained">Save changes</Button>
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
  )
}

export default ModalEditTask;