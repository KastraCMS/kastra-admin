import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants';
import Loading from '../common/loading';

export default class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            users: [],
            isLoading: false,
            loadingMessage: ''
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true, loadingMessage: 'Loading users ...' });

        fetch(`${Kastra.API_URL}/api/user/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                users: result,
                isLoading: false
            });
            }
        ).catch(function(error) {
            this.setState({ isLoading: false });
            console.log('Error: \n', error);
        });
    }

    handleDelete(id) {
        this.setState({ isLoading: true, loadingMessage: 'Deleting user ...' });

        fetch(`${Kastra.API_URL}/api/user/delete`, 
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
            this.setState({ isLoading: false });
            console.log('Error: \n', error);
        });
    }

    renderUsers() {
        if(this.state.users.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">No user found</td>
                </tr>
            );
        }

        return (
            this.state.users.map((user, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td><Link to={`/admin/users/edit/${user.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title="Delete user"
                                message={`Are you sure you want to delete "${user.userName}" ?`}
                                onConfirm={() => this.handleDelete(user.id)}
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
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">All users of your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">User list</h2>
                <Link to={'/admin/users/edit'} className="btn btn-outline-info mb-5">New user</Link>
                <div className="float-right">
                    <Link to={'/admin/users/roles'} className="btn btn-outline-info mb-5">Manage roles</Link>
                    <Link to={'/admin/users/permissions'} className="btn btn-outline-info mb-5 ml-3">Manage permissions</Link>
                </div>
                <table className="table table-hover table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUsers()}
                    </tbody>
                </table>
            </div>
        );
    }
}