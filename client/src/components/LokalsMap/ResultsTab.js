import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GOOGLE_MAP_API } from '../../config/keys';
import './ResultsTab.css'
import Spinner from '../Common/Spinner';
import { capitalize } from '../../util/stringFormat';

export default class ResultsTab extends Component {
  render() {
    const { markers, kw, onHoverResultCard } = this.props;
    return (
      <div className="explorer-tab">
          <div className="explorer-results">
            <div className="results-ctrl">
              <p className="mr-2 mb-0 results-title">
                <span>
                  <span className="results-length">
                    { markers ?(<span>{markers.length}</span>):(<span>0</span>)}
                  </span>
                  <span> results for </span>
                  <span className="results-keyword">{kw}</span>
                </span>
              </p>
              <div className="sort-btn">
                {/* <div className="flx-contn al-c">
                  <span className="lk-btn-ol md">Distance
                    <FontAwesomeIcon icon="angle-down" className="dropdown-icon ml-2"/>
                  </span>
                </div> */}
              </div>
            </div>
            <div className="results-all">
              <h4 className="sec-hd ft-2">
                Popular
                <FontAwesomeIcon icon="star" className="ml-2"/>
              </h4>
              { !!!markers ? (
                <div className="wd-10 empty-result">
                  <Spinner 
                    cssStyle={{
                      top: '50%',
                      right: '0',
                      width: '100%',
                      height: 'max-content',
                      position: 'absolute',
                      color: 'white',
                      transform: 'translateY(-50%)'
                    }}
                  />
                </div>
              ):
              <div className="results-all-contn">
                {markers && markers.map((marker,i)=>(
                  <div 
                    className={marker?"result-card ft-1":"result-card ft-1 sm"} 
                    key={i}
                    onMouseOver={(e)=>onHoverResultCard(i,e)}
                  >
                    <div className="obj-img"
                      id={marker.cover_photo.third_party && (marker.cover_photo.width / marker.cover_photo.height)}
                      style={ marker.cover_photo.third_party && { 
                        backgroundImage: `url('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${marker.cover_photo.photo_reference}&key=${GOOGLE_MAP_API}')`,
                        backgroundSize: (marker.cover_photo.width / marker.cover_photo.height > 1.55) ? `auto 105%`:`105% auto`
                      }}
                      >
                      {/* {marker.photos && marker.photos[0] && 
                      <img 
                        style={{ width: `100%`}}
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${marker.photos[0].photo_reference}&key=${GOOGLE_MAP_API}`} alt={"Good Job"}
                      />} */}
                    </div>
                    <div className="obj-info wd-10">
                      <div className="contn mr-1">
                        <h5 className="obj-title">
                          <span className="name">{marker.business_name}</span>
                        </h5>
                        <p className="obj-detail">
                          <FontAwesomeIcon icon={marker && marker.categories.slice(0,1)[0].keyword.match(/wine/i)?"wine-glass-alt":"utensils"} className="ic on-l"/>
                          <span className="cuisine">{marker.categories[0].keyword}</span>
                          <span className="sprt"> • </span>
                          { marker.price && <span className="price">{marker.price.level>0?'$'.repeat(marker.price.level):'N/A'}</span>}
                        </p>
                        <p className="obj-location flx jt-spbt al-c">
                          <span className="address">
                          <FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
                          <span>{marker.address.street}, {marker.address.neighborhood}</span>
                          </span>
                          <span className="rating">
                            <FontAwesomeIcon icon={['fab', 'google']} className="ic on-l gg"/>
                            <span>{marker.google_rating}</span>
                          </span>
                        </p>
                      </div>
                      <div className="contn right">
                        <div className="btn-list flx">
                          <div className="lk-tag-btn toggle sm">
                            <span>Follow</span>
                            <FontAwesomeIcon icon="plus" className="ic on-r"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          </div>
      </div>
    )
  }
}
