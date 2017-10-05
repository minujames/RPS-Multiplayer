
// $(document).ready(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyChTAaVQWE03rCXZRYfFVV5MP5VAJKfQyM",
    authDomain: "first-project-c4617.firebaseapp.com",
    databaseURL: "https://first-project-c4617.firebaseio.com",
    projectId: "first-project-c4617",
    storageBucket: "first-project-c4617.appspot.com",
    messagingSenderId: "669063937710"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var playersRef = database.ref("/players");
  var rootRef = database.ref();
  var turnRef = database.ref("/turn");
  
  var playerId = 0;
  var playerName = null;

  var isPlayerJoined_1 = false;
  var isPlayerJoined_2 = false;

  turnRef.on('value', function(snapshot){
    console.log("turn", snapshot.key, snapshot.val());
    var id = snapshot.val();
    var currentId = "#player-" + id;
    if(null !== id){
      $(currentId).addClass("currentTurn");
    }
  });

  playersRef.once("value", function(snapshot) {
    console.log("on value");
  });

  playersRef.on("child_changed", function(childSnapshot){
    console.log("on child changed");
  });

  playersRef.on("child_removed", function(childSnapshot){
    
    turnRef.remove();
    var removedId = childSnapShot.key;
    console.log("removed", removedId);


  });

  playersRef.on("child_added", function(childSnapShot) {
    console.log(childSnapShot.key);

    var plyrId = childSnapShot.key;

    if(parseInt(plyrId) === 1){
      isPlayerJoined_1 = true;
    }
    else if(parseInt(plyrId) === 2){
      isPlayerJoined_2 = true;
    }

    console.log("name", childSnapShot.val().name); 
    
    $("#player-" + plyrId + "-name").text(childSnapShot.val().name);
    $("#player-" + plyrId + "-wins").text(childSnapShot.val().wins);
    $("#player-" + plyrId + "-losses").text(childSnapShot.val().losses);

    $("#player-"+ plyrId +"-wrapper").show();
    $("#player-"+ plyrId +"-waiting").hide();

    if(isPlayerJoined_1 && isPlayerJoined_2){
      rootRef.update({
        turn: 1
      });
    }
   });

  $("#player-1-options").on("click", "p a", function(){
    $("#player-1").removeClass("currentTurn");
    var choice = $(this).attr("data-option");
    console.log("player-1", choice);
    rootRef.update({
        turn: 2
      });

  });

  $("#player-2-options").on('click', 'p a', function(){
    $("#player-2").removeClass("currentTurn");
    var choice = $(this).attr("data-option");
    console.log("player-2", choice);
    rootRef.update({
        turn: 1
      });
  });
    
  $("#start-btn").click(function(){
    playerName = $("#name").val();
    $("#name").val('');
    console.log(playerName);

    console.log("joined status", isPlayerJoined_1, isPlayerJoined_2);

    if(!isPlayerJoined_1 && !isPlayerJoined_2){
      playerId = 1;
    }
    else {
      playerId = (isPlayerJoined_1 === true ) ? 2 : 1;
    }

    console.log(playerId, playerName);

    if(playerId){

      var playerRef = playersRef.child(playerId);
      var newPostKey = playerRef.push().key;
      console.log("newPostKey", newPostKey);
      playerRef.update({
        name: playerName, 
        losses: 0,
        wins: 0
      });

      playerRef.onDisconnect().remove();
    }

  });

// });

