
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
  var playerRef = null;
  
  var playerId = 0;
  var playerName = null;

  var isPlayerJoined_1 = false;
  var isPlayerJoined_2 = false;

  var player_choice_1 = null;
  var player_choice_2 = null;

  var player_name_1 = null;
  var player_name_2 = null;

  // possible values: p1, p2, waiting
  // var playerStatus = "waiting";

  turnRef.on('value', function(snapshot){
    // console.log("turn", snapshot.key, snapshot.val());
    
    var id = parseInt(snapshot.val());
    var otherId = (id === 1) ? 2 : 1;

    if(id === 1){
      $("#result").empty();
      $("#player-2-options").empty();
    }

    var currentPlayer = "#player-" + id;
    var otherPlayer = "#player-" + otherId;
  
    if(null !== id){
      $(otherPlayer).removeClass("currentTurn");
      $(currentPlayer).addClass("currentTurn");
      if(id === playerId){
        showOptions();
      }
    }
  });

  playersRef.once("value", function(snapshot) {
    console.log("on value");
  });


  playersRef.on("child_changed", function(childSnapshot, prevChildKey){
    
    console.log("on child changed", childSnapshot.key);
    var childId = parseInt(childSnapshot.key);

    if(childId === 1){
      player_choice_1 = childSnapshot.val().choice;
      player_name_1 = childSnapshot.val().name;
    }

    else if (childId === 2){
      player_choice_2 = childSnapshot.val().choice;
      player_name_2 = childSnapshot.val().name;
       
       if(player_choice_1 && player_choice_2)
       {
          console.log("choices....." ,player_choice_1, player_choice_2);
          
          $("#player-1-options").text(player_choice_1);
          $("#player-2-options").text(player_choice_2);

          var result = rockPaperScissors();
          var message = null;

          if(result === 1){
             message = player_name_1 + " Wins!";
          }
          else if(result === 2){
            message = player_name_2 + " Wins!"; 
          }
          else if(result === "tie"){
            message = "Tie Game!";
          }

          $("#result").text(message);
       }
    }

  });


  function rockPaperScissors(){
    // 1, 2, tie
    var result = null;

    if(player_choice_1 === player_choice_2){
      result = "tie";
    }
    else if(player_choice_1 === "rock"  && player_choice_2 === "paper"){
      result = 2;
    }
    else if(player_choice_1 === "rock"  && player_choice_2 === "scissors"){
      result = 1;
    }
    else if(player_choice_1 === "paper"  && player_choice_2 === "rock"){
      result = 1;
    }
    else if(player_choice_1 === "paper"  && player_choice_2 === "scissors"){
      result = 2;
    }
    else if(player_choice_1 === "scissors"  && player_choice_2 === "rock"){
      result = 2;
    }
    else if(player_choice_1 === "scissors"  && player_choice_2 === "paper"){
      result = 1;
    }
    return result;
  }

  playersRef.on("child_removed", function(childSnapshot){
    
    var removedId = parseInt(childSnapshot.key);
    console.log("removed", removedId);

    turnRef.remove();
    
    if(removedId === 1){
      isPlayerJoined_1 = false;
    }
    else if(removedId === 2){
      isPlayerJoined_2 = false;
    }

    $("#player-" + removedId + "-waiting").show();
    $("#player-" + removedId + "-name").empty();
    $("#player-" + removedId + "-status").empty();

    $("#player-1-options").empty();
    $("#player-2-options").empty();

    $("#player-1").removeClass("currentTurn");
    $("#player-2").removeClass("currentTurn");

    if(playerId === 0){
      $("#login-wrapper").show();
      $("#message").hide();
    }

  });

  function showOptions(){
    // var div = $("<div>").attr("id", "options-wrapper");
    $("#player-" + playerId + "-options").empty();
    var rock = $("<p>").append($("<a>").attr("href", "#").text("rock").attr("data-option", "rock"));
    var paper = $("<p>").append($("<a>").attr("href", "#").text("paper").attr("data-option", "paper"));
    var scissors = $("<p>").append($("<a>").attr("href", "#").text("scissors").attr("data-option", "scissors"));
    $("#player-" + playerId + "-options").append(rock).append(paper).append(scissors);
  }

  function displayChoice(choice){
    $("#player-" + playerId + "-options").empty();
    var selectedOption = $("<p>").append($("<a>").attr("href", "#").text(choice).attr("data-option", choice));
    $("#player-" + playerId + "-options").append(selectedOption);
  }

  playersRef.on("child_added", function(childSnapShot) {
    console.log(childSnapShot.key);

    var childPlayerId = parseInt(childSnapShot.key);

    if( childPlayerId === 1){
      isPlayerJoined_1 = true;

      if(childPlayerId === playerId){
        $("#login-wrapper").hide();

        $("#message").append($("<p>").text("Hi " + childSnapShot.val().name + " You are Player1"));
        $("#message").show();
      }
    }
    else if(parseInt(childPlayerId) === 2){
      isPlayerJoined_2 = true;

      if(childPlayerId === playerId){
        $("#login-wrapper").hide();

        $("#message").append($("<p>").text("Hi " + childSnapShot.val().name + " You are Player2"));
        $("#message").show();
      }
    }

    console.log("name", childSnapShot.val().name);

    $("#player-" + childPlayerId + "-name").text(childSnapShot.val().name);
    $("#player-" + childPlayerId + "-wins").text(childSnapShot.val().wins);
    $("#player-" + childPlayerId + "-losses").text(childSnapShot.val().losses);

    $("#player-"+ childPlayerId +"-wrapper").show();
    $("#player-"+ childPlayerId +"-waiting").hide();

    if(isPlayerJoined_1 && isPlayerJoined_2){
      if(playerId === 0){
        $("#players").hide();
        // not an active player
        //TODO: disable login and show error message
      }
      else{
        rootRef.update({
          turn: 1
        });
      }  
    }
   });

  $("#player-1-options").on("click", "p a", function(){
    // $("#player-1").removeClass("currentTurn");
    var pchoice = $(this).attr("data-option");
    if(playerId === 1){

      playerRef.update({
        choice: pchoice
      });


      displayChoice(pchoice);
      console.log("player-1", pchoice);
      rootRef.update({
        turn: 2
      });
    }

  });

  $("#player-2-options").on('click', 'p a', function(){
    // $("#player-2").removeClass("currentTurn");
    var pchoice = $(this).attr("data-option");
    if(playerId === 2){

      playerRef.update({
        choice: pchoice
      });

      displayChoice(pchoice);
      console.log("player-2", pchoice);

      //display both choices on both browsers


      //display result on both browsers

      // call it on set timeout
      setTimeout(nextGame, 5000);
    }
  });


  function nextGame(){
    rootRef.update({
      turn: 1
    });
  }

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

      playerRef = playersRef.child(playerId);
      var newPostKey = playerRef.push().key;
      console.log("newPostKey", newPostKey);
      playerRef.update({
        name: playerName, 
        losses: 0,
        wins: 0
      });

      // playerRef.on("child_changed", function(childSnapshot, prevChildKey){
      //     console.log("on child changed", childSnapshot.key, prevChildKey );
      // });

      playerRef.onDisconnect().remove();
    }

  });

// });

