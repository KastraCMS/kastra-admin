import React from 'react';

const ConfirmDialog = (props) => {
    return (
        <div className="modal fade" id={props.id} tabIndex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content text-white bg-dark">
                <div className="modal-header">
                    <h5 className="modal-title" id="ModalLabel">{props.title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {props.message}
                </div>
                <div className="modal-footer">
                    <button type="button" onClick={props.onConfirm} className="btn btn-outline-info" data-dismiss="modal">{props.confirmLabel}</button>
                    <button type="button" className="btn btn-outline-info" data-dismiss="modal">{props.cancelLabel}</button>
                </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;