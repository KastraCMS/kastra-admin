import React, {Component} from 'react';
import * as Kastra from '../../constants'
import Loading from '../common/loading';

export default class NavigationHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            message: ''
        };
    }

    handleRestart(event) {
        event.preventDefault();

        this.setState({ isLoading: true, message: 'Stopping application ...' });

        fetch(`${Kastra.API_URL}/api/siteconfiguration/restart`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((response) => {
                this.setState({ isLoading: true, message: 'Starting application ...' });
                if(response.ok) {
                    fetch(`${Kastra.API_URL}/api/siteconfiguration/get`, 
                    {
                        method: 'GET',
                        credentials: 'include'
                    })
                    .then((response) => {
                            this.setState({ isLoading: false });
                            if(!response.ok) {
                                alert('Failed to start the application');
                            }
                        }
                    );
                } else {
                    alert('Failed to stop the application');
                }
            }
        )
    }

    render() {
        return (
            <nav id="navigation-header" className="navbar navbar-dark bg-dark">
                <button type="button" id="sidebarCollapse" className="btn btn-outline-info navbar-btn">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="list-unstyled components">
                    <li><a href="" onClick={(e) => this.handleRestart(e)} ><i className={`icon ion-refresh`}></i></a></li>
                </ul>
                <Loading isLoading={this.state.isLoading} message={this.state.message} />
            </nav>
        );
    }
}