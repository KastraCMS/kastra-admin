import React, {Component} from 'react';
import { Link } from 'react-router-dom'

export default class PageList extends React.Component {

    constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        //this.fetchSettings();
    }

    handleCreate() {

    }

    handleEdit() {

    }

    handleDelete() {
        
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center"> Manage all the web site pages</h4>
                <hr/>
                <h2 className="mb-5 text-center">Page list</h2>
                <Link to={'/pages/edit'} className="btn btn-outline-info mb-4">New page</Link>
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
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td><Link to={`/pages/edit/1`}><span className="ion-compose"></span></Link></td>
                            <td><a href="javascript:void(0)" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark 2</td>
                            <td><Link to={`/pages/edit/1`}><span className="ion-compose"></span></Link></td>
                            <td><a href="javascript:void(0)" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                        </tr>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark 3</td>
                            <td><Link to={`/pages/edit/1`}><span className="ion-compose"></span></Link></td>
                            <td><a href="javascript:void(0)" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}