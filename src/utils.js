import { isNil } from 'lodash'

export const getXSRFToken = () => {
    const tokenInput = document.getElementById('RequestVerificationToken');
    if(!isNil(tokenInput)) {
        return tokenInput.value;
    }

    return 'empty';
}