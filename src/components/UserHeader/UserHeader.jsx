import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as ReactLogo } from '../../styles/images/manot_logo_pink.svg';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import paths from '../../utils/routing';
import './UserHeader.scss';

require('dotenv').config();

function UserHeader(props) {
    const history = useHistory();

    const handleClick = () => {
        props.handleToggle(true);
    };

    return (
        <div className='header'>
            <button
                className="manot-logo-button"
                onClick={() => history.push(paths.DashBoard)}
            >
                <ReactLogo className='manot-logo' />
            </button>
            {!props.showBurger && <div className='user__menu'
                onClick={handleClick}
            >
                <MenuIcon
                    fontSize='large'
                />
            </div>}
        </div>
    )
}

export default UserHeader;

export function CustomMenu(props) {
    const history = useHistory();
    const path = window.location.pathname;

    const handleCloseLogout = () => {
        localStorage.removeItem('token');
        history.push(paths.Main);
    }

    const handleClick = () => {
        props.handleToggle(false);
    };

    return (
        <div className='custum__menu__wrapper' style={{ width: '20%' }}>
            <div className='user__close__btn'
                onClick={handleClick}
            >
                <CloseIcon
                    fontSize='large'
                    style={{ fill: "white" }}
                />

            </div>
            <div className='menu__items__wrapper'>
                <div className="first" onClick={() => history.push(path === paths.Importdata ? paths.Importdata : paths.DashBoard)}>dashboard</div>
                <div onClick={() => history.push(paths.Profile)}>profile and password</div>
                <div onClick={() => history.push(paths.Payment)}>payment details</div>
                <div onClick={() => history.push(paths.ContactUs)}>contact us</div>
                <div className='upgrade' onClick={() => history.push(paths.Upgrade)}>upgrade</div>
                <hr style={{ width: '75%', margin: '5px' }} />
                <div onClick={handleCloseLogout}>log out</div>
            </div>
        </div >
    )
}