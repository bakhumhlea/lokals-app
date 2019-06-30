import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { googleAuth, facebookAuth, emailLogin } from '../../actions/authActions';
import { setAppTheme, setLocal } from '../../actions/appstateAction';

import { logoutUser } from '../../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Navbar.css'

const INITIAL_STATE = {
  email: '',
  password: '',
  local: {city: 'san francisco'},
  hidden: false,
  devBar: false
};
const CITIES = [
  {name:'san francisco'},
  {name:'new york'},
  {name:'london'},
  {name:'chiang mai'},
]
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      selectingCity: false,
      hasScroll: false,
      bgOpacity: 0,
    }
    this.selectCityTimer = null;
  }
  componentDidMount() {
    window.onscroll = this.handlePageScroll;
    const { app } = this.props;
    const path = app && app.currentPath?app.currentPath:null;
    if (path==='/explore') {
      this.setState({hidden: true});
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    } else if (nextProps.app !== this.props.app) {
      if (nextProps.app.currentPath==='/explore') {
        this.setState({hidden: true});
      } else {
        this.setState({hidden: false});
      }
      return true;
    } else if (nextProps.auth.isAuth !== this.props.auth.isAuth) {
      return true;
    } else {
      return false;
    }
  }
  handlePageScroll = () => {
    var offsetTop = window.pageYOffset;
    // if (offsetTop > 60) {
    //   console.log(">60");
    //   this.setState({hasScroll: true});
    // } else {
    //   this.setState({hasScroll: false});
    // }
    if (offsetTop > 60) {
      this.setState({bgOpacity: 0.8})
    } else if (offsetTop <= 10) {
      this.setState({bgOpacity: 0})
    } else {
      this.setState({bgOpacity: (offsetTop-10)/50 - 0.2})
    }
  }
  onSelectCity(e,value) {
    e.preventDefault();
    this.setState({ local: { city: value}, selectingCity:false })
    this.props.setLocal({ city: value});
  }
  onChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit = (e) => {
    e.preventDefault();
    const cred = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.emailLogin(cred);
    this.showLoginBar();
    this.setState({email: '', password: ''});
  }
  googleResponse = (res) => {
    this.props.googleAuth(res.tokenId);
    this.showLoginBar();
  }
  facebookResponse = (res) => {
    const name = res.name.split(' ');
    const userData = {
      name: {
        first: name[0],
        last: name[1]
      },
      email: res.email,
      facebookAuth:{
        id: res.userID
      },
      imageUrl: res.picture.data.url
    }
    this.props.facebookAuth(userData);
    this.showLoginBar();
  }
  onLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    const { isAuth, user } = this.props.auth;
    const { setAppTheme } = this.props;
    // const path = app && app.currentPath?app.currentPath:null;
    const { hidden, local, selectingCity } = this.state;
    const guestLinks = (
      <div className="auth-link">
        <Link to="/login" className="lk-btn-ol md mr-2">Log in</Link>
        <Link to="/signup" className="lk-btn btn-pri md">Sign up</Link>
      </div>
    );
    const loggedLinks = (
      <div className="auth-link logged">
        <div className="welcome-user">
          <span>Welcome, </span>
          <span className="lk-link" onClick={(e)=>setAppTheme('dark-th')}><strong>{ isAuth && user.name.first}</strong></span>
        </div>
        <button type="button" onClick={this.onLogout} className="lk-btn btn-dan md">Log out</button>
      </div>
    );
    return (
      <div className="nav-bar">
        <header className="app-header" id="app-header" style={{transform: hidden?'translateY(-100%)':'none'}}>
          <div className="left">
            <Link to="/" className="home-link">
              <h1 className="app-name">L<span><FontAwesomeIcon icon="fire-alt" className="icon"/></span>KALS</h1>
            </Link>
              <ul className="inl-contn mb-0 nav-link">
                <li><Link to="/explore" className="lk-tab-link">Explore</Link></li>
                <li><a href="/events" className="lk-tab-link">Events</a></li>
                <li><Link to="/lokalsforbusiness" className="lk-tab-link">For Business</Link></li>
              </ul>
              {/* <SearchBar
                classname="top-search-bar"
              /> */}
          </div>
          <div className="flx al-c">
            <div className="lk-dd-select">
              <div className="disp mr-2" onClick={(e)=> this.setState({selectingCity: !selectingCity})}>
                <span className="city">{local.city}</span>
                <FontAwesomeIcon icon="angle-down" className="ic"/>
              </div>
             <div className={selectingCity?"backdrop show":"backdrop"} onClick={(e)=> this.setState({selectingCity: false})}>
              <div className={"dd"}>
                {CITIES.map((c,i)=>(
                  <span key={i} className={c.name.toLowerCase() === local.city.toLowerCase()?"lst selected":"lst"} onClick={(e)=>this.onSelectCity(e, c.name)}>{c.name}</span>
                ))}
              </div>
             </div>
              {/* <select name="city" onChange={(e)=>this.onSelectCity(e)} value={local.city}>
                <option value="san francisco">San Francisco</option>
                <option value="new york">New York</option>
                <option value="london">London</option>
                <option value="chiang mai">Chiang Mai</option>
              </select>
               */}
            </div>
          {isAuth? loggedLinks : guestLinks}</div>
          {/* {guestLinks} */}
        </header>

        <div className={this.state.devBar?"development-bar opened":"development-bar"}>
          <FontAwesomeIcon icon="angle-down" className="open-devbar" onClick={(()=>this.setState({devBar: !this.state.devBar}))}/>
          <p>for development only</p>
          <Link to="/lokalsbiz/dashboard">Dashboard</Link>
          <Link to="/explore" >New Explore</Link>
          <a href="/lokalsbiz/event" >Event</a>
          <a href="/lokalsbiz/story" >Story</a>
          <Link to="/lokals-boh" >Lokals BOH</Link>
          <Link to="/system-design" >System Design Guideline</Link>
        </div>
      </div>
    )
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  app: state.app
});

export default connect(mapStateToProps, { 
  facebookAuth, googleAuth, emailLogin ,logoutUser, setAppTheme, setLocal
})(withRouter(Navbar));