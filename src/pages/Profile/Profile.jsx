import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import UserHeader, { CustomMenu } from '../../components/UserHeader/UserHeader';
import Loader from '../../components/Loader/Loader';
import TextField from '@mui/material/TextField';
import { InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import paths from '../../utils/routing';

import './Profile.scss';

require('dotenv').config();

function Profile(props) {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [old_password, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmed_pass, setConfirmedPassword] = useState('');

    const [showOld_passwords, setShowOld_password] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmed_pass, setShowConfirmed_pass] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [old_passwordError, setOldPasswordError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmed_passError, setConfirmed_passError] = useState('');
    const [toggleMenu, setToggleMenu] = useState(false);

    const history = useHistory();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}get-user`, {
            method: 'GET',
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setIsLoading(false)
                if (data.status === 'fail' && data.message === 'Token is invalid') {
                    localStorage.removeItem('token');
                    history.push(paths.Main)
                }
                setName(data.message.name);
                setSurname(data.message.surname);
                setEmail(data.message.email);
            })
    }, [])

    const sendUserNewData = (data) => {
        fetch(`${apiUrl}edit-profile`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "x-access-token": localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json();
            })
            .then(() => {
                fetch(`${apiUrl}get-folders`, {
                    method: 'GET',
                    headers: {
                        "x-access-token": localStorage.getItem('token')
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
                        if (data.status === 'fail' && data.message === "No folder created.") {
                            history.push(paths.Importdata);
                        } else {
                            history.push(paths.DashBoard);
                        }
                    })
                    .catch(err => {
                        console.log('Errrr', err);
                    })
            })
            .catch((err) => console.log('err', err))
        // history.push(paths.Importdata)
    }

    function validateNameAndSurname() {
        name === '' ? setNameError(true) : setNameError(false);
        surname === '' ? setSurnameError(true) : setSurnameError(false);
    }
    // old_password === '' ? setOldPasswordError(true) : setOldPasswordError(false);
    // (password === '' || password !== confirmed_pass) ? setPasswordError(true) : setPasswordError(false);
    // (confirmed_pass === '' || password !== confirmed_pass) ? setConfirmed_passError(true) : setConfirmed_passError(false);

    function isMissingField() {
        if (name !== '' && surname !== '' && email !== '') {
            if (old_password === '' && confirmed_pass === '' && password === '') {
                return true;
            }
            if (old_password !== '' && confirmed_pass !== '' && password !== '') {
                return true;
            }
        } else {
            return false;
        }
    }

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})");

    function handleSubmit(event) {
        event.preventDefault();
        let data;

        validateNameAndSurname();

        if (name !== '' && surname !== '' && email !== '') {
            if (old_password === '' && confirmed_pass === '' && password === '') {
                data = {
                    name,
                    surname,
                    email,
                }
                isMissingField() && sendUserNewData(data)
            }
            if (old_password !== '' || confirmed_pass !== '' || password !== '') {
                old_password === '' ? setOldPasswordError(true) : setOldPasswordError(false);
                (password === '' || password !== confirmed_pass) ? setPasswordError(true) : setPasswordError(false);
                (confirmed_pass === '' || password !== confirmed_pass) ? setConfirmed_passError(true) : setConfirmed_passError(false);
                data = {
                    name,
                    surname,
                    email,
                    old_password,
                    password,
                    confirmed_pass,
                }

                isMissingField() && (password === confirmed_pass) && strongRegex.test(password) && sendUserNewData(data)
            }
        }
    }

    const showMenu = toggleMenu ? 'show__menu' : 'hide__menu'

    const handleToggle = (data) => {
        setToggleMenu(data)
    }

    return (
        <>
            {isLoading ? <Loader /> : <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div className={`profile_container ${showMenu}`}>
                    <UserHeader handleToggle={handleToggle} showBurger={toggleMenu} />
                    <div className='profile__wrapper'>
                        <div className='profile__heading'>profile and password</div>
                        <TextField
                            label='first name'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setNameError(false)}
                            error={nameError}
                            style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        <TextField
                            label='last name'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            onFocus={() => setSurnameError(false)}
                            error={surnameError}
                            style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        <TextField
                            label='email'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            disabled
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        <TextField
                            label='current password'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            type={showOld_passwords ? 'text' : "password"}
                            value={old_password}
                            onChange={(e) => setOldPassword(e.target.value)}
                            onFocus={() => setOldPasswordError(false)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className='pass__eye'>
                                        <div
                                            onClick={() => setShowOld_password(!showOld_passwords)}
                                        >
                                            {showOld_passwords ? <Visibility /> : <VisibilityOff />}
                                        </div>
                                    </InputAdornment>
                                )
                            }}
                            error={old_passwordError} style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        <TextField
                            label='new password'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            type={showPassword ? 'text' : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordError(false)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className='pass__eye'>
                                        <div
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </div>
                                    </InputAdornment>
                                )
                            }}
                            error={passwordError} style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        {!strongRegex.test(password) && password !== '' &&
                            <div className='error__message' style={{ width: '440px' }}>Password must contain at least 6 characters, including upper + lowercase, numbers and special symbols[!@#$%^&*]</div>}

                        <TextField
                            label='repeat password'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            type={showConfirmed_pass ? 'text' : "password"}
                            value={confirmed_pass}
                            onChange={(e) => setConfirmedPassword(e.target.value)}
                            onFocus={() => setConfirmed_passError(false)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className='pass__eye'>
                                        <div
                                            onClick={() => setShowConfirmed_pass(!showConfirmed_pass)}
                                        >
                                            {showConfirmed_pass ? <Visibility /> : <VisibilityOff />}
                                        </div>
                                    </InputAdornment>
                                )
                            }}
                            error={confirmed_passError} style={{
                                width: '450px',
                                margin: '9px'
                            }} />

                        <div className='save__button__wrapper'>
                            <button
                                type='submit'
                                className='button__component'
                                onClick={handleSubmit}
                            >
                                save
                            </button>
                        </div>
                        <div className='cancel__button' onClick={() => history.go(-1)}>
                            cancel
                        </div>
                    </div>
                </div>
                {toggleMenu && <CustomMenu handleToggle={handleToggle} />}
            </div>
            }
        </>

    )
}

export default Profile;