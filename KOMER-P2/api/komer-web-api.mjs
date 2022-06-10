// Module responsibilities
// Register game api routes
// Have the functions that handle HTTP requests

import express from 'express'


import handleError from './http-errors.mjs'


export default function(services) {

    const app = express.Router()

    // Configure CRUD routes to manage Komer 
    app.get('/komer/recipes/popular', handlerWrapper(getPopularRecipes))       // Get the list of the most popular recipes
    app.get('/komer/recipes/search', handlerWrapper(searchRecipes))            // Search recipes by words contained on its name
    app.post('/komer/groups', handlerWrapper(createGroup))                     // Create group providing its name and description
    app.put('/komer/groups/:id', handlerWrapper(updateGroup))                  // Edit group by changing its name and description
    app.get('/komer/groups', handlerWrapper(getGroups))                        // List all groups
    app.delete('/komer/groups/:id', handlerWrapper(deleteGroup))               // Delete a group
    app.get('/komer/groups/:id', handlerWrapper(getDetailsFromGroup))          // Get the details of a group, with its name, description and names of the included recipes
    app.post('/komer/groups/:id', handlerWrapper(addRecipe))                   // Add a recipe to a group
    app.delete('/komer/groups/:id/:recipe', handlerWrapper(deleteRecipe))      // Remove a recipe from a group
    app.post('/komer/users', handlerWrapper(createUser))                       // Create new user

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
        return await services.createGroup(req.token, req.body.name, req.body.description, req.body.recipes)
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





