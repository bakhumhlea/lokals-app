import React, { Component } from 'react'
import './SystemDesign.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleLeft, faSun, faMoon, faTimes, faBell, faExclamationCircle, faSearch, faFilter, faBolt, faThLarge, faRedo} from '@fortawesome/free-solid-svg-icons'
import MessageBox from '../Common/MessageBox';
library.add(faAngleLeft, faSun, faMoon, faTimes, faBell, faExclamationCircle, faSearch, faFilter, faBolt, faThLarge, faRedo);

class SystemDesign extends Component {
  state = {
    darkTheme: false,
    openedSection: ['buttons','typo','inputs','links','colors','errors'],
    selected: true,
    showPopup: true,
    showPopup2: false,
  }
  componentDidMount() {
    window.onscroll = function() {
      var offY = window.pageYOffset;
      var btn = document.getElementById('theme-btn');
      if (offY > 50) {
        btn.style.opacity = 1;
      } else {
        btn.style.opacity = 0;
      }
    }
  }
  componentWillUnmount() {
    window.onscroll = null;
  }
  openSection(e, section) {
    e.preventDefault();
    var openedSection = this.state.openedSection;
    if (openedSection.includes(section)) {
      const removeIndex = openedSection.indexOf(section);
      openedSection.splice(removeIndex, 1)
      this.setState({openedSection: openedSection});
    } else {
      openedSection.push(section);
      this.setState({openedSection: openedSection});
    }
  }
  render() {
    const { darkTheme, openedSection } = this.state;
    return (
      <div className={darkTheme?`page-container dark-th pd-common`:"page-container pd-common"}>
        <button className="lk-btn btn-pri ml-4 md theme-btn sha-1" id="theme-btn" onClick={(e)=>this.setState({darkTheme: !darkTheme})}><FontAwesomeIcon icon={darkTheme?"sun":"moon"}/></button>
        <h1 className="page-title flx al-c"><span>Lokals Design Guide</span><button className="lk-btn-ol ml-4 md" onClick={(e)=>this.setState({darkTheme: !darkTheme})}>{darkTheme?"Light Theme":"Dark Theme"}</button></h1>
        <div className="guide">
          <h3 className="title flx al-c">Buttons<button className="ml-2 lk-btn-ol sm" onClick={(e)=>this.openSection(e,'buttons')}><FontAwesomeIcon icon={openedSection.includes('buttons')?"angle-left":"angle-down"}/></button></h3>
          <div className="dropdown" style={{height: openedSection.includes('buttons')?'100%':'0px'}}>
            <div className="grd-contn c-2-fr c-gap-2">
              <div className="c-1">
                <h4 className="sub-title">Filled Button</h4>
                <ul className="inl-contn guide-display">
                  <li>
                    <button className="lk-btn wd-10">Normal</button>
                    <p className="class-decla"><small>.lk-btn</small></p>
                    </li>
                  <li>
                    <button className="lk-btn wd-10 btn-pri">Primary</button>
                    <p className="class-decla"><small>.lk-btn.btn-pri</small></p>
                  </li>
                  <li>
                    <button className="lk-btn wd-10 btn-suc">Success</button>
                    <p className="class-decla"><small>.lk-btn.btn-suc</small></p>
                  </li>
                  <li>
                    <button className="lk-btn wd-10 btn-dan">Danger</button>
                    <p className="class-decla"><small>.lk-btn.btn-dan</small></p>
                  </li>
                  <li>
                    <button className="lk-btn wd-10 btn-dis">Dismiss</button>
                    <p className="class-decla"><small>.lk-btn.btn-dis</small></p>
                  </li>
                </ul>
                <h4 className="sub-title">Spacial Button</h4>
                <button className="lk-btn btn-suc spacial mb-2 wd-5">Get Started</button>
                <h4 className="sub-title">Outline Button</h4>
                <ul className="inl-contn guide-display">
                  <li>
                    <button className="lk-btn-ol">Outline</button>
                    <p className="class-decla"><small>.lk-btn-ol</small></p>
                  </li>
                  <li>
                    <button className="lk-btn-ol md">Outline</button>
                    <p className="class-decla"><small>.lk-btn-ol.md</small></p>
                  </li>
                  <li>
                    <button className="lk-btn-ol sm">Outline</button>
                    <p className="class-decla"><small>.lk-btn-ol.sm</small></p>
                  </li>
                </ul>
              </div>
              <div className="c-1">
                <h4 className="sub-title">Tag Button</h4>
                <div className="flx">
                  <span className="lk-tag-btn">Maguro</span>
                  <span className="lk-tag-btn">Sake</span>
                  <span className="lk-tag-btn">Hirame</span>
                  <span className="lk-tag-btn">Unagi</span>
                </div>
                <p className="class-decla"><small>.lk-tag-btn</small></p>
                <div className="flx">
                  <span className="lk-tag-btn sm">Maguro</span>
                  <span className="lk-tag-btn sm">Sake</span>
                  <span className="lk-tag-btn sm">Hirame</span>
                  <span className="lk-tag-btn sm">Unagi</span>
                </div>
                <p className="class-decla"><small>.lk-tag-btn.sm</small></p>
                <h4 className="sub-title">Tag Button (edit mode)</h4>
                <div className="flx">
                  <span className="lk-tag-btn sm">Luffy<FontAwesomeIcon icon="times" className="close-icon"/></span>
                  <span className="lk-tag-btn sm">Goku<FontAwesomeIcon icon="times" className="close-icon"/></span>
                  <span className="lk-tag-btn sm">Naruto<FontAwesomeIcon icon="times" className="close-icon"/></span>
                  <span className="lk-tag-btn sm">Jojo<FontAwesomeIcon icon="times" className="close-icon"/></span>
                </div>
                <p className="class-decla"><small>.lk-tag-btn.sm</small></p>
                <h4 className="sub-title">Toggle Button</h4>
                <button className={this.state.selected?"lk-btn-ol toggle md":"lk-btn-ol toggle md selected"} onClick={(e)=>this.setState({selected: !this.state.selected})}>Toggle Button</button>
                <p className="class-decla"><small>.lk-btn-ol.toggle(.toggle)</small></p>
                <h4 className="sub-title">Toggle Tags</h4>
                <div className="flx">
                  <span className="lk-tag-btn sm">D. Beckham</span>
                  <span className="lk-tag-btn sm selected">C. Ronaldo<FontAwesomeIcon icon="check" className="ml-1"/></span>
                  <span className="lk-tag-btn sm">A. Martial</span>
                  <span className="lk-tag-btn sm">A. Herrera</span>
                  <span className="lk-tag-btn sm">P. Pogba</span>
                </div>
                <p className="class-decla"><small>.lk-tag-btn(.selected)</small></p>
              </div>
            </div>
          </div>
        </div>
        <h3 className="title flx al-c c-3">Typography
          <button className="ml-2 lk-btn-ol sm" onClick={(e)=>this.openSection(e,'typo')}>
            <FontAwesomeIcon icon={openedSection.includes('typo')?"angle-left":"angle-down"}/>
          </button>
        </h3>
        <div className="dropdown" style={{height: openedSection.includes('typo')?'100%':'0px'}}>
        <div className="grd-contn c-3-fr c-gap-4 r-gap-2 ">
          <div className="guide c-1">
            <h4 className="sub-title">Header / Title</h4>
            <div className="typeface">
              <h1 className="hd-1">Header 1</h1>
              <p className="type-detail">Rubik | 600</p>
              <p className="class-decla"><small>.hd-1</small></p>
            </div>
            <div className="typeface">
              <h2 className="hd-2">Header 2</h2>
              <p className="type-detail">Rubik | 600</p>
              <p className="class-decla"><small>.hd-2</small></p>
            </div>
            <div className="typeface">
              <h3 className="hd-3">Header 3</h3>
              <p className="type-detail">Rubik | 600</p>
              <p className="class-decla"><small>.hd-3</small></p>
            </div>
            <div className="typeface">
              <h4 className="hd-4">Header 4</h4>
              <p className="type-detail">Rubik | 500</p>
              <p className="class-decla"><small>.hd-4</small></p>
            </div>
            <div className="typeface">
              <h5 className="hd-5">Header 5</h5>
              <p className="type-detail">Rubik | 500</p>
              <p className="class-decla"><small>.hd-5</small></p>
            </div>
          </div>
          <div className="guide c-1">
          <h4 className="sub-title">Label</h4>
            <div className="typeface">
              <p className="label-1">This is content label</p>
              <p className="type-detail">Montserrat | 400</p>
              <p className="class-decla"><small>.label-1</small></p>
            </div>
            <h4 className="sub-title">Paragraph</h4>
            <div className="typeface">
              <p className="body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p className="type-detail">Noto Sans | 400 | Color</p>
              <p className="class-decla"><small>.body-1</small></p>
            </div>
          </div>
          <div className="guide c-1">
            <h4 className="sub-title">Example</h4>
            <div className="typeface">
              <h1 className="hd-1">Header 1</h1>
              <h4 className="hd-5 flx al-c">Header 5 <button className="lk-btn-ol sm ml-2">Small</button></h4>
              <p className="body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <div className="flx al-c mb-1">
                <button className="lk-btn btn-pri mr-2">Accept</button>
                <button className="lk-btn btn-dis">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="guide">
          <h3 className="title flx al-c">Links and Tabs
            <button className="ml-2 lk-btn-ol sm" onClick={(e)=>this.openSection(e,'links')}>
              <FontAwesomeIcon icon={openedSection.includes('links')?"angle-left":"angle-down"}/>
            </button>
          </h3>
          <div className="dropdown" style={{height: openedSection.includes('links')?'100%':'0px'}}>
            <div className="grd-contn c-2-fr c-gap-2">
              <div className="c-1">
                <h4 className="sub-title">Block text link (font size inherited)</h4>
                <a href="#input" className="lk-link solo mb-3">Go get some sushi</a>
                <h4 className="sub-title">Inline text links (font size inherited)</h4>
                <ul className="inl-contn mb-3">
                  <li><a href="/" className="lk-link active">Link 1</a></li>
                  <li><a href="/" className="lk-link">Link 2</a></li>
                  <li><a href="/" className="lk-link">Link 3</a></li>
                </ul>
                <h4 className="sub-title">Tabs</h4>
                <ul className="inl-contn mb-3">
                  <li><a href="/" className="lk-tab-link active">Link 1</a></li>
                  <li><a href="/" className="lk-tab-link">Link 2</a></li>
                  <li><a href="/" className="lk-tab-link">Link 3</a></li>
                </ul>
              </div>
              <div className="c-1">
                <h4 className="sub-title">Clickable Object</h4>
                <div className="lk-card wrap-link mb-3">
                  <h4 className="hd-5 flx al-c">Card Title<button className="lk-btn-ol sm ml-3">Button</button></h4>
                  <p className="body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <div className="flx al-c ft-3">
                    <span className="label-1">Tags: </span>
                    <span className="lk-tag-btn sm">Live</span>
                    <span className="lk-tag-btn sm">Ride</span>
                    <span className="lk-tag-btn sm">Die</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="guide">
          <h3 className="title flx al-c">Alert and Pop-up
            <button className="ml-2 lk-btn-ol sm" onClick={(e)=>this.openSection(e,'errors')}>
              <FontAwesomeIcon icon={openedSection.includes('errors')?"angle-left":"angle-down"}/>
            </button>
          </h3>
          <div className="dropdown" style={{
            overflow: openedSection.includes('errors')?'initial':'hidden',
            height: openedSection.includes('errors')?'100%':'0px'}}>
            <div className="grd-contn c-2-fr c-gap-2">
              <div className="c-1">
                <h4 className="sub-title">Dropdown Alert Box</h4>
                <MessageBox
                  type="info"
                  message="This is information"
                  unique="key-001"
                />
                <MessageBox
                  type="err"
                  message="Something wrong!"
                  unique="key-002"
                />
                <MessageBox
                  type="noti"
                  message="You got new message"
                  unique="key-003"
                />
              </div>
              <div className="c-1">
                <h4 className="sub-title">Dropdown Popup Box</h4>
                <div className="flx al-c">
                  <div className="popup-bound">
                    <div className="lk-btn btn-suc md trigger-btn mr-2 ml-2" onClick={()=>this.setState({showPopup:!this.state.showPopup})}><FontAwesomeIcon icon="bell"/></div>
                    <div className={this.state.showPopup?"lk-popup":"lk-popup hidden"} style={{width: '300px'}}>
                      <div className="anchor"></div>
                      <div className="p-3">
                        <p className="mb-2"><small>“You musn’t be afraid to dream a little bigger, darling.“</small></p>
                        <p><strong><em>Eames - Inception (2010)</em></strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="popup-bound">
                  <div className="lk-btn btn-pri md trigger-btn mr-2 ml-2" onClick={()=>this.setState({showPopup2:!this.state.showPopup2})}><FontAwesomeIcon icon="comment-alt"/></div>
                    <div className={this.state.showPopup2?"lk-popup":"lk-popup hidden"} style={{width: '300px'}}>
                      <div className="anchor"></div>
                      <div className="p-3">
                        <p className="mb-2"><small>“Why do we fall? So we can learn to pick ourselves back up.“</small></p>
                        <p><strong><em>Dr. Thomas Wayne - Batman Begins (2005)</em></strong></p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div className="guide">
          <h3 className="title flx al-c">Inputs
            <button className="ml-2 lk-btn-ol sm" onClick={(e)=>this.openSection(e,'inputs')}>
              <FontAwesomeIcon icon={openedSection.includes('inputs')?"angle-left":"angle-down"}/>
            </button>
          </h3>
          <div className="dropdown input-section" style={{height: openedSection.includes('inputs')?'100%':'0px'}}>
            <div className="grd-contn c-2-fr c-gap-2">
              <div className="c-1">
                <h4 className="sub-title">Text Input</h4>
                <div className="lk-ip-group">
                  <input type="text" className="lk-ip" placeholder="lk-ip-group .lk-ip"/>
                </div>
                <h4 className="sub-title">Text Input with Label</h4>
                <div className="lk-ip-group">
                  <label className="label-1">Input label</label>
                  <input type="text" className="lk-ip" placeholder="lk-ip-group .lk-ip"/>
                </div>
                <h4 className="sub-title">Multiple Inline Text Inputs with Label (2)</h4>
                <div className="lk-wrap-inl ip-x2">
                  <div className="lk-ip-group">
                    <label className="label-1">First</label>
                    <input type="text" className="lk-ip" placeholder="Type..."/>
                  </div>
                  <div className="lk-ip-group">
                    <label className="label-1">Last</label>
                    <input type="text" className="lk-ip" placeholder="Type..."/>
                  </div>
                </div>
                <h4 className="sub-title">Multiple Inline Text Inputs with Label (3)</h4>
                <div className="lk-wrap-inl ip-x3">
                  <div className="lk-ip-group">
                    <label className="label-1">Label 1</label>
                    <input type="text" className="lk-ip" placeholder="Type..."/>
                  </div>
                  <div className="lk-ip-group">
                    <label className="label-1">Label 2</label>
                    <input type="text" className="lk-ip" placeholder="Type..."/>
                  </div>
                  <div className="lk-ip-group">
                    <label className="label-1">Label 3</label>
                    <input type="text" className="lk-ip" placeholder="Type..."/>
                  </div>
                </div>
                <h4 className="sub-title">Text Input with Button</h4>
                <div className="lk-ip-group with-btn">
                  <input type="text" className="lk-ip" placeholder="lk-ip-group.with-btn .lk-ip"/>
                  <button className="lk-btn btn-suc"><FontAwesomeIcon icon="plus"/></button>
                </div>
              </div>
              <div className="c-1">
                <h4 className="sub-title">Text Area</h4>
                <div className="lk-ip-group">
                  <textarea type="text" className="lk-ip" placeholder="lk-ip-group .lk-ip"/>
                </div>
                <h4 className="sub-title">Select</h4>
                <div className="lk-ip-group">
                  <div className="lk-ip">
                    <select name="sample-name">
                      <option value="value1">value 1</option>
                      <option value="value2">value 2</option>
                      <option value="value3">value 3</option>
                    </select>
                    <FontAwesomeIcon icon="angle-down" className="dropdown-icon"/>
                  </div>
                </div>
                <h4 className="sub-title">Select with Button</h4>
                <div className="lk-ip-group with-btn">
                  <div className="lk-ip">
                    <select name="sample-name">
                      <option value="value1">value 1</option>
                      <option value="value2">value 2</option>
                      <option value="value3">value 3</option>
                    </select>
                    <FontAwesomeIcon icon="angle-down" className="dropdown-icon"/>
                  </div>
                  <button className="lk-btn btn-pri">Button</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="guide">
          <h3 className="title flx al-c">Color Scheme
            <button className="ml-2 lk-btn-ol sm" onClick={(e)=>this.openSection(e,'colors')}>
              <FontAwesomeIcon icon={openedSection.includes('colors')?"angle-left":"angle-down"}/>
            </button>
          </h3>
          <div className="dropdown" style={{height: openedSection.includes('colors')?'100%':'0px'}}>
            <h4 className="sub-title">Base Colors</h4>
            <div className="flx jt-fls mb-2 color-container">
              <div className="color-scheme sha-1">
                <div className="hex-name c-wh-1"></div>
                <p>#ffffff</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-gr-1"></div>
                <p>#7d9292</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-gn-1"></div>
                <p>#23c96d</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-gn-2"></div>
                <p>#0fa050</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-rd-1"></div>
                <p>#c4762d</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-rd-2"></div>
                <p>#cf0e5e</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-gnbl-1"></div>
                <p>#187cbe</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-dkbl-1"></div>
                <p>#182a2e</p>
              </div>
              <div className="color-scheme sha-1">
                <div className="hex-name c-dkgr-1"></div>
                <p>#253636</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SystemDesign;