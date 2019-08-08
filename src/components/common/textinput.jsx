import React from 'react';
import { isNil } from "lodash";

const TextInput = (props) => {
    const classInput = props.displayError ? 'form-control border-danger' : 'form-control';

    return (
        <div className="form-group row">
            {!isNil(props.title) && (
                <label htmlFor={props.name} className="col-sm-2 col-form-label">{props.title}</label>
            )}
            <div className="col-sm-10">
                <textarea id={props.name} rows={props.rows} className={classInput} name={props.name} onChange={props.handleChange} value={props.value}></textarea>
            </div>
        </div>
    );
}

export default TextInput;