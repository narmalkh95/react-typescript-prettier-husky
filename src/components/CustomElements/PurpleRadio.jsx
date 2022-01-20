import { withStyles } from '@material-ui/core/styles';
import { Radio } from '@material-ui/core';
import React from 'react';

export const PurpleRadio = withStyles({
    root: {
        color: '#8924BF',
        marginLeft: '20px',
        '&$checked': {
            color: '#8924BF'
        },
        '& svg': {
            width: '0.8em !important',
            height: '0.8em'
        },
        '&:hover': {
            background: 'none'
        },
    },
    checked: {}
})((props) => <Radio color="default" {...props} />);
