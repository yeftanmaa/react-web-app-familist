import { Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
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

const ModalAddScheduler = ({open, handleClose, onCloseClick}) => {

    const [schedulerTitle, setSchedulerTitle] = useState('');
    const [schedulerType, setSchedulerType] = useState('');
    const [schedulerDesc, setSchedulerDesc] = useState('');
    const schedulerRef = collection(db, "scheduler");

    const HandleSave = async() => {
        // not allowing empty title neither type
        if (schedulerTitle === "") {
            alert('Scheduler title is mandatory!');
        } else if (schedulerType === "") {
            alert('Scheduler type is mandatory!');
        } else {
            try {
                await addDoc(schedulerRef, {
                    createdAt: Timestamp.fromDate(new Date()),
                    title: schedulerTitle,
                    desc: schedulerDesc,
                    type: schedulerType
                });

                // confirm if data successfully saved
                alert("Data saved!", handleClose);
                handleClose();
            } catch(err) {
                console.error("Error!", err);
            };
        };
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h4" sx={{textAlign: 'center', fontWeight: '500', fontSize: 30}}>New Scheduler</Typography>

                <TextField
                    label="Title"
                    id="outlined-multiline-static"
                    sx={{ marginTop: '25px', marginBottom: '15px'}}
                    fullWidth
                    type="text"
                    size="small"
                    onChange={(e) => setSchedulerTitle(e.target.value)}
                    placeholder="Name of this scheduler"
                    InputProps={{
                        style: {fontSize: 15}
                    }}
                />

                <TextField
                    id="outlined-multiline-static"
                    onChange={(e) => setSchedulerDesc(e.target.value)}
                    label="Description"
                    type="text"
                    multiline
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
                        value={schedulerType}
                        onChange={(e) => setSchedulerType(e.target.value)}
                    >
                        <MenuItem value="Tagihan bulanan">Monthly</MenuItem>
                        <MenuItem value="Tagihan tahunan">Annual</MenuItem>
                    </Select>
                </FormControl>

                <Box className="box-income-modal" sx={css}>
                    <Button onClick={HandleSave} className="btn-group-income-modal" sx={css} color="primary" variant="contained">Create</Button>
                    <Button onClick={onCloseClick} className="btn-group-income-modal" sx={css} color="cancel" variant="outlined">Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}
 
export default ModalAddScheduler;