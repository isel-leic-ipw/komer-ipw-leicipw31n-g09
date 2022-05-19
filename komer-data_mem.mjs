// File responsibilities
// Implement data access to memory storage

import { errors } from './errors.mjs'

const groups = [
    { id: 1, name: "group1", description: "group1 description1", recipes : [{id:1, name: "name1", description:"recipe1"},{id:2, name: "name2", description:"recipe2"}] },
    { id: 2, name: "group2", description: "group2 description2", recipes : [] }
]

const users = [
    { id: 1, name: "user1" },
    { id: 2, name: "user2" }
]


let nextGroupId = 3
let nextUserId = 3


export default function () {
    return {    
        createGroup,
        updateGroup,
        getGroups,
        deleteGroup,
        getDetailsFromGroup,
        addRecipe,
        deleteRecipe,
        createUser
    }

    async function getGroups() {
        return Promise.resolve(groups)
    }

    async function getDetailsFromGroup(id) {
        const group = groups.find(g => g.id == id)
        if (!group) throw errors.NOT_FOUND()
        return Promise.resolve(group)
    }

    async function createGroup(group) {
        const newId = nextGroupId++
        const newGroup = { id: newId, name: group.name, description: group.description }
        groups.push(newGroup)
        return Promise.resolve(newGroup)

    }

    async function createUser(user) {
        //todo add key
        const newId = nextUserId++
        const newUser = { id: newId, name: user.name }
        users.push(newUser)
        return Promise.resolve(newUser)

    }

    async function addRecipe(recipe) {
        const idx = groups.findIndex(g => g.id == recipe.groupId)
        if (idx == -1) {
            throw errors.NOT_FOUND()
        }
        const addedRecipe = { id:recipe.recipeID,  name: recipe.name, description: recipe.description }
        groups[idx].recipes.push(addedRecipe)
        return Promise.resolve(addedRecipe)

    }

    async function updateGroup(newGroup) {
        const idx = groups.findIndex(g => g.id == newGroup.id)
        if (idx == -1) {
            throw errors.NOT_FOUND()
        }
        groups[idx] = newGroup
        return newGroup
    }

    async function deleteGroup(id) {
        const idx = groups.findIndex(g => g.id == id)
        if (idx == -1) {
            throw errors.NOT_FOUND()
        }
        const deletedGroup = groups[idx]
        groups.splice(idx, 1)
        return deletedGroup
    }

    async function deleteRecipe(id,recipe) {
        const idxGroup = groups.findIndex(g => g.id == id)
        if (idxGroup == -1) {
            throw errors.NOT_FOUND("grupo")
        }
        const idxRecipe = groups[idxGroup].recipes.findIndex(r => r.id == recipe)
        if (idxRecipe == -1) {
            throw errors.NOT_FOUND("receita")
        }
        const deletedRecipe = groups[idxGroup].recipes[idxRecipe]
        groups[idxGroup].recipes.splice(idxRecipe, 1)
        return deletedRecipe
    }
}