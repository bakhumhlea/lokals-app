import React from 'react'
import { BaseControl } from 'react-map-gl'
import './LokalsMapbox.css'
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
    const {longitude, latitude, data, popupId, selectedPopup, offset} = this.props;
    const [x, y] = this._context.viewport.project([longitude, latitude]);
    const popupStyle = {
      position: 'absolute',
      display: selectedPopup? 'flex':'none',
      left: x + offset.x,
      top: y + offset.y,
    };
    return (
      <div 
        ref={this._containerRef}
        style={popupStyle} 
        className="custom-popup-container"
      >
        <div key={data.id} className="flx al-c jt-spbt">
          <div className="number">
            {popupId + 1}
          </div>
          <div className="info">
            <p className="name">{data.name}</p>
            <p className="rating">
              {/* <span className="stars">{[1,2,3,4,5].map((star,i)=>(
                this.calculateStar(data.rating, star).icon && (
                  <FontAwesomeIcon 
                    icon={this.calculateStar(data.rating, star).icon} 
                    key={i} className={this.calculateStar(data.rating, star).class}
                  />)
                ))}
              </span> */}
              {/* <span className="user-count"> ({data.user_ratings_total})</span> */}
            </p>
            <p className="address">
              {data.vicinity.split(',')[0]}, {data.plus_code && data.plus_code.compound_code.split(',')[0].split(' ').slice(1).join(' ')}
            </p>
            <p className="category">{}</p>
          </div>
        </div>
        <div className="anchor"></div>
      </div>
    );
  }
}
export default CustomPopup;
