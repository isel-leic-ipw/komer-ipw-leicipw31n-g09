// File responsibilities
// Implement all Komer handling logic

import { errors } from './errors.mjs'



export default function(komerData,spoonacularData)  {
    if(!komerData)
        throw errors.NOT_FOUND("komerData")
    if(!spoonacularData)
        throw errors.NOT_FOUND("spoonacularData")
    return {
        getPopularRecipes,
        searchRecipes,
        createGroup :validateUser(createGroup),
        updateGroup : validateUser(updateGroup),
        getGroups : validateUser(getGroups),
        deleteGroup : validateUser(deleteGroup),
        getDetailsFromGroup : validateUser(getDetailsFromGroup),
        addRecipe : validateUser(addRecipe),
        deleteRecipe : validateUser(deleteRecipe),
        createUser
    }

    function validateUser(f) {
        return async function(...args) {
            const token = args[0]
            // Validate if it is a valid string for a token
            if(!token || token.constructor !== String) {
                return Promise.reject(errors.INVALID_TOKEN())
                // TODO: Validate if the string corresponds to a UUID
            }

            return f.apply(null, args)
        }
    }

    async function checkUser(idGroupOwner, token){
        const id = await komerData.getUserByGroupId(idGroupOwner)
        const user = await komerData.getUserByToken(token)
        return await id != user.id?false:true;
    }

    async function getPopularRecipes(quantity){
        if (!quantity)
            quantity=10
        return spoonacularData.getPopularRecipes(quantity)
    }

    async function getGroups(userToken){
        const user = await komerData.getUserByToken(userToken)
        return komerData.getGroups(user.id)
    }


    async function searchRecipes(name,quantity){
        if(!name)
            throw errors.INVALID_ARGUMENT("name")
        if (!quantity)
            quantity=10
        return spoonacularData.searchRecipes(name,quantity)
    }

    async function getDetailsFromGroup(userToken,id){
        if(isNaN(Number(id))) 
            throw errors.INVALID_ARGUMENT("id")
        
        if( !(await checkUser(id,userToken)))            
            throw errors.INVALID_USER()
        return komerData.getDetailsFromGroup(id)
    }

    async function createGroup(userToken, name, description,recipes){
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        const user = await komerData.getUserByToken(userToken)
        const newGroup = { name : name, description: description, recipes: recipes, ownerUser: user.id  }
        return komerData.createGroup(newGroup)
    }

    async function createUser(name){
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        const newUser = { name : name}
        return komerData.createUser(newUser)
    }

    async function addRecipe(userToken,groupID, recipeId){
        if(isNaN(Number(groupID))) 
            throw errors.INVALID_ARGUMENT("Group id")
        if(isNaN(Number(recipeId))) 
            throw errors.INVALID_ARGUMENT("Recipe id")
        const fetchedRecipe = await spoonacularData.getRecipeById(recipeId)
        console.log(fetchedRecipe)
        if( !(await checkUser(groupID,userToken)))
            throw errors.INVALID_USER()

        const newRecipe = { groupId: groupID ,recipeID: fetchedRecipe.id, name : fetchedRecipe.title, description: fetchedRecipe.summary }
        console.log(newRecipe)
        return komerData.addRecipe(newRecipe)
    }

    async function updateGroup(userToken, id, name, description){
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        
        if( !(await checkUser(id,userToken)))
            throw errors.INVALID_USER()

        const updatedGroup = {id :id, name: name , description : description , recipes:[], ownerUser: komerData.getUserByToken(userToken).id} 
        return komerData.updateGroup(updatedGroup)
    }

    async function deleteGroup(userToken, id){ 
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        
        if( !(await checkUser(id,userToken)))
            throw errors.INVALID_USER()
        
        return komerData.deleteGroup(id)
    }

    async function deleteRecipe(userToken, id,recipe){ 
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        if(!recipe) 
            throw errors.INVALID_ARGUMENT("recipe")
        
        if( !(await checkUser(id,userToken)))
            throw errors.INVALID_USER()
        
        return komerData.deleteRecipe(id,recipe)
    }
}