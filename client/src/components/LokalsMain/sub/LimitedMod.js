import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LimitedMod(props) {
  return (
    <div className="mdl-bound fture">
      <h5 className="mdl-tt"><span>Limited Time</span></h5>
      <div className="mdl">
        <div className="img-cont">
          <div className="top-els">
            <span className="main-tag">
            <FontAwesomeIcon icon="utensils" className="ic on-l"/>Happy Hours</span>
            <span className="more-btn lk-btn-ol sm">Happy Hours</span>
          </div>
        </div>
        <div className="dtail-bx">
          <h5 className="caption">20% OFF whole bottle</h5>
          <p className="location">
            <FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
            <span className="place">West Coast Wine • Cheese</span>
            <span>, </span>
            <span className="st">Union St</span>
            <span>, </span>
            <span className="nbhood">Cow Hollow</span>
          </p>
          <div className="lk-ip-group">
            <div className="flx-contn wrp">
              {['Wine','Wine Tasting','Happy Hours'].map((t,i)=>(
                <span key={i} className="lk-tag-btn sm">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
