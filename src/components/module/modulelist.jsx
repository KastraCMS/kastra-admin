import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'
import Loading from '../common/loading';

export default class ModuleList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            pageId: props.match.params.pageId || 0,
            modules: [],
            isLoading: false,
            loadingMessage: ''
         };
    }

    componentDidMount() {
        this.setState({ isLoading: true, loadingMessage: 'Loading modules ...' });

        fetch(`${Kastra.API_URL}/api/module/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        modules: result,
                        isLoading: false
                    });
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    handleDelete(id) {
        this.setState({ isLoading: true, loadingMessage: 'Deleting module ...' });

        fetch(`${Kastra.API_URL}/api/module/delete`, 
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

    openPopup(event) {
        event.preventDefault();
        window.open(event.currentTarget.href, 'Module settings', 'width=800,height=600');
    }

    renderModules() {

        if(this.state.modules.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">No module found</td>
                </tr>
            );
        }

        return (
            this.state.modules.map((module, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{module.id}</td>
                        <td>{module.name}</td>
                        <td>
                            <a href={`module/settings/${module.id}/settings`} onClick={(e) => this.openPopup(e)}>
                                <span className="ion-gear-a"></span>
                            </a>
                        </td>
                        <td><Link to={`/admin/modules/edit/${module.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" onClick={this.handleDelete} data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title="Delete module"
                                message={`Are you sure you want to uninstall "${module.name}" ?`}
                                onConfirm={() => this.handleDelete(module.id)}
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
                <h4 className="text-center">All your website module</h4>
                <hr/>
                <h2 className="mb-5 text-center">Module list</h2>
                <Link to={`/admin/modules/new/${this.state.pageId}`} className="btn btn-outline-info mb-5">New module</Link>
                <div className="float-right">
                    <Link to={'/admin/modules/install'} className="btn btn-outline-info mb-5">Manage module definitions</Link>
                </div>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Content - Settings</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderModules()}
                    </tbody>
                </table>
            </div>
        );
    }
}