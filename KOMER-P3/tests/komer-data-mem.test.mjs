


import createGroup from '../data/komer-data_mem.mjs'


test("test part 1.1 assignment example", () => {
    const req = {
        body: {
            name: "Group_100",
            description: "Ok"
        }
    }
    const user = { id: 1, name: "Filipe", auth: 'abc' }
    const grp = { id: 10, name: "Group_100", description: "Ok", recipes: [], ownerUser: user.id }
    expect(
        createGroup(grp)).toEqual({ id: 10, name: "Group_100", description: "Ok", recipes: [], ownerUser: user.id })
})


/*
        updateGroup,
        getGroups,
        deleteGroup,
        getDetailsFromGroup,
        addRecipe,
        deleteRecipe,
        createUser,
        getUserByToken,
        getUserByGroupId*/