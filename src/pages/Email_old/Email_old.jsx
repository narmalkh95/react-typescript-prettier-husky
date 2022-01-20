import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import { useHistory } from 'react-router';
import paths from '../../utils/routing';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup';
import './Email_old.scss';

require('dotenv').config();

function Email() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [isEmailEmptyErr, setIsEmailEmptyErr] = useState('');
    const [togglePopup, setTogglePopup] = useState(false);
    const [message, setMessage] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    const sendEmail = () => {
        fetch(`${apiUrl}forgot-password?email=${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                // {'status': 'fail', 'message': 'No user registered.'}), 422
                if (response.status === 'fail' && response.message === 'No user registered.') {
                    throw Error('There is no user registered with this mail.')
                } else {
                    setMessage(response.message);
                    setTogglePopup(!togglePopup);
                }
            })
            .catch((error) => {
                setMessage(error.message);
                setTogglePopup(!togglePopup);
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email === '') {
            setIsEmailEmptyErr('Please enter your email to reset your password');
        }

        (email !== '') && sendEmail(email);
    }
    return (
        <div className='email_container'>
            <Header />
            <div className='form_wrapper'>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='heading'>Confirm Email</div>
                    <input
                        type='email'
                        className="email_input"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        onFocus={() => {
                            setIsEmailEmptyErr('');
                        }}
                    />
                    {isEmailEmptyErr && <div className='error_message'>{isEmailEmptyErr}</div>}
                    <button
                        className='submit_button'
                        type='submit'
                    >
                        Send
                    </button>
                </form>
                <ErrorPopup togglePopup={togglePopup} errMsg={message} togglePopupf={setTogglePopup} />
            </div>
        </div>
    )
}

export default Email;