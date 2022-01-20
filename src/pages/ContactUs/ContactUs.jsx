import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import UserHeader, { CustomMenu } from '../../components/UserHeader/UserHeader';
import TextField from '@mui/material/TextField';

import './ContactUs.scss';

require('dotenv').config();

function ContactUs(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [companyError, setCompanyError] = useState('');
    const [messageError, setMessageError] = useState('');

    const [toggleMenu, setToggleMenu] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const apiUrl = process.env.REACT_APP_API_URL;

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validateData() {
        name === '' ? setNameError(true) : setNameError(false);
        (email === '' ) ? setEmailError(true) : setEmailError(false);
        !validateEmail(email) ? setErrorMessage('Email is invalid.') : setErrorMessage('');
        company === '' ? setCompanyError(true) : setCompanyError(false);
        message === '' ? setMessageError(true) : setMessageError(false);
    }

    function isMissing() {
        return name === '' || email === '' || company === '' || message === '';
    }

    function sendData(data) {
        fetch(`${apiUrl}contact`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "x-access-token": localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'fail') {
                    console.log('err', res.message);
                } else if (res.status === 'success') {
                    setSuccessMessage(res.message);
                    setName('');
                    setEmail('');
                    setCompany('');
                    setMessage('');
                }
            })
    }



    function handleSubmit(event) {
        event.preventDefault();

        const data = {
            name,
            email,
            company,
            message,
        }

        validateData();

        !isMissing() && validateEmail(email) && sendData(data);
        isMissing() && setErrorMessage('Plesase fill all filds');
    }

    const showMenu = toggleMenu ? 'show__menu' : 'hide__menu'

    const handleToggle = (data) => {
        setToggleMenu(data)
    }

    return (
        <>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div className={`contactUs_container ${showMenu}`}>
                    <UserHeader handleToggle={handleToggle} showBurger={toggleMenu} />
                    <div className='contactUs__wrapper'>
                        <div className='contactUs__heading'>contact us</div>
                        {successMessage && <div className="success message">{successMessage}</div>}
                        {errorMessage && <div className="error message">{errorMessage}</div>}
                        <TextField
                            key='1'
                            label='full name'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => {
                                setNameError(false);
                                setSuccessMessage(false);
                                setErrorMessage(false);
                            }}
                            error={nameError} style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        <TextField
                            key='2'
                            label='email'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => {
                                setEmailError(false);
                                setSuccessMessage(false);
                                setErrorMessage(false);
                            }}
                            error={emailError}
                            style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        <TextField
                            key='3'
                            label='company name'
                            variant="outlined"
                            size="small"
                            color="secondary"
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            onFocus={() => {
                                setCompanyError(false);
                                setSuccessMessage(false);
                                setErrorMessage(false);
                            }}
                            error={companyError}
                            style={{
                                width: '450px',
                                margin: '9px'
                            }} />
                        <TextField
                            key='4'
                            label='message'
                            variant="outlined"
                            size="small"
                            multiline
                            rows={9}
                            color="secondary"
                            type="text"
                            value={message}
                            inputProps={{
                                maxLength: 100,
                            }}
                            onChange={(e) => setMessage(e.target.value)}
                            onFocus={() => {
                                setMessageError(false);
                                setSuccessMessage(false);
                                setErrorMessage(false);
                            }}
                            error={messageError}
                            style={{
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
        </>

    )
}

export default ContactUs;