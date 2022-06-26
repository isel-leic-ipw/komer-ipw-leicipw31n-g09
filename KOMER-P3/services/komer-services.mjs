// File responsibilities
// Implement all Komer handling logic

import { errors } from '../errors.mjs'



export default function(komerData,spoonacularData)  {
    if(!komerData)
        throw errors.NOT_FOUND("komerData")
    if(!spoonacularData)
        throw errors.NOT_FOUND("spoonacularData")
    return {
        getPopularRecipes,
        searchRecipes,
        getDetailsFromRecipe,
        createGroup :validateUser(createGroup),
        updateGroup : validateUser(updateGroup),
        getGroups : validateUser(getGroups),
        deleteGroup : validateUser(deleteGroup),
        getDetailsFromGroup : validateUser(getDetailsFromGroup),
        addRecipe : validateUser(addRecipe),
        deleteRecipe : validateUser(deleteRecipe),
        createUser,
        validateCredentials
    }

    function validateUser(f) {
        return async function(...args) {
            const token = args[0]
            // Validate if it is a valid string for a token
            if(!token || token.constructor !== String) {
                return Promise.reject(errors.INVALID_TOKEN())
                // TODO: Validate if the string corresponds to a UUID
            }
            const user = await komerData.getUserByToken(token)
            args[0] = user.id
            return f.apply(null, args)
        }
    }

    async function checkUser(idGroupOwner, userId){
        const group_user = await komerData.getUserByGroupId(idGroupOwner)

        if(!group_user || group_user != userId) {
            throw errors.INVALID_USER()
       }
       return group_user
    }

    async function getPopularRecipes(quantity){
        if (!quantity)
            quantity=10
        return spoonacularData.getPopularRecipes(quantity)
    }

    async function getGroups(userID){
        //const user = await komerData.getUserByToken(userToken)
        return komerData.getGroups(userID)
    }


    async function searchRecipes(name,quantity){
        if(!name)
            throw errors.INVALID_ARGUMENT("name")
        if (!quantity)
            quantity=10
        return spoonacularData.searchRecipes(name,quantity)
    }

    async function getDetailsFromRecipe(id){
        if(isNaN(Number(id))) 
            throw errors.INVALID_ARGUMENT("id")
        return spoonacularData.getRecipeById(id)
    }

    async function getDetailsFromGroup(userID,id){
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        
        await checkUser(id,userID)
            
        return komerData.getDetailsFromGroup(id)
    }

    async function createGroup(userID, name, description,recipes){
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")

       
        let newGroup ={}
        console.log(recipes)
        if(isNaN(Number(recipes)) || !recipes)
            newGroup = { name : name, description: description, recipes: [], ownerUser: userID  }
        else {
            const recipe=await spoonacularData.getRecipeById(recipes)
            newGroup = { name : name, description: description, recipes: [{id: recipe.id, name: recipe.title, description: recipe.summary }], ownerUser: userID  }
        }
        
        console.log(newGroup)
        return komerData.createGroup(newGroup)
    }

    async function createUser(name,password){
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        const newUser = { name : name, password: password}
        return komerData.createUser(newUser)
    }

    async function addRecipe(userID,groupID, recipeId){
        if(!groupID)
            throw errors.INVALID_ARGUMENT("Group id")
        if(isNaN(Number(recipeId))) 
            throw errors.INVALID_ARGUMENT("Recipe id")
        const fetchedRecipe = await spoonacularData.getRecipeById(recipeId)
        console.log(fetchedRecipe)

        await checkUser(groupID,userID)

        const newRecipe = { groupId: groupID ,recipeID: fetchedRecipe.id, name : fetchedRecipe.title, description: fetchedRecipe.summary }
        console.log(newRecipe)
        return komerData.addRecipe(newRecipe)
    }

    async function updateGroup(userID, id, name, description){
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        
        await checkUser(id,userID)

        const updatedGroup = {id :id, name: name , description : description , recipes:[], ownerUser: userID} 
        return komerData.updateGroup(updatedGroup)
    }

    async function deleteGroup(userID, id){ 
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        
        await checkUser(id,userID)
        
        return komerData.deleteGroup(id)
    }

    async function deleteRecipe(userID, id,recipe){ 
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        if(!recipe) 
            throw errors.INVALID_ARGUMENT("recipe")
        
        await checkUser(id,userID)
        
        return komerData.deleteRecipe(id,recipe)
    }

    async function validateCredentials(username, password) {
        try {
            const user = await komerData.getUserByUsername(username)
            if(user.password != password) {
                return null
            }
            return user.authToken
        } catch(e) {
            return null
        }
    }
}