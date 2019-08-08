import React from 'react';
import { isNil } from "lodash";

const SingleInput = (props) => {
    const classInput = props.displayError ? 'form-control border-danger' : 'form-control';

        return (
            <div className="form-group row">
                {!isNil(props.title) && (
                    <label htmlFor={props.name} className="col-sm-2 col-form-label">{props.title}</label>
                )}
                
                <div className="col-sm-10">
                    <input id={props.name} className={classInput} type={props.type} name={props.name} value={props.value} onChange={props.handleChange} />
                </div>
            </div>
        );
}

export default SingleInput;