import { Dialog, DialogTitle, DialogActions } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import './ErrorPopup.scss';

function ErrorPopup(props) {
    return (
        <>
            <Dialog
                className='contactus_dialog'
                aria-labelledby="customized-dialog-title"
                open={props.togglePopup}
            >
                <div className='header-icons-container'>
                    <div onClick={() => props.togglePopupf(false)}>
                        <CloseIcon />
                    </div>
                </div>
                <DialogTitle className='delete-context'>
                    {props.errMsg}
                </DialogTitle>
                <DialogActions
                    className='dialog_action'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <button
                        className='continue-button'
                        onClick={() => {
                            props.togglePopupf(false);
                        }}
                        style={{
                            backgroundColor: '#f86878'
                        }}
                    >
                        Close
                    </button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default ErrorPopup;