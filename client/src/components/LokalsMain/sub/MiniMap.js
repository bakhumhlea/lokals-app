import React, { Component } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom'
import ReactMapGL, { Marker, LinearInterpolator } from 'react-map-gl'
import { MAPBOX_TOKEN } from '../../../config/keys';
import Spinner from '../../Common/Spinner';
import { makeTitle } from '../../../util/stringFormat';
import isEmpty from '../../../util/is-empty'

import CustomMarker from '../../LokalsMap/sub/CustomMarker';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LOKALS_STYLE = 'mapbox://styles/bakhumhlea/cjsp4km8x072o1fmevtwowt5x';

// const SF = {lat: 37.7749, lng: -122.4194};

export default class MiniMap extends Component {
  state = {
    kw: 'thai',
    ty: 'restaurant',
    lc: 'downtown',
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
    const clc = isEmpty(lc)?'downtown':lc;
    const { ty } = this.state;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.getNearUser({kw: kw, lc: 'your location'}, location, ty, 1000 , false);
      });
    } else {
      this.getNearbyPlaces({kw: kw, lc: clc}, ty, ct, 1000 , false);
    }
    this.setState({kw: kw,ct:this.props.ct})
  }
  componentDidUpdate(prevProps, prevState) {
    const { ct, kw, lc } = this.props;
    const { ty } = this.state;
    const propsChange = prevProps.ct !==  ct ||
      prevProps.kw !==  kw ||
      prevProps.lc !==  lc;
    if (propsChange) {
      this.setState({kw: kw, ct: ct, lc: lc})
      this.getNearbyPlaces({kw: kw, lc: lc}, ty, ct, 1000, false)
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
  getNearUser(input,location,type,radius,opennow) {
    const params = {};
    params.kw = input.kw;
    params.lc = input.lc;
    params.ty = type;
    params.rad = radius || 1000;
    params.opn = opennow;
    Axios.get(`/api/business/searchnearuser/${params.kw}/${params.ty}/${location.lat}/${location.lng}/${params.rad}/${params.opn}`)
      .then(res => {
        console.log(res.data);
        return this.setState({
          lc: params.lc,
          markers: res.data,
          cUserLc: {
            lat: location.lat, 
            lng: location.lng
          },
          cMapCen: {
            lat: location.lat, 
            lng: location.lng
          },
          cSearchCen: {
            lat: location.lat, 
            lng: location.lng
          },
          mapviewport: {
            ...this.state.mapviewport,
            latitude: location.lat,
            longitude: location.lng
          }
        });
      })
      .catch(err => console.log({error:'Error!'}))
  }
  getNearbyPlaces(input, type, city, radius, opennow) {
    // console.log(input)
    const params = {};
    params.kw = input.kw;
    params.ty = type;
    params.lc = !isEmpty(input.lc) ? input.lc : 'downtown';
    params.rad = radius || 1000;
    params.opn = opennow;
    params.ct = city;
    Axios.get(`/api/business/searchnearby/${params.kw}/${params.ty}/${params.lc}/${params.ct}/${params.rad}/${params.opn}`)
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
    // this.getCurrentMapCenter({
    //   lat: viewport.latitude, 
    //   lng: viewport.longitude
    // }, viewport.zoom)
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
  render() {
    const { mapviewport, kw, lc, ct, type, opennow, 
      markers, cMapCen, cSearchCen, searchRadius } = this.state;
    return (
      <div className="mdl-bound mini-map">
        <h5 className="mdl-tt flx al-c">
          <Link to="/explore" className="lk-link"><span className="mr-3">Explorer</span></Link>
          <span className="lk-btn btn-war sm tx-cap mr-2">{makeTitle(ct)}</span>
          <span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(kw)}</span>
          { cMapCen && cMapCen.lat === cSearchCen.lat && (<span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(lc)}</span>)}
        </h5>
        <div className="mdl">
          { cMapCen && cMapCen.lat !== cSearchCen.lat && (
            <div className="lk-btn sm redo-minimap"
              onClick={(e)=>this.getNearUser({kw: kw, lc: 'financial district'}, {lat:mapviewport.latitude,lng:mapviewport.longitude}, type, searchRadius , opennow)}>
              Redo Search
            </div>
          )}
          <div className="lk-btn sm center-map"
            onClick={(e)=>this.locateUserLocation(e)}>
              <svg width="20" height="20" fill="transparent">
                <circle cx="10" cy="10" r="3" fill="#494949"/>
                <circle cx="10" cy="10" r="7"/>
                <path d="M0 10 L3 10" />
                <path d="M17 10 L20 10" />
                <path d="M10 0 L10 3" />
                <path d="M10 17 L10 20" />
              </svg>
            {/* <FontAwesomeIcon icon="center" className="ic center"/> */}
          </div>
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
              mapboxApiAccessToken={ MAPBOX_TOKEN }
              minZoom={11}
              maxZoom={13.5}
              dragPan={true}
              trackResize={true}
              transitionDuration={50}
              transitionInterpolator={new LinearInterpolator()}
            >
            { cMapCen && cMapCen.lat !== cSearchCen.lat && (<Marker 
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
                showMarkerNumber={true}
                data={marker}
                offset={{x:-15,y:-30}}
                latitude={marker.geometry.location.lat}
                longitude={marker.geometry.location.lng}
                onHoverMarker={() => console.log("Hover")}
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
