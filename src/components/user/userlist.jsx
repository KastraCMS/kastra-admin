import React, {Component} from 'react';
import { Link } from 'react-router-dom'

export default class UserList extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //this.fetchSettings();
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">All users of your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">User list</h2>
                <Link to={'/users/edit'} className="btn btn-outline-info mb-5">New user</Link>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Edit roles</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td><Link to={`/users/roles/1`}><span className="ion-compose"></span></Link></td>
                            <td><Link to={`/users/edit/1`}><span className="ion-compose"></span></Link></td>
                            <td><a href="javascript:void(0)" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark 2</td>
                            <td><Link to={`/users/roles/1`}><span className="ion-compose"></span></Link></td>
                            <td><Link to={`/users/edit/1`}><span className="ion-compose"></span></Link></td>
                            <td><a href="javascript:void(0)" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark 3</td>
                            <td><Link to={`/users/roles/1`}><span className="ion-compose"></span></Link></td>
                            <td><Link to={`/users/edit/1`}><span className="ion-compose"></span></Link></td>
                            <td><a href="javascript:void(0)" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}