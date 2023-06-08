db.movie.insertOne(
  { name: "AgniPath", releaseData: 2020 },
  { ordered: true },
  { w: 1, j: true, wtimeout: 200 }
);

db.movies.find({ premiered: { $regex: /2012/ } });

db.movies.find({ genres: { $size: 2 } });

db.movies.find({ "rating.average": { $gt: 8, $lt: 10 } });

//32 mb threshold limit for sorting.

db.persons.createIndex(
  { "dob.age": 1 },
  { partialFilterExpression: { gender: "male" } }
);

db.persons
  .explain("executionStats")
  .find({ "dob.age": { $gt: 60 }, gender: "male" });

db.users.createIndex(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } }
);

//Time to live Index

db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });

db.customers.explain("allPlanExecution").find({ age: 27, name: "Siru" });

db.products
  .find(
    { $text: { $search: "awaesome t-shirt" } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } });

db.data.find({$expr:{$cond:{if:{"challange.point":{$eq:3}},then:{"challange.point":add{}},else:{}}}});



// Practice part Two///---> This will be more clear and well documented

//Dropping Databse
db.dropDatabase()
show collections // In order to find out the collections in the database

//creating collection named Person and Inserting data in in
db.persons.insertOne({name:"Arun", age:31, hobbies:["Cars","Cooking"]}) 
//insertMany
db.persons.insertMany([{name:"Anna" , age:29, hobbies:["Sports","Yoga"]},{name:"Maria", age:31},{name:"Chris", age:25}])

// There can also be db.persons.indert() but this practice is not recommended


//Working with the Ordered Inserts

db.hobbies.insertMany([{_id:"Sports",name:"Sports"},{_id:"cooking",name:"Cooking"},{_id:"cars",name:"Cars"}])

//The beloww statement on ordered:false will let the new item get into the database  even if it face error in the the first comming document
db.hobbies.insertMany([{ _id: "Yoga", name: "Yoga" }, { _id: "cooking", name: "Cooking" }, { _id: "hiking", name: "Hiking" }],{ordered:false})


//WRITE CONCERN
//{w:1,j:undefined or true,wtimeout:200}
// Here j means journal where the server will write the task before actually writting gon the disk. If the servers stops suddenly then the data can be written into the disk from the journal which increase more security
// w:1 will acknowledge that the data is written in the disk it `s value can be zero as well where it doesnot acknowledge
// wtimeout will wait till the mili secons specidied to write the data from server

db.persons.insertOne({name:"Alex", age:36},{writeConcern:{w:1, j:true}})
db.persons.insertOne({name:"maya", age:39},{writeConcern:{w:1, j:true,wtimeout:200}})


//Mongodb support automicity on document level. Strictly on document level

// SORTING IN MONGODB AND PROJECTION 1 is ascending and -1 is descending
db.movies.find({"rating.average":{$ne:null}},{"rating.average":1, _id:1, name:1}).sort({"rating.average":-1, name:1})

db.movies.find({"rating.average":{$ne:null}},{"rating.average":1, _id:1, name:1}).sort({"rating.average":-1, name:1}).skip(20).limit(10)
// SOrt SKIP LIMIT 

db.movies.find({genres:"Drama"},{"genres.$":1})// Give the first matching element during the projection genres.$

db.movies.find({genres:"Drama"},{genres:{$elemMatch:{$eq:"Horror"}}}) // Can be useful.. just try hitting it it will give the item specified as projection Condition


// SLice in projection can be helpful

db.movies.find({},{name:1, genres:{$slice:2}}).limit(10)// This query will prject the first two value of genres
db.movies.find({},{name:1, genres:{$slice:[1,2]}}).limit(10)// This query will project the seconf and thirs value from genres skipping first value 