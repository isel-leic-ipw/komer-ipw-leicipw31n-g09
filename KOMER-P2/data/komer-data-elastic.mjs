import {get, post} from './fetch-wrapper.mjs'
import uriManager from './uri-manager.mjs'

export default function () {
    const INDEX_NAME_GROUPS = 'groups'
    const INDEX_NAME_RECIPES = 'recipes'
    const INDEX_NAME_USERS = 'users'
    const URI_MANAGER_GROUPS = uriManager(INDEX_NAME_GROUPS)
    const URI_MANAGER_RECIPES = uriManager(INDEX_NAME_RECIPES)
    const URI_MANAGER_USERS = uriManager(INDEX_NAME_USERS)

    return {
        createGroup,
        updateGroup,
        getGroups,
        deleteGroup,
        getDetailsFromGroup,
        addRecipe,
        deleteRecipe,
        createUser,
        getUserByToken,
        getUserByGroupId
    }

    async function getGroups(userId) {
        const query = {
            query: {
              match: {
                "ownerUser": userId
              }
            }
          }
        return post(URI_MANAGER_GROUPS.getAll(), query)
            .then(body => body.hits.hits.map(createGroupFromElastic))

    }

    async function getDetailsFromGroup( id) {
        return get(URI_MANAGER_GROUPS.get(id))
            .then(createGroupFromElastic)
    }

    async function getUserByToken( token) {
        const query = {
            query: {
              match: {
                "authToken": token
              }
            }
          }
          return post(URI_MANAGER_USERS.getAll(), query)
          .then(body => body.hits.hits.map(createUserFromElastic)[0])
    }

    async function getUserByGroupId( id) {
        return get(URI_MANAGER_GROUPS.get(id))
            .then(createGroupFromElasticSendUser)
            
    }

    async function createGroup(group) {
        const newGroup = Object.assign(group)
        return post(URI_MANAGER_GROUPS.create(), newGroup)
            .then(body => { newGroup.id = body._id; return newGroup })
    }

    async function addRecipe(recipe) {
        const newRecipe = Object.assign(recipe)
        const query ={
            "script": {
              "source": "ctx._source.recipes.add(params.newRecipe)",
              "lang": "painless",
              "params": {
                "newRecipe": {id: recipe.recipeID, name: recipe.name, description: recipe.description}
              }
            }
          }
        return post(URI_MANAGER_GROUPS.addTo(newRecipe.groupId), query)
            .then( () => {  return newRecipe })
    }

    async function updateGroup(group) {
        console.log("updateGroup")
    }

    async function createUser(user) {
        console.log("createUser")
    }

    async function deleteGroup(id) {
        return del(URI_MANAGER_GROUPS.delete(id), )
            .then(body => body._id)
    }

    async function deleteRecipe(id, recipe) {
        return del(URI_MANAGER_RECIPES.delete(recipe), )
            .then(body => body._id)
    }


    function createGroupFromElastic(groupElastic) {
        let group = groupElastic._source
        group.id = groupElastic._id
        return group
    }

    function createGroupFromElasticSendUser(groupElastic) {
        let group = groupElastic._source
        group.id = groupElastic._id
        return group.ownerUser
    }

    function createUserFromElastic(userElastic) {
        let user = userElastic._source
        user.id = userElastic._id
        return user
    }

    
}