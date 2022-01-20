import { useRef, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

import './LeftBar.scss';

require('dotenv').config();

function LeftBar({ imagesList, setImagesList, setImageIndex, folderName }) {
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const interval = useRef(1);
    const ref = useRef(null);
    const scrollOffset = 500;

    const scroll = offset => ref.current.scrollTop += offset;

    const canScroll = offset => ref.current.scrollTop + offset >= -scrollOffset + 1;

    const fetchMoreData = scrollOffset => {
        setIsFetching(true);

        if (!canScroll(scrollOffset)) {
            setIsFetching(false);
            return;
        }

        scroll(scrollOffset);

        if (!hasMore) {
            setIsFetching(false);
            return;
        }

        interval.current++;
        fetch(`${apiUrl}get-images?folder_name=${folderName}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "x-access-token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                image_interval: interval.current
            })
        })
            .then(response => {
                if (response.status === 403) {
                    setHasMore(false);
                } else {
                    return response.json();
                }
            })
            .then(res => {
                setImagesList(imagesList.concat(res.message));
            })
            .catch((err) => {
                console.log('error', err);
            }).finally(() => {
                setIsFetching(false);
            })
    };

    return (
        <div className='left-bar-container full'>
            <div className='full_screen_leftbar'>
                {!isFetching &&
                    <div className='arrow-container'>
                        <i onClick={() => fetchMoreData(-scrollOffset)} className='arrow up' />
                    </div>}
                <div className='photos-container' ref={ref}>
                    {imagesList.length && imagesList?.map((el, key) => {
                        return (
                            <div key={key} className='image_container' onClick={() => setImageIndex(key)}>
                                <label>{`Image ${key + 1}`}</label>
                                <img alt='girl'
                                    src={el}
                                    className='label-photo'/>
                            </div>
                        )
                    })}
                </div>
                <div className='arrow-container second'>
                    {isFetching ? <LinearProgress color="secondary" /> : <i onClick={() => fetchMoreData(scrollOffset)} className='arrow down' />}
                </div>
            </div>
        </div>
    )
}

export default LeftBar;
