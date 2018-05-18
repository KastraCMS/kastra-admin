import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'

export default class Role extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handlePermissionChange = this.handlePermissionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);

        this.state = { 
            roleId: props.match.params.roleId,
            name: '',
            roles: [],
            permissions: [],
            permissionOptions: [],
            nameError: false,
            displaySuccess: false,
            displayErrors: false,
            errors: []
        };
    }

    componentDidMount() {
        let data = {};

        fetch(`${Kastra.API_URL}/api/permission/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.permissionOptions = [];
                    
                    result.forEach(function (element) {
                        data.permissionOptions.push({
                            id: element.id,
                            value: element.name,
                            checked: false
                        });
                    });
                    if(this.state.roleId !== undefined) {
                        this.fetchRole(data);
                    } else {
                        this.setState(data);
                    }
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchRole(data) {
        fetch(`${Kastra.API_URL}/api/role/get/${this.state.roleId}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.name = result.name;

                    if(data.permissionOptions.length > 0) {
                        data.permissionOptions = this.setCheckBoxValues(data.permissionOptions, data.permissions);
                    }

                    this.setState(data);
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    setCheckBoxValues(options, values) {
        
        for(let i = 0; i < options.length; i++) {
            if(values !== undefined && values.includes(options[i].id)) {
                options[i].checked = true;
            } else {
                options[i].checked = false;
            }
        }

        return options;
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value,
            displaySuccess: false
        });
    }

    handlePermissionChange(event) {
        let permissions = this.state.permissions;
        let options = this.state.permissionOptions;
        const target = event.target;
        const value = parseInt(target.value, 10);
        const isChecked = target.checked;
        const index = permissions.indexOf(value);

        if(isChecked) {
            permissions.splice(index, 0, value);
        } else {
            permissions.splice(index, 1);
        }

        this.setState({
            permissions: permissions,
            permissionOptions: this.setCheckBoxValues(options, permissions)
        });
    }

    handleSubmit(event) {

        const errorMessages = [];
        let newState = {};

        event.preventDefault();

        if (this.state.email.length === 0) {
            errorMessages.push("Email address can't be empty");
            newState.emailError = true;
        } else {
            newState.emailError = false;
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            newState.displaySuccess = false;
        } else {
            newState.displayErrors = false;
            newState.displaySuccess = true;
        }

        this.setState(newState);
    }

    closeSuccessMessage() {
        this.setState({ displaySuccess: false });
    }

    closeErrorMessage() {
        this.setState({ displayErrors: false });
    }

    renderPermissions() {
        return this.state.permissionOptions.map((permission, index) => {
            return (
                <CheckboxInput key={index} name="roles" value={permission.id} handleChange={this.handlePermissionChange} checked={permission.checked} title={permission.value} />
            );
        })
    }

    render() {
        let roleTitle = (this.state.roleIdlength > 0) ? 'Edit role' : 'New role';

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">Edit the role</h4>
                <hr/>
                <h2 className="mb-5 text-center">{roleTitle}</h2>
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message="Role updated with success" />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>

                    <h3 className="mt-5 mb-3">General</h3>
                    <SingleInput type="text" onChange={this.handleChange} displayError={this.state.nameError} title="Name * :" name="name" value={this.state.name} />

                    <h3 className="mt-5 mb-3">Permissions</h3>
                    {this.renderPermissions()}

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">Submit</button>
                </form>
            </div>
        );
    }
}