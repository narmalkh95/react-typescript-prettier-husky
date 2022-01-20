import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as UploadImg } from '../../styles/images/upload_img.svg';
import UserHeader, { CustomMenu } from '../../components/UserHeader/UserHeader';
import TextField from '@mui/material/TextField';
import paths from '../../utils/routing';
import ImageUploading from 'react-images-uploading';
import Loader from '../../components/Loader/Loader';
import './ImportData.scss';


function ImportData() {
    const [toggleMenu, setToggleMenu] = useState(false);

    const [folder_name, setFolderName] = useState('');
    const [folderNameErr, setFolderNameErr] = useState(false);
    const [foldersNames, setFoldersNames] = useState([]);
    const [imagesArray, setImagesArray] = useState([]);
    const [newImagesArray, setNewImagesArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;

    const history = useHistory();
    const maxNumber = 500;

    const showMenu = toggleMenu ? 'show__menu' : 'hide__menu';


    const isValidFolderName = (name) => {
        const validFolderNameRegEx = new RegExp("^[a-zA-Z][a-zA-Z1-9_-]{1,14}");
        return validFolderNameRegEx.test(name)
    }

    const onChange = (imageList) => {
        setImagesArray(imageList);
        setNewImagesArray(imageList);
    };

    const handleToggle = (data) => {
        setToggleMenu(data)
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

    const handleCreate = (e) => {
        e.preventDefault();
        !foldersNames.includes(folder_name)
            && setFoldersNames((foldersNames) => {
                return folder_name && [...foldersNames, folder_name]
            });

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

    return (
        <>
            {isLoading ? <Loader /> : <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div className={`profile_container ${showMenu}`}>
                    <UserHeader handleToggle={handleToggle} showBurger={toggleMenu} />
                    <div className='starting__header'>
                        <hr className='starting__header__first__line' />
                        <span>let's get started</span>
                        <hr className='starting__header__second__line' />
                    </div>

                    <div className={`upload__wrapper ${showMenu}`}>
                        <div className='upload__subwrapper'>
                            <div>Start with...</div>
                            <TextField
                                label='folder name'
                                variant="outlined"
                                size="small"
                                color="secondary"
                                value={folder_name}
                                onChange={(e) => setFolderName(e.target.value)}
                                onFocus={() => setFolderNameErr(false)}
                                error={folderNameErr}
                                style={{
                                    width: '450px',
                                    margin: '9px'
                                }}
                            />
                            <div style={{ marginTop: '30px' }}>Then...</div>
                            <ImageUploading
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
                                    and proceed to annotation
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                {toggleMenu && <CustomMenu handleToggle={handleToggle} />}
            </div>
            }
        </>
    )
}

export default ImportData;