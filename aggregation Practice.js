db.persons.aggregate([
  { $match: { "dob.age": { $gt: 50 } } },
  { $group: { _id: { gender: "$gender" }, averageAge: { $avg: "$dob.age" } } },
  { $sort: { averageAge: 1 } },
]);

// generating first name and last name through aggregation paipeline

db.persons.aggregate([
  {
    $project: {
      gender: 1,
      id: 1,
      name: { $concat: ["$name.first", " ", "$name.last"] },
    },
  },
]);

//generating first Name and Last Name Through Aggregation Pipeline and generating First Word of both names in Capital letters

db.persons.aggregate([
  {
    $project: {
      _id: 1,
      gender: 1,
      name: {
        $concat: [
          { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
          {
            $substrCP: [
              "$name.first",
              1,
              { $subtract: [{ $strLenCP: ["$name.first"] }, 1] },
            ],
          },
          " ",

          { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
          {
            $substrCP: [
              "$name.last",
              1,
              { $subtract: [{ $strLenCP: ["$name.last"] }, 1] },
            ],
          },
        ],
      },
    },
  },
]);

// Convering string longitude and latittude and saving it as a geo Json data,

db.persons.aggregate([
  {
    $project: {
      gender: 1,
      _id: 1,
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onNull: 0.0,
              onError: 0.0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onNull: 0.0,
              onError: 0.0,
            },
          },
        ],
      },
    },
  },
]);

//Getting age and BirthDate as a seperate Element and converting their types.

db.persons.aggregate([
  {
    $project: {
      _id: 1,
      gender: 1,
      birthDate: { $toDate: "$dob.date" },
      age: "$dob.age",
    },
  },
]);

// Getting birthYear and generating total number of person borned that year.

db.persons.aggregate([
  { $project: { _id: 1, gender: 1, BirthYear: { $toDate: "$dob.date" } } },
  {
    $project: {
      _id: 1,
      Year: { $isoWeekYear: "$BirthYear" },
      numberOfPersons: { $sum: 1 },
    },
  },
  { $group: { _id: { Year: "$Year" }, numOfPersons: { $sum: 1 } } },
  { $sort: { numOfPersons: -1 } },
]);

// Getting all the hobbies stored in Arrays  according to age .(use $push if the duplicate is fine but use $addToSet id the duplicate value is not acceptable)
db.data.aggregate([
  { $unwind: "$hobbies" },
  { $group: { _id: "$age", hobbies: { $addToSet: "$hobbies" } } },
]);

// Getting oly specific element from the arrays using $slice

db.data.aggregate([
  { $project: { _id: 1, examScore: { $slice: ["$examScores", -1, 2] } } },
]);

//Getting the size of an array
db.data.aggregate([
  { $project: { _id: 1, sizeOfExamScore: { $size: "$examScores" } } },
]);

// Fitering the exam scores greater than 60

db.data.aggregate([
  {
    $project: {
      _id: 1,
      examScores: {
        $filter: {
          input: "$examScores",
          as: "sc",
          cond: { $gt: ["$$sc.score", 60] },
        },
      },
    },
  },
]);

// Getting highest score stored inside an array.

db.data.aggregate([
  { $unwind: "$examScores" },
  { $group: { _id: "$_id", highestScore: { $max: "$examScores.score" } } },
  { $sort: { highestScore: -1 } },
]);

// Finding out average age by creating age group using bucket Method.

db.persons.aggregate([
  {
    $bucket: {
      groupBy: "$dob.age",
      boundaries: [20, 40, 60, 80, 100],
      output: {
        NumberOfPersons: { $sum: 1 },
        averageAge: { $avg: "$dob.age" },
      },
    },
  },
]);

//This will auto bucket looking at the data.
db.persons.aggregate([
  {
    $bucketAuto: {
      groupBy: "$dob.age",
      buckets: 5,
      output: {
        numberOfPersons: { $sum: 1 },
        averageAge: { $avg: "$dob.age" },
      },
    },
  },
]);

//Finding oldest and youngest person in database

db.persons.aggregate([
  {
    $project: {
      _id: 1,
      sample: "WholeDataBase",
      Birthdate: { $toDate: "$dob.date" },
    },
  },
  {
    $group: {
      _id: { sample: "$sample" },
      youngestpersons: { $max: "$Birthdate" },
      oldestPerson: { $min: "$Birthdate" },
    },
  },
]);
