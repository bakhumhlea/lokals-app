import React, { Component } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import { MAPBOX_TOKEN, GOOGLE_MAP_API } from '../../config/keys';
import Axios from 'axios';
// import CustomMarker from '../LokalsMapbox/CustomMarker';
import './BOHBusinesses.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SF = {lat: 37.7749, lng: -122.4194};

class BOHBusinesses extends Component {
  state={
    keyword: 'all',
    type: 'restaurant',
    radius: 500,
    searched: '',
    mapviewport: {
      width: '100%',
      height: '100%',
      zoom: 12.5,
      latitude: SF.lat,
      longitude: SF.lng,
      bearing: 0,
      pitch: 0,
    },
    marker: null,
    markers: null,
    success: null,
    password: '',
    errors: null
  }
  componentDidMount() {
    this.setState({
      mapviewport: {
        ...this.state.mapviewport,
        latitude: SF.lat,
        longitude: SF.lng,
      }
    })
  }
  onSearchCurrentCenter(e) {
    e.preventDefault();
    const { keyword, type, radius } = this.state;
    const { latitude, longitude } = this.state.mapviewport;
    Axios.get(`/api/lokals/business/list/${keyword}/${type}/${latitude}/${longitude}/${radius}/${false}`)
      .then(res => {
        this.setState({
          markers: res.data,
          marker: null,
          searched: keyword+' '+type
        });
      })
      .catch(err => console.log(err.response.data));
  }
  getBusinessData(placeid, e) {
    if (e) e.preventDefault();
    Axios.get(`/api/lokals/business/get-profile-by/${placeid}`)
      .then(res => {
        this.setState({
          marker: res.data,
          selected: placeid
        });
      })
      .catch(err => console.log(err.response.data));
  }
  postNewBusiness(businessdata, e) {
    if (e) e.preventDefault();
    // console.log(businessdata);
    const data = {};
    data.businessdata = businessdata;
    data.password = this.state.password;
    Axios.post(`/api/lokals/business/add`, data)
      .then(res => {
        console.log(res.data);
        if (res.data.status === 'OK') {
          return this.setState({ success:{
            business_name: res.data.data.business_name,
            business_id: res.data.data._id,
            timestamp: new Date(res.data.data.create_at).toLocaleDateString()
          }, password: ''})
        }
      })
      .catch(err => {
        return this.setState({ errors: err.response.data, password: ''})
      });
  }
  deleteObject(parentkey,objkey,e) {
    if (e) e.preventDefault();
    console.log(parentkey+":"+objkey);
    let arrayOfObjects = this.state.marker[parentkey];
    arrayOfObjects.splice(objkey,1);
    this.setState({marker: {
      ...this.state.marker,
      [parentkey]: arrayOfObjects
    }});
  }
  addObject(parentkey,e) {
    if (e) e.preventDefault();
    let arrayOfObjects = this.state.marker[parentkey];
    arrayOfObjects.push({keyword: 'new value'});
    this.setState({marker: {
      ...this.state.marker,
      [parentkey]: arrayOfObjects
    }});
  }
  switchType(parentkey) {
    let exceptions = ['address','location','contacts', 'price']
    if (exceptions.includes(parentkey)) {
      return 'type-1';
    } else if (parentkey === 'socials') {
      return 'type-2';
    } else if (parentkey === 'map_url') {
      return 'type-3';
    } else if (parentkey === 'photos') {
      return 'type-4';
    } else if (parentkey === 'categories') {
      return 'type-5';
    } else {
      return 'type-6';
    }
  }
  onChangeArray(parentkey,index,e) {
    e.preventDefault();
    var array = this.state.marker[parentkey];
    var newValue = {keyword: e.target.value};
    array.splice(index,1,newValue);
    this.setState({
      marker: {
        ...this.state.marker,
        [parentkey]: array
      }
    })
  }
  onChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]:e.target.value});
  }
  render() {
    const {mapviewport, marker, markers, keyword, type, radius, selected, searched, success, errors} = this.state;
    // console.log(marker);
    let swithOutput = (parentkey,value,type) => {
      let disableItems = ['google_place_id','contacts','price','socials','google_rating','location','opening_hours'];
      if (type === 'type-1') {
        return (
          <div>
            {Object.entries(value).map((pair,n)=>(
              <div className="body-1 flx-contn" key={n}>
                <span>{pair[0].split('_').join(' ').substr(0,1).toUpperCase()+pair[0].split('_').join(' ').substr(1)}: </span>
                <input
                  className="lk-ip-typing" 
                  name={pair[0]} 
                  value={this.state.marker[parentkey][pair[0]]} 
                  onChange={(e)=>this.setState({
                    marker: {
                      ...this.state.marker,
                      [parentkey]: {
                        ...this.state.marker[parentkey],
                        [pair[0]]: e.target.value
                      }
                    }
                  })}
                  disabled={disableItems.includes(parentkey)}
                />
              </div>
            ))}
          </div>
        );
      } else if (type === 'type-2') {
        return (
          <div className="body-1">
            <span>{Object.keys(value)[0].split('_').join(' ').substr(0,1).toUpperCase()+Object.keys(value)[0].split('_').join(' ').substr(1)}: </span>
            <a className="lk-link solo" href={value.website} rel="noopener noreferrer" target="_blank">{value.website}</a>
          </div>
        )
      } else if (type === 'type-3') {
        return (
          <div className="body-1">
            <a className="lk-link solo" href={value} rel="noopener noreferrer" target="_blank">{value}</a>
          </div>
        )
      } else if (type === 'type-4') {
        return (
          <div>
            {value.map((v,n)=>(
            <div className="body-1 flx-contn" key={n}>
              <div className="obj-img">
                <img 
                  style={{ width: `100%`}}
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${v.photo_reference}&key=${GOOGLE_MAP_API}`} alt={"Good Job"}
                />
                <div className="img-ctr-btn flx-contn">
                  <button className="lk-btn btn-dan sm" onClick={(e)=>this.deleteObject(parentkey,n,e)}><FontAwesomeIcon icon="trash"/></button>
                </div>
              </div>
            </div>))}
          </div>
        )
      } else if (type === 'type-5') {
        return (
          <div>
            {Object.entries(value).map((pair,n)=>(
            <div className="body-1 flx-contn wd-10 jt-spbt" key={n}>
              <input 
                className="lk-ip-typing wd-9" 
                name='keyword' 
                value={this.state.marker[parentkey][pair[0]].keyword} 
                onChange={(e)=>this.onChangeArray(parentkey,n,e)}
                disabled={disableItems.includes(parentkey)}
              />
              <button 
                className="lk-btn-ol sm trash-btn" 
                onClick={(e)=>this.deleteObject(parentkey,pair[0],e)}
                disabled={disableItems.includes(parentkey)}
              >
                <FontAwesomeIcon icon="trash-alt"/>
              </button>
            </div>))}
            <div className="wd-10 add-btn">
              <span 
                className="lk-link solo" 
                onClick={(e)=>this.addObject(parentkey,e)}
              >
                <FontAwesomeIcon icon="plus" className="mr-1"/> Add Keyword
              </span>
            </div>
          </div>
        )
      } else {
        return (
          <div className="body-1">
            <input
              className="lk-ip-typing" 
              name={parentkey} 
              value={this.state.marker[parentkey]} 
              onChange={(e)=>this.setState({
                marker: {
                  ...this.state.marker,
                  [parentkey]: e.target.value
                }
              })}
              disabled={disableItems.includes(parentkey)}
            />
          </div>
        )
      }
    }
    return (
      <div className="page-container add-businesses">
        <div className="lk-card alert-modal" style={{opacity: success?`1`:`0`, zIndex: success?`200`:`0`, transform: success?`translate(-50%,-50%)`:`translate(-50%,-40%)`}}>
          <h5><FontAwesomeIcon icon="check-circle" className="success-post" style={{transform: success?`scale(1)`:`scale(0)`}}/></h5>
          <p className="body-1"><span><strong>{marker && marker.business_name}</strong></span> is on Lokals database.</p>
          <p className="body-1"><small>Business ID: {success && success.business_id}</small></p>
          <p className="body-1"><small>Timestamp: {success && success.timestamp}</small></p>
          <button className="lk-btn btn-pri sm" onClick={()=>this.setState({success:null})}>Got it!</button>
        </div>
        <div className="lk-card alert-modal" style={{opacity: errors?`1`:`0`, zIndex: errors?`200`:`0`, transform: errors?`translate(-50%,-50%)`:`translate(-50%,-40%)`}}>
          <h5><FontAwesomeIcon icon="exclamation-circle" className="error-post"/></h5>
          <p className="body-1"><span><strong>{marker && `${marker.business_name} is already on Lokals!`}{errors && errors.password && `Password Incorrect`}</strong></span> </p>
          <button className="lk-btn-ol sm" onClick={()=>this.setState({errors:null})}>Dismiss</button>
        </div>
        <div className="contn">
          <h5 className="hd-5 mb-3">Search Business{(<FontAwesomeIcon icon="check-circle" className="check-circle-icon" style={{transform: markers?`scale(1)`:`scale(0)`}}/>)}</h5>
          <div className="map-cont">
            <ReactMapGL
              {...mapviewport}
              mapStyle='mapbox://styles/bakhumhlea/cjsp4km8x072o1fmevtwowt5x'
              onViewportChange={(viewport) => this.setState({mapviewport:{...viewport}})}
              mapboxApiAccessToken={ MAPBOX_TOKEN }
              minZoom={6}
              maxZoom={20}
              dragPan={true}
              trackResize={true}
            >
              { (<Marker 
                  className="marker-center-con"
                  latitude={mapviewport.latitude}
                  longitude={mapviewport.longitude}>
                  <svg className="marker-center diamond" width="30" height="30" fill="transparent" stroke="#ffffff" strokeWidth="0.5">
                    {/* <circle cx="10" cy="10" r="7"/> */}
                    <path d="M15 2 L25 10.5 L15 28 L4 12 Z" fill="#a50b4b"/>
                    <path d="M15 2 L18 15.5 L4 12 z" strokeWidth="0.5" fill="#cf0e5e"/>
                    <path d="M25 10.5 L15 2.5 L18 15.5 z" strokeWidth="0.5" fill="#cf0e5e"/>
                    <path d="M25 10.5 L18 15.5 L4 12" strokeWidth="0.5"/>
                    <path d="M15 2 L18 15.5 L15 28" strokeWidth="0.5"/>
                  </svg>
                  <svg className="marker-center ellipse" width="30" height="30">
                    {/* <path d="M15 11.5 L22 14.5 L15 18.5 L8 15.5 Z"/> */}
                    <ellipse cx="15" cy="15" rx="5" ry="2.5"/>
                    <ellipse cx="15" cy="15" rx="3" ry="1.5"/>
                  </svg>
                </Marker>) }
              { markers && !!markers.length && markers.map((m,i)=>(
                <Marker 
                  key={i}
                  latitude={m.geometry.location.lat}
                  longitude={m.geometry.location.lng}
                >
                  <svg className="marker dot" width="12" height="12" stroke="#ffffff">
                    <circle cx="6" cy="6" r="5"/>
                  </svg>
                </Marker>
              ))}
              { marker && (
                <Marker
                  latitude={marker.location.lat}
                  longitude={marker.location.lng}
                >
                  <svg className="marker dot selected" width="16" height="16" stroke="#ffffff">
                    <circle cx="8" cy="8" r="7"/>
                    <path className="star" 
                      d="M8 2.5 
                        L9.5 6.25 L13.5 6.25 
                        L10.25 8.75 
                        L11.5 12.5 L8 10.5 L4.5 12.5 
                        L5.75 8.75 
                        L2.5 6.25 L6.5 6.25 
                        Z"/>
                  </svg>
                </Marker>
              )}
            </ReactMapGL>
          </div>
          <div className="mt-3">
            <div className="lk-ip-group">
            <label className="label-1"><small>Keyword</small></label>
              <input type="text" placeholder="keyword" name="keyword" className="lk-ip" value={keyword} onChange={e=>this.setState({[e.target.name]:e.target.value})}/>
            </div>
            <div className="lk-ip-group">
            <label className="label-1"><small>Type</small></label>
              <input type="text" placeholder="type" name="type" className="lk-ip" value={type} onChange={e=>this.setState({[e.target.name]:e.target.value})}/>
            </div>
            <div className="lk-ip-group">
              <label className="label-1 flx-contn jt-spbt"><small>Radius (meter)</small><small>{radius} m</small></label>
              <input type="range" name="radius" min="200" max="1000" className="lk-ip-range" value={radius} onChange={e=>this.setState({[e.target.name]:e.target.value})}/>
            </div>
            <button className="lk-btn btn-pri wd-10" onClick={(e)=>this.onSearchCurrentCenter(e)}>
              Search at <strong>Lat:</strong> {mapviewport.latitude.toString().substr(0,7)}, <strong>Lng:</strong> {mapviewport.longitude.toString().substr(0,9)}
            </button>
          </div>
        </div>
        <div className="contn results">
          <h5 className="hd-5 mb-3">All Results{(<FontAwesomeIcon icon="check-circle" className="check-circle-icon" style={{transform: markers?`scale(1)`:`scale(0)`}}/>)}</h5>
          {markers && (
            <div>
              { markers.length !== 0 ? markers.map((m,i)=>(
                <div className={(selected === m.place_id)?"lk-card wrap-link mini selected":"lk-card wrap-link mini"} key={m.place_id} onClick={(e)=>this.getBusinessData(m.place_id, e)}>
                  <p className="body-1"><strong>{m.name}</strong></p>
                  <p className="body-1"><small>{m.rating} ({m.user_ratings_total})| {Array.from(Array(m.price_level)).map(v=>'$').join('')}</small></p>
                  <p className="body-1"><small>{m.vicinity}</small></p>
                  <p className="body-1"><small>{m.types.map(t => t.split('_').join(' ').substr(0,1).toUpperCase()+t.split('_').join(' ').substr(1)).join(', ')}</small></p>
                </div>
              )):(<div className="empty-data">
                  <h4><FontAwesomeIcon icon="exclamation-circle"/></h4>
                  <p className="body-1"><strong>No Result for '{searched}'!</strong></p>
                  <p className="body-1"><small><span>in {radius} meters radius from center</span></small></p>
                </div>)
              }
            </div>
          )
          }
        </div>
        <div className="contn view-result">
          <h5 className="hd-5 mb-3">Review Business{marker && (<FontAwesomeIcon icon={Object.keys(marker).length>0?"check-circle":"exclamation-circle"} className="check-circle-icon" style={{transform: marker?`scale(1)`:`scale(0)`}}/>)}</h5>
          {marker && (
            <div className="mt-3 viewport">
              {Object.keys(marker).length===0?
                (<div className="empty-data">
                  <h4><FontAwesomeIcon icon="exclamation-circle"/></h4>
                  <p className="body-1"><strong>No Data Found!</strong></p>
                  <p className="body-1"><small><span>Google Place ID: </span><span>{selected}</span></small></p>
                </div>)
              :Object.entries(marker).map((pair,i)=>(
                <div className="field" key={i}>
                  <label className="label-1">{pair[0].split('_').join(' ').substr(0,1).toUpperCase()+pair[0].split('_').join(' ').substr(1)}</label>
                  {swithOutput(pair[0],pair[1],this.switchType(pair[0]))}
                  {/* {(typeof pair[1] === 'string' || typeof pair[1] === 'number') && (
                    <div className="body-1">
                      {this.urlCheck(pair[0],pair[1])}
                    </div>
                  )}
                  {typeof pair[1] === 'object' && 
                    Object.entries(pair[1]).map((el,n)=>(
                      <div className="body-1 flx-contn" key={n}>
                        {this.urlCheck(el[0],el[1],pair[0])}
                      </div>
                    )
                  )} */}
                </div>
              ))}
              <div className="lk-wrap-inl ip-x2 mt-4">
                <div className="lk-ip-group">
                  <input type="password" className="lk-ip" placeholder="Enter Password" name="password" onChange={(e)=>this.onChange(e)}/>
                </div>
                {Object.keys(marker).length > 0 && 
                  (<div className="lk-ip-group with-btn">
                    <button className="lk-btn btn-suc" onClick={(e)=>this.postNewBusiness(marker, e)}>Save to Lokals DB</button>
                  </div>)
                }
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default BOHBusinesses;