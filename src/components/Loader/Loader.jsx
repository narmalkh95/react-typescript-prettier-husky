import CircularProgress from '@mui/material/CircularProgress';

import './Loader.scss';

export default function CircularUnderLoad() {

    return <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <CircularProgress disableShrink size='40' />
    </div>
}
