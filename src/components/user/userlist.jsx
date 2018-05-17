import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as Kastra from '../../constants';

export default class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            users: []
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        fetch(`${Kastra.API_URL}/api/user/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                users: result
            });
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    handleDelete() {

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
                return (
                    <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td><Link to={`/admin/users/edit/${user.id}`}><span className="ion-compose"></span></Link></td>
                        <td><a href="" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                    </tr>
                );
            })
        );
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">All users of your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">User list</h2>
                <Link to={'/admin/users/edit'} className="btn btn-outline-info mb-5">New user</Link>
                <table className="table table-dark bg-dark">
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