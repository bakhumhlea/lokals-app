import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class BOHLogin extends Component {
  render() {
    return (
      <div className="page-container">
        <Link to="/lokals-boh/add-businesses" className="lk-btn btn-pri">Go to Add Businesses</Link>
      </div>
    )
  }
}
