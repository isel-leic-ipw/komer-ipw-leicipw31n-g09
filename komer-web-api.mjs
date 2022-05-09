// File rsponsibilities
// Have the functions that handle HTTP requests

export default {
    getPopularRecipes,
    searchRecipes,
    createGroup,
    updateGroup,
    getGroups,
    deleteGroup,
    getDetailsFromGroup,
    createRecipe,
    deleteRecipe,
    createUser
}


function getPopularRecipes(req, resp){
    resp.json({message : "Get the list of the most popular recipes" })
}

function getGroups(req, resp){
    resp.json({message : "List all groups" })
}

function searchRecipes(req, resp){
    resp.json({message : "Search recipes by words contained on its name id " + req.params.id })
}

function getDetailsFromGroup(req, resp){
    resp.json({message : "Get the details of a group, with its name, description and names of the included recipes id" + req.params.id })
}

function updateGroup(req, resp){
    console.log('Received in body: ', req.body)
    resp.json({message : " Updated group id = " + req.params.id })
    
}

function createGroup(req, resp){
    console.log('Create group providing its name and description: ', req.body)
    resp
        .status(201)
        .json({message : "Group created" })
}

function createRecipe(req, resp){
    console.log('Add a recipe to a group: ', req.body)
    resp
        .status(201)
        .json({message : "Recipe added" })
}

function createUser(req, resp){
    console.log('Create new user: ', req.body)
    resp
        .status(201)
        .json({message : "User created" })
}

function deleteGroup(req, resp){ 
    resp.json({message : "deleted Group id = " + req.params.id })
}

function deleteRecipe(req, resp){ 
    resp.json({message : "deleted Recipe id = " + req.params.id })
}






