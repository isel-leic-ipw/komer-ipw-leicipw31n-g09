// File responsibilities
// Implement all Komer handling logic

import { errors } from './errors.mjs'


export default function(komerData,spoonacularData)  {
    if(!komerData)
        throw errors.NOT_FOUND()
    return {
        getPopularRecipes,
        searchRecipes,
        createGroup,
        updateGroup,
        getGroups,
        deleteGroup,
        getDetailsFromGroup,
        addRecipe,
        deleteRecipe,
        createUser
    }

    async function getPopularRecipes(){
        return spoonacularData.getPopularRecipes()
    }

    async function getGroups(){
        return komerData.getGroups()
    }


    async function searchRecipes(name){
        if(!name)
            throw errors.INVALID_ARGUMENT("name")
        return spoonacularData.searchRecipes(name)
    }

    async function getDetailsFromGroup(id){
        if(isNaN(Number(id))) 
            throw errors.INVALID_ARGUMENT("id")
        return komerData.getDetailsFromGroup(id)
    }

    async function createGroup(name, description){
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        const newGroup = { name : name, description: description }
        return komerData.createGroup(newGroup)
    }

    async function createUser(name){
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        const newUser = { name : name}
        return komerData.createUser(newUser)
    }

    async function addRecipe(groupID, recipeId){
        if(isNaN(Number(groupID))) 
            throw errors.INVALID_ARGUMENT("Group id")
        if(isNaN(Number(recipeId))) 
            throw errors.INVALID_ARGUMENT("Recipe id")
        const fetchedRecipe = await spoonacularData.getRecipeById(recipeId)
        console.log(fetchedRecipe)
        const newRecipe = { groupId: groupID ,recipeID: fetchedRecipe.id, name : fetchedRecipe.title, description: fetchedRecipe.summary }
        return komerData.addRecipe(newRecipe)
    }

    async function updateGroup(id, name, description){
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        if(!name) 
            throw errors.INVALID_ARGUMENT("name")
        
        const updatedGroup = {id :id, name: name , description : description} 
        return komerData.updateGroup(updatedGroup)
    }

    async function deleteGroup(id){ 
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        return komerData.deleteGroup(id)
    }

    async function deleteRecipe(id,recipe){ 
        if(!id) 
            throw errors.INVALID_ARGUMENT("id")
        if(!recipe) 
            throw errors.INVALID_ARGUMENT("recipe")
        return komerData.deleteRecipe(id,recipe)
    }
}