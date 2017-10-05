
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
  
  var playerId = 0;
  var playerName = null;

  var isPlayerJoined_1 = false;
  var isPlayerJoined_2 = false;

  playersRef.once("value", function(snapshot) {

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

