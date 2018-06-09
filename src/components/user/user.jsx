import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'
import Loading from '../common/loading';

export default class User extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);

        this.state = { 
            userId: props.match.params.userId,
            email: '',
            roles: [],
            roleOptions: [],
            emailError: false,
            displaySuccess: false,
            displayErrors: false,
            errors: [],
            isLoading: false,
            loadingMessage: ''
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true, loadingMessage: 'Loading roles ...' });
        let data = {};

        fetch(`${Kastra.API_URL}/api/role/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.roleOptions = [];
                    data.isLoading = false;

                    result.forEach(function (element) {
                        data.roleOptions.push({
                            id: element.id,
                            value: element.name,
                            checked: false
                        });
                    });

                    if(this.state.userId !== undefined) {
                        this.fetchUser(data);
                    } else {
                        this.setState(data);
                    }
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchUser(data) {
        this.setState({ isLoading: true, loadingMessage: 'Loading user ...' });

        fetch(`${Kastra.API_URL}/api/user/get/${this.state.userId}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.email = result.email;
                    data.roles = result.roles;
                    data.isLoading = false;

                    if(data.roleOptions.length > 0) {
                        data.roleOptions = this.setCheckBoxValues(data.roleOptions, data.roles);
                    }

                    this.setState(data);
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    setCheckBoxValues(options, values) {
        
        for(let i = 0; i < options.length; i++) {
            if(values.includes(options[i].id)) {
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

    handleRoleChange(event) {
        let roles = this.state.roles;
        let options = this.state.roleOptions;
        const target = event.target;
        const value = parseInt(target.value, 10);
        const isChecked = target.checked;
        const index = roles.indexOf(value);

        if(isChecked) {
            roles.splice(index, 0, value);
        } else {
            roles.splice(index, 1);
        }

        this.setState({
            roles: roles,
            rolesOptions: this.setCheckBoxValues(options, roles)
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

    renderRoles() {
        return this.state.roleOptions.map((role, index) => {
            return (
                <CheckboxInput key={index} name="roles" value={role.id} handleChange={this.handleRoleChange} checked={role.checked} title={role.value} />
            );
        })
    }

    render() {
        let userTitle = (this.state.userId.length > 0) ? 'Edit user' : 'New user';

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">Edit the user</h4>
                <hr/>
                <h2 className="mb-5 text-center">{userTitle}</h2>
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message="User updated with success" />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>

                    <h3 className="mt-5 mb-3">General</h3>
                    <SingleInput type="text" onChange={this.handleChange} displayError={this.state.emailError} title="Email address * :" name="email" value={this.state.email} />

                    <h3 className="mt-5 mb-3">Roles</h3>
                    {this.renderRoles()}

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">Submit</button>
                </form>
            </div>
        );
    }
}