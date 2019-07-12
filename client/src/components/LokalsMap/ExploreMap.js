import React, { Component } from 'react'
// import Axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../Common/Spinner';
import { setCurrentPath } from '../../actions/appstateAction';
import LokalsLogo from '../Common/LokalsLogo';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactMapGL, { Marker, LinearInterpolator } from 'react-map-gl'
import { MAPBOX_TOKEN } from '../../config/keys';
import CustomMarker from '../LokalsMap/sub/CustomMarker';
import ResultsTab from './ResultsTab';
// import { capitalize } from '../../util/stringFormat';

import './ExploreMap.css'
import TabButtons from './sub/TabButtons';
import ExplorerTab from './sub/ExplorerTab';
import { getSearchResults } from '../../actions/searchActions';
import CustomPopup from './sub/CustomPopup';



const LOKALS_STYLE = 'mapbox://styles/bakhumhlea/cjsp4km8x072o1fmevtwowt5x';

class ExploreMap extends Component {
  state = {
    kw: 'wine',
    lc: {
      address: 'all', 
      type: 'none'
    },
    type: 'restaurant',
    activeTab: 'exp_reslt',
    markers: null,
    showPopup: true,
    selectedMarker: 0,
    currentKw: 'all',
    currentCenter: null,
    currentSearchCenter: null,
    radius: 1000,
    mapviewport: {
      width: '100%',
      height: '100%',
      zoom: 12.0,
      latitude: null,
      longitude: null,
      bearing: 0,
      pitch: 0,
    }
  }
  componentDidMount() {
    this.props.setCurrentPath('/explore');
    const { kw, lc } = this.state;
    const { city } = this.props.app.local;
    const { businessResults, query } = this.props.search;
    // var currentLocation = null;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // currentLocation = {
          //   lat: position.coords.latitude,
          //   lng: position.coords.longitude
          // };
          // console.log('Search');
          if (query.currentKw !== "") {
            this.onSearch(query.currentKw,lc,city)
          } else {
            this.onSearch(kw,lc,city)            
          }
        }
      );
    } else {
      this.onSearch(kw,lc,city)
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.search !== this.props.search) {
      if (this.props.search.businessResults.length > 0) {
        this.setState({
          mapviewport: {
            ...this.state.mapviewport,
            latitude: this.props.search.query.currentCenter.lat,
            longitude: this.props.search.query.currentCenter.lng
          },
          kw: this.props.search.query.currentKw,
          currentKw: this.props.search.query.currentKw,
          activeTab: 'exp_reslt',
        })
      }
    }
  }
  componentWillUnmount() {
    this.props.setCurrentPath({});
  }
  onOpenTab(tab, e) {
    if (e) e.preventDefault();
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({activeTab: tab});
    }
  }
  handleViewportChange(viewport) {
    if (viewport) {
      this.getCurrentCenter({
        lat: viewport.latitude, 
        lng: viewport.longitude
      }, viewport.zoom)
    }
    this.setState({mapviewport:viewport})
  }
  getCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => alert(`${position.coords.latitude}, ${position.coords.longitude}`)
      );
    }
  }
  getCurrentCenter(center, zoom) {
    // console.log(center);
    var radius = Math.ceil(1000 + (((13 - zoom)) * 300));
    this.setState({
      radius: radius
    });
  }
  onSearch(kw, lc, ct, e) {
    if (e) e.preventDefault();
    // console.log(kw);
    this.props.getSearchResults(kw, lc, ct);
  }
  onSelectMarker(index,e) {
    if(e) e.preventDefault();
    this.setState({
      selectedMarker: index
    });
  }
  render() {
    // const recents = ['coffee','sushi','bar','indian'];
    // const pref = ['japanese','thai','late_night_coffee','italian','vietnamese'];
    const { mapviewport ,kw, type, activeTab, 
       currentKw, currentLc, currentCenter, selectedMarker, radius } = this.state;
    const { history ,search, user } = this.props;
    const { theme, local } = this.props.app;
    return (
      <div className={theme?"page-container explore-map dark-th":"page-container explore-map"}>
        <div className="explorer">
          <div className="explorer-side">
            <button 
              className="back-btn lk-btn btn-dan full-wd"
              onClick={() => history.goBack()}
            >
              <svg width="40" height="40" fill="transparent" stroke="#ffffff" strokeWidth="2">
                <path d="M15 15 L25 25"/>
                <path d="M25 15 L15 25"/>
              </svg>
            </button>
            <TabButtons
              activeTab={activeTab}
              tabs={[
                {name: 'exp_tool', icon: 'search'},
                {name: 'exp_reslt', icon: 'th-large'},
                // {name: 'exp_fav', icon: 'heart'}
              ]}
              onClickTab={(tabname, e)=>this.onOpenTab(tabname, e)}
            />
          </div>
          <div className="explorer-cons sha-1">
            <div className="logo-bar">
              <div className="contn">
                <Link to="/"><LokalsLogo styles={{color: theme?'#ffffff':'#23c96d'}}/></Link>
                <h5 className="tool-name">EXPLORER</h5>
              </div>
            </div>
            { activeTab ==='exp_tool' && (
              <ExplorerTab
                recents={user.recentKw}
                pref={user.pref}
                currentKw={currentKw}
                currentLc={currentLc}
                currentCenter={currentCenter}
                ct={local.city}
                type={type}
                radius={radius}
                onChange={(e)=>this.onChange(e)}
                onClickSearch={(kw,lc,ct,e)=>this.onSearch(kw,lc,ct,e)}
              />
            )}
            { activeTab==='exp_reslt' && 
              <ResultsTab 
                markers={search.businessResults}
                kw={kw}
                onHoverResultCard={(index,e) => this.onSelectMarker(index,e)}
              />}
            { activeTab==='exp_fav' &&
              <div className="explorer-tab">
                <div className="explorer-results">Collection Lists</div>
              </div>}
            { activeTab==='exp_filt' &&
              <div className="explorer-tab">
                <div className="explorer-results">Filters</div>
              </div>}
          </div>          
          {/* <div className="explorer-redo">
            <button 
              className="lk-btn btn-dan full-wd"
              onClick={(e)=>this.getNearbyPlaces(kw, type, currentCenter, radius, e)}
            >
              Redo Search
            </button>
            <FontAwesomeIcon icon="redo" className="redo-icon"/>
          </div> */}
        </div>
        {!mapviewport.latitude ? 
        <div className="map-contn">
          <Spinner
            cssStyle={{
              top: '50%',
              right: '0',
              width: '100%',
              height: 'max-content',
              position: 'absolute',
              color: 'white'
            }}/>
        </div>
      : <div className="map-contn">
          <ReactMapGL
            {...mapviewport}
            mapStyle={LOKALS_STYLE}
            onViewportChange={(viewport) => this.handleViewportChange(viewport)}
            mapboxApiAccessToken={ MAPBOX_TOKEN }
            minZoom={6}
            maxZoom={20}
            dragPan={true}
            trackResize={true}
            transitionDuration={0}
            transitionInterpolator={new LinearInterpolator()}
          >
          { search.query.currentCenter && search.query.currentCenter.lat !== mapviewport.latitude && (
          <Marker 
            className="current-pos-marker"
            latitude={mapviewport.latitude}
            longitude={mapviewport.longitude}>
            <svg width="20" height="20" fill="#c4762d" stroke="#ffffff" strokeWidth="2">
              <circle cx="10" cy="10" r="7"/>
            </svg>
          </Marker>) }
          {search.businessResults && search.businessResults.length > 0 && search.businessResults.map((marker,i)=>(
            <CustomPopup 
              key={i}
              popupId={i}
              longitude={marker.location.lng} 
              latitude={marker.location.lat} 
              data={marker} 
              selectedPopup={selectedMarker === i} 
              offset={{x:-3,y:-40}}
              size={'lg'}
            />
          ))}
          { search.businessResults && search.businessResults.length > 0 && search.businessResults.map((marker,i)=>(
            <CustomMarker
              key={i}
              markerID={i}
              data={marker}
              offset={{x:-15,y:-30}}
              latitude={marker.location.lat}
              longitude={marker.location.lng}
              selectedMarker={selectedMarker === i}
              showMarkerNumber={true}
              onHoverMarker={(index,e) => this.onSelectMarker(index,e)}
              onClickMarker={() => console.log("Click")}
            />
          ))}
          </ReactMapGL>
        </div>}
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  app: state.app,
  user: state.user,
  search: state.search
});


export default connect(mapStateToProps, { setCurrentPath, getSearchResults })(withRouter(ExploreMap));