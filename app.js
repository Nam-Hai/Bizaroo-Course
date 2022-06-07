require('dotenv').config()

const express = require('express');
const app = express();
const path = require('path')
const port = 3000

// const bodyParser = require('body-parser')
// const methodOverride = require('method-override')
// const logger = require('morgan')
// const errorHandler = require('errorhandler')

// app.use(logger('dev'));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(methodOverride());
// app.use(errorHandler())

app.use(express.static(path.join(__dirname, 'dev')))

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
  // console.log(doc);
  if (doc.type == 'product') {
    return `/detail/${doc.slug}`
  }
  if (doc.type == 'about') return '/about'
  if (doc.type == 'collections') return '/collections'
  return '/'
}

const ejs = require('ejs')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// const sharedRequest = async api => {
//   const preloader = await api.getSingle('preload')
//   const navigation = await api.getSingle('navigation')
//   return { preloader, navigation }
// }

app.use(async (req, res, next) => {
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

  console.log(home);

  res.render('template', {
    route: 'pages/home',
    home,
  });
});

app.get('/about', async (req, res) => {
  const [about] = await client.getAllByType('about')
  // const meta = await client.getAllByType('meta')
  // console.log(about.data);

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
        title
        description
        products {
          products_product {
            ...on product {
              product_image
            }
          }
        }
      }
    }`
  const collections = await client.getAllByType('collection', { "graphQuery": graphQuery })
  const home = await client.getSingle('home')
  // console.log(collections, collections[0].data.products[0].products_product.data);


  // console.log(collections[0].data.products[0].products_product);
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

app.listen(port, () => {
  console.log(`Exemple port : ${port}`);
})
