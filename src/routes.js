import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './components/home/home'
import Login from './components/home/login'
import Settings from './components/siteconfiguration/settings'
import MailTempateList from './components/siteconfiguration/mails'
import Module from './components/module/module'
import ModuleList from './components/module/modulelist'
import ModuleInstall from './components/module/moduleinstall'
import PageList from './components/page/pagelist'
import Page from './components/page/page'
import UserList from './components/user/userlist'
import User from './components/user/user'
import RoleList from './components/user/rolelist'
import Role from './components/user/role'
import PermissionList from './components/user/permissionlist'
import Template from './components/page/template';
import TemplateList from './components/page/templatelist';

export const Routes = () => (
  <main>
    <Switch>
      <Route exact path='/admin/' component={Home}/>
      <Route exact path='/admin/modules/edit' component={Module}/>
      <Route path='/admin/modules/edit/:moduleId?' component={Module}/>
      <Route path='/admin/modules/new/:pageId?' component={Module}/>
      <Route exact path='/admin/modules/install' component={ModuleInstall}/>
      <Route path='/admin/modules/:pageId?' component={ModuleList}/>
      <Route exact path='/admin/pages' component={PageList}/>
      <Route path='/admin/pages/edit/:pageId?' component={Page}/>
      <Route exact path='/admin/users' component={UserList}/>
      <Route exact path='/admin/pages/templates' component={TemplateList}/>
      <Route path='/admin/pages/template/:templateId?' component={Template}/>
      <Route path='/admin/users/edit/:userId?' component={User}/>
      <Route exact path='/admin/users/roles' component={RoleList}/>
      <Route exact path='/admin/users/role/:roleId?' component={Role}/>
      <Route exact path='/admin/users/permissions' component={PermissionList}/>
      <Route exact path='/admin/settings' component={Settings}/>
      <Route exact path='/admin/settings/mailtemplates' component={MailTempateList}/>
      <Route path='/admin/login' component={Login}/>
    </Switch>
  </main>
)