// Initialize Firebase
var config = {
    apiKey: "AIzaSyCSqwDLElNOKcKmD0u6rUygG0Bkv9Yb7Ws",
    authDomain: "train-schedule-327c1.firebaseapp.com",
    databaseURL: "https://train-schedule-327c1.firebaseio.com",
    projectId: "train-schedule-327c1",
    storageBucket: "train-schedule-327c1.appspot.com",
    messagingSenderId: "603948262742"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-time-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  var newTrain = {
    name: trainName,
    dest: destination,
    first: firstTrain,
    freq: frequency
  };

  database.ref().push(newTrain);

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {

var trainName = childSnapshot.val().name;
var destination = childSnapshot.val().dest;
var firstTrain = childSnapshot.val().first;
var frequency = childSnapshot.val().freq;


console.log(trainName);
console.log(destination);
console.log(firstTrain);
console.log(frequency);


    // Moment JS
    var timeHour = moment().format('H');
    var timeMin = moment().format('m');
    var ftHour = moment(firstTrain, "HH:mm").format('H');
    var ftMin = moment(firstTrain, "HH:mm").format('m');

    var ftMoment = (ftHour * 60) + (ftMin * 1);
    var timeMoment = (timeHour * 60) + (timeMin * 1);

  // Find how much time has passed since the first train
    var diff = timeMoment - ftMoment;

  // Find how many trains have come so far
    var trainsSinceFirst = Math.floor(diff/frequency);

  // Find how long until the next train comes
    var nextArrival = ((trainsSinceFirst + 1) * frequency) + ftMoment;
    
  // Handle negative values for minAway and nextArrival
    if (ftMoment < timeMoment) {
      var minAway = nextArrival - timeMoment;
      var nextArrival = moment().add(minAway, 'minutes').format('HH:mm');
    } 
    else {
      var nextArrival = firstTrain;
      var minAway = ftMoment - timeMoment;
    };

  // Appends new information to table
  $("#train-table").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");

      }, function (errorObject) {
          console.log('The read failed' + errorObject.code);

    }); 



