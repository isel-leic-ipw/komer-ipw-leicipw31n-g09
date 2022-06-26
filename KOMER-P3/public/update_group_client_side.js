'use strict';


function updateGroups() {
	
	let el = document.getElementById("but-update");
  	el.addEventListener("click", onUpdateGroup, false)
	return;
	
	async function onUpdateGroup() {
		const groupId = document.querySelector("#groupID").value;
		
		try {
			await apiUpdateGroup(groupId);
			deleteTableEntry();
		} catch (err) {
			alert(err);
		}
	}
	
	async function apiUpdateGroup(groupId) {
		const updReqRes = await fetch(
			'/api/komer/groups/' + groupId,
			{ 
				method: 'PUT' ,
				headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({ name: document.querySelector("#name").value, description: document.querySelector("#description").value })
			}
		);
		if (updReqRes.status === 200) {
			alert(`Group name was updated to ${document.querySelector("#name").value} and description to ${document.querySelector("#description").value}. The recipes were erased!!`)
			return;
		}
		throw new Error(
			'Failed to update group with id ' + groupId + '\n' +
			updReqRes.status + ' ' + updReqRes.statusText
		);
	}

	function deleteTableEntry() {
		const tableEntryId = '#recipes';
		const tableEntry = document.querySelector(tableEntryId);
		tableEntry.parentNode.removeChild(tableEntry);
	}
	
	
}
