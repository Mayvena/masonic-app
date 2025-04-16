import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/upload" component={FileUpload} />
          <Route path="/files" component={FileDownload} />
          <Route path="/chat" component={Chat} />
          <Route path="/" exact component={FileDownload} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;