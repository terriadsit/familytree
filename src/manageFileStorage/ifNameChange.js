// if a person in the db has a name change, all of their relatives
// need the new name in their appropriate relative field
// call if name is changed in <AddPerson /> update portion
// updateARelative parameters: personToUpdateId, relativeId, relativeName, newName, whRelative, whChange

import getAPersonById from './getAPersonById'
import updateARelative from './updateARelative'

async function ifNameChange(personId, originalName, newName) {
    const person = await getAPersonById(personId).catch(err => console.log('error getting person', err))
    console.log('person in NameChange', person,'OrigName', originalName,'name', newName )
    for (let i=0; i < person.siblings.length; i++) {
        await updateARelative(person.siblings[i].id, personId, originalName, newName, 'siblings', 'changeName')
    }
    for (let i=0; i < person.spouses.length; i++) {
        await updateARelative(person.spouses[i].id, personId, originalName, newName, 'spouses', 'changeName')
    }
    for (let i=0; i < person.children.length; i++) {
        await updateARelative(person.children[i].id, personId, originalName, newName, 'parents', 'changeName')
    }
    for (let i=0; i < person.parents.length; i++) {
        await updateARelative(person.parents[i].id, personId, originalName, newName, 'children', 'changeName')
    }
}

export { ifNameChange as default }



