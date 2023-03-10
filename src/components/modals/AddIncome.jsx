import { Button, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addDoc, collection, Timestamp } from "firebase/firestore";
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

const ModalAddIncome = ({open, handleClose, onCloseClick, getLatestEarning}) => {

    const [incomeTitle, setIncomeTitle] = useState("");
    const [incomeDesc, setIncomeDesc] = useState("");
    const [income, setIncome] = useState(0);
    const workspaceRef = collection(db, "workspace-graph");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const HandleSave = async() => {
        // not allowing empty earning input
        if (income === 0) {
            setSnackbarMessage('Income is mandatory!');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000);
        } else if (Number(income) <= 0) {
            setSnackbarMessage('Income could not negative numbers!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000);
        } else {
            try {
                await addDoc(workspaceRef, {
                    createdAt: Timestamp.fromDate(new Date()),
                    title: incomeTitle,
                    description: incomeDesc,
                    amount: Number(income),
                    type: 'Income',
                    totalEarnings: Number(getLatestEarning) + Number(income),
                    token: "n4th4nSpace"
                });

                // confirm if data successfully saved
                setSnackbarMessage('Income has been added to your workspace!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                    window.location.reload();
                }, 3000);
            } catch(err) {
                setSnackbarMessage('Error! Could not add your income.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                }, 3000);
            };
        };
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
                    <Typography variant="h4" sx={{textAlign: 'center', fontWeight: 'medium'}}>New Income</Typography>

                    {/* Title field */}
                    <TextField
                        id="outlined-multiline-static"
                        onChange={(e) => setIncomeTitle(e.target.value)}
                        label="Title"
                        type="text"
                        size="small"
                        fullWidth
                        placeholder="Set new title"
                        inputProps={{style: {fontSize: 15}}}
                        sx={{ marginTop: '25px', marginBottom: '20px'}}
                    />
                    
                    {/* Description field */}
                    <TextField
                        id="outlined-multiline-static"
                        onChange={(e) => setIncomeDesc(e.target.value)}
                        label="Description"
                        type="text"
                        multiline
                        rows={4}
                        size="small"
                        fullWidth
                        placeholder="Add some details for your new income"
                        inputProps={{style: {fontSize: 15}}}
                    />

                    {/* Amount Field */}
                    <TextField
                        label="Amount"
                        id="outlined-start-adornment"
                        sx={{ marginTop: '25px'}}
                        fullWidth
                        type="number"
                        onChange={(e) => setIncome(e.target.value)}
                        size="large"
                        placeholder="Set your new income"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">IDR</InputAdornment>,
                            style: {fontSize: 15}
                        }}
                    />

                    <Box className="box-income-modal" sx={css}>
                        <Button onClick={HandleSave} className="btn-group-income-modal" sx={css} color="primary" variant="contained">Save</Button>
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
 
export default ModalAddIncome;