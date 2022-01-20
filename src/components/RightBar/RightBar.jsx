import GetAppIcon from '@material-ui/icons/GetApp';
import { Toaster, ToasterType } from '../Toaster/Toaster';

import './RightBar.scss';

require('dotenv').config();

function RightBar({ notes, detectOnSingleImage, folderName, isRotationAllowed }) {
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleDownload = () => {
        fetch(`${apiUrl}download/${isRotationAllowed ? 'rbb' : 'bb'}?folder_name=${folderName}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/zip; charset=UTF-8',
                "x-access-token": localStorage.getItem('token')
            },
        })
            .then(response => {
                if (response.status === 403) {
                    Toaster.notify('There is not any data to download.', ToasterType.failure);
                } else if (response.status === 200) {
                    return response.blob();
                }
            })
            .then((blob) => {
                if (blob) {
                    // Create blob link to download
                    const url = window.URL.createObjectURL(
                        new Blob([blob]),
                    );
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute(
                        'download',
                        `manot_data_${isRotationAllowed ? 'rbb' : 'bb'}_annotation.zip`,
                    );

                    // Append to html link element page
                    document.body.appendChild(link);

                    // Start download
                    link.click();

                    // Clean up and remove the link
                    link.parentNode.removeChild(link);
                }
            })
            .catch((err) => {
                console.log('error', err);
            })
    }

    return (
        <div className='right_bar_container'>
            <div className='text_part'>
                <b> Details about object </b>
                <GetAppIcon onClick={handleDownload} />
            </div>
            <div className='notes_list'>
                {(!Object.keys(notes).length) ? <div className='not_available'> Not available yet </div> :
                    Object.keys(notes).map((note, id) => notes[note] && (
                        <div key={id}>
                            <div className='paper_inner_div'>
                                <div className='note_part'>{note}</div>
                                <div className='counter_part'>{notes[note]}</div>
                            </div>
                            {(id !== Object.keys(notes).length - 1) && <hr />}
                        </div>
                    ))}
            </div>

            <div className='btn_container'>
                <div className='single_annotation_btn_container'>
                    <div className='single_annotation_btn_border'>
                        <button className='single_annotation_btn' onClick={detectOnSingleImage}>
                            Detect object on current image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightBar
