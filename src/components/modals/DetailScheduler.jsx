import React, {useState} from "react";
import { Grid, IconButton, Modal, Typography } from "@mui/material";
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
    p: 4,
};

const ModalSchedulerDetails = ({ open, handleClose, onCloseClick, desc, title, type }) => {
    
    const [getDesc] = useState(desc);
    const [getTitle] = useState(title);
    const [getType] = useState(type);
    
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
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Title:</Typography>
                        </Grid>
                        <Grid gridColumn="span 8">
                            <Typography>{getTitle}</Typography>
                        </Grid>

                        <Grid gridColumn="span 4" >
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Description:</Typography>
                        </Grid>
                        <Grid container gridColumn="span 8" wrap="nowrap">
                            <Typography>{getDesc}</Typography>
                        </Grid>

                        <Grid gridColumn="span 4" >
                            <Typography variant="body1" sx={{fontWeight: '600'}}>Scheduler Type:</Typography>
                        </Grid>
                        <Grid gridColumn="span 8" >
                            <Typography>{getType}</Typography>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
 
export default ModalSchedulerDetails;