import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import InfiniteScroll from 'react-infinite-scroller'

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
      data: [],
      tag: 'tag',
      dataLoaded: false,
      timestamp: 0
    }
    this.updateTag = this.updateTag.bind(this)
    this.infiniteScroll = this.infiniteScroll.bind(this)
  }
  updateTag (e) {
    e.preventDefault()
    const tag = document.querySelector('input').value
    client.taggedPosts(tag, { limit: 12 }, (err, data) => {
      const imgArray = data.filter((i) => i.type === 'photo')
      const firstThreePhotos = imgArray.slice(0, 3)
      const images = firstThreePhotos.map((i) => i.photos[0])
      console.log(firstThreePhotos[2].timestamp)
      this.setState(() => {
        return ({
          tag: tag,
          data: images,
          dataLoaded: true,
          timestamp: firstThreePhotos[2].timestamp
        })
      }
      )
    })
  }
  infiniteScroll () {
    console.log(this.state.timestamp)
    const timestamp = this.state.timestamp
    client.taggedPosts(this.state.tag, { limit: 12, before: timestamp }, (err, data) => {
      console.log(data)
      const imgArray = data.filter((i) => i.type === 'photo')
      const firstThreePhotos = imgArray.slice(0, 3)
      const images = firstThreePhotos.map((i) => i.photos[0])
      this.setState(() => {
        return ({
          data: images,
          timestamp: firstThreePhotos[2].timestamp
        })
      }
      )
    })
  }
  render () {
    return (
      <div>
        <h1>cool pics of cool things</h1>
        <form onSubmit={this.updateTag}>
          <input className='form-input' name='search' type='text' placeholder='alia bhatt' />
        </form>
        {this.state.dataLoaded && (
          <div>
            <div className='container'>
              <div className='columns'>
                {this.state.data.map((data, index) => {
                  return (
                    <Picture
                      data={this.state.data[index]}
                      key={this.state.data + index}
                      infiniteScroll={this.infiniteScroll}
                    />
                  )
                })}
              </div>
            </div>

            {this.state.timestamp && (
              <InfiniteScroll
                pageStart={0}
                loadMore={this.infiniteScroll}
              >
                {<div className='container'>
                  <div className='columns'>
                    {this.state.data.map((data, index) => {
                      return (
                        <Picture
                          data={this.state.data[index]}
                          key={this.state.data + index}
                          infiniteScroll={this.infiniteScroll}
                        />
                      )
                    })}
                  </div>
                </div>}
              </InfiniteScroll>
            )}
          </div>
        )
        }
      </div>
    )
  }
}

class Picture extends Component {
  render () {
    return (
      <div>
        <div className='column col-4'>
          <img
            src={this.props.data.original_size.url}
            className='img-responsive' />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<CoolPics />, document.getElementById('app'))
