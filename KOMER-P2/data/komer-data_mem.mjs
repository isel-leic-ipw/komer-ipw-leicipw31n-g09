// File responsibilities
// Implement data access to memory storage

import { errors } from '../errors.mjs'

import crypto from 'crypto'

const groups = [
    { id: 1, name: "group1", description: "group1 description1", recipes : [{id:1, name: "name1", description:"recipe1"},{id:2, name: "name2", description:"recipe2"}], ownerUser: 1 },
    { id: 2, name: "group2", description: "group2 description2", recipes : [], ownerUser: 2 },
    { id: 3, name: "group3", description: "group3 description3", recipes : [], ownerUser: 1 },
    { id: 4, name: "group4", description: "group4 description4", recipes : [], ownerUser: 2 }
]

const users = [
    { id: 1, name: "user1", authToken: '0b115b6e-8fcd-4b66-ac26-33392dcb9340'},
    { id: 2, name: "user2", authToken: '3dfd8596-cfd3-431d-8e36-f0fc4c64f364'}
]


let nextGroupId = groups.length+1
let nextUserId = users.length+1


export default function () {
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

    async function getGroups(idUser) {
        const userGroups = groups.filter( e => e.ownerUser == idUser)
       
        return Promise.resolve(userGroups)
    }


    async function getDetailsFromGroup(id) {
        const group = groups.find(g => g.id == id)
        if (!group) throw errors.NOT_FOUND("group")
        return Promise.resolve(group)
    }

    async function createGroup(group) {
        const newId = nextGroupId++
        const newGroup = { id: newId, name: group.name, description: group.description, recipes:group.recipes, ownerUser: group.ownerUser }
        groups.push(newGroup)
        return Promise.resolve(newGroup)

    }

    async function createUser(user) {
        const newUser = { id: nextUserId++, name: user.name, authToken: crypto.randomUUID() }
        users.push(newUser)
        return Promise.resolve(newUser)

    }

    async function addRecipe(recipe) {
        const idx = groups.findIndex(g => g.id == recipe.groupId)
        if (idx == -1) {
            throw errors.NOT_FOUND("group")
        }
        const addedRecipe = { id:recipe.recipeID,  name: recipe.name, description: recipe.description }
        groups[idx].recipes.push(addedRecipe)
        return Promise.resolve(addedRecipe)

    }

    async function updateGroup(newGroup) {
        const idx = groups.findIndex(g => g.id == newGroup.id)
        if (idx == -1) {
            throw errors.NOT_FOUND("group")
        }
        groups[idx] = newGroup
        return newGroup
    }

    async function deleteGroup(id) {
        const idx = groups.findIndex(g => g.id == id)
        if (idx == -1) {
            throw errors.NOT_FOUND("group")
        }
        const deletedGroup = groups[idx]
        groups.splice(idx, 1)
        return deletedGroup
    }

    async function deleteRecipe(id,recipe) {
        const idxGroup = groups.findIndex(g => g.id == id)
        if (idxGroup == -1) {
            throw errors.NOT_FOUND("group")
        }
        const idxRecipe = groups[idxGroup].recipes.findIndex(r => r.id == recipe)
        if (idxRecipe == -1) {
            throw errors.NOT_FOUND("recipe")
        }
        const deletedRecipe = groups[idxGroup].recipes[idxRecipe]
        groups[idxGroup].recipes.splice(idxRecipe, 1)
        return deletedRecipe
    }

    async function getUserByToken(token) {
        const user = users.find(u => u.authToken == token)
        if(!user) {
            throw errors.NOT_FOUND('User')
        }
        return user
    }

    async function getUserByGroupId(id) {
        const user = groups.find(g => g.id == id)
        if(!user) {
            throw errors.NOT_FOUND('Group')
        }
        return user.ownerUser
    }
}