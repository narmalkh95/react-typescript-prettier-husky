import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import { useHistory } from 'react-router';
import Recaptcha from 'react-recaptcha';
import { Link } from "react-router-dom";


import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import paths from '../../utils/routing';

import Loader from '../../components/Loader/Loader';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup';
import './Registration_old.scss';

require('dotenv').config();

function Registration_old(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmed_pass, setConfirmed_pass] = useState('');

    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [confirmed_passError, setConfirmed_passError] = useState('');

    const [passwordType, setPasswordType] = useState('password');
    const [repeatPasswordType, setRepeatPasswordType] = useState('password');

    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(true);
    const [accept, setAccept] = useState(false);
    const [isMatched, setIsMatched] = useState(true);
    const [error, setError] = useState('');
    const [togglePopup, setTogglePopup] = useState(false);
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
                if (response.status === 422) {
                    throw Error('You already registered with this credentials')
                }
                return response.json();
            })
            .then(response => {
                setIsLoading(false)
                history.push(paths.Verify);
            })
            .catch((error) => {
                setError(error.message);
                setTogglePopup(true);
            });
    }

    function validate() {
        if (name === '') { setNameError('Please enter your name') }
        if (surname === '') { setSurnameError('Please enter your surname') }
        if (email === '') { setEmailError('Please enter your email') }
        if (confirmed_pass === '') { setConfirmed_passError('Please enter password') }
    }

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})");

    function handleClick1() {
        (passwordType === 'password') ? setPasswordType('text') : setPasswordType('password');
    }

    function handleClick2() {
        (repeatPasswordType === 'password') ? setRepeatPasswordType('text') : setRepeatPasswordType('password');
    }

    const handleAccept = () => {
        setAccept(!accept);
    }

    function handleVerifyCallback(response) {
        if (response) {
            setIsVerified(true)
        }
    }

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

        password !== confirmed_pass ? setIsMatched(false) : setIsMatched(true);

        ((password === confirmed_pass) && accept && Object.keys(data).length)
            && isVerified && register(data);
    };

    return (
        <>
            {isLoading ? <Loader /> :
                <div className='registration_container'>
                    <Header />
                    <div className='form_wrapper'>
                        <form className='form' onSubmit={handleSubmit}>
                            <div className='heading'>Sign up</div>

                            <input
                                type='text'
                                className="name_input"
                                placeholder='Name'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                            {!name && nameError && <div className='error_message'>{nameError}</div>}

                            <input
                                type='text'
                                className="surname_input"
                                placeholder='Surname'
                                onChange={(e) => setSurname(e.target.value)}
                                value={surname}
                            />
                            {!surname && surnameError && <div className='error_message'>{surnameError}</div>}

                            <input
                                type='email'
                                className="email_input"
                                placeholder='Email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            {!email && emailError && <div className='error_message'>{emailError}</div>}

                            <div className='pass_wrapper'>
                                <input
                                    type={passwordType}
                                    className='new_password_input'
                                    placeholder='Password'
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    value={password}
                                />
                                <div className='pass_button' onClick={handleClick1}>
                                    {(passwordType === 'text') ? <VisibilityOutlinedIcon style={{ fontSize: '22', color: 'grey' }} />
                                        : <VisibilityOffOutlinedIcon style={{ fontSize: '22', color: 'grey' }} />
                                     }
                                </div>
                            </div>
                            {!strongRegex.test(password) && password !== '' &&
                                <div className='error_message'>Password must contain at least 6 characters, including upper + lowercase, numbers and special symbols[!@#$%^&*]</div>}

                            <div className='pass_wrapper'>
                                <input
                                    type={repeatPasswordType}
                                    className='new_password_input'
                                    placeholder='Repeat password'
                                    onChange={(e) => { setConfirmed_pass(e.target.value) }}
                                    value={confirmed_pass}
                                />
                                <div className='pass_button' onClick={handleClick2}>
                                    {(repeatPasswordType === 'text') ? <VisibilityOutlinedIcon style={{ fontSize: '22', color: 'grey' }} />
                                        : <VisibilityOffOutlinedIcon style={{ fontSize: '22', color: 'grey' }} />
                                    }
                                </div>
                            </div>
                            {!confirmed_pass && <div className='error_message'>{confirmed_passError}</div>}
                            {!isMatched && <div className='error_message'>Passwords don't match</div>}

                            <div className='accept-policy-container'>
                                <div>
                                    <input
                                        className='policy-checkbox'
                                        type='checkbox'
                                        onClick={handleAccept}
                                    />
                                    <div className='policy-container'>
                                        Accept our
                                        <Link className='terms' to="/terms" target="_blank">
                                            <b>Terms Of Use</b></Link>
                                        and
                                        <Link className='policy' to="/policy" target="_blank">
                                            <b>Privacy Policy</b></Link>
                                    </div>
                                </div>
                            </div>

                            <Recaptcha
                                className='login_recaptcha'
                                sitekey="6Lco1h8cAAAAAB0Si1bOomVmcyRqCK-OYKhy_7SW"
                                render="explicit"
                                verifyCallback={handleVerifyCallback}
                            />

                            <button
                                className='submit_button'
                                type='submit'
                            >
                                Sign up
                            </button>
                        </form>
                    </div>
                    {<ErrorPopup togglePopup={togglePopup} togglePopupf={setTogglePopup} errMsg={error} />}
                </div>
            }
        </>
    )
}

export default Registration_old;