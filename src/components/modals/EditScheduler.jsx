import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Timestamp, updateDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import css from "../styles/global-style.css";
import SnackbarComponent from "../snackbar";
import { addLeadingZero, getOrdinalSuffix, parseDeadlineData } from "../utils/DateGenerator";

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

const ModalEditScheduler = ({open, handleClose, onCloseClick, title, deadline, type, fixedBill, id}) => {

    const [getDeadline, setDeadline] = useState(deadline);

    // use parsing function to parse deadline date into a number and display in the field
    const deadlineNumber = parseDeadlineData(getDeadline);

    const [getTitle, setTitle] = useState(title);
    const [getType, setType] = useState(type);
    const [getFixedBill, setFixedBill] = useState(fixedBill);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Check if deadline changed
    const [isDeadlineChanged, SetIsDeadlineChanged] = useState(false);

    useEffect(() => {
        if (getDeadline !== deadline) {
            SetIsDeadlineChanged(true);
        }
    }, [getDeadline, deadline])

    const EditScheduler = async () => {
        // get ordinal suffix
        const suffix = getOrdinalSuffix(getDeadline);

        // add leading zero if number is one digit
        const finalDeadlineNumber = addLeadingZero(getDeadline);

        const schedulerRef = doc(db, 'scheduler', id);
        const newValue = {
            createdAt: Timestamp.fromDate(new Date()),
            title: getTitle,
            type: getType
        }

        if (getFixedBill !== undefined) {
            newValue.fixedBill = Number(getFixedBill);
        }

        if (isDeadlineChanged) {
            newValue.deadline = finalDeadlineNumber + suffix + ' of the month'
        }

        try {
            updateDoc(schedulerRef, newValue);
            setSnackbarMessage('Scheduler has been edited!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
                window.location.reload();
            }, 1500);
        } catch(err) {
            console.error("Error!", err);
            setSnackbarMessage('Error! Could not edit the scheduler.');
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
                        label="Payment Deadline"
                        id="outlined-multiline-static"
                        sx={{marginTop: '15px', marginBottom: '15px'}}
                        fullWidth
                        type="number"
                        value={deadlineNumber}
                        onChange={(e) => setDeadline(e.target.value)}
                        size="small"
                        placeholder="Date of Deadline"
                        InputProps={{
                            style: {fontSize: 15},
                            endAdornment: <InputAdornment position="start">Of the month</InputAdornment>,
                            inputProps: {
                                min: 1,
                                max: 31
                            }
                        }}
                    />

                    {getFixedBill === undefined ? "" : (
                        <TextField 
                            label="Fixed Bill"
                            id="outlined-multiline-static"
                            sx={{marginTop: '15px', marginBottom: '15px'}}
                            fullWidth
                            type="number"
                            value={getFixedBill}
                            onChange={(e) => setFixedBill(e.target.value)}
                            size="small"
                            placeholder="How much the cost?"
                            InputProps={{
                                style: {fontSize: 15}
                            }}
                        />
                    )}

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