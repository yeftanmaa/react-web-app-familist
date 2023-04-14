import { Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Modal, Select, Switch, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import css from "../styles/global-style.css";
import SnackbarComponent from "../snackbar";
import { GetMemberOnCurrentToken } from "../utils/firestoreUtils";
import InputAdornment from '@mui/material/InputAdornment';
import { addLeadingZero, getOrdinalSuffix } from "../utils/DateGenerator";

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
    const [schedulerAssignee, setSchedulerAssignee] = useState("");
    const [schedulerDeadline, setSchedulerDeadline] = useState("");
    const [memberList, setMemberList] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Handle switch button
    const [isBillFixed, setIsBillFixed] = useState(false);
    const [isInstallment, setIsInstallment] = useState(false);

    const handleBillFixedToggle = (event) => {
        setIsBillFixed(event.target.checked);
    };

    const handleInstallmentToggle = (event) => {
        setIsInstallment(event.target.checked);
    };
    

    const [billFixedAmount, setBillFIxedAmount] = useState(0);
    const [installmentTotalPayment, setInstallmentTotalPayment] = useState(0);


    // Fetch member list
    useEffect(() => {
        const fetchMemberListData = async () => {
            const memberListData = await GetMemberOnCurrentToken('n4th4nSpace');
            setMemberList(memberListData);
        }

        fetchMemberListData();
    }, [])

    const HandleSave = async() => {
        // generate ordinal suffix
        const suffix = getOrdinalSuffix(schedulerDeadline);

        // add leading zero if deadline is one digit
        const finalDeadlineNumber = addLeadingZero(schedulerDeadline);

        // not allowing empty title neither type
        if (schedulerTitle === "") {
            alert('Scheduler title is mandatory!');
        } else if (schedulerType === "") {
            alert('Scheduler type is mandatory!');
        } else {
            try {
                const newSchedulerData = {
                    createdAt: Timestamp.fromDate(new Date()),
                    title: schedulerTitle,
                    assignee: schedulerAssignee,
                    deadline: finalDeadlineNumber + suffix + ' of the month',
                    type: schedulerType,
                }

                if (isBillFixed) {
                    newSchedulerData.fixedBill = Number(billFixedAmount);
                }

                if (isInstallment) {
                    newSchedulerData.isCicilan = true;
                    newSchedulerData.totalBills = Number(installmentTotalPayment);

                }

                // Add newSchedulerData to the schedulerRef
                const schedulerRef = collection(db, "scheduler");
                const newSchedulerDoc = await addDoc(schedulerRef, newSchedulerData);

                // Create a new document in the payments subcollection 
                const paymentsRef = collection(newSchedulerDoc, "payments");
                const paymentData = {   
                    remainingBill: Number(installmentTotalPayment),
                    lastPaid: Timestamp.fromDate(new Date())
                };

                if (isBillFixed) {
                    paymentData.amountPaid = Number(billFixedAmount)
                } else {
                    paymentData.amountPaid = 0;
                }

                await addDoc(paymentsRef, paymentData);

                // confirm if data successfully saved
                setSnackbarMessage('New scheduler has been added!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                    window.location.reload();
                }, 1500);
            } catch(err) {
                setSnackbarMessage('Error! Could not add new scheduler.');
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

                    <FormControl sx={{marginTop: '5px'}} fullWidth>
                        <InputLabel id="select-schedule-assignee-label">Assignee</InputLabel>
                        <Select
                            labelId="select-schedule-assignee-label"
                            id="select-schedule-type"
                            label="Assignee"
                            displayEmpty
                            value={schedulerAssignee}
                            onChange={(e) => setSchedulerAssignee(e.target.value)}
                        >
                            {memberList.map((member) => (
                                <MenuItem value={member.name}>{member.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Payment Deadline"
                        id="outlined-multiline-static"
                        sx={{ marginTop: '25px', marginBottom: '15px'}}
                        type="number"
                        size="small"
                        onChange={(e) => setSchedulerDeadline(e.target.value)}
                        placeholder="Date of Deadline"
                        InputProps={{
                            style: {fontSize: 15},
                            endAdornment: <InputAdornment position="start" >Of the month</InputAdornment>
                        }}
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

                    <FormGroup sx={{marginTop: '10px'}}>
                        <FormControlLabel control={<Switch checked={isBillFixed} onChange={handleBillFixedToggle} />} label="Bill is fixed" />

                        {isBillFixed && (
                            <TextField
                                label="Bill Amount"
                                id="outlined-multiline-static"
                                sx={{marginTop: '5px', marginBottom: '5px'}}
                                fullWidth
                                type="number"
                                size="small"
                                onChange={(e) => setBillFIxedAmount(e.target.value)}
                                placeholder="Enter amount of bill"
                                InputProps={{
                                    style: {fontSize: 15}
                                }}
                            />
                        )}
                    </FormGroup>
                    
                    <FormGroup sx={{marginTop: '10px'}}>
                        <FormControlLabel control={<Switch checked={isInstallment} onChange={handleInstallmentToggle} />} label="This is installment" />

                        {isInstallment && (
                            <TextField
                                label="Enter total payment"
                                id="outlined-multiline-static"
                                sx={{ marginTop: '5px', marginBottom: '15px'}}
                                fullWidth
                                type="number"
                                size="small"
                                onChange={(e) => setInstallmentTotalPayment(e.target.value)}
                                placeholder="Enter total payment"
                                InputProps={{
                                    style: {fontSize: 15}
                                }}
                            />
                        )}
                    </FormGroup>

                    

                    <Box className="box-income-modal" sx={css}>
                        <Button onClick={HandleSave} className="btn-group-income-modal" sx={css} color="primary" variant="contained">Create</Button>
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
 
export default ModalAddScheduler;