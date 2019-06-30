import React from 'react'
import { BaseControl } from 'react-map-gl'
import './LokalsMapbox.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CustomMarker extends BaseControl {
  // onClickMarker(e, number) {
  //   e.preventDefault();
  //   const { data } = this.props;
  //   this.props.onClickMarker(number);
  //   this.props.onCenterMap(data.geometry.location);
  // }
  // onHoverMarker(e, number) {
  //   e.preventDefault();
  //   this.props.onClickMarker(number);
  // }
  _render() {
    const { 
      longitude, 
      latitude, 
      markerID, 
      selectedMarker, 
      offset, 
      onClickMarker, 
      onHoverMarker,
      showMarkerNumber,
    } = this.props;

    const [x, y] = this._context.viewport.project([longitude, latitude]);

    const markerStyle = {
      position: 'absolute',
      left: x + offset.x,
      top: y + offset.y
    };
    const classname = selectedMarker?"custom-marker-container selected":"custom-marker-container";
    return (
      <div 
        ref={this._containerRef}
        style={markerStyle} 
        className={classname}
        onMouseOver={() => onHoverMarker(markerID)}
        onClick={() => onClickMarker({lat: latitude, lng: longitude}, markerID)}
      >
        <FontAwesomeIcon 
          icon={showMarkerNumber?"map-marker":"map-marker-alt"}
          className="custom-marker-icon"/>
        {showMarkerNumber && <div className="custom-marker-number">{markerID+1}</div>}
      </div>
    )
  }
}
export default CustomMarker;
