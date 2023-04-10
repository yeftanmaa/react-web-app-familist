import React, {useState} from "react";
import { Divider, Grid, IconButton, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    py: 10,
    px: 5
};

const ModalSchedulerDetails = ({ open, handleClose, onCloseClick, title, type, lastPaid, amountPaid, remainingBill, totalBill  }) => {
    
    const [getTitle] = useState(title);
    const [getType] = useState(type);
    const [getLastPaid] = useState(lastPaid);
    const [getAmountPaid] = useState(Number(amountPaid));
    const [getRemainingBill] = useState(Number(remainingBill));
    const [getTotalBill] = useState(Number(totalBill));

    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box position="absolute" right={0} top={0} paddingTop={"5px"} paddingRight={"5px"}>
                    <IconButton onClick={onCloseClick}><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ width: '450px', height: '180px', display: 'flex', alignItems: "center" }}>
                    <Box display="grid" alignItems="center" textAlign="left" gridTemplateColumns="repeat(12, 1fr)" gap={2}>

                        <Grid gridColumn="span 4">
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Title</Typography>
                        </Grid>
                        <Grid gridColumn="span 8">
                            <Typography>: {getTitle}</Typography>
                        </Grid>

                        <Grid gridColumn="span 4" >
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Scheduler Type</Typography>
                        </Grid>
                        <Grid gridColumn="span 8" >
                            <Typography>: {getType}</Typography>
                        </Grid>

                        <Grid gridColumn="span 12" >
                            <Divider />
                        </Grid>

                        {totalBill === 0 ? '' : (
                            <>
                                <Grid gridColumn="span 4" >
                                    <Typography variant="body1" sx={{fontWeight: '600'}}>Total Bill</Typography>
                                </Grid>
                                <Grid container gridColumn="span 8" wrap="nowrap">
                                    <Typography>: {getTotalBill.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Typography>
                                </Grid>
                            </>
                        )}

                        <Grid gridColumn="span 4" >
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Amount Paid</Typography>
                        </Grid>
                        <Grid container gridColumn="span 8" wrap="nowrap">
                            <Typography>: {getAmountPaid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Typography>
                        </Grid>

                        <Grid gridColumn="span 4" >
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Remaining Bill</Typography>
                        </Grid>
                        <Grid container gridColumn="span 8" wrap="nowrap">
                            <Typography>: {getRemainingBill.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Typography>
                        </Grid>

                        <Grid gridColumn="span 12" >
                            <Divider />
                        </Grid>

                        <Grid gridColumn="span 4" >
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Last Paid</Typography>
                        </Grid>
                        <Grid container gridColumn="span 8" wrap="nowrap">
                            <Typography>: {getLastPaid}</Typography>
                        </Grid>
                        
                        {currentMonth === getLastPaid.substring(0,1) ? (
                            <>
                                <Grid gridColumn="span 12">
                                    <Typography color={"green"}>You have paid for this month</Typography>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid gridColumn="span 12">
                                    <Typography color={"red"}>You haven't paid for this month yet!</Typography>
                                </Grid>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
 
export default ModalSchedulerDetails;