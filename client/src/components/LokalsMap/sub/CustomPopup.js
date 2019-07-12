import React from 'react'
import { BaseControl } from 'react-map-gl'
import './LokalsMapbox.css'
import { capitalize } from '../../../util/stringFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CustomPopup extends BaseControl {
  calculateStar(rating, star) {
    if (star < rating) {
      return {
        class: "shine",
        icon: 'star',
      };
    } else if (star > rating && star-0.5 <= rating) {
      return {
        class: "shine",
        icon: 'star-half',
      };
    } else {
      return {
        class: "no-star",
        icon: false,
      }
    }
  }
  _render() {
    const {longitude, latitude, data, popupId, selectedPopup, offset, size} = this.props;
    const [x, y] = this._context.viewport.project([longitude, latitude]);
    const popupStyle = {
      position: 'absolute',
      display: selectedPopup? 'flex':'none',
      left: x + offset.x,
      top: y + offset.y,
    };
    // console.log(data);
    let lg = (
      <div className="info">
        <p className="name">{data.business_name}</p>
        <p className="address">
          <FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
          <span>{data.address.street}</span>, <span>{data.address.neighborhood}</span>
        </p>
        <div className="flx al-c jt-spbt">
          <p className="category">
            <FontAwesomeIcon icon={data && data.categories.slice(0,1)[0].keyword.match(/wine/i)?"wine-glass-alt":"utensils"} className="ic on-l"/>
            <span>{data.categories[0].keyword}</span><span> • </span>
            {data.price && <span>{data.price.level > 0 ? '$'.repeat(data.price.level): 'N/A'}</span>}
          </p>
          <p className="rating">
            <FontAwesomeIcon icon={['fab', 'google']} className="ic on-l gg"/>
            <span>{data && data.google_rating}</span>
          </p>
        </div>
        
      </div>
    );
    let sm = (
      <div className="info">
        <p className="name">{data.business_name}</p>
        <div className="flx al-c jt-spbt">
          <p className="address">
            <FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
            <span>{data.address.neighborhood}</span> • <span>{capitalize(data.categories[0].keyword)}</span><span> • </span>
            {data.price && <span>{data.price.level > 0 ? '$'.repeat(data.price.level): 'N/A'}</span>}
          </p>
        </div>
        
      </div>
    );
    return (
      <div 
        ref={this._containerRef}
        style={popupStyle} 
        className={size==='lg'?"custom-popup-container lg":"custom-popup-container"}
      >
        <div key={data._id} className="flx al-c jt-spbt">
          <div className="number">
            {popupId + 1}
          </div>
          { size==='lg' ?lg: sm}
        </div>
        <div className="anchor"></div>
      </div>
    );
  }
}
export default CustomPopup;
