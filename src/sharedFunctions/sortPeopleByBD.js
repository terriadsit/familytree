// Receives an array of people. Returns the array 
// sorted by birthdates.
function sortPeopleByBD(people) {
    people.sort(function(a, b) {
        const dateA = a.birthDate.toUpperCase(); // ignore upper and lowercase
        const dateB = b.birthDate.toUpperCase(); // ignore upper and lowercase
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
      
        // names must be equal
        return 0;
    }) 
  return people  
}

export {sortPeopleByBD as default}