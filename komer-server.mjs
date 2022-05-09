// File responsibilities
// 1 - Configure the server
// 2 - Launch the server and wait for requests

import express from 'express'
const app = express()
const PORT = 1984
import komerApi from './komer-web-api.mjs'
app.use(express.json())



// Configure CRUD routes to manage jokes 
app.get('/api/komer/recipes', komerApi.getPopularRecipes)           // Get the list of the most popular recipes
app.get('/api/komer/recipes/:id', komerApi.searchRecipes)           // Search recipes by words contained on its name
app.post('/api/komer/groups', komerApi.createGroup)                 // Create group providing its name and description
app.put('/api/komer/groups/:id', komerApi.updateGroup)              // Edit group by changing its name and description
app.get('/api/komer/groups', komerApi.getGroups)                    // List all groups
app.delete('/api/komer/groups/:id', komerApi.deleteGroup)           // Delete a group
app.get('/api/komer/groups/:id', komerApi.getDetailsFromGroup)      // Get the details of a group, with its name, description and names of the included recipes
app.post('/api/komer/groups/:id', komerApi.createRecipe)            // Add a recipe to a group
app.delete('/api/komer/groups/:id/:recipe', komerApi.deleteRecipe)      // Remove a recipe from a group
app.post('/api/komer/users', komerApi.createUser)                   // Create new user

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

