import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as Kastra from '../../constants'

export default class ModuleList extends Component {

    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        
        this.state = { 
            pageId: props.match.params.pageId || 0,
            modules: []
         };
    }

    componentDidMount() {
        fetch(`${Kastra.API_URL}/api/module/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        modules: result
                    });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    handleDelete() {
        
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
                return (
                    <tr key={index}>
                        <td>{module.id}</td>
                        <td>{module.name}</td>
                        <td><a target="blank" href="/modulesettings"><span className="ion-gear-a"></span></a></td>
                        <td><Link to={`/admin/modules/edit/${module.id}`}><span className="ion-compose"></span></Link></td>
                        <td><a href="" onClick={this.handleDelete}><span className="ion-trash-a"></span></a></td>
                    </tr>
                );
            })
        );
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">All your website module</h4>
                <hr/>
                <h2 className="mb-5 text-center">Module list</h2>
                <Link to={`/admin/modules/new/${this.state.pageId}`} className="btn btn-outline-info mb-5">New module</Link>
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