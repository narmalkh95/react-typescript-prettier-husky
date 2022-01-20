import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserHeader, { CustomMenu } from '../../components/UserHeader/UserHeader';
import { ReactComponent as UploadImg } from '../../styles/images/upload_img.svg';
import { ReactComponent as UploadBtnImg } from '../../styles/images/import_img.svg';
import { ReactComponent as AddImg } from '../../styles/images/add_img.svg';
import { ReactComponent as EditImg } from '../../styles/images/edit_img.svg';
import { ReactComponent as DeleteImg } from '../../styles/images/delete_img.svg';
import TextField from '@mui/material/TextField';
import ImageUploading from 'react-images-uploading';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import paths from '../../utils/routing';
import './DashBoard.scss';

function DashBoard() {
    const [folder_name, setFolderName] = useState('');
    const [toggleMenu, setToggleMenu] = useState(false);
    const [openEdit, setOpenEdit] = useState(null);
    const [foldersNames, setFoldersNames] = useState([]);
    const [toggleAddImages, setToggleAddImages] = useState(false);
    const [deleteToggle, setDeleteToggle] = useState(null);
    const [toggleImportPopup, setToggleImportPopup] = useState(false);
    const [toggleAddImagePopup, setToggleAddImagePopup] = useState(false);
    const [editFolderName, setEditFolderName] = useState('');
    const [togglePopup, setTogglePopup] = useState(false);
    const [imagesArray, setImagesArray] = useState([]);
    const [newImagesArray, setNewImagesArray] = useState([]);
    const [folderNameErr, setFolderNameErr] = useState('');
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;

    const [elementToEdit, setElementToEdit] = useState('');
    const [elementToDelete, setElementToDelete] = useState('');
    const [elementToAdd, setElementToAdd] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();
    const maxNumber = 500;
    const maxlimit = 10;
    const maxLimitOfSelectedImages = 15;

    const showMenu = toggleMenu ? 'show__menu' : 'hide__menu';

    useEffect(() => {
        fetch(`${apiUrl}get-folders`, {
            method: 'GET',
            headers: {
                "x-access-token": token
            }
        })
            .then(response => {
                if (response.status === 403) {
                    localStorage.removeItem('token');
                    history.push(paths.Main)
                }
                if (response.status === 422) {
                    setError(true)
                }
                return response.json();
            })
            .then(data => {
                setFoldersNames(data.message);
                setIsLoading(false);
            })
            .catch(err => {
                console.log('Errrr', err);
            })
    }, [elementToAdd, elementToDelete])

    const createPicFoder = (data, isAbleToRedirect) => {
        fetch(`${apiUrl}create-folder?folder_name=${data.folder_name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": token,
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 'fail' && response.message === 'Token is invalid') {
                    localStorage.removeItem('token');
                    history.push(paths.Main)
                }
                if (response.status === 'fail' && response.message === "There is folder with that name.") {
                    setFolderNameErr(true)
                }
                if (response.status === 'success' && data.images.length) {
                    addPhotos(data)
                }
                if (!data.images.length && response.message !== "There is folder with that name.") {
                    history.push(paths.DashBoard)
                }
            }
            )
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const addPhotos = (data) => {
        setIsLoading(true)
        fetch(`${apiUrl}add-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": token,
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then((response) => {
                setIsLoading(false)
                if (response.status === 'fail' && response.message === 'Token is invalid') {
                    localStorage.removeItem('token');
                    history.push(paths.Main)
                }
                if (response.status === 'success') {
                    history.push({ pathname: paths.Desktop, state: { folderName: data.folder_name } })
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const addImages = (el) => {
        Promise.all(imagesArray.map((element) => {
            return new Promise((res) => {
                let i = new Image();
                i.onload = () => {
                    res({
                        image: element.data_url,
                        width: i.width,
                        height: i.height,
                        size: element.file.size,
                    })
                };
                i.src = element.data_url;
            })
        }))
            .then((images) => {
                const data = {
                    folder_name: el,
                    images: images,
                }
                images.length ? addPhotos(data) : setTogglePopup(true);
            })
    }
    const handleCreate = (e) => {
        e.preventDefault();
        if (isValidFolderName(folder_name)) {
            !foldersNames.includes(folder_name)
                && setFoldersNames((foldersNames) => {
                    return folder_name && [...foldersNames, folder_name]
                })
            setToggleImportPopup(false)
        }
        Promise.all(imagesArray.map((element) => {
            return new Promise((res) => {
                let i = new Image();
                i.onload = () => {
                    res({
                        image: element.data_url,
                        width: i.width,
                        height: i.height,
                        size: element.file.size,
                    })
                };
                i.src = element.data_url;
            })
        }))
            .then((images) => {
                const data = {
                    folder_name: folder_name,
                    images: images,
                }
                isValidFolderName(folder_name) ? setFolderNameErr(false) : setFolderNameErr(true)
                isValidFolderName(folder_name) && createPicFoder(data, images.length);
            })
    };

    const editFileName = (data) => {
        fetch(`${apiUrl}rename-folder`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "x-access-token": token,
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then((response) => {
                if (response.status === 'fail') {
                    handleEditToggle(false)
                }
                if (response.status === 'fail' && response.message === 'Token is invalid') {
                    localStorage.removeItem('token');
                    history.push(paths.Main)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const deleteFile = (data) => {
        fetch(`${apiUrl}delete-folder?folder_name=${data}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": token,
            },
        })
            .then(response => response.json())
            .then((response) => {
                if (response.status === 'fail' && response.message === 'Token is invalid') {
                    localStorage.removeItem('token');
                    history.push(paths.Main)
                }
                toggleDelete();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const isValidFolderName = (name) => {
        const validFolderNameRegEx = new RegExp("^[a-zA-Z][a-zA-Z1-9_-]{1,14}");
        return validFolderNameRegEx.test(name)
    }

    const handleEditCreate = (el) => {
        // editFolderName && setOpenEdit(false);
        const data = {
            folder_name: el,
            new_folder_name: editFolderName,
        }
        if (!isValidFolderName(editFolderName)) {
            setFolderNameErr('Invalid folder name')
        }
        else if (foldersNames.includes(editFolderName)) {
            setFolderNameErr('There is already folder with that name')
        } else {
            setFoldersNames(prev => prev.map(i => i === el ? editFolderName : i))
            setOpenEdit(false);
            editFileName(data);
        }
    }

    const onChange = (imageList) => {
        setImagesArray(imageList);
        setNewImagesArray(imageList);
    };

    const handleCloseAddImage = () => {
        setImagesArray([]);
        setNewImagesArray([]);
        setToggleAddImages(!toggleAddImages);
    }

    const handleAddImages = (el) => {
        setImagesArray(null)
        setToggleAddImagePopup(true)
    }

    const handleEditToggle = (el) => {
        !el.type && setEditFolderName(el);
        setOpenEdit(!openEdit);
        setFolderNameErr('');
    }

    const cancelEditFoldername = () => {
        setOpenEdit(!openEdit);
        setFolderNameErr('');
    }

    const toggleDelete = (el = null) => {
        setDeleteToggle(el);
    }

    const handleToggle = (data) => {
        setToggleMenu(data)
    }
    return (
        <>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div className={`profile_container ${showMenu}`}>
                    <UserHeader handleToggle={handleToggle} showBurger={toggleMenu} />
                    <div className='dashboard__import__new__data__btn__wrapper'>
                        <div className='dashboard__import__new__data__btn'
                            onClick={(el) => {
                                setFolderName('');
                                setToggleImportPopup(el)
                            }}
                        >
                            <UploadBtnImg />
                            Import new data
                        </div>
                    </div>
                    <div className='dashboard__header'>
                        <hr className='dashboard__first__line' />
                        <span>imported data</span>
                        <hr className='dashboard__second__line' />
                    </div>
                    <div className='dashboard__content__wrapper'>
                        {foldersNames.map((el, index) => (
                            <div className='dashboard__row' key={index}>
                                <div
                                    className='file__name__box'
                                    onClick={() => history.push({ pathname: paths.Desktop, state: { folderName: el } })}
                                >
                                    {el.length > maxlimit ? el.substring(0, maxlimit - 3) + '...' : el}
                                </div>
                                <div>
                                    <AddImg
                                        className='dashboard__add__img'
                                        onClick={() => {
                                            setElementToAdd(el)
                                            handleAddImages(el)
                                        }} />
                                    <EditImg
                                        className='dashboard__edit__img'
                                        onClick={() => {
                                            setElementToEdit(el)
                                            handleEditToggle(el)
                                        }} />
                                    <DeleteImg
                                        className='dashboard__delete__img'
                                        onClick={() => {
                                            setElementToDelete(el)
                                            toggleDelete(el)
                                        }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {toggleMenu && <CustomMenu handleToggle={handleToggle} />}

                {/* add image mmodal */}
                <Dialog
                    PaperProps={{
                        style: {
                            width: '522px',
                            height: '300px',
                            borderRadius: '13px',
                        }
                    }}
                    open={toggleAddImagePopup}
                    onClose={() => { setNewImagesArray([]); setToggleAddImagePopup(false); }}
                >
                    <div className='import__dialog__content__wrapper'>
                        <DialogTitle className='add__image__dialog__title'>
                            <span style={{ marginTop: '230px' }}> Upload more images to folder</span>
                            <div style={{ color: '#8924BF' }}>{`${elementToAdd}`}</div>
                        </DialogTitle>
                        {!!newImagesArray.length && <div className='selected__images__container'>
                            {newImagesArray.map((el) => <span className='add__image__item__name'>
                                {el.file.name.length > maxLimitOfSelectedImages ?
                                    el.file.name.substring(0, maxLimitOfSelectedImages - 3) + '...' : el.file.name}
                            </span>)}
                        </div>}
                        <DialogActions style={{ height: !!newImagesArray.length ? '85px' : '160px' }}>
                            {!newImagesArray.length && <ImageUploading
                                multiple
                                value={newImagesArray}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                acceptType={['jpg', 'jpeg', 'png']}
                                maxFileSize={1000000}
                                resolutionType='less'
                                resolutionWidth={1025}
                                resolutionHeight={1025}
                                dataURLKey="data_url"
                            >
                                {({
                                    onImageUpload
                                }) => (
                                    <span onClick={onImageUpload}>
                                        <UploadImg />
                                    </span>
                                )}
                            </ImageUploading>}
                            {!!newImagesArray.length &&
                                <>
                                    <div className='upload__button__wrapper'>
                                        <button
                                            type='submit'
                                            className='button__component'
                                            style={{
                                                width: '287px',
                                                height: '46px'
                                            }}
                                            onClick={() => addImages(elementToAdd)}
                                        >
                                            proceed to annotation
                                        </button>
                                    </div>
                                </>
                            }
                            <div
                                className='cancel__dialog__btn'
                                onClick={() => { setNewImagesArray([]); setToggleAddImagePopup(false) }}
                            >
                                cancel
                            </div>
                        </DialogActions>
                    </div>
                </Dialog>

                {/* edit modal */}
                <Dialog
                    PaperProps={{
                        style: {
                            width: '522px',
                            height: '270px',
                            borderRadius: '13px',
                        }
                    }}
                    onClose={handleEditToggle}
                    open={openEdit}
                >
                    <div className='delete__dialog__content__wrapper'>
                        <DialogTitle
                            className='edit__dialog__title'
                        >
                            Edit folder name
                        </DialogTitle>
                        <>
                            <DialogContent className='edit__dialog__content'>
                                <TextField
                                    label='new name'
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    value={editFolderName}
                                    onChange={(e) => {
                                        setEditFolderName(e.target.value);
                                    }}
                                    onFocus={() => setFolderNameErr('')}
                                    error={!!folderNameErr}
                                    style={{
                                        width: '427px',
                                    }} />
                                {folderNameErr && <div className='error__message' style={{ width: '100%' }}>{folderNameErr}</div>}
                            </DialogContent>
                            <DialogActions>
                                <button
                                    className='edit__dialog__button'
                                    onClick={() => handleEditCreate(elementToEdit)}
                                    color="primary"
                                >
                                    save
                                </button>
                                <div
                                    className='cancel__dialog__btn'
                                    onClick={cancelEditFoldername}
                                >
                                    cancel
                                </div>
                            </DialogActions>
                        </>
                    </div>
                </Dialog>

                {/* delete modal */}
                <Dialog
                    PaperProps={{
                        style: {
                            width: '522px',
                            height: '227px',
                            borderRadius: '13px',
                            background: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    }}
                    className='delete__dialog'
                    open={!!deleteToggle}
                >
                    <div className='delete__dialog__content__wrapper'>
                        <DialogTitle className='delete__dialog__content'>
                            {'Are you sure you want to '}
                            <b>delete</b>
                            {' folder '}
                            <span style={{ color: '#8924BF' }}>{`${elementToDelete}?`}</span>
                            <br />
                            The process is eirrevertable.
                        </DialogTitle>
                        <DialogActions>
                            <button
                                className='delete__dialog__button'
                                onClick={() => {
                                    deleteFile(elementToDelete);
                                    let newArr = foldersNames.filter((el) => el !== elementToDelete);
                                    newArr.length ?
                                        setFoldersNames(foldersNames.filter((el) => el !== elementToDelete))
                                        :
                                        history.push(paths.Importdata)
                                    // setElementToDelete('')
                                }}
                                color="primary"
                            >
                                Yes, delete
                            </button>
                            <div
                                className='cancel__dialog__btn'
                                onClick={() => toggleDelete()}
                            >
                                cancel
                            </div>
                        </DialogActions>
                    </div>
                </Dialog>

                {/* import new data dialog */}
                <Dialog
                    PaperProps={{
                        style: {
                            width: '522px',
                            height: '400px',
                            borderRadius: '13px',
                            background: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    }}
                    className='import__dialog'
                    onClose={() => { setFolderNameErr(false); setToggleImportPopup(false) }}
                    open={toggleImportPopup}
                >
                    <div className='import__dialog__content__wrapper'>
                        <DialogContent className='import__dialog__content'>
                            <span style={{ marginTop: '230px' }}> Create new folder</span>
                            <div className='upload__subwrapper' style={{ marginTop: '15px' }}>
                                <TextField
                                    label='folder name'
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    value={folder_name}
                                    onChange={(e) => setFolderName(e.target.value)}
                                    onFocus={() => setFolderNameErr(false)}
                                    error={!!folderNameErr}
                                    style={{
                                        width: '450px',
                                        margin: '9px'
                                    }}
                                />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <ImageUploading
                                multiple
                                value={imagesArray}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                acceptType={['jpg', 'jpeg', 'png']}
                                maxFileSize={1000000}
                                resolutionType='less'
                                resolutionWidth={1025}
                                resolutionHeight={1025}
                                dataURLKey="data_url"
                            >
                                {({
                                    onImageUpload
                                }) => (
                                    <span onClick={onImageUpload}>
                                        <UploadImg />
                                    </span>
                                )}
                            </ImageUploading>
                            <div className='upload__button__wrapper'>
                                <button
                                    type='submit'
                                    className='button__component'
                                    style={{
                                        width: '287px',
                                        height: '46px'
                                    }}
                                    onClick={handleCreate}
                                >
                                    proceed to annotation
                                </button>
                            </div>
                            <div
                                className='cancel__dialog__btn'
                                onClick={() => { setFolderNameErr(false); setToggleImportPopup(false) }}
                            >
                                cancel
                            </div>
                        </DialogActions>
                    </div>
                </Dialog>
            </div >
        </>
    )
}
export default DashBoard;