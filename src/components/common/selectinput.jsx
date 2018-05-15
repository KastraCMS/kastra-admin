import React from 'react';

const SelectInput = (props) => {
    const classInput = props.displayError ? 'form-control border-danger' : 'form-control';

    return (
        <div className="form-group row">
            <label htmlFor={props.name} className="col-sm-2 col-form-label">{props.label}</label>
            <div className="col-sm-10">
                <select className={classInput} name={props.name} onChange={props.onChange} value={props.selectedOption} id={props.name}>
                    <option value="">{props.placeholder}</option>
                    {props.options.map((option, index) => {
                        return (
                            <option key={index} value={option.value}>{option.name}</option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
}

export default SelectInput;