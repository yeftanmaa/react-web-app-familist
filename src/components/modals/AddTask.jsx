import { Button, Modal, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import css from "../styles/global-style.css";
import SnackbarComponent from "../snackbar";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
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

function ModalAddTask({ open, handleClose, onCloseClick }) {

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskEstimationPrice, setTaskEstimationPrice] = useState(0);
    const [taskAssignee, setTaskAssignee] = useState('');
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

    const taskRef = collection(db, "payments");

    const HandleSave = async () => {

        if (taskDesc === "") {
            setTaskDesc('No description');
        } else {
            if (taskTitle === "") {
                alert("Task title is mandatory!");
            } else if (taskAssignee === "") {
                alert ("Please assign this payment task to your family member!");
            } else {
                try {
                    await addDoc(taskRef, {
                        title: taskTitle,
                        desc: taskDesc,
                        priceEstimation: Number(taskEstimationPrice),
                        status: 'topay',
                        assignee: taskAssignee
                    });
    
                    // confirm if data successfully saved
                    setSnackbarMessage('New payment task has been added!');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                    setTimeout(() => {
                        setSnackbarOpen(false);
                        window.location.reload();
                    }, 1500);
                } catch (err) {
                    setSnackbarMessage('Error! Could not add new payment task.');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    setTimeout(() => {
                        setSnackbarOpen(false);
                    }, 3000);
                
                } 
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
                    <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '500', fontSize: 30}}>New Task</Typography>

                    <TextField
                        label="Title"
                        id="outlined-multiline-static"
                        sx={{ marginTop: '25px', marginBottom: '15px'}}
                        fullWidth
                        type="text"
                        size="small"
                        onChange={(e) => setTaskTitle(e.target.value)}
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
                        onChange={(e) => setTaskDesc(e.target.value)}
                        rows={4}
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
                        onChange={(e) => setTaskEstimationPrice(e.target.value)}
                        rows={4}
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
                            displayEmpty
                            value={taskAssignee}
                            onChange={(e) => setTaskAssignee(e.target.value)}
                        >
                            {memberList.map((member) => (
                                <MenuItem value={member.name}>{member.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box className="box-income-modal" sx={css}>
                        <Button onClick={HandleSave} className="btn-group-income-modal" sx={css} color="primary" variant="contained">Save changes</Button>
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

export default ModalAddTask;