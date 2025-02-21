import React, { memo } from 'react'
import {
    Alert,
    Snackbar,
    Backdrop 
} from '@mui/material';
import { green } from "@mui/material/colors";
import { Set_Notification } from '../../services/page/common';
import { useSelector } from 'react-redux';

const Custom_Snackbar = () => {
    const notification = useSelector((store) => store.Common_Data.notification);
    console.log('notification==', notification)

    const handleCloseNotification = (event, reason) => {
        if (reason === "clickaway") return;
        Set_Notification({ open: false, message: '', severity: '' });
    };

    return (
        <>
            {/* Backdrop to disable clicks when Snackbar is open */}
            {/* <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
                open={notification.open}
                // onClick={handleCloseNotification} // Ensure users must close Snackbar
            /> */}
        <Snackbar
            open={notification.open}
            autoHideDuration={2000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={handleCloseNotification}
                severity={notification.severity}
                sx={{
                    width: "100%",
                    ...(notification.severity === "success" && {
                        bgcolor: green[600],
                        "& .MuiAlert-icon": {
                            color: "#fff",
                        },
                    }),
                }}
                variant="filled"
            >
                {notification.message}
            </Alert>
        </Snackbar>
        </>
    )
}

export default memo(Custom_Snackbar);