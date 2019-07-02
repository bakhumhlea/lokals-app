import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GOOGLE_MAP_API } from '../../config/keys';
import './ResultsTab.css'
import Spinner from '../Common/Spinner';

export default class ResultsTab extends Component {
  render() {
    const { markers, keyword } = this.props;
    return (
      <div className="explorer-tab">
          <div className="explorer-results">
            <div className="results-ctrl">
              <p className="mr-2 mb-0 results-title">
                <span>
                  <span className="results-length">{markers ? markers.length: 0}</span> results for <span className="results-keyword">{keyword}</span>
                </span>
              </p>
              <div className="sort-btn">
                {/* <p className="mr-2 mb-0">Sort:</p> */}
                <div className="flx-contn al-c">
                  <span className="lk-btn-ol md">Distance
                    <FontAwesomeIcon icon="angle-down" className="dropdown-icon ml-2"/>
                  </span>
                </div>
              </div>
            </div>
            <div className="results-all">
              <h4 className="sec-hd ft-2">
                Popular
                <FontAwesomeIcon icon="star" className="ml-2"/>
              </h4>
              { !markers? (
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
                  <div className={marker?"result-card ft-1":"result-card ft-1 sm"} key={i}>
                    <div className="obj-img">
                      {marker.photos && marker.photos[0] && 
                      <img 
                        style={{ width: `100%`}}
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${marker.photos[0].photo_reference}&key=${GOOGLE_MAP_API}`} alt={"Good Job"}
                      />}
                    </div>
                    <div className="obj-info wd-10">
                      <div className="contn mr-1">
                        <h5 className="obj-title">
                          <span className="name">{marker.name}</span>
                          {/* <span className="type ml-2">Restaurant</span>
                          <span className="sprt">•</span> */}
                          <span className="rating ml-2">{Math.floor(marker.rating/5*100)+"%"}</span>
                        </h5>
                        <p className="obj-detail">
                          <span className="price">{Array.apply(null, Array(marker.price_level)).map(sym => '$').join('')}</span>
                          <span className="sprt">•</span>
                          <span className="cuisine">French</span>
                        </p>
                        <p className="obj-location">
                          {marker.vicinity &&marker.plus_code.compound_code&& <span className="address">{marker.vicinity.split(',')[0]+", "+marker.plus_code.compound_code.split(',')[0].split(' ').slice(1).join(' ')}</span>}
                        </p>
                      </div>
                      <div className="contn right">
                        <div className="btn-list flx">
                          <div className="lk-btn-ol toggle sm mr-2">
                            <FontAwesomeIcon icon="heart"/>
                          </div>
                          <div className="lk-btn-ol toggle sm">
                            <FontAwesomeIcon icon="share"/>
                          </div>
                        </div>
                        <div className="obj-sorting"><span>12 min</span></div>
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
