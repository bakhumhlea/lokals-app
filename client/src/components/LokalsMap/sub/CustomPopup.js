import React from 'react'
import { BaseControl } from 'react-map-gl'
import './LokalsMapbox.css'
import { GOOGLE_MAP_API } from '../../config/keys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    const {longitude, latitude, data, selectedPopup, offset} = this.props;
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
        <div className="image-thumbnail">
          {data.photos && data.photos[0] && 
          <img 
            style={data.photos[0].height > data.photos[0].width ? { width: `100%`}:{ height: `100%`}}
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photos[0].photo_reference}&key=${GOOGLE_MAP_API}`} alt={"Good Job"}/>}
        </div>
        <div key={data.id}>
          <p className="name">{data.name}</p>
          <p className="rating">
            <span className="stars">{[1,2,3,4,5].map((star,i)=>(
              this.calculateStar(data.rating, star).icon && (
                <FontAwesomeIcon 
                  icon={this.calculateStar(data.rating, star).icon} 
                  key={i} className={this.calculateStar(data.rating, star).class}
                />)
              ))}
            </span>
            <span className="user-count"> ({data.user_ratings_total})</span>
          </p>
          <p className="address">
            {data.vicinity.split(',')[0]}, {data.plus_code.compound_code.split(',')[0].split(' ').slice(1).join(' ')}
          </p>
          <p className="category">{}</p>
        </div>
        <div className="anchor"></div>
      </div>
    );
  }
}
export default CustomPopup;
