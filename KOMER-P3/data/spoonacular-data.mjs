// File responsibilities
// Implement data access to the Board Games Atlas API.
import  fetch  from 'node-fetch'
import * as dotenv from 'dotenv';
dotenv.config();


const RECEIPES_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}`

function RECEIPES_BY_ID_URL(id) { return `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`}


export default function () {
    return {    
        getPopularRecipes,
        searchRecipes,
        getRecipeById
    }

    async function getPopularRecipes(quantity){
        return fetch(RECEIPES_URL+`&number=${quantity}&sort=popularity`)
        .then(rsp => rsp.json())
    }

    async function searchRecipes(name,quantity){
        return fetch(RECEIPES_URL+`&query=${name}&number=${quantity}`)
        .then(rsp => rsp.json())
    }

    async function getRecipeById(id){
        return fetch(RECEIPES_BY_ID_URL(id))
        .then(rsp => rsp.json())
    }


}