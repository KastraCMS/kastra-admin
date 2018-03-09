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
      <Route path='/modules' component={ModuleList}/>
      <Route path='/module/:moduleId?' component={Module}/>
      <Route path='/pages' component={PageList}/>
      <Route path='/page/:pageId?' component={Page}/>
    </Switch>
  </main>
)