import React, {Component} from 'react';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { isNil } from 'lodash'

class NavigationHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            message: '',
            retry: 0
        };
    }

    fetchStartApplication() {
        const { t } = this.props;

        fetch(`${Kastra.API_URL}/api/siteconfiguration/get`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((response) => {
            if(!response.ok) {
                if(this.state.retry < 15) {
                    this.setState({ retry: this.state.retry+1 });
                    setTimeout(() => this.fetchStartApplication(), 1000);
                } else {
                    this.setState({ isLoading: false });
                    alert(t('settings.startFailed'));
                }
            } else {
                this.setState({ isLoading: false });
            }
        });
    }

    handleRestart(event) {
        const { t } = this.props;
        
        if(!isNil(event)) {
            event.preventDefault();
        }

        this.setState({ isLoading: true, message: t('settings.stoppingApplication') });

        fetch(`${Kastra.API_URL}/api/siteconfiguration/restart`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((response) => {
            if(response.ok) {
                this.setState({ isLoading: true, message: t('settings.startingApplication'), retry: 0 });
                this.fetchStartApplication();
            } else {
                if(this.state.retry < 15) {
                    this.setState({ retry: this.state.retry+1 });
                    setTimeout(() => this.handleRestart(), 1000);
                } else {
                    this.setState({ isLoading: false });
                    alert(t('settings.stopFailed'));
                }
            }
        });
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

export default translate()(NavigationHeader);