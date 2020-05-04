exports.randomPick = array =>{
    length = array.length;
    index = Math.floor((Math.random() * length));
    return array[index]
}
var randomPick = array =>{
    length = array.length;
    index = Math.floor((Math.random() * length));
    return array[index]
}

exports.createNames = (surnames, forenames, count_of_names) => {
    var names = [];
    for (let i = 0; i <= count_of_names; i++) {
        generated_name = randomPick(forenames).concat(' ', randomPick(surnames))
        if (names.includes(generated_name)) {
        generated_name = randomPick(forenames).concat(' ', randomPick(surnames))
        } else {
        names.push(generated_name)
        }
    }
    return names
} 

exports.createEmails = (surenames, forenames, count_of_names) => {
    var emails = [];
    for (i = 0; i <= count_of_names; i++) {
        email = randomPick(forenames).toLowerCase().concat(randomPick(surenames),'@gmail.com')
        emails.push(email)
    }
    return emails
}

exports.deriveEmails = (names) => {
    var emails = [];
    for (i = 0; i< names.length; i++) {
        name = String(names[i]).split(' ');
        email = name[0].toLowerCase().concat(name[1],'@gmail.com')
        emails.push(email)
    }
    return emails
}

exports.randomBetween = (min, max, n) => {
    min = Math.ceil(min);
    max = Math.ceil(max);
    generated = [];
    for (i = 0; i < n; i++){
        number = Math.floor(Math.random() * (max - min) + min);
        generated.push(number);
    }
    return generated
} 
