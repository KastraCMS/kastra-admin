import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as Kastra from '../../constants';

export default class PermissionList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            permissions: []
        };
        this.handleDelete = this.handleDelete.bind(this);
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

    handleDelete() {

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
                return (
                    <tr key={index}>
                        <td>{permission.id}</td>
                        <td>{permission.name}</td>
                        <td><a href="" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
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