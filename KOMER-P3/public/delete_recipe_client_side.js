'use strict';

function deleteRecipes() {
	const deleteButtons =
		document.querySelectorAll('.cls-delele-but');
	deleteButtons.forEach(butDel => {
		butDel.onclick = onDeleteRecipe;
	});
	return;
	
	async function onDeleteRecipe() {
		const recipeId = this.id.substr(11);
		
		try {
			await apiDeleteGroup(recipeId);
			deleteTableEntry(recipeId);
		} catch (err) {
			alert(err);
		}
	}
	
	async function apiDeleteGroup(recipeId) {
		const delReqRes = await fetch(
			'/api/komer/groups/'+ document.querySelector("#groupID").value + '/' + recipeId,
			{ method: 'DELETE' }
		);
		if (delReqRes.status === 200) {
			return;
		}
		throw new Error(
			'Failed to delete recipe with id ' + recipeId + '\n' +
			delReqRes.status + ' ' + delReqRes.statusText
		);
	}
	
	function deleteTableEntry(recipeId) {
		const tableEntryId = '#recipe-' + recipeId;
		const tableEntry = document.querySelector(tableEntryId);
		tableEntry.parentNode.removeChild(tableEntry);
	}
}

