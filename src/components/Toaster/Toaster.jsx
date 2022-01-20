import { toast } from 'react-toastify';
import { ReactComponent as InfoIcon } from '../../styles/images/toaster_info_icon.svg';
import { ReactComponent as SuccessIcon } from '../../styles/images/toaster_success_icon.svg';
import { ReactComponent as FailureIcon } from '../../styles/images/toaster_failure_icon.svg';
import './Toaster.scss';


export const ToasterType = {
    success: 'success',
    failure: 'failure',
    info: 'info'
}

export const Toaster = {
    notify: (message, type) => toast(
        <ToastComponent message={message} type={type}/>,
        { className: type ? `toast-info-container toast-info-container__${type}` : 'toast-info-container' }
    ),
    update: (id, message, type) => {
        toast.update(id, {
            render: <ToastComponent message={message} type={type}/>,
            className: type ? `toast-info-container toast-info-container__${type}` : 'toast-info-container'
        });
    },
    dismiss: id => toast.dismiss(id)
};

const ToastComponent = ({ message, type }) => {
    const getIconFromType = type => {
        switch (type) {
            case ToasterType.success:
                return <SuccessIcon className="toast-icon-success"/>;
            case ToasterType.failure:
                return <FailureIcon className="toast-icon"/>;
            default:
                return <InfoIcon className="toast-icon"/>;
        }
    }

    const getTitleFromType = type => {
        switch (type) {
            case ToasterType.success:
                return 'Success!';
            case ToasterType.failure:
                return 'Failure!';
            default:
                return '';
        }
    }

    return <div className='toast-info'>
        { getIconFromType(type) }

        <div className='toast-text-container'>
            <span className='toast-text'> { getTitleFromType(type) }  </span>
            <span className='toast-text'> {message} </span>
        </div>
    </div>
}
