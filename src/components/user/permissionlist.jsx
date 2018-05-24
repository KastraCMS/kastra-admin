import React, {Component} from 'react';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants';

export default class PermissionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            permissions: []
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch(`${Kastra.API_URL}/api/permission/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                permissions: result
            });
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    handleCreate(event) {

        event.preventDefault();

        const data = this.state.name;

        fetch(`${Kastra.API_URL}/api/permission/add`, 
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.componentDidMount();
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        });
    }

    handleDelete(id) {

        fetch(`${Kastra.API_URL}/api/permission/delete`, 
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(id)
            })
            .then(
                () => {
                    this.componentDidMount();
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    renderPermissions() {
        if(this.state.permissions.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">No permission found</td>
                </tr>
            );
        }

        return (
            this.state.permissions.map((permission, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{permission.id}</td>
                        <td>{permission.name}</td>
                        <td>
                            <a href="" onClick={(e) => e.preventDefault()} data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title="Delete permission"
                                message={`Are you sure you want to delete "${permission.name}" ?`}
                                onConfirm={() => this.handleDelete(permission.id)}
                                confirmLabel="Delete"
                                cancelLabel="Cancel" />
                        </td>
                        
                    </tr>
                );
            })
        );
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">All permissions of your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">Permission list</h2>
                              
                <div className="container mb-4">
                    <div className="row">
                        <input id="name" className="form-control col-sm-3 mr-2" onChange={this.handleChange} name="name" type="text" />
                        <a href="" className="btn btn-outline-info col-sm-1" onClick={this.handleCreate}>Add</a>
                    </div>
                </div>

                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPermissions()}
                    </tbody>
                </table>
            </div>
        );
    }
}