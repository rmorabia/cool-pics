import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './style.css'

const tumblr = require('tumblr.js')
const client = tumblr.createClient({
  credentials: {
    consumer_key: 'w7glm8iJpj6gKSDC7VKX1NtGGLYKkQ4AHPflY7YQF2ju4Iixgb',
    consumer_secret: 'CtcVRrkMohSvOm2hjv1cmZji3nDKWrkteup3k3GRHIxVG7SHsV',
    token: 'E1OnZmrCcDT8amQ55sPXBjaJGrBjye7aUpKRiJM3W5f74XHOGX',
    token_secret: 'CtcVRrkMohSvOm2hjv1cmZji3nDKWrkteup3k3GRHIxVG7SHsV'
  },
  returnPromises: true
})

class CoolPics extends Component {
  constructor () {
    super()
    this.state = {
      data: {},
      tag: 'tag'
    }
    this.updateTag = this.updateTag.bind(this)
  }
  updateTag (e) {
    e.preventDefault()
    const tag = document.querySelector('input').value
    client.taggedPosts(tag, (err, data) => {
      console.log(data)
      this.setState({ data, tag })
    })
  }
  render () {
    return (
      <div>
        <h1>cool pics of cool things</h1>
        <form onSubmit={this.updateTag}>
          <input className='form-input'name='search' type='text' placeholder='alia bhatt' />
        </form>
      </div>
    )
  }
}

ReactDOM.render(<CoolPics />, document.getElementById('app'))
