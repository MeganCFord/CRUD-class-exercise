/*eslint-disable no-console */
/*global firebase:false*/


$(() =>{ //jquery ready function.
  // console.log("DOM READY!");
  //the same as: $.ready(function() {
  // console.log("DOM READY!");
  // })
  let token = null;
  const API_URL = `https://crud-nss-5-26-class-exercise.firebaseio.com/tasks`;
//ok so first I went onto firebase and made a new project. then I can add the name of the super-object (in this case task) to the end of the URL. took the ".json" off, since I needed to add ID's to the end of this URL for the individual complete/delete buttons. 

//we also had bower install firebase --save

//under your project on firebase.com, 'add firebase to your web app' and it will auto-generate this object for you.  this initialization is an asynchronous call and runs automatically so will take time.

  firebase.initializeApp({
    apiKey: "AIzaSyCzuVbza4DLN_2EoTcVKX6P142l7SGWLHA",
    authDomain: "crud-nss-5-26-class-exercise.firebaseapp.com",
    databaseURL: "https://crud-nss-5-26-class-exercise.firebaseio.com",
    storageBucket: "crud-nss-5-26-class-exercise.appspot.com"
  });

  // both return promise like objects
  const login = (email, password) => (
    firebase.auth()
      .signInWithEmailAndPassword(email, password)

  );

  const register = (user, password) => (
    firebase.auth().createUserWithEmailAndPassword(user, password)
  );

  $(".login form").submit((e) => {
    const form = $(e.target);
    const email = form.find('input[type="text"]').val();
    const password = form.find('input[type="password"]').val();

    login(email, password)
      .then(console.log)
      .catch(console.err);

    e.preventDefault();
  });

  $('input[value="Register"]').click((e) => {
    const form = $(e.target).closest("form");
    const email = form.find('input[type="text"]').val();
    const password = form.find('input[type="password"]').val();

    register(email, password)
      .then(() => login(email, password))
      .then(console.log)
      .catch(console.err);

    e.preventDefault();
  });
  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      token = user._lat;
      $(".login").hide();
      $(".app").show();
      loadTheThings();
    } else {
      $(".login").show();
      $(".app").hide();
      // logged out
    }
  });

  $(".logout").on("click", function() {
    firebase.auth().signOut();
    token=null;
  });

//READ: GET data from firebase and display in table. Runs at start. Could technically also run at submit button if I assigned it a name, but see below for instead.

  function loadTheThings () { 
    $("tbody").text("");
    $.get(`${API_URL}.json?auth=${token}`)
      .done((data) => {
        //if the object doesn't exist, firebase will return null. ONE WAY:
        //if (data===null) {
          //return //get out of the function and stop. 
        //}
        //ANOTHER WAY: 
        if (data) {
          //append the data to the page. 
          Object.keys(data).forEach((id)=>{
            addItemToTable(data[id], id); //note I'm passing in the ID here so I can grab the individual message later. 
            if (data[id].completed === true) {
              console.log("hey this one is completed", id );
              completeItem(id);
            }
          //other option: for (key in data) {
          //  addItemToTable(data[key])
          //  }
          }); //otherwise don't do anything. 'null' is falsy.
        }
      });
  }

 //CREATE: form submit event to POST data to firebase. Here I am NOT reloading the entire database object, although it can be- I'm simply running the dom object with the ID that's returned by the POST Jquery method. 
 
  $(".newTask").submit((e)=> {
    //submit buttons refresh pages. make it stop.
    e.preventDefault();
    // grab the form text. 
    const theText = $(".theTextBox").val();
    //by default, .post sends a form, which firebase doesn't like. We used json.stringify to make it work. ONE OPTION: 
    //$.post(`${API_URL}.json`, JSON.stringify({"task": "I was posted!"}))
    //ANOTHER OPTION:  
    $.ajax({ //settings object
      url: `${API_URL}.json?auth=${token}`, 
      method: "POST",
      data: JSON.stringify({task: `${theText}`}) //is going to be the text entered in the form. 
    }).done(() => { //the POST action returns the ID so if you put ID in this argument, you can use it for stuff.
      loadTheThings();
    });
    $(".theTextBox").val("");
  });



//DELETE: click event on delete to send DELETE to firebase
  $("tbody").on("click", ".delete", (e) =>{ //not here we couldn't use $(".delete").click() because at the time of page load there were no delete-classed items to attach to.
    const row = $(e.target).closest("tr"); 
    const id = row.data("id");
  //debugger //we put a debugger here to check what the ID is. 
    $.ajax({
      url: `${API_URL}/${id}.json?auth=${token}`,
      method: "DELETE"
    }).done(() => {
      row.remove();
    });
  });



//EDIT: click event on complete to send PUT/PATCH to firebase. PUT replaces the contents of the object. Patch adds the data to the assigned object.

  $("tbody").on("click", ".complete", (e) => {
    const row = $(e.target).closest("tr");
    const id = row.data("id");

    $.ajax({
      url:`${API_URL}/${id}.json?auth=${token}`,
      method: "PATCH",
      data: JSON.stringify({completed: true})
    });
    completeItem(id);
  }); 

  function completeItem (id) {
  
    const row = $("tbody").find(`tr[data-id = "${id}"]`);
    console.log("row", row );
    const textDiv = row.find($(".taskText"));
    console.log("task text", textDiv);
    const completeButtonToDisable = row.find($(".complete"));

    $(textDiv).addClass("completed");
    $(completeButtonToDisable).attr("disabled", "disabled");
  }

  function addItemToTable (text, id) {
    //best way to store the individual ID of the object from firebase (so you can edit or delete it later) will be in the HTML. use 'data' in the HTML to store the ID. start with data- . note that the ID is one level up from the main data object. make it second so if it doesn't have one (for some insane reason), the item will still show up. 
    const row =`<tr data-id = ${id}>
    <td class="taskText">${text.task}</td>
    <td>
      <button class = "btn btn-success complete">Complete</button>
      <button class="btn btn-danger delete">Delete</button>
    </td>
  </tr>`;
    $("tbody").append(row);
  }

});//end of jquery ready function at top.
