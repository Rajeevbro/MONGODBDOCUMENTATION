// finding rating from the databse whose imdb is greater than 9.2
db.boxofficeData.find({ "meta.rating": { $gt: 9.2 } }).count();
//Using regex Operator
// It will find all the document which contain Armstrong in summary
db.movies.find({ summary: { $regex: /Armstrong/ } });

//complex And in mongodb which find meeting all the criteria

db.movies
  .find({
    $and: [
      { "rating.average": { $gt: 9.2 } },
      { language: "English" },
      { status: "Running" },
    ],
  })
  .count();

//Complex or
db.movies
  .find({
    $or: [
      { "rating.average": { $gt: 9.2 } },
      { language: "English" },
      { status: "Running" },
    ],
  })
  .count();

// not operator: Not operator eaither need regex /..../or document :{....}to work on

db.movies.find({ name: { $not: /Bitten/ } }).count();

// Query using And Operator bot also using not operator at the same time
db.movies.find({
  $and: [{ language: "Japanese" }, { status: { $not: /Running/ } }],
});

// $exists operator: It will check if the phone field exists on the document or not

db.users.find({ phone: { $exists: true } }).count();

// $type: Only find the document whose type is equal to number: other valu can be double, array
//but all of them most be enclose with ""

db.users.find({ totalAge: { $type: "number" } });

//IN DETAIL INFORMATION OF MONGODB

// It will give the movies whose name is The Last Ship here {name:"The Last Ship"} is the filter
db.movies.find({ name: "The Last Ship" });
//find will give all the document which will match the parameters byt  findone willl only give the first matching one

//Comparision Operators
//https://www.mongodb.com/docs/manual/reference/operator/query/ .  very helpfull link about operators. Work watching there all about the operators

// It will give the movies whose ratings are greater than 9//We are going into the embedded document
db.movies.find({ "rating.average": { $gt: 9 } });

//Comparision Operrators
db.movies.find({ runtime: { $in: [30, 40] } }); //Gives the runtime whose value is exactly 30 or 40// We use this to cheeck for multiple equlality
db.movies.find({ runtime: { $nin: [30, 40] } }); // Gives the runtime3 whose value is not exactly 30 or 40

//Logical operators

//The query below will give the result of average rating which are less than 5 and greater than 9.3
db.movies.find({
  $or: [{ "rating.average": { $gt: 9.3 } }, { "rating.average": { $lte: 5 } }],
});

db.movies.find({
  $and: [{ "rating.average": { $gt: 9.3 } }, { "rating.average": { $lte: 5 } }],
});

//Some others keywords to search are $nor

//If you need value from the same field we need $and

db.movies.find({ genres: "Drama", genres: "Comedy" });
db.movies.find({ genres: "Comedy" });
//The above two queys are equivalent as the javascript overide the first genres with second one

// We have to use and to justify this as given below

db.movies.find({ $and: [{ genres: "Comedy" }, { genres: "Drama" }] });

//$not

db.movies.find({ runtime: { $not: { $eq: 30 } } });

// This also can be written as

db.movies.find({ runtime: { $ne: 30 } });

// It gives Same result

// Element Operators($exist, $type)
db.users.find({ totalAge: { $exists: true, $ne: null } });
// The above mentioned query will find out if the totalAge element is present in the document or not and only provide the document which consist of the totaAge field
// and is not equal to null

db.users.find({ phone: { $type: ["string", "number"] } });
//The above query will give document whose phone number is string or number
db.users.find({ phone: { $type: "string" } }); // This is also fine and will give the document whose value is in string

// Evaluation Operators
//$regex
db.movies.find({ summary: { $regex: /Toronto/ } }).count();
//The above query will give the document which have the word Toronto in its summary field.// Nice for the searching text

// $expr
db.sales.find({ $expr: { $lt: ["$volume", "$target"] } });
// The above wuery wil;l return the document where value pf volume is less than value of target

db.sales.find({
  $expr: {
    $gt: [
      {
        $cond: {
          if: { $lt: ["$target", "$volume"] },
          then: { $add: ["$target", 20] },
          else: "$target",
        },
      },
      "$volume",
    ],
  },
});

// The above query will check if the target is greater than volume or not if it is not greater than volumen then 20 will be added and comparison will be made after that

// TO ACCESS THE DATA FROM ARRAY

db.users.find({ hobbies: { $size: 1 } }); // Find the data whose array size is exactly one based on given criteria or field

db.users.find({
  hobbies: { $elemMatch: { title: "Sports", frequency: { $gt: 2 } } },
});
// $elemMatch is very important to look inside the document which is inside the array. With #elemMatch we can just comapre the field value of one document of the array
