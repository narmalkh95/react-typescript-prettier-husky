import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { useHistory, useParams } from "react-router-dom";
import Recaptcha from 'react-recaptcha';
import { Link } from '@material-ui/core';

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';

import Loader from '../../components/Loader/Loader';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import paths from '../../utils/routing';
import './LogIn_old.scss';

require('dotenv').config();

function LogIn_old(props) {

    const params = useParams();
    const history = useHistory();
    const [isVerified, setIsVerified] = useState(true);
    const [passwordType, setPasswordType] = useState('password');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [error, setError] = useState('');
    const [togglePopup, setTogglePopup] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isFromEmail, setIsFromEmail] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // setIsFromEmail(params.id.includes('account') ? false : true);

        fetch(`${apiUrl}verify-account`, {
            method: 'PUT',
            headers: {
                "x-access-token": params.id
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status === 'success' && data.message === 'This account is activated. Now user can logged in.') {
                    setIsLoading(false)
                }
        setIsLoading(false)
    })

    const timeId = setTimeout(() => {
        setIsFromEmail(false)
    }, 1800)

    return () => {
        clearTimeout(timeId)
    }
}, [])

const login = (data) => {
    fetch(`${apiUrl}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.status === 401) {
                throw Error('Invalid name or password');
            } else if (response.status === 422) {
                throw Error('Your account is not active. Please check Your email and verify account.');
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem('token', data.token)
            history.push(paths.Importdata);
        })
        .catch((error) => {
            setError(error.message);
            setTogglePopup(true);
        });
}

const resetPassword = (event) => {
    history.push(paths.Email)
};

function handleClick1() {
    (passwordType === 'password') ? setPasswordType('text') : setPasswordType('password');
}

function handleVerifyCallback(response) {
    if (response) {
        setIsVerified(true)
    }
}

function validate() {
    if (email === '') { setEmailError('Please enter your email') }
    if (password === '') { setPasswordError('Please enter your password') }
}

function handleSubmit(event) {
    event.preventDefault();

    const data = {
        email,
        password,
    };

    validate();

    Object.keys(data).length && login(data);
}

return (
    <>
        {isLoading ? <Loader /> :
            <div className='verify_container'>
                <Header />
                {isFromEmail &&
                    < Stack sx={{ width: '80%' }} spacing={2} style={{ margin: 'auto' }}>
                        <Alert variant="outlined" severity="success">
                            Your account is activated, please login to continue
                        </Alert>
                    </Stack>
                }
                <div className='form_wrapper'>
                    <form className='form' onSubmit={handleSubmit}>
                        <div className='heading'>Sign in</div>

                        <input
                            type='email'
                            className="email_input"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {!email && emailError && <div className='error_message'>{emailError}</div>}

                        <div className='pass_wrapper'>
                            <input
                                type={passwordType}
                                className='new_password_input'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className='pass_button' onClick={handleClick1}>
                                {(passwordType === 'text') ? <VisibilityOutlinedIcon style={{ fontSize: '22', color: 'grey' }} />
                                    : <VisibilityOffOutlinedIcon style={{ fontSize: '22', color: 'grey' }} />
                                }
                            </div>
                        </div>
                        {!password && passwordError && <div className='error_message'>{passwordError}</div>}

                        <Recaptcha
                            className='login_recaptcha'
                            sitekey="6Lco1h8cAAAAAB0Si1bOomVmcyRqCK-OYKhy_7SW"
                            render="explicit"
                            verifyCallback={handleVerifyCallback}
                        />

                        <Link
                            href="#"
                            onClick={resetPassword}
                            className='forgot-password'
                        >
                            Forgot Password?
                        </Link>
                        <button
                            className='save_button'
                            type='submit'
                        >
                            <div className='submit_text'>
                                Sign in
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        }
        {<ErrorPopup togglePopup={togglePopup} togglePopupf={setTogglePopup} errMsg={error} />}
    </>
)
}

export default LogIn_old;
