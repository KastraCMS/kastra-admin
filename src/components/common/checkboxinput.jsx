import React from 'react';

const CheckboxInput = (props) => {
    return (
        <div className="form-check row ml-1">
            <input id={`${props.name}-${props.value}`} className="form-check-input" name={props.name} type="checkbox" value={props.value} checked={props.checked} onChange={props.handleChange} /> 
            <label htmlFor={`${props.name}-${props.value}`} className="form-check-label">{props.title}</label> 
        </div>
    );
}

export default CheckboxInput;