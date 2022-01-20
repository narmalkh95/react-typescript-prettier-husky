import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import { useHistory } from 'react-router';
import { ReactComponent as SignUpImg } from '../../styles/images/signup_page_img.svg';
import InputComponent from '../../components/InputComponent/InputComponent';
import { Link } from "react-router-dom";
import { InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import paths from '../../utils/routing';

import Loader from '../../components/Loader/Loader';

import './Registration.scss';

require('dotenv').config();

function Registration(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmed_pass, setConfirmed_pass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmed_pass, setShowConfirmed_pass] = useState(false);

    const [nameError, setNameError] = useState(false);
    const [surnameError, setSurnameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [confirmed_passError, setConfirmed_passError] = useState(false);
    const [hasAcceptCheckboxErrorBorder, setHasAcceptCheckboxErrorBorder] = useState('')

    const [isLoading, setIsLoading] = useState(false);
    const [accept, setAccept] = useState(false);
    const [isMatched, setIsMatched] = useState(true);
    const [error, setError] = useState('');
    const [helperText, setHelperText] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;
    const history = useHistory();

    const register = (data) => {
        setIsLoading(true);

        fetch(`${apiUrl}register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                return response.json();
            })
            .then(response => {
                setIsLoading(false)

                if (response.status === 'fail' && response.message === "User already registered.") {
                    setEmailError(true)
                    setError('This email is already connected to an account');
                } else {
                    history.push(paths.Email);
                }
            })
            .catch((error) => {
                setIsLoading(false)
            });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validate() {
        name === '' ? setNameError(true) : setNameError(false);
        surname === '' ? setSurnameError(true) : setSurnameError(false);
        (email === '' || !validateEmail(email)) ? setEmailError(true) : setEmailError(false);
        password === '' ? setPassError(true) : setPassError(false);
        confirmed_pass === '' ? setConfirmed_passError(true) : setConfirmed_passError(false);
    }

    function isMissingField() {
        if (name === '' || surname === '' || email === '' || confirmed_pass === '') {
            return false
        } else {
            return true;
        }
    }

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})");

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name,
            surname,
            email,
            password,
            confirmed_pass
        }
        validate();
        if (password !== confirmed_pass) {
            setIsMatched(false);
            setPassError(true);
            setConfirmed_passError(true);
        } else {
            setIsMatched(true);
        }

        !accept && setHasAcceptCheckboxErrorBorder('with__err__border')

        !error && isMissingField() && (password === confirmed_pass) && strongRegex.test(password) && validateEmail(email) && accept && register(data);
    };

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
                        <div className='signup__fields__wrapper'>
                            <div className='signup__fields__header'>
                                sign up
                            </div>
                            <div className='signup__inputs__wrapper'>
                                <InputComponent
                                    label='first name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => setNameError(false)}
                                    error={nameError}
                                />
                                <InputComponent
                                    label='last name'
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    onFocus={() => setSurnameError(false)}
                                    error={surnameError}
                                />

                                <InputComponent
                                    label='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => { setEmailError(false); setError(false) }}
                                    error={emailError}
                                />
                                {error && password !== '' &&
                                    <div className='error__message'>{error}</div>}

                                <InputComponent
                                    label="password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    onFocus={() => setPassError(false)}
                                    error={passError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className='pass__eye'>
                                                <div
                                                    onClick={() => setShowPass(!showPass)}
                                                >
                                                    {showPass ? <Visibility /> : <VisibilityOff />}
                                                </div>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                {!strongRegex.test(password) && password !== '' &&
                                    <div className='error__message'>Password must contain at least 6 characters, including upper + lowercase, numbers and special symbols[!@#$%^&*]</div>}

                                <InputComponent
                                    label='repeat password'
                                    type={showConfirmed_pass ? 'text' : "password"}
                                    value={confirmed_pass}
                                    onChange={(e) => setConfirmed_pass(e.target.value)}
                                    onFocus={() => setConfirmed_passError(false)}
                                    error={confirmed_passError}
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
                                />
                            </div>
                            <div className={`terms__policy__checkbox__wrapper ${hasAcceptCheckboxErrorBorder}`}>
                                <input type="checkbox"
                                    className='terms__policy__checkbox'
                                    defaultChecked={accept}
                                    onClick={() => {
                                        !accept ? setHasAcceptCheckboxErrorBorder('') : setHasAcceptCheckboxErrorBorder('with__err__border')
                                        setAccept(!accept)
                                    }} />
                                {'  Accept our  '}
                                <Link to={paths.Terms} target='_blank'>Terms of Use</Link>
                                {'  and  '}
                                <Link to={paths.Policy} target='_blank'>Privacy Policy</Link>
                            </div>
                            <div className='signup__button__wrapper'>
                                <button
                                    type='submit'
                                    className='button__component'
                                    onClick={handleSubmit}
                                >
                                    sign up
                                </button>
                            </div>
                            <Link className='redirect__to__login' to={paths.Login}>login</Link>
                        </div>
                    </div>

                </div>
            }
        </>
    )
}

export default Registration;
