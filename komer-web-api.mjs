// Module responsibilities
// Register game api routes
// Have the functions that handle HTTP requests

import express from 'express'


import handleError from './http-errors.mjs'


export default function(services) {

    const app = express.Router()

    // Configure CRUD routes to manage Komer 
    app.get('/api/komer/popular_recipes', handlerWrapper(getPopularRecipes))       // Get the list of the most popular recipes
    app.get('/api/komer/search_recipes', handlerWrapper(searchRecipes))            // Search recipes by words contained on its name
    app.post('/api/komer/groups', handlerWrapper(createGroup))                     // Create group providing its name and description
    app.put('/api/komer/groups/:id', handlerWrapper(updateGroup))                  // Edit group by changing its name and description
    app.get('/api/komer/groups', handlerWrapper(getGroups))                        // List all groups
    app.delete('/api/komer/groups/:id', handlerWrapper(deleteGroup))               // Delete a group
    app.get('/api/komer/groups/:id', handlerWrapper(getDetailsFromGroup))          // Get the details of a group, with its name, description and names of the included recipes
    app.post('/api/komer/groups/:id', handlerWrapper(addRecipe))                   // Add a recipe to a group
    app.delete('/api/komer/groups/:id/:recipe', handlerWrapper(deleteRecipe))      // Remove a recipe from a group
    app.post('/api/komer/users', handlerWrapper(createUser))                       // Create new user

    return app

    function setUserToken(req) {
        let token = req.get("Authorization")        
        if(token) {
            token = token.split(' ')[1]
        }
        req.token = token
    }

    function handlerWrapper(handler) {
        return async function(req, rsp) {
            setUserToken(req)
            try {
                rsp.json(await handler(req, rsp))
            } catch(e) {
               const error = handleError(e) 
               rsp.status(error.status).json(error.body)
            }    
        }
    }


    async function getPopularRecipes(req, resp){
        return await services.getPopularRecipes(req.body.quantity)
    }

    async function getGroups(req, resp){
        return await services.getGroups(req.token)
    }

    async function searchRecipes(req, resp){
        return await services.searchRecipes( req.body.name,req.body.quantity)
    }

    async function getDetailsFromGroup(req, resp){
        return await services.getDetailsFromGroup(req.token, req.params.id)
    }

    async function updateGroup(req, resp){
        return await services.updateGroup(req.token, req.params.id, req.body.name, req.body.description)
        
    }

    async function createGroup(req, resp){
        resp.status(201)
        return await services.createGroup(req.token, req.body.name, req.body.description)
    }

    async function addRecipe(req, resp){
        resp.status(201)
        return await services.addRecipe(req.token, req.params.id, req.body.recipeId)
    }

    async function createUser(req, resp){
        resp.status(201)
        return await services.createUser(req.body.name)
    }

    async function deleteGroup(req, resp){ 
        return await services.deleteGroup(req.token, req.params.id)
    }

    async function deleteRecipe(req, resp){ 
        return await services.deleteRecipe(req.token, req.params.id, req.params.recipe)
    }
}





