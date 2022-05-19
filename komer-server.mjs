// File responsibilities
// 1 - Include the API modules that configure the server, and provide them its dependencies
// 2 - Launch the server and wait for requests

import express from 'express'

// Create and initialize the Express application
const app = express()
const PORT = 1984

// Import komerApi and all its direct and indirect dependencies
//import komerDataInit and spoonacularDataInit
import komerDataInit from './komer-data_mem.mjs'
const komerData = komerDataInit()
import spoonacularDataInit from './spoonacular-data.mjs'
const spoonacularData = spoonacularDataInit()

import servicesInit from './komer-services.mjs'
const services = servicesInit(komerData,spoonacularData)

// games-api returns router
import komerApiInit from './komer-web-api.mjs'
const komerApi = komerApiInit(services)


app.use(express.json())
app.use(komerApi)


app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

