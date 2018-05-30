import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as Kastra from '../../constants';

export default class RoleList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            roles: []
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        fetch(`${Kastra.API_URL}/api/role/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                roles: result
            });
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    handleDelete(id) {
        fetch(`${Kastra.API_URL}/api/role/delete`, 
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

    renderRoles() {
        if(this.state.roles.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">No role found</td>
                </tr>
            );
        }

        return (
            this.state.roles.map((role, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{role.id}</td>
                        <td>{role.name}</td>
                        <td><Link to={`/admin/users/role/${role.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" onClick={this.handleDelete} data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title="Delete role"
                                message={`Are you sure you want to delete "${role.name}" ?`}
                                onConfirm={() => this.handleDelete(role.id)}
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
                <h4 className="text-center">All roles of your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">Role list</h2>
                <Link to={'/admin/users/role'} className="btn btn-outline-info mb-5">New role</Link>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRoles()}
                    </tbody>
                </table>
            </div>
        );
    }
}