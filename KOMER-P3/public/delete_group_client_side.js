'use strict';

function deleteGroups() {
	const deleteButtons =
		document.querySelectorAll('.cls-delele-but');
	deleteButtons.forEach(butDel => {
		butDel.onclick = onDeleteGroup;
	});
	return;
	
	async function onDeleteGroup() {
		const groupId = this.id.substr(11);
		
		try {
			await apiDeleteGroup(groupId);
			deleteTableEntry(groupId);
		} catch (err) {
			alert(err);
		}
	}
	
	async function apiDeleteGroup(groupId) {
		const delReqRes = await fetch(
			'/api/komer/groups/' + groupId,
			{ method: 'DELETE' }
		);
		if (delReqRes.status === 200) {
			return;
		}
		throw new Error(
			'Failed to delete group with id ' + groupId + '\n' +
			delReqRes.status + ' ' + delReqRes.statusText
		);
	}
	
	function deleteTableEntry(groupId) {
		const tableEntryId = '#group-' + groupId;
		const tableEntry = document.querySelector(tableEntryId);
		tableEntry.parentNode.removeChild(tableEntry);
	}
}

