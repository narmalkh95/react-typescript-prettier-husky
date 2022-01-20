import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { ReactComponent as SignUpImg } from '../../styles/images/signup_page_img.svg';
import InputComponent from '../../components/InputComponent/InputComponent';
import { Link, useParams } from "react-router-dom";
import { Toaster, ToasterType } from '../../components/Toaster/Toaster';
import { InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import paths from '../../utils/routing';

import Loader from '../../components/Loader/Loader';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup';

import './Login.scss';

require('dotenv').config();

function NewLogin(props) {

    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);

    const params = useParams();
    const history = useHistory();
    const { state } = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const [error, setError] = useState('');
    const [togglePopup, setTogglePopup] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isFromEmail, setIsFromEmail] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    // TODO check loading part
    useEffect(() => {
        params.id && setIsFromEmail(params.id.includes('account') ? false : true);

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
                if (data) {
                    setIsLoading(false);
                }

            })
        // const timeId = setTimeout(() => {
        //     setIsFromEmail(false)
        // }, 1800)

        // return () => {
        //     clearTimeout(timeId)
        // }
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
                return response.json();
            })
            .then((data) => {
                if (data.status === 'fail' && data.message === "Wrong email or password.") {
                    setPassError(true)
                    setEmailError(true)
                    setError('The email or password is invalid.');
                } else if (data.status === 'fail' && data.message === "This account is not active.") {
                    setError('Your account is not activated yet. Please check the email.');
                } else {
                    localStorage.setItem('token', data.token)
                }
            })
            .then(() => {
                const token = localStorage.getItem('token');

                if (token) {
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
                            if (data.status === 'fail' && data.message === "No folder created.") {
                                history.push(paths.Importdata);
                            } else {
                                history.push(paths.DashBoard);
                            }
                        })
                        .catch(err => {
                            console.log('Errrr', err);
                        })
                }
            })
            .catch((error) => {
                setError(error.message);
            });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        return strongRegex.test(password);
    }

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})");

    function validate() {
        (email === '' || !validateEmail(email)) ? setEmailError(true) : setEmailError(false);
        (password === '' || !validatePassword(password)) ? setPassError(true) : setPassError(false);
        !validatePassword(password) && setError('The email or password is invalid.');
    }

    function isMissingField() {
        if (password === '' || email === '') {
            return true
        } else {
            return false;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const data = {
            email,
            password,
        };

        validate();

        !isMissingField() && strongRegex.test(password) && validateEmail(email) && login(data);
    }

    return (
        <>
            {isLoading ? <Loader /> :
                <div className='registration__wrapper'>
                    {state?.message && Toaster.notify(state.message, ToasterType.success)}
                    <div className='signup__left__part'>
                        <Header />
                        <div className='welcome__header'>
                            {'welcome to '}
                            <b>
                                manot
                            </b>
                        </div>
                        <SignUpImg className='signup__page__image' />
                    </div>
                    <div className='signup__right__part'>
                        <div className='signin__fields__wrapper'>
                            <div className='signup__error__message__box'>{error}</div>
                            <div className='signup__fields__header'>
                                login
                            </div>
                            <div className='signin__inputs__wrapper'>
                                <InputComponent
                                    label='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => {
                                        setEmailError(false);
                                        setError(false);
                                    }}
                                    error={emailError}
                                />
                                <InputComponent
                                    label='password'
                                    type={showPassword ? 'text' : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    onFocus={() => {
                                        setPassError(false);
                                        setError(false);
                                    }}
                                    error={passError}
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
                                />
                            </div>
                            <div className='signin__button__wrapper'>
                                <button
                                    type='submit'
                                    className='button__component'
                                    onClick={handleSubmit}
                                >
                                    login
                                </button>
                            </div>
                        </div>
                        <Link className='redirect__to__reset__password' to={paths.EmailPass} >forgot password?</Link>
                        <hr className='divider' />
                        <div className="dont_have_account">Don't have an account?</div>
                        <div className='signup2__button__wrapper'>
                            <button
                                type='submit'
                                className='button__component'
                                onClick={() => history.push(paths.Registration)}
                            >
                                sign up
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default NewLogin;