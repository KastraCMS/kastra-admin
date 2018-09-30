import React, {Component} from 'react';
import { Line } from 'react-chartjs'
import * as Kastra from '../../constants'
import { translate } from 'react-i18next';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            data: {}, 
            stats: {}, 
            visits: [], 
            recentUsers: [],
            applicationVersion: '',
            coreVersion: ''
         };
    }

    componentDidMount() {
        this.fetchGraphData();
        this.fetchGlobalStats();
        this.fetchVisits();
        this.fetchRecentUsers();
        this.fetchVersions();
    }

    fetchGraphData() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetVisitorsByDay`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ data: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchGlobalStats() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetGlobalStats`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ stats: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchVisits() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetVisits`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ visits: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchRecentUsers() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetRecentUsers`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ recentUsers: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchVersions() {
        fetch(`${Kastra.API_URL}/api/SiteConfiguration/GetApplicationVersions`, 
            {
                method: 'GET',
                credentials: 'include'
            })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({ 
                    applicationVersion: result.applicationVersion,
                    coreVersion: result.coreVersion
                    });
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    renderVisitsTable() {
        const { t } = this.props;
        if(this.state.visits.length > 0) {
            return (
                <table className="table table-hover table-dark bg-dark mt-5 rounded">
                    <thead>
                        <tr>
                            <th>{t('home.date')}</th>
                            <th>{t('home.user')}</th>
                            <th>{t('home.ipAddress')}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.visits.map((visit, index) => {
                            return (
                                <tr key={index}>
                                    <td>{visit.date}</td>
                                    <td>{visit.username}</td>
                                    <td>{visit.ipAddress}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            );
        } else {
            return (
                <table>
                    <thead>
                        <tr>
                            <th>{t('home.date')}</th>
                            <th>{t('home.user')}</th>
                            <th>{t('home.ipAddress')}</th>
                            <th>{t('home.userAgent')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>{t('home.visitNotFound')}</td></tr>
                    </tbody>
                </table>
            );
        }
    }

    renderRecentUsers() {
        const { t } = this.props;
        if(this.state.recentUsers.length > 0) {
            return (
                <table className="table table-hover table-dark bg-dark mt-5 rounded">
                    <tbody>
                    {
                        this.state.recentUsers.map((user, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className="list-group small">
                                            <div className="w-100">
                                                <h5 className="mb-1">{user.username}</h5>
                                            </div>
                                            <p className="mb-0">{user.email}</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            );
        } else {
            return (
                <p>{t('home.userNotFound')}</p>
            );
        }
    }

    render() {
        if(Object.keys(this.state.data).length === 0) {
            return null;
        }

        const { t } = this.props;
        
        return (
            <div className="text-white mt-5 clearfix">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="bg-dark mb-4 p-4">                                  
                                    <blockquote className="blockquote">
                                        <p>{t('home.welcomeTitle')}</p>
                                        <footer className="blockquote-footer text-right">
                                            <small>Kastra website (v{this.state.applicationVersion}) based on Kastra Core (v{this.state.coreVersion})</small>
                                        </footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-4">
                                <div className="bg-dark p-4">
                                    <h3>
                                        <i className={`icon ion-person-stalker`}></i> 
                                        <small> {t('home.userNumber')}</small>
                                    </h3>
                                    <h2 className="display-4">{this.state.stats.numberOfUsers}</h2>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-dark p-4">
                                    <h3>
                                        <i className={`icon ion-clock`}></i> 
                                        <small> {t('home.visitOfDay')}</small>
                                    </h3>
                                    <h2 className="display-4">{this.state.stats.visitsPerDay}</h2>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-dark p-4">
                                    <h3><i className="icon ion-clipboard"></i><small> {t('home.totalVisits')}</small></h3>
                                    <h2 className="display-4">{this.state.stats.totalVisits}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="bg-dark p-4">
                                    <h3>{t('home.visitByDay')}</h3>
                                    <Line id="visits-chart" data={this.state.data} options={{ maintainAspectRatio: false, pointDot: false, responsive: true }} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="bg-dark mr-sm-1 p-4">
                                    <h3>{t('home.recentUsers')}</h3>
                                    {this.renderRecentUsers()}
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="bg-dark p-4">
                                    <h3>{t('home.visits')}</h3>
                                    {this.renderVisitsTable()}
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

export default translate()(Home);