import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'

export default class PageList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pages: []
        };
    }

    componentDidMount() {
        fetch(`${Kastra.API_URL}/api/page/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                pages: result
            });
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    handleDelete(id) {
        fetch(`${Kastra.API_URL}/api/page/delete`, 
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

    renderPages() {
        if(this.state.pages.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="6">No page found</td>
                </tr>
            );
        }

        return (
            this.state.pages.map((page, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{page.id}</td>
                        <td>{page.name}</td>
                        <td>{page.keyName}</td>
                        <td><Link to={`/admin/modules/${page.id}`}><span className="ion-cube"></span></Link></td>
                        <td><Link to={`/admin/pages/edit/${page.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" onClick={(e) => e.preventDefault()} data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title="Delete page"
                                message={`Are you sure you want to delete "${page.name}" ?`}
                                onConfirm={() => this.handleDelete(page.id)}
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
                <h4 className="text-center"> Manage all the web site pages</h4>
                <hr/>
                <h2 className="mb-5 text-center">Page list</h2>
                <Link to={'/admin/pages/edit'} className="btn btn-outline-info mb-4">New page</Link>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Keyname</th>
                            <th scope="col">Modules</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPages()}
                    </tbody>
                </table>
            </div>
        );
    }
}