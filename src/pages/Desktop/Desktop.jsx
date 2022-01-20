import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom'

import UserHeader, { CustomMenu } from '../../components/UserHeader/UserHeader';
import LeftBar from '../../components/LeftBar/LeftBar';
import RightBar from '../../components/RightBar/RightBar';
import AnotationTool from '../../components/AnotationTool/AnotationTool';
import defMarks from '../../components/AnotationTool/marks.json';
import Loader from '../../components/Loader/Loader';
import CircularUnderLoad from '../../components/Loader/Loader';
import { PurpleRadio } from '../../components/CustomElements/PurpleRadio';
import { Toaster, ToasterType } from '../../components/Toaster/Toaster';

import './Desktop.scss';

import paths from '../../utils/routing';
import {
    FormControl,
    FormControlLabel,
    RadioGroup,
    Typography
} from '@material-ui/core';

require('dotenv').config();


function Desktop() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const history = useHistory();
    const { state } = useLocation();
    const { folderName } = state;
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [imagesList, setImagesList] = useState([]);
    const [isRotationAllowed, setIsRotationAllowed] = useState(false)
    const [notes, setNotes] = useState({})
    const [imageIndex, setImageIndex] = useState(0)
    const [marks, setMarks] = useState(defMarks[0])
    const [toggleMenu, setToggleMenu] = useState(false);

    const chooseImage = (index, isRotation) => {
        isRotation = isRotation === undefined ? isRotationAllowed : isRotation;

        fetch(`${apiUrl}get-image-info/${isRotation ? 'rbb' : 'bb'}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ folder_name: folderName, img_index: index })
        }).then(res => res.json())
            .then(data => {
                setMarks(data.message && typeof data.message === 'object' && data.message[index] || []);
                setImageIndex(index);
            })
            .catch(() => { })
    }

    const changeIsRotationAllowed = () => {
        setIsRotationAllowed(prev => !prev);
        chooseImage(imageIndex, !isRotationAllowed);
    }

    useEffect(() => {
        setLoading(true);
        state === undefined ? history.push(paths.DashBoard)
            : fetch(`${apiUrl}get-images?folder_name=${folderName}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "x-access-token": localStorage.getItem('token')
                },
                body: JSON.stringify({ image_interval: 1 })
            })
                .then(response => {
                    return response.json();
                })
                .then(res => {
                    if (res.status !== 'fail') {
                        setImagesList(res.message);
                        chooseImage(imageIndex);
                    } else {
                        history.push(paths.DashBoard)
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError(err)
                    console.log('err: ', err);
                })
                .finally(() => setLoading(false))
    }, [])


    const detectOnSingleImage = () => {
        setLoading(true)
        fetch(`${apiUrl}detect-on-single-image/${isRotationAllowed ? 'rbb' : 'bb'}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "x-access-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ folder_name: folderName, img_index: imageIndex })
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.status === 'fail') {
                    Toaster.notify(res.message, ToasterType.info);
                    throw new Error(res.message)
                }
                setMarks(res.message[imageIndex])
            })
            .catch(e => {
                setError(e)
                console.error(e)
            })
            .finally(() => setLoading(false))
    }

    const showMenu = toggleMenu ? 'show__menu' : 'hide__menu';

    const handleToggle = (data) => {
        setToggleMenu(data)
    }

    if (loading) return <CircularUnderLoad />

    return (
        <>
            {isLoading ? <Loader /> : <div className='desktop__wrapper'>
                <div className={`comp-desktop ${showMenu}`}>
                    <UserHeader className='user_header_desktop' handleToggle={handleToggle} showBurger={toggleMenu} />
                    <div className='desktop__header'>
                        <hr className='desktop__first__line' />
                        <span className='annotation__title'>annotation of {folderName}</span>
                        <hr className='desktop__second__line' />
                    </div>

                    <div className='radio-buttons-container'>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="position" name="position" defaultValue="top" onChange={() => changeIsRotationAllowed()}>
                                <FormControlLabel value="B-box" control={<PurpleRadio checked={!isRotationAllowed} />}
                                    label={<Typography className='radio-buttons-label'>B-box</Typography>} />
                                <FormControlLabel value="RB-Box" control={<PurpleRadio checked={isRotationAllowed} />}
                                    label={<Typography className='radio-buttons-label'>RB-box</Typography>} />
                            </RadioGroup>
                        </FormControl>
                        <button className='button__component'> start full data annotation </button>
                    </div>
                    <div className='main-content-container'>
                        <LeftBar className='left_bar'
                            imagesList={imagesList}
                            setImagesList={setImagesList}
                            folderName={folderName}
                            setImageIndex={chooseImage}
                        />
                        <AnotationTool
                            image={imagesList[imageIndex]}
                            isRotationAllowed={isRotationAllowed}
                            setNotes={setNotes}
                            marks={marks}
                            folderName={folderName}
                            imageIndex={imageIndex}
                        />
                        <RightBar
                            detectOnSingleImage={detectOnSingleImage}
                            notes={notes}
                            folderName={folderName}
                            isRotationAllowed={isRotationAllowed}
                        />
                    </div>
                </div>
                {toggleMenu && <CustomMenu handleToggle={handleToggle} />}
            </div>
            }
        </>
    )
}

export default Desktop;
