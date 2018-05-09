const API = 'w7glm8iJpj6gKSDC7VKX1NtGGLYKkQ4AHPflY7YQF2ju4Iixgb'
let timestamp = 0

// Function to init Infinite Scroll
const infiniteScroll = (tag) => {
  return new InfiniteScroll('.container', {
    path: () => {
      return 'https://api.tumblr.com/v2/tagged?tag=' + tag + '&limit=12&before=' + timestamp + '&api_key=' + API
    },
    responseType: 'text',
    history: false
  })
}

// Listen for tag input & create Infinite Scroll based on value
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  const tag = document.querySelector('input').value
  document.querySelector('.images').innerHTML = ''
  // Form validation
  if (tag) {
    document.querySelector('h1').textContent = 'cool pics of ' + tag
  } else {
    document.querySelector('h1').textContent = 'Uh oh! Try again.'
  }

  if (infiniteScroll()) {
    infiniteScroll().destroy()
  }
  infiniteScroll(tag)

  // Logic for whenever the infinite scrolling is triggered
  infiniteScroll().on('load', (response) => {
    // Parse JSON file to get images
    const json = JSON.parse(response)
    const imgArray = json.response.filter((i) => i.type === 'photo').map((i) => i.photos[0])
    const timestampArray = json.response.filter((i) => i.type === 'photo')
    timestamp = timestampArray[timestampArray.length - 1].timestamp
    // Render images to the screen, 6 at a time
    // Templating function
    function renderFlexRow (x, y, flexRow) {
      flexRow.setAttribute = ('class', 'columns')
      document.querySelector('.images').appendChild(flexRow)
      for (let i = x; i < y; i++) {
        const highQuality = imgArray[i].original_size.url
        const postImg = document.createElement('img')
        if (imgArray[i].alt_sizes[1]) {
          const lowQuality = imgArray[i].alt_sizes[1].url
          postImg.setAttribute('src', lowQuality)
          postImg.setAttribute('data-src', highQuality)
        } else {
          postImg.setAttribute('src', highQuality)
        }
        postImg.setAttribute('class', 'lazyload column col-4 col-md-6 col-xs-12')
        postImg.setAttribute('data-sizes', 'auto')
        flexRow.appendChild(postImg)
      }
    }
    // Row 1
    const flexRow1 = document.createElement('div')
    renderFlexRow(0, 3, flexRow1)
    // Row 2
    const flexRow2 = document.createElement('div')
    renderFlexRow(4, 7, flexRow2)
  })
  // Load first instance of the next page automatically
  infiniteScroll().loadNextPage()
})
