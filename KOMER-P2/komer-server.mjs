// File responsibilities
// 1 - Include the API modules that configure the server, and provide them its dependencies
// 2 - Launch the server and wait for requests

import express from 'express'

import path from 'path'
import { fileURLToPath } from 'url'
import hbs from 'hbs'

// Create and initialize the Express application
const app = express()
const PORT = 1984

app.use(express.json()) // Register middleware to handle request bodies with json format
app.use(express.urlencoded()) // Register middleware to handle request bodies with json format


const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename) 

// Import komerApi and all its direct and indirect dependencies
//import komerDataInit and spoonacularDataInit
//import komerDataInit from './data/komer-data_mem.mjs'
import komerDataInit from './data/komer-data-elastic.mjs'
const komerData = komerDataInit()
import spoonacularDataInit from './data/spoonacular-data.mjs'
const spoonacularData = spoonacularDataInit()

import servicesInit from './services/komer-services.mjs'
const services = servicesInit(komerData,spoonacularData)

// komer-api returns router
import komerApiInit from './api/komer-web-api.mjs'
const komerApi = komerApiInit(services)

// komer-web-site returns router
import komerWebSiteInit from './api/komer-web-site.mjs'
const komerWebSite = komerWebSiteInit(services)


//view engine setup
app.set('views', path.join(_dirname, 'views'));
app.set('view engine','hbs');
hbs.registerPartials(_dirname + '/views/partials');


app.use('/api',komerApi)
app.use('/',komerWebSite)


app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

