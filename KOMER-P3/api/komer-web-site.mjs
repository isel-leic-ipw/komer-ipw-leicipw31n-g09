// Module responsibilities
// Register game api routes
// Have the functions that handle HTTP requests

import express from 'express'

const USER_TOKEN_COOKIE = "user-token"

import handlerWrapper from './web-site-common.mjs'




export default function(services) {

    const app = express.Router()

    // Configure CRUD routes to manage Komer 
    app.get('/home', home)                                                     // Homepage
    app.get('/komer/recipes/popular', handlerWrapper(getPopularRecipes))       // Get the list of the most popular recipes
    app.get('/komer/recipes/search', handlerWrapper(searchRecipes))            // Search recipes by words contained on its name
    app.get('/komer/recipes/:id/getDetails', getDetailsFromRecipe)             // Search recipes by words contained on its name    
    app.get('/komer/recipes/searchByName', getSearchRecipeByNameForm)          // Get a Form to Search Recipe By Name
    app.get('/komer/recipes/popularQuantity', getRecipesQquantity)             // Get a Form to indicate how many recipes
    app.post('/komer/groups', handlerWrapper(createGroup))                     // Create group providing its name and description
    //app.put('/komer/groups/:id', handlerWrapper(updateGroup))                // Edit group by changing its name and description
    app.get('/komer/groups', handlerWrapper(getGroups))                        // List all groups
    app.get('/komer/groups/create', getCreateGroupForm)                        // Get a Form to Create a Group
    //app.delete('/komer/groups/:id', handlerWrapper(deleteGroup))             // Delete a group
    app.get('/komer/groups/chooseGroup',handlerWrapper(getDropdownGroups))     // Choose Group
    app.get('/komer/groups/addRecipeToChosenGroup',addRecipeToChosenGroup)     // add Recipe To Chosen Group
    app.get('/komer/groups/:id', handlerWrapper(getDetailsFromGroup))          // Get the details of a group, with its name, description and names of the included recipes
    app.post('/komer/groups/:id', handlerWrapper(addRecipe))                   // Add a recipe to a group    
    //app.delete('/komer/groups/:id/:recipe', handlerWrapper(deleteRecipe))    // Remove a recipe from a group
    app.post('/komer/users', handlerWrapper(createUser))                       // Create new user
    app.get('/komer/users/create', getCreateUserForm)                          // Get a Form to Create a User

    return app

 
    async function home(req, resp){
        const user = req.user
        resp.render('home',{ title:"Home", user: user})
    }

    async function addRecipeToChosenGroup(req, resp){
        const groupiD=req.query.groupId
        const recipeId=req.query.recipeId
        
        resp.render('addRecipeToChosenGroup',{ title:"add Recipe To Chosen Group" , groupiD, recipeId } )
    }

    async function getDropdownGroups(req, resp){
        const groups = await services.getGroups(req.user)
        const recipe=req.query.recipeId
        const user = req.user
        resp.render('chooseGroup',{ title:"Choose Group",g: groups ,recipe: recipe, user: user})
    }

    async function getCreateGroupForm(req, resp) {
        const recipes = await services.getPopularRecipes(10)
        const user = req.user
        resp.render('createGroup',{r: recipes.results, title:"Create Group", user: user})
    }

    async function getCreateUserForm(req, resp) {
        
        resp.render('createUser',{title:"Create User"})
    }

    async function getSearchRecipeByNameForm(req, resp) {
        resp.render('searchRecipeByName')
    }

    async function getRecipesQquantity(req, resp) {
        resp.render('getQuantity')
    }

    
    async function getDetailsFromRecipe(req, resp){
        const recipes = await services.getDetailsFromRecipe(req.params.id)
        resp.render('getDetailsFromRecipe',{r: recipes, title:"Get Details from Recipe"})
        
    }

    async function getPopularRecipes(req, resp){
        const recipes = await services.getPopularRecipes(req.query.quantity)        
        resp.render('getPopularRecipes',{r: recipes.results, title:"Get Popular Recipes"})
        
    }

    async function getGroups(req, resp){
        const groups = await services.getGroups(req.user)    
        const user = req.user    
        resp.render('getGroups',{g: groups, title:"Get Groups", user: user})
    }

    async function searchRecipes(req, resp){
        const recipes = await services.searchRecipes( req.query.name,req.query.quantity)
        resp.render('searchRecipes',{r: recipes.results, title:"Search recipes"})
    }

    async function getDetailsFromGroup(req, resp){
        const group = await services.getDetailsFromGroup(req.user, req.params.id)
        const recipes = await services.getPopularRecipes(10)
        const user = req.user
        resp.render('getDetailsFromGroup',{g: group, title:"Get Details From Group",r: recipes.results, user: user})
    }

    //async function updateGroup(req, resp){
    //    return await services.updateGroup(req.user, req.params.id, req.body.name, req.body.description)
        
    //}

     async function createGroup(req, resp){
         await services.createGroup(req.user, req.body.name, req.body.description, req.body.recipes)
         resp.redirect('/komer/groups')
     }

    async function addRecipe(req, resp){
        await services.addRecipe(req.user, req.params.id, req.body.recipeId)
        resp.redirect('/komer/groups')
    }

     async function createUser(req, resp){
         await services.createUser(req.body.name,req.body.password)
         resp.redirect('/komer/groups')
     }

    // async function deleteGroup(req, resp){ 
    //     return await services.deleteGroup(req.user, req.params.id)
    // }

    // async function deleteRecipe(req, resp){ 
    //     return await services.deleteRecipe(req.user, req.params.id, req.params.recipe)
    // }
}





