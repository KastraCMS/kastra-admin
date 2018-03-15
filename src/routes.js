import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Settings from './components/siteconfiguration/settings'
import Module from './components/module/module'
import ModuleList from './components/module/modulelist'
import PageList from './components/page/pagelist'
import Page from './components/page/page'

export const Routes = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Settings}/>
      <Route exact path='/modules' component={ModuleList}/>
      <Route path='/modules/edit/:moduleId?' component={Module}/>
      <Route exact path='/pages' component={PageList}/>
      <Route path='/pages/edit/:pageId?' component={Page}/>
      <Route path='/settings' component={Settings}/>
    </Switch>
  </main>
)