require('dotenv').config()
const PORT = process.env.PORT || 3000

const express = require('express');
const app = express();
const path = require('path')
// const PORT = 8004
const UAParser = require('ua-parser-js')

// const bodyParser = require('body-parser')
// const methodOverride = require('method-override')
// const logger = require('morgan')
// const errorHandler = require('errorhandler')

// app.use(logger('dev'));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(methodOverride());
// app.use(errorHandler())

app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const repoName = 'Floema' // Fill in your repository name.
const accessToken = process.env.PRISMIC_ACCESS_TOKEN // If your repository is private, add an access token.
const endpoint = process.env.PRISMIC_ENDPOINT



const client = Prismic.createClient(endpoint, {
  fetch,
  accessToken,
  // routes,
  endpoint
})

const linkHandler = (doc) => {
  if (doc.type == 'product') {
    return `/detail/${doc.uid}`
  }
  if (doc.type == 'about') return '/about'
  if (doc.type == 'collections') return '/collections'
  return '/'
}

const ejs = require('ejs')

// const router = require('./api/index')
// app.use('/api/index.js', router) // vercel

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// const sharedRequest = async api => {
//   const preloader = await api.getSingle('preload')
//   const navigation = await api.getSingle('navigation')
//   return { preloader, navigation }
// }

app.use(async (req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])
  res.locals.isDesktop = void 0 === ua.device.type
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'




  const preloader = await client.getSingle('preload')
  const meta = await client.getSingle('meta')
  const navGraphQuery = `{
    navigation {
      list {
        ...listFields
      }
    }
  }`
  const navigation = await client.getSingle('navigation', { graphQuery: navGraphQuery })
  res.locals.ctx = {
    PrismicH,
    linkHandler,
    preloader,
    navigation,
    meta
  }
  next()
})

app.get('/', async (req, res) => {
  const home = await client.getSingle('home')

  res.render('template', {
    route: 'pages/home',
    home,
  });
});

app.get('/about', async (req, res) => {
  const [about] = await client.getAllByType('about')

  res.render('template', {
    route: 'pages/about',
    about,
  });
});

app.get('/detail/:uid', async (req, res) => {
  try {
    const uid = req.params.uid
    let detail;
    const graphQuery = `{
      product {
        ...productFields
        product_collection {
          ...on collection {
            ...collectionFields
          }
        }
      }
    }`
    detail = await client.getByUID('product', uid, { 'graphQuery': graphQuery })
    const collection = detail.data.product_collection

    res.render('template', {
      route: 'pages/detail',
      id: uid,
      detail: detail,
      collection: collection,
    });
  } catch (e) {
    new Error('product not found')
  }
});

app.get('/collections', async (req, res) => {

  const graphQuery = `{
      collection {
        ...collectionFields
        products {
          products_product {
            ...on product {
              product_image
            }
          }
        }
      }
    }`
  const collections = await client.getAllByType('collection',
    {
      "graphQuery": graphQuery,
      orderings: {
        field: 'my.collection.order',
      }
    })
  const home = await client.getSingle('home')

  res.render('template', {
    route: 'pages/collections',
    collections,
    home,
  });
});

app.get('*', (req, res) => {

  res.render('template', {
    route: 'pages/404',
  })
})

app.listen(PORT, () => {

  console.log(`Exemple port : ${PORT}`);
})
