import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useHistory } from 'react-router';
import { ReactComponent as SignUpImg } from '../../styles/images/signup_page_img.svg';
import InputComponent from '../../components/InputComponent/InputComponent';
import { Link, useParams } from "react-router-dom";
import { InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Toaster, ToasterType } from '../../components/Toaster/Toaster';

import paths from '../../utils/routing';

import Loader from '../../components/Loader/Loader';

import './ResetPassword.scss';

require('dotenv').config();

function ResetPassword(props) {
    const [secondView, setSecondView] = useState(true);

    const [emailError, setEmailError] = useState(false);
    const [newPassError, setNewPassError] = useState(false);
    const [repeatPassError, setRepeatPassError] = useState(false);
    const [userMessage, setUserMessage] = useState('');

    const params = useParams();
    const history = useHistory();
    const pathname = window.location.pathname;

    useEffect(() => {
        setSecondView(pathname.includes('reset-password'));
    }, [pathname])

    const [email, setEmail] = useState('');
    const [new_pass, setNewPass] = useState('');
    const [repeat_pass, setRepeatPass] = useState('');
    const [showNew_pass, setShowNew_pass] = useState(false);
    const [showRepeat_pass, setShowRepeat_pass] = useState(false);

    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const senEmail = () => {
        fetch(`${apiUrl}forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 'fail') {
                    throw Error('No user registered.');
                } else if (response.status === 'success') {
                    setUserMessage('We sent you email. Please check it');
                }
            })
            .catch((error) => {
                setEmailError(error.message);
            });
    }

    const resetPass = (data) => {
        fetch(`${apiUrl}reset-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': window.location.pathname.slice(16),
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 'fail') {
                    throw Error('Error.');
                } else if (response.status === 'success') {
                    Toaster.notify(response.message, ToasterType.success);
                }
            })
            .then(() => history.push(paths.Login))
            .catch((error) => {
                console.log('err', error);
            });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        return strongRegex.test(`${password}`);
    }

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})");

    function validate() {
        (email === '' || !validateEmail(email)) ? setEmailError(true) : setEmailError(false);
    }

    function validatePass(password, errorFunction) {
        return password === '', !validatePassword(new_pass) ? errorFunction(true) : errorFunction(false);
    }

    function isPasswordsMatch() {
        return new_pass === repeat_pass ? setError(false) : setError(true);
    }

    function isEmailMissing() {
        return email === '';
    }

    function isPasswordsMissing() {
        return new_pass === '' && repeat_pass === '';
    }

    function handleSubmitEmail(event) {
        event.preventDefault();

        const data = {
            email,
        };

        validate();

        !isEmailMissing() && validateEmail(email) && senEmail(data);
    }

    function handleSubmitPass(event) {
        event.preventDefault();

        const data = {
            password: new_pass,
            confirmed_pass: repeat_pass
        };

        validatePass(new_pass, setNewPassError);
        validatePass(repeat_pass, setRepeatPassError);

        !isPasswordsMissing()
            && !isPasswordsMatch()
            && validatePassword(new_pass)
            && validatePassword(repeat_pass)
            && resetPass(data);
    }

    return (
        <>
            {isLoading ? <Loader /> :
                <div className='registration__wrapper'>
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
                            <div className='signup__fields__header'>
                                forgot password?
                            </div>
                            {!secondView ?
                                <>
                                    <div className='reset__fields__wrapper'>
                                        Enter the email assiciated with your account, and we will send an email with a link to reset your password.
                                    </div>
                                    <div className='reset__input__wrapper'>
                                        <InputComponent
                                            type='text'
                                            label='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => { setEmailError(false); setUserMessage('') }}
                                            error={emailError}
                                        />
                                    </div>
                                    {emailError && <div className='error__message message__wrapper'> {emailError} </div>}
                                    {userMessage && <div className='success_message message__wrapper'>{userMessage}</div>}
                                </> :
                                <div className='pass__input__wrapper'>
                                    <InputComponent
                                        type={showNew_pass ? "text" : "password"}
                                        label='new password'
                                        value={new_pass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                        onFocus={() => setNewPassError(false)}
                                        error={newPassError}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" className='pass__eye'>
                                                    <div
                                                        onClick={() => setShowNew_pass(!showNew_pass)}
                                                    >
                                                        {showNew_pass ? <Visibility /> : <VisibilityOff />}
                                                    </div>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <InputComponent
                                        type={showRepeat_pass ? "text" : "password"}
                                        label='repeat new paaword'
                                        value={repeat_pass}
                                        onChange={(e) => setRepeatPass(e.target.value)}
                                        onFocus={() => setRepeatPassError(false)}
                                        error={repeatPassError}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"  className='pass__eye'>
                                                    <div
                                                        onClick={() => setShowRepeat_pass(!showRepeat_pass)}
                                                    >
                                                        {showRepeat_pass ? <Visibility /> : <VisibilityOff />}
                                                    </div>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {error && <div className='error__message message__wrapper'  >Passwords don't match</div>}
                                </div>
                            }
                            <div className='signin__button__wrapper'>
                                <button
                                    type='submit'
                                    className='button__component'
                                    onClick={!secondView ? handleSubmitEmail : handleSubmitPass}
                                >
                                    {!secondView ? 'send email' : 'reset'}
                                </button>
                            </div>
                        </div>
                        <Link className='redirect__to__reset__password' to={paths.Login} >login</Link>
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

export default ResetPassword;