import React, { Component } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom'
import ReactMapGL, { Marker, LinearInterpolator } from 'react-map-gl'
import { MAPBOX_TOKEN } from '../../../config/keys';
import Spinner from '../../Common/Spinner';
import { makeTitle } from '../../../util/stringFormat';
import isEmpty from '../../../util/is-empty'

import CustomMarker from '../../LokalsMap/sub/CustomMarker';
import CustomPopup from '../../LokalsMap/sub/CustomPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LOKALS_STYLE = 'mapbox://styles/bakhumhlea/cjsp4km8x072o1fmevtwowt5x';

// const SF = {lat: 37.7749, lng: -122.4194};

export default class MiniMap extends Component {
  state = {
    kw: 'thai',
    ty: 'restaurant',
    lc: {address: 'downtown',type:'neighborhood'},
    ct: 'San Francisco',
    opennow: false,
    markers: null,
    showPopup: true,
    selectedMarker: null,
    cUserLc: null,
    cMapCen: null,
    cSearchCen: null,
    searchRadius: 1000,
    mapviewport: {
      width: '100%',
      height: '100%',
      zoom: 12,
      latitude: null,
      longitude: null,
      bearing: 0,
      pitch: 0,
    }
  }
  componentDidMount() {
    const { kw, ct, lc } = this.props;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // console.log(kw);
        // console.log(lc);
        // console.log(ct);
        Axios.get(`/api/business/querybusinesses/categories/${kw}/${lc.address}/${lc.type}/${ct}`)
        .then(res => {
          // console.log(res.data);
          this.setState({
            markers: [...res.data.businesses],
            mapviewport : {
              ...this.state.mapviewport,
              latitude: res.data.map_center.lat,
              longitude: res.data.map_center.lng
            },
            cUserLc: {
              lat: location.lat, 
              lng: location.lng
            },
            cMapCen: {
              lat: res.data.map_center.lat, 
              lng: res.data.map_center.lng
            },
            cSearchCen: {
              lat: location.lat, 
              lng: location.lng
            },
            kw: kw,
            lc: lc,
            ct: ct
          })
        })
        .catch(err => console.log({error: err}));
      });
    } else {
      this.setState({kw: kw, ct:this.props.ct, markers: this.props.markers})
    }
    
  }
  componentDidUpdate(prevProps, prevState) {
    const { ct, kw, lc } = this.props;
    const propsChange = prevProps.ct !==  ct ||
      prevProps.kw !==  kw ||
      prevProps.lc !==  lc;
    if (propsChange && this.props.markers.length !== 0) {
      console.log(this.props.cMapCen)
      this.setState({
        cMapCen: {
          ...this.props.cMapCen
        },
        markers: this.props.markers,
        mapviewport: {
          ...this.state.mapviewport,
          latitude: this.props.cMapCen.lat,
          longitude: this.props.cMapCen.lng
        },
        kw: kw,
        lc: lc,
        ct: ct
      })
    }
  }
  locateUserLocation(e) {
    e.preventDefault();
    const { mapviewport } = this.state;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          mapviewport: {
            ...mapviewport,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      });
    }
  }
  getNearUser(keyword,address,location,type,radius,opennow, e) {
    if (e) e.preventDefault();
    const params = {};
    params.kw = keyword;
    params.ty = type;
    params.rad = radius || 1000;
    params.opn = opennow;
    console.log(this.props.markers);
    if (this.props.markers.length > 0) {
      console.log(this.props.markers);
      this.setState({
        lc: address,
        markers: this.props.markers,
        mapviewport: {
          ...this.state.mapviewport,
          latitude: this.props.markers[0].location.lat,
          longitude: this.props.markers[0].location.lng
        }
      });
    } else {
      Axios.get(`/api/business/searchnearuser/${params.kw}/${params.ty}/${location.lat}/${location.lng}/${params.rad}/${params.opn}`)
      .then(res => {
        return this.setState({
          lc: address,
          markers: res.data,
          mapviewport: {
            ...this.state.mapviewport,
            latitude: location.lat,
            longitude: location.lng
          }
        });
      })
      .catch(err => console.log({error:'Error!'}))
    }
  }
  getNearbyPlaces(keyword, location, type, city, radius, opennow) {
    // console.log(type)
    const params = {};
    params.kw = keyword;
    params.ty = type;
    params.lc = !isEmpty(location) ? location : {address:'financial district',type:'neighborhood'};
    params.rad = radius || 1000;
    params.opn = opennow;
    params.ct = city;
    Axios.get(`/api/business/searchnearby/${params.kw}/${params.ty}/${params.lc.address}/${params.ct}/${params.rad}/${params.opn}`)
      .then(res => {
        if (res.data.length>0) {
          return this.setState({
            lc: params.lc,
            markers: res.data,
            cMapCen: {
              lat: res.data[0].geometry.location.lat, 
              lng: res.data[0].geometry.location.lng
            },
            cSearchCen: {
              lat: res.data[0].geometry.location.lat, 
              lng: res.data[0].geometry.location.lng
            },
            mapviewport: {
              ...this.state.mapviewport,
              latitude: res.data[0].geometry.location.lat,
              longitude: res.data[0].geometry.location.lng
            }
          });
        }
      })
      .catch(err => console.log({error: 'An unknown error occor!'}));
  }
  handleViewportChange(viewport) {
    this.setState({
      cMapCen: {
        lat: viewport.latitude, 
        lng: viewport.longitude
      },
      mapviewport: viewport
    })
  }
  getCurrentMapCenter(center, zoom) {
    var searchRadius = Math.ceil(1000 + (((13 - zoom)) * 300));
    this.setState({
      cMapCen: center,
      searchRadius: searchRadius
    });
  }
  onHoverMarker(index,e) {
    if(e) e.preventDefault();
    this.setState({
      selectedMarker: index
    });
  }
  render() {
    const { mapviewport,kw, lc, ct, ty, opennow, 
      markers, cMapCen, cSearchCen, searchRadius, selectedMarker} = this.state;
    // const { kw, lc, ct } = this.props;
    return (
      <div className="mdl-bound mini-map">
        <h5 className="mdl-tt flx al-c jt-spbt">
          <div className="flx al-c">
            <Link to="/explore" className="lk-link mr-2"><span>Explorer</span></Link>
            <FontAwesomeIcon icon={['fab', 'google']} className="ic on-l gg mr-3"/>
          </div>
          <div className="flx al-c">
            <span className="lk-btn btn-war sm tx-cap mr-2">{makeTitle(ct)}</span>
            <span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(kw)}</span>
            {(<span className="lk-btn-ol sm tx-cap">{makeTitle(lc.address)}</span>)}
          </div>
        </h5>
        <div className="mdl">
          {/* { cMapCen && cMapCen.lat !== cSearchCen.lat && (
            <div className="lk-btn sm redo-minimap"
              onClick={(e)=>this.getNearUser(kw,{address:'financial district',type: 'neighborhood'}, {lat: mapviewport.latitude,lng: mapviewport.longitude}, ty, searchRadius , opennow, e)}>
              Redo Search
            </div>
          )} */}
          {cMapCen && (<div className="lk-btn sm center-map"
            onClick={(e)=>this.locateUserLocation(e)}>
              <svg width="20" height="20" fill="transparent">
                <circle cx="10" cy="10" r="3" fill="#494949"/>
                <circle cx="10" cy="10" r="7"/>
                <path d="M0 10 L3 10" />
                <path d="M17 10 L20 10" />
                <path d="M10 0 L10 3" />
                <path d="M10 17 L10 20" />
              </svg>
          </div>)}
          { !(mapviewport.latitude && mapviewport.longitude) ? 
            (<Spinner cssStyle={{
              top: `50%`,
              transform: `translateY(-50%)`,
              color: `#5b8890`,
              height: `max-content`
            }}/>)
            :
            (<ReactMapGL
              {...mapviewport}
              mapStyle={LOKALS_STYLE}
              onViewportChange={(viewport) => this.handleViewportChange(viewport)}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              minZoom={11}
              maxZoom={13.5}
              dragPan={true}
              trackResize={true}
              transitionDuration={50}
              transitionInterpolator={new LinearInterpolator()}
            >
              {/* { cMapCen.lat && (<Marker 
                className="current-pos-marker"
                latitude={mapviewport.latitude}
                longitude={mapviewport.longitude}>
                <svg width="20" height="20" fill="#c4762d" stroke="#ffffff" strokeWidth="2">
                  <circle cx="10" cy="10" r="7"/>
                </svg>
              </Marker>)} */}
              {markers && markers.length > 0 && markers.map((marker,i)=>(
                <CustomPopup 
                  key={i}
                  popupId={i}
                  longitude={marker.location.lng} 
                  latitude={marker.location.lat} 
                  data={marker} 
                  selectedPopup={selectedMarker === i} 
                  offset={{x:-3,y:-40}}
                />
              ))}
              { markers && markers.length > 0 && markers.map((marker,i)=>(
                <CustomMarker
                  key={i}
                  markerID={i}
                  selectedMarker={selectedMarker === i}
                  showMarkerNumber={true}
                  data={marker}
                  offset={{x:-15,y:-30}}
                  latitude={marker.location.lat}
                  longitude={marker.location.lng}
                  onHoverMarker={(index,e) => this.onHoverMarker(index,e)}
                  onClickMarker={() => console.log("Click")}
                />
              ))}
            </ReactMapGL>)
          }
        </div>
      </div>
    )
  }
}
