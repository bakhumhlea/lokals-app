import React, { Component } from 'react'
import Axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../Common/Spinner';
import { setCurrentPath } from '../../actions/appstateAction';
import LokalsLogo from '../Common/LokalsLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactMapGL, { Marker, LinearInterpolator } from 'react-map-gl'
import { MAPBOX_TOKEN } from '../../config/keys';
import CustomMarker from '../LokalsMap/sub/CustomMarker';
import ResultsTab from './ResultsTab';
import { capitalize } from '../../util/stringFormat';

import './ExploreMap.css'


const CITIES = [
  {name: 'San Francisco', location: {
    lat: 37.7749, lng: -122.4194
  }},
  {name: 'New York', location: {
    lat: 40.7128, lng: -74.0060
  }},
  {name: 'London', location: {
    lat: 51.5074, lng: -0.1278
  }},
  {name: 'Paris', location: {
    lat: 48.8566, lng: 2.3522
  }},
  {name: 'Los Angeles', location: {
    lat: 34.0522, lng: -118.2437
  }},
  {name: 'Barcelona', location: {
    lat: 41.3851, lng: 2.1734
  }},
  {name: 'Tokyo', location: {
    lat: 35.6821, lng: 139.7647
  }},
  {name: 'Osaka', location: {
    lat: 34.6936, lng: 135.5009
  }},
  {name: 'Chiang Mai', location: {
    lat: 18.7886, lng: 98.9861
  }}
];
const LOKALS_STYLE = 'mapbox://styles/bakhumhlea/cjsp4km8x072o1fmevtwowt5x';

