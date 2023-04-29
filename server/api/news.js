import express from 'express'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const router = express.Router()

router.get('/', function(req, res) {

  axios.get('https://tanki.su/ru/news/').then(response => {
    const html = response.data
    const { window } = new JSDOM(html)
    const document = window.document
    const items = document.querySelectorAll('.preview_item')
    const news = []
    for (var i = 0; i < items.length; i++) {
      const link = items[i].querySelector('.preview_link').getAttribute('href')
      const title = items[i].querySelector('.preview_title').textContent
      const time = parseInt(items[i].querySelector('.preview_time').getAttribute('data-timestamp'))
      if (link && title) {
        news.push({
          link,
          title,
          time
        })
      }
    }
    res.json({
      success: true,
      news
    })
  }).catch(error => {
    res.json({
      success: false,
      error
    })
  })
})

export default router