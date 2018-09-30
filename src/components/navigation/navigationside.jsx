import React, {Component} from 'react';
import { NavLink } from 'react-router-dom'
import { translate } from 'react-i18next';

class NavigationSide extends Component {
    render() {
        const { t } = this.props;
        return (
            <ul className="list-unstyled components">
                <ExactNavigationLink url="/admin/" title={t('navigation.home')} className="ion-home" />
                <NavigationLink url="/admin/pages" title={t('navigation.pages')} className="ion-document" />
                <NavigationLink url="/admin/modules" title={t('navigation.modules')} className="ion-cube" />
                <NavigationLink url="/admin/users" title={t('navigation.users')} className="ion-person-stalker" />
                <NavigationLink url="/admin/settings" title={t('navigation.settings')} className="ion-gear-a" />
            </ul>
        );
    }
}

const NavigationLink = (properties) => {
    return (
        <li>
            <NavLink to={properties.url} activeClassName="active">
                <i className={`icon ${properties.className}`}></i>
                {properties.title}
            </NavLink>
        </li>);
};

const ExactNavigationLink = (properties) => {
    return (
        <li>
            <NavLink exact to={properties.url} activeClassName="active">
                <i className={`icon ${properties.className}`}></i>
                {properties.title}
            </NavLink>
        </li>);
};

export default translate()(NavigationSide);