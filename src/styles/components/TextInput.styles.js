import styled from '@emotion/styled/macro';

export const TextInputField = styled.input(
    {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        padding: '3px',
        background: '#F6F9FA',
        border: '1px solid #D5DEE4',
        borderRadius: '3px',
        '::placeholder': {
            color: '#33577D',
        },
        '::-webkit-input-placeholder': {
            color: '#33577D',
        },
        ':-ms-input-placeholder': {
            color: '#33577D',
        },
        ':focus-visible': {
            color: '#33577D',
        },
    },
    ({ height, width, textAlign, disabled }) => {
        let styles = { height, width, textAlign };
        if (disabled) {
            styles = { ...styles, color: 'grey', pointerEvents: 'none' };
        }
        return styles;
    }
);
