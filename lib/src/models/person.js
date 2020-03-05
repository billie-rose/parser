class Person extends OrderedObject {
    firstName;
    lastName;
    gender;
    favoriteColor;
    dob;

    constructor(firstName, lastName, gender, favoriteColor, dob) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.favoriteColor = favoriteColor;
        this.dob = dob;
    }
}

module.exports = Person;
