export const getXSRFToken = () => {
    return document.getElementById('RequestVerificationToken').value;
}