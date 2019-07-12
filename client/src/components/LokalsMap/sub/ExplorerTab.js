import React, { Component } from 'react'
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalize } from '../../../util/stringFormat';

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

class ExplorerTab extends Component {
  state = {
    kw: '',
    lc: {
      address: 'all',
      type: 'none'
    },
    type: 'restuarant'
  }
  onChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }
  render() {
    const { recents, pref, currentKw, ct, type, onClickSearch } = this.props;
    const { kw, lc } = this.state;
    return (
      <div className="explorer-tab">
        <div className="explorer-ip">
          <div className="qk-search">
            <h4 className="sec-hd ft-2">
              Quick Search
              <FontAwesomeIcon icon="bolt" className="ml-2"/>
            </h4>
            <h5 className="label-1 mb-2">Recent</h5>
            <div className="flx mb-2 wrp">
              {recents && recents.map((recent,i)=>(
                <span key={i} className={currentKw===recent?"lk-tag-btn toggle sm selected":"lk-tag-btn toggle sm"}
                  onClick={(e)=>onClickSearch(recent, {address: 'all', type: 'none'}, ct, e)}
                >
                  {recent.split('_').map(w => capitalize(w)).join(' ')}
                </span>
              ))}
            </div>
            <h5 className="label-1 mb-2">Preferences</h5>
            <div className="flx wrp">
              {pref && pref.map((p,i)=>(
                <span key={i} className={currentKw===p.toLowerCase()?"lk-tag-btn toggle sm selected":"lk-tag-btn toggle sm" }
                  onClick={(e)=>onClickSearch(p, {address: 'all', type: 'none'}, ct, e)}
                >
                  {p.split('_').map(w => capitalize(w)).join(' ')}
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
                name="kw" 
                value={kw}
                onChange={(e)=>this.onChange(e)} 
                placeholder="Find restaurant, cuisine, etc.."/>
            </div>
            <div className="lk-wrap-inl ip-x2">
              <div className="lk-ip-group">
                <h5 className="label-1 mb-2">In</h5>
                <div className="lk-ip">
                  <select name="type" onChange={(e)=>this.onChange(e)} value={type}>
                    <option value="restaurant">Restaurant</option>
                    <option value="place">Bar</option>
                  </select>
                  <FontAwesomeIcon icon="angle-down" className="dropdown-icon"/>
                </div>
              </div>
              <div className="lk-ip-group">
                <h5 className="label-1 mb-2">Where</h5>
                <div className="lk-ip-ol">
                  <select name="city" 
                    defaultValue={ct}
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
              <span className={true?"lk-tag-btn sm selected":"lk-tag-btn sm" }>
                {true?(<span>Open Now<FontAwesomeIcon icon="check" className="ml-1"/></span>):"Open now"}
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
          onClick={(e)=>this.props.onClickSearch(kw, lc, ct, e)}
        >
            <FontAwesomeIcon icon="search" className="mr-1"/> Search
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile
}) 
export default connect(mapStateToProps, {})(ExplorerTab);