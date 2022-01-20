import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import { ReactComponent as EmailImg } from '../../styles/images/email_page_img.svg';

// import Loader from '../../components/Loader/Loader';

import './Email.scss';

require('dotenv').config();

function Email(props) {

    // const [isLoading, setIsLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    return (
        <>
            {/* {isLoading ? <Loader /> : */}
                <div className='registration__wrapper'>
                    <div className='signup__left__part'>
                        <Header />
                        <div className='email__img__wrapper'>
                            <EmailImg className='email__page__image' />
                        </div>
                    </div>
                    <div className='signup__right__part'>
                        <div className='signin__fields__wrapper'>
                            <div className='signup__fields__header'>
                                verify your email
                            </div>
                            <div className='mail__content__wrapper'>
                                <div className='mail__content__subwrapper'>
                                    <div>We have sent an email</div>
                                    <div>
                                        You need to verify your email to continue, if you have not recieved verification email, please check your “Spam” or “Bulk Email” folder. 
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* :TODO later discuss and implement, not must for the first release */}
                        {/* <div className='resend__button'onClick={() => console.log('resend')}>
                            resend confirmation email
                        </div> */}
                    </div>
                </div>
            {/* } */}
        </>
    )
}

export default Email;