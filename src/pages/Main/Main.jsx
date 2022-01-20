import { useHistory } from "react-router-dom";
import { ReactComponent as ReactLogo } from '../../styles/images/manot_logo_blue.svg';
import paths from "../../utils/routing";
import './Main.scss';

function Main() {
    const history = useHistory();
    const param = 'account';
    return (
        <>
            <div className='main_page_container'>
                <div className='big_logo_container'>
                    <ReactLogo className='big_logo' />
                    <span className='manot-text'>
                        manot
                    </span>
                </div>

                <div className='button-containers'>
                    <button
                        onClick={() => history.push(`login/${param}`)}>
                        Sign in
                    </button>
                    <button
                        onClick={() => history.push(paths.SignUp)}>
                        Sign up
                    </button>
                </div>
            </div>
        </>
    )
}

export default Main;