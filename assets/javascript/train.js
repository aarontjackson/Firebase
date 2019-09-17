$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyC7dGEoPGRi_rc5UPMoQlAiP6CfUzCq5HA",
        authDomain: "traintracker-51d94.firebaseapp.com",
        databaseURL: "https://traintracker-51d94.firebaseio.com",
        projectId: "traintracker-51d94",
        storageBucket: "",
        messagingSenderId: "581480693445",
        appId: "1:581480693445:web:cb9bcfe04a16ce1a897aac"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the database service
    var database = firebase.database().ref();

    // Populate firebase database with initial data
    // Global Variables
    var trainName;
    var trainDestination;
    var trainFrequency;
    var firstTrain;
    // var trainNextArrival;
    // var trainMinutesAway;
    
    $("#current-time").append(moment().format("HH:mm A"));

    //Create on click event to capture form values and add ID of submit button

    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        // Captures user input
        trainName = $("#train-input").val().trim();
        trainDestination = $("#destination-input").val().trim();
        trainFrequency = $("#frequency-input").val().trim();
        firstTrain = moment($("#time-input").val().trim(), "HH:mm").format("X");

        // Adds user input to the log
        console.log(trainName);
        console.log(trainDestination);
        console.log(trainFrequency);
        console.log(firstTrain);


        // Pushes user input to the database as a temporary object
        database.ref().push({
            dbtrainName: trainName,
            dbtrainDestination: trainDestination,
            dbtrainFrequency: trainFrequency,
            dbfirstTrain: firstTrain
        })
        alert("train" + dbtrainName + "has been added");

        $("#train-input").val("");
        $("#destination-input").val("");
        $("#frequency-input").val("");
        $("#time-input").val("");
    });

    //create firebase event to retrieve trains form the database and a table row in the html wen a user adds an entry

    database.ref().on("child_added", function(snap) {
        console.log(snap.val());

        var tName = snap.val().dbtrainName;
        var tDestination = snap.val().dbtrainDestination;
        var tFrequency = snap.val().dbtrainFrequency;
        var tFirstTrain = snap.val().dbfirstTrain;


        //store everything into a variable

        //next arrival and mintues away calculations here
        //calculation to get remaining time before train arrival
        var firstTimeConverted = moment(tFirstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
       

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        //display results inside the table
        var tr = $("<tr>");


        //append all table data(td) to the table row (tr)
        tr.append(
            "<td>" + tName + "<td>",
            "<td>" + tDestination + "<td>",
            "<td>" + tFrequency + "<td>",
            "<td>" + nextTrain + "<td>",
            "<td>" + tMinutesTillTrain + "<td>"
        );
        //append to tbody element
        $("#train-table > tbody").append(tr)
    });
});

