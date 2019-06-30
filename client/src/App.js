import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { fetchToken } from './util/fetchToken';
import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faAngleDown, faCloudRain, faBolt, faFireAlt, faGrinHearts, faGrinStars, faArrowLeft, faArrowRight, faThList, faCalendarAlt, faWineGlassAlt, faGlassMartini, faMapMarkerAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import Navbar from './components/NavBar/Navbar';
import LokalsMain from './components/LokalsMain/LokalsMain';
import ExploreMap from './components/LokalsMap/ExploreMap';
import SystemDesign from './components/SystemDesign/SystemDesign';
import BOHLogin from './components/LokalsBOH/BOHLogin';
import BOHBusinesses from './components/LokalsBOH/BOHBusinesses';

import './App.css';

library.add( faAngleDown, faCloudRain, faBolt, faFireAlt, faGrinHearts, faGrinStars, faArrowLeft, faArrowRight, faThList, faCalendarAlt, faWineGlassAlt, faGlassMartini, faMapMarkerAlt, faThumbsUp );

const App = () => {
  return (
    <Provider store={ store }>
      <Router>
        <div className="App">
          <Navbar/>
          <h1>D A R K</h1>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
