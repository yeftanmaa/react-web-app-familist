import { Button, InputAdornment, Modal, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import { addDoc, collection } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import css from "../styles/global-style.css";
import SnackbarComponent from "../snackbar";
import { FetchAllSchedulers } from "../../hooks/useFetchScheduler";
import { GetPreviousMonthRemainingBill } from "../utils/firestoreUtils";

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

const ModalPayBills = ({open, handleClose, onCloseClick, getLatestEarning}) => {
    const [schedulerList, setSchedulerList] = useState([]);
    const [selectBill, setSelectBill] = useState('');
    const [expense, setExpense] = useState(0);
    const [selectedSchedulerAmount] = useState(0); // new state variable
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch list of scheduler
    useEffect(() => {
      const fetchSchedulerData = async () => {
        const schedulerData = await FetchAllSchedulers();

        setSchedulerList(schedulerData);
      }

      fetchSchedulerData();
    
    }, []);

    const [schedulerId, setSchedulerId] = useState('');
    const [selectedScheduler, setSelectedScheduler] = useState([]);

    // Update expense when a new scheduler is selected
    useEffect(() => {
        // Find the selected scheduler based on its title
        const selectedScheduler = schedulerList.find(schedule => schedule.title === selectBill);
      
        // Update the expense state with the selected scheduler's amount
        if (selectedScheduler) {
            if (selectedScheduler.fixedBill === undefined) {
                setExpense(0);

            } else {
                setExpense(selectedScheduler.fixedBill);
            }
            setSchedulerId(selectedScheduler.id);
            setSelectedScheduler(selectedScheduler);
        } else {
          setExpense(0);
          setSchedulerId('');
        }
    }, [selectBill, schedulerList]);

    const HandleSave = async() => {
        // not allowing empty earning input
        if (expense === 0) {
            setSnackbarMessage('Expense is mandatory!');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 1500);
        } else if (Number(expense) > Number(getLatestEarning)) {
            setSnackbarMessage('Expense could not exceed current earnings!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 1500);
        } else {
            try {
                const schedulerRef = collection(db, 'scheduler', schedulerId, 'payments');

                const newPayment = {
                    amountPaid: Number(expense),
                    lastPaid: new Date()
                };

                // If it is a cicilan then set remainingBill
                if (selectedScheduler.isCicilan === true) {
                    const prevRemainingBill = await GetPreviousMonthRemainingBill(schedulerId);
                    newPayment.remainingBill = Number(prevRemainingBill) - Number(expense);
                }

                await addDoc(schedulerRef, newPayment);

                // confirm if data successfully saved
                setSnackbarMessage('Expense has been added to your workspace!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                    window.location.reload();
                }, 1500);
            } catch(err) {
                setSnackbarMessage('Error! Could not add your income.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                }, 1500);
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
                    <Typography variant="h4" sx={{textAlign: 'center', fontWeight: 'medium'}}>Bill Payment</Typography>

                    {/* Title field */}
                    <FormControl sx={{marginTop: '25px'}} fullWidth>
                        <InputLabel id="select-scheduler-label">Which bill to pay?</InputLabel>
                        <Select
                            labelId="select-scheduler-label"
                            id="select-scheduler-type"
                            label="Which bill to pay?"
                            displayEmpty
                            value={selectBill}
                            onChange={(e) => setSelectBill(e.target.value)}
                        >
                            {schedulerList.map((schedule) => (
                                <MenuItem value={schedule.title}>{schedule.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Amount Field */}
                    <TextField
                        label="Amount"
                        id="outlined-start-adornment"
                        sx={{ marginTop: '25px'}}
                        fullWidth
                        value={selectedSchedulerAmount || expense}
                        type="number"
                        onChange={(e) => setExpense(e.target.value)}
                        size="large"
                        placeholder="Set amount to pay"
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
 
export default ModalPayBills;