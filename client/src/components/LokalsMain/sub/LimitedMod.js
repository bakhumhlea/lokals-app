import React, { Component } from 'react'
import Axios from 'axios';
import { makeTitle } from '../../../util/stringFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class LimitedMod extends Component {
  state = {
    events: [],
    viewIndex: null
  }
  componentDidMount() {
    const { city } = this.props;
    this.getEvents(city)
  }
  getEvents(city) {
    Axios.get(`/api/event/all/${city}`)
      .then(res => {
        return this.setState({
          events: res.data,
          viewIndex: 0
        })
      })
  }
  onNextPrev(e,goright) {
    e.preventDefault();
    const { viewIndex, events } = this.state;
    if (goright) {
      const nextIndex = (viewIndex !== events.length - 1)?viewIndex + 1:0; 
      this.setState({viewIndex: nextIndex});
    } else {
      const prevIndex = (viewIndex !== 0)?viewIndex - 1:events.length - 1; 
      this.setState({viewIndex: prevIndex});
    }
  }
  render() {
    const { events, viewIndex } = this.state;
    return (
      <div className="mdl-bound fture">
        <h5 className="mdl-tt"><span>Recently Post</span></h5>
        <div className="mdl">
          <div className="story-display">
            <div className="img-cont"
              style={events && events[viewIndex] && {
                backgroundImage: `url('/images/events/${events[viewIndex].images[0].url}')`,
                backgroundSize: '100% auto',
                backgroundPosition: 'center center'
              }}
            >
              <div className="top-els">
                <span className="main-tag">
                  <FontAwesomeIcon icon="utensils" className="ic on-l"/>{events.length > 0  && events[viewIndex].event_date ? 'Event':'News'}
                </span>
                {/* <span className="more-btn lk-btn-ol sm">View Detail</span> */}
              </div>
            </div>
            <div className="dtail-bx">
              <div className="btn-left" onClick={(e)=>this.onNextPrev(e,false)}><FontAwesomeIcon icon="angle-left"/></div>
              <div className="btn-right" onClick={(e)=>this.onNextPrev(e,true)}><FontAwesomeIcon icon="angle-right"/></div>
              <h5 className="caption">{events.length > 0 && events[viewIndex].title}</h5>
              <p className="location">
                {events.length > 0 && <span><FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
                <span className="place lk-link">{events[viewIndex].business.business_name}</span>
                <span>, </span>
                <span className="nbhood">{events[viewIndex].business.address.neighborhood}</span></span>}
              </p>
              <div className="lk-ip-group tags">
                <div className="flx-contn wrp">
                  {events.length > 0 && events[viewIndex].categories.map((c,i)=>(
                    <span key={i} className="lk-tag-btn sm">{makeTitle(c.keyword)}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
