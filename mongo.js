const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

else if(process.argv.length > 5){
  console.log('Too many arguments given!')
  process.exit(1)
}

else if(process.argv.length === 4){
  console.log('Please provide both name and number')
  process.exit(1)
}

const password = process.argv[2]
let name = ""
let number = ""

const url = `mongodb+srv://zainab:${password}@cluster0.ce7cwrx.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5){
  name = process.argv[3]
  number = process.argv[4]

  mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const person = new Person({
      name: name,
      number: number,
    })

    return person.save()
  })
  .then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
     return mongoose.connection.close()
  })
  .catch((err) => console.log(err))

}

else if(process.argv.length === 3){
  mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    // The parameter of the method is an object expressing search conditions. 
    // Since the parameter is an empty object{}, we get all of the notes stored in the notes collection.
    console.log('phonebook:')
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  })
  .catch((err) => console.log(err))
}