class ExploreMap extends Component {
  state = {
    keyword: 'all',
    type: 'restaurant',
    city: 'San Francisco',
    opennow: false,
    activeTab: 'exp_reslt',
    markers: null,
    showPopup: true,
    selectedMarker: null,
    currentKeyword: 'all',
    currentMapCenter: null,
    currentSearchCenter: null,
    searchRadius: 1000,
    mapviewport: {
      width: '100%',
      height: '100%',
      zoom: 13.5,
      latitude: null,
      longitude: null,
      bearing: 0,
      pitch: 0,
    }
  }
  componentDidMount() {
    // const backToTopBtn = document.getElementById("back_to_top");
    // window.onscroll = function() {
    //   // console.log(window.pageYOffset);
    //   if (window.pageYOffset > 300) {
    //     backToTopBtn.style.opacity = 1;
    //     backToTopBtn.style.transform = 'translate(-50%, 0%)';
    //   } else {
    //     backToTopBtn.style.opacity = 0;
    //     backToTopBtn.style.transform = 'translate(-50%, -120%)';
    //   }
    // }; 
    this.props.setCurrentPath('/explore');

    var currentLocation = null;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.getNearbyPlaces(this.state.keyword, this.state.type, currentLocation , 1000 , null);
        }
      );
    } else {
      this.getNearbyPlaces(this.state.keyword, this.state.type, null , 1000 , null);
    }
  }
  componentWillUnmount() {
    this.props.setCurrentPath({});
  }
  onChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }
  onChangeCity(e) {
    e.preventDefault();
    console.log(e.target.value);
    const cities = CITIES.map(city=>city.name);
    console.log(cities);
    const idx = cities.indexOf(e.target.value);
    console.log(idx);
    this.setState({
      currentMapCenter: {
        lat: CITIES[idx].location.lat,
        lng: CITIES[idx].location.lng
      },
      mapviewport: {
        ...this.state.mapviewport,
        latitude: CITIES[idx].location.lat,
        longitude: CITIES[idx].location.lng,
      },
      city: CITIES[idx].name})
  }
  onClickOpenTab(tab, e) {
    if (e) e.preventDefault();
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({activeTab: tab});
    } else {
      return;
    }
  }
  handleViewportChange(viewport) {
    // console.log(viewport.latitude+","+viewport.longitude);
    this.getCurrentMapCenter({
      lat: viewport.latitude, 
      lng: viewport.longitude
    }, viewport.zoom)
    this.setState({...this.state, mapviewport:viewport})
  }
  getCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => alert(`${position.coords.latitude}, ${position.coords.longitude}`)
      );
    }
  }
  getCurrentMapCenter(center, zoom) {
    var searchRadius = Math.ceil(1000 + (((13 - zoom)) * 300));
    this.setState({
      currentMapCenter: center,
      searchRadius: searchRadius
    });
  }
  getNearbyPlaces(keyword, type, location, radius, e) {
    if (e) e.preventDefault();
    const kw = keyword && keyword.length !== 0 ?  keyword : 'all';
    const ty = type && type.length !== 0  ? type : 'restaurant';
    const loc = location || this.state.city;
    const rad = radius || this.state.searchRadius;
    const { opennow } = this.state;
    // console.log(kw + ty + loc + rad)
    Axios.get(`/api/business/searchnearby/${kw}/${ty}/${loc.lat}/${loc.lng}/${rad}/${opennow}`)
      .then(res => {
        if (res.data.length !== 0) {
          return this.setState({
            currentKeyword: kw,
            mapviewport: {
              ...this.state.mapviewport,
              latitude: res.data[0].geometry.location.lat,
              longitude: res.data[0].geometry.location.lng,
            },
            currentMapCenter: {
              lat: res.data[0].geometry.location.lat,
              lng: res.data[0].geometry.location.lng
            },
            currentSearchCenter: {
              lat: res.data[0].geometry.location.lat,
              lng: res.data[0].geometry.location.lng
            },
            markers: res.data,
            selectedMarker: 0,
            activeTab: 'exp_reslt'
          });
        } else {
          return this.setState({
            mapviewport: {
              ...this.state.mapviewport,
              latitude: loc.lat,
              longitude: loc.lng,
            },
            currentMapCenter: {
              lat: loc.lat,
              lng: loc.lng
            },
            currentSearchCenter: {
              lat: loc.lat,
              lng: loc.lng
            },
            markers: [],
            selectedMarker: null,
            activeTab: 'exp_reslt',
          });
        }
      })
      .catch(err => console.log(err.response.data));
  }
  render() {
    const recents = ['coffee','sushi','bar','indian'];
    const preferences = ['japanese','thai','late_night_coffee','italian','vietnamese'];
    const { mapviewport ,keyword, type, opennow, activeTab, 
      markers, currentKeyword, currentMapCenter, currentSearchCenter, searchRadius } = this.state;
    // const { electedMarker, showPopup } = this.state;
      // console.log(currentMapCenter  && `${currentMapCenter.lat},${currentMapCenter.lng}` === "51.5074,-0.1278");
    const { history } = this.props;
    const { theme } = this.props.app;
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
            <div className="btn-rack flx">
              <button
                type="button" 
                className={activeTab==='exp_tool'?"lk-btn active":"lk-btn"} 
                name="exp_tool" 
                onClick={(e)=>this.onClickOpenTab('exp_tool', e)}
              >
                <FontAwesomeIcon icon="search"/>
              </button>
              <button
                type="button" 
                className={activeTab==='exp_reslt'?"lk-btn active":"lk-btn"} 
                name="exp_reslt" 
                onClick={(e)=>this.onClickOpenTab('exp_reslt', e)}
              >
                <FontAwesomeIcon icon="th-large"/>
              </button>
              <button
                type="button"
                className={activeTab==='exp_fav'?"lk-btn active":"lk-btn"} 
                name="exp_fav" 
                onClick={(e)=>this.onClickOpenTab('exp_fav', e)}
              >
                <FontAwesomeIcon icon="heart"/>
              </button>
              <button
                type="button"
                className={activeTab==='exp_filt'?"lk-btn active":"lk-btn"} 
                name="exp_filt" 
                onClick={(e)=>this.onClickOpenTab('exp_filt', e)}
              >
                <FontAwesomeIcon icon="filter"/>
              </button>
            </div>
          </div>
          <div className="explorer-cons sha-1">
            <div className="logo-bar">
              <div className="contn">
                <Link to="/"><LokalsLogo styles={{color: theme?'#ffffff':'#23c96d'}}/></Link>
                <h5 className="tool-name">EXPLORER</h5>
              </div>
            </div>
            { activeTab==='exp_tool' && <div className="explorer-tab">
              <div className="explorer-ip">
                <div className="qk-search">
                  <h4 className="sec-hd ft-2">
                    Quick Search
                    <FontAwesomeIcon icon="bolt" className="ml-2"/>
                  </h4>
                  <h5 className="label-1 mb-2">Recent</h5>
                  <div className="flx mb-2 wrp">
                    {recents && recents.map((recent,i)=>(
                      <span key={i} className={currentKeyword===recent?"lk-btn-ol toggle sm selected":"lk-btn-ol toggle sm"}
                        onClick={(e)=>this.getNearbyPlaces(recent, type, currentMapCenter, searchRadius, e)}
                      >
                        {recent.split('_').map(r => capitalize(r)).join(' ')}
                      </span>
                    ))}
                  </div>
                  <h5 className="label-1 mb-2">Preferences</h5>
                  <div className="flx wrp">
                    {preferences && preferences.map((pref,i)=>(
                      <span key={i} className={currentKeyword===pref?"lk-btn-ol toggle sm selected":"lk-btn-ol toggle sm" }
                        onClick={(e)=>this.getNearbyPlaces(pref, type, currentMapCenter, searchRadius, e)}
                      >
                        {pref.split('_').map(kw => capitalize(kw)).join(' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="normal-search">
                  <h4 className="sec-hd ft-2">
                    Looking for
                    <FontAwesomeIcon icon="search" className="ml-2"/>
                  </h4>
                  <div className="lk-ip-group">
                    <input 
                      type="text" 
                      className="lk-ip" 
                      name="keyword" 
                      value={keyword}
                      onChange={(e)=>this.onChange(e)} 
                      placeholder="Find restaurant, cuisine, etc.."/>
                  </div>
                  <div className="lk-wrap-inl ip-x2">
                    <div className="lk-ip-group">
                      <h5 className="label-1 mb-2">In</h5>
                      <div className="lk-ip">
                        <select name="type" onChange={(e)=>this.onChange(e)} value={type}>
                          <option value="restaurant">Restaurant</option>
                          <option value="place">Place</option>
                          <option value="event">Event</option>
                        </select>
                        <FontAwesomeIcon icon="angle-down" className="dropdown-icon"/>
                      </div>
                    </div>
                    <div className="lk-ip-group">
                      <h5 className="label-1 mb-2">Where</h5>
                      <div className="lk-ip-ol">
                        <select name="city" 
                          onChange={(e)=>this.onChangeCity(e)}
                          defaultValue={this.state.city}
                          >
                          { CITIES && CITIES.map((ct,i)=>(
                            <option value={ct.name} key={i}>{ct.name}</option>
                          ))}
                        </select>
                        <FontAwesomeIcon icon="angle-down" className="dropdown-icon"/>
                      </div>
                    </div>
                  </div>
                  <h5 className="label-1 mb-2">Which</h5>
                  <div className="flx wrp">
                    <span className={opennow?"lk-tag-btn sm selected":"lk-tag-btn sm" }
                      onClick={()=>this.setState({opennow: !opennow})}
                    >
                      {opennow?(<span>Open Now<FontAwesomeIcon icon="check" className="ml-1"/></span>):"Open now"}
                    </span>
                    <span className="lk-tag-btn sm">WiFi</span>
                    <span className="lk-tag-btn sm">Good Wine List</span>
                    <span className="lk-tag-btn sm">Good for a Date</span>
                    <span className="lk-tag-btn sm">Cozy and Chill</span>
                  </div>
                </div>
              </div>
              <button 
                className="lk-btn btn-pri full-wd search-btn" 
                onClick={(e)=>this.getNearbyPlaces(keyword, type, currentMapCenter, searchRadius, e)}
              >
                  <FontAwesomeIcon icon="search" className="mr-1"/> Search
              </button>
            </div>}
            { activeTab==='exp_reslt' && 
              <ResultsTab 
                markers={markers}
                keyword={keyword}
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
          <div className="explorer-redo">
            <button 
              className="lk-btn btn-dan full-wd"
              onClick={(e)=>this.getNearbyPlaces(keyword, type, currentMapCenter, searchRadius, e)}
            >
              Redo Search
            </button>
            <FontAwesomeIcon icon="redo" className="redo-icon"/>
          </div>
        </div>
        {!mapviewport.latitude ? 
        <div className="map-contn">
          <Spinner
            spinnerStyle={{
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
          { currentMapCenter && currentMapCenter.lat !== currentSearchCenter.lat && (<Marker 
            className="current-pos-marker"
            latitude={mapviewport.latitude}
            longitude={mapviewport.longitude}>
            {/* <FontAwesomeIcon icon="circle"/> */}
            <svg width="20" height="20" fill="#c4762d" stroke="#ffffff" strokeWidth="2">
              <circle cx="10" cy="10" r="7"/>
            </svg>
          </Marker>) }
          { markers && markers.length > 0 && markers.map((marker,i)=>(
            <CustomMarker
              key={i}
              markerID={i}
              data={marker}
              offset={{x:-15,y:-30}}
              latitude={marker.geometry.location.lat}
              longitude={marker.geometry.location.lng}
              onHoverMarker={() => console.log("Hover")}
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
  app: state.app
});

export default connect(mapStateToProps, { setCurrentPath })(withRouter(ExploreMap));