import express from 'express'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const router = express.Router()

router.get('/', async function(req, res) {
  try {
    const response = await axios.get('https://tanki.su/ru/news/')
    const html = response.data
    const { window } = new JSDOM(html)
    const document = window.document
    const items = document.querySelectorAll('.preview_item')
    const news = []
    for (var i = 0; i < items.length; i++) {
      const imageStyle = (items[i].querySelector('.preview_image-holder').getAttribute('style') || '').match(/url\((.*?)\)/)
      const image = imageStyle && imageStyle[1]
      const link = items[i].querySelector('.preview_link').getAttribute('href')
      const title = items[i].querySelector('.preview_title').textContent
      const time = parseInt(items[i].querySelector('.preview_time').getAttribute('data-timestamp'))
      if (link && title) {
        news.push({
          link,
          title,
          time: time * 1000,
          image
        })
      }
    }
    res.json({ success: true, news })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router