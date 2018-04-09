import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';

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
            emailError: false,
            displaySuccess: false,
            displayErrors: false,
            errors: []
        };
    }

    componentDidMount() {

        if(this.state.userId === undefined) {
            return;
        }

        this.setState({ 
            email: 'email@testemail.fr',
            roles: [
                {
                    id: 1,
                    value: "Administrator",
                    checked: true
                },
                {
                    id: 2,
                    value: "Registred",
                    checked: false
                }
            ]
        });
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
        const target = event.target;
        const value = target.checked;
        const name = target.name;
        const nRoles = [];
        
        const roles = this.state.roles;
        let cRole;

        for(let i = 0; i < roles.length; i++) {

            cRole = roles[i];

            if(roles[i].id === parseInt(target.value)) {
                if(value) {
                    cRole.checked = true;
                } else {
                    cRole.checked = false;
                }
            }

            nRoles.push(cRole);
            
            this.setState({ roles : nRoles });
        }
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
        return this.state.roles.map((role, index) => {
            return (
                <CheckboxInput key={index} name="roles" value={role.id} handleChange={this.handleRoleChange} checked={role.checked} title={role.value} />
            );
        })
    }

    render() {
        let userTitle = (this.state.userId > 0) ? 'Edit user' : 'New user';

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
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