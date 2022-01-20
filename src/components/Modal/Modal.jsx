import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './Modal.scss';

function Modal() {
    return (
        <Dialog
            className='folder-dialog'
            // onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <div className='header-icons-container'>
                {/* <MinimizeIcon /> */}
                {/* <Crop169Icon />  */}
                <div onClick={handleClose}>
                    <CloseIcon />
                </div>
            </div>
            <DialogTitle
                className="dialog-title"
            // onClose={handleClose}
            >
                {changeFolderName ? 'Edit Folder Name' : 'Data’s folder creation'}
            </DialogTitle>
            <DialogContent>
                <input
                    className="folder-name-input"
                    onChange={(e) => {
                        setFolderName(e.target.value);
                    }}
                    type='text'
                    autoFocus
                    placeholder='Folder Name'
                    value={folderName}
                />
                {errMessage && <div className='error_message'>Please write a folder name</div>}
            </DialogContent>
            <DialogActions className='dialog-action'>
                <button
                    className='continue-button'
                    onClick={handleCreate}
                    color="primary"
                >
                    {changeFolderName ? 'Confirm' : 'Create'}
                </button>
                <button
                    className='continue-button'
                    onClick={handleClose}
                    color="primary"
                >
                    {/* {changeFolderName ? 'Confirm' : 'Create'} */}
                    Cancle
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default Modal;