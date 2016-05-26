$(() =>{ //jquery ready function.
  console.log("DOM READY!");

//ok so first I went onto firebase and made a new project. then I can add the name of the super-object (in this case task.json) to the end of the URL. 
const API_URL = "https://crud-nss-5-26-class-exercise.firebaseio.com/task.json"

//the same as: $.ready(function() {
// console.log("DOM READY!");
// })


  //CREATE: form submit event to POST data to firebase. 
   $.get(API_URL)
      .done((data) => {
        console.log(data);
        //if the object doesn't exist, firebase will return null. ONE WAY:
        //if (data===null) {
          //return //get out of the function and stop. 
        //}
        //ANOTHER WAY: 
        if (data) {
          //append the data to the page. 
          Object.keys(data).forEach((key)=>{
            addItemToTable(data[key]);
          //other option: for (key in data) {
          //  addItemToTable(data[key])
          //  }
          })
        };
   })

  $("form").submit(()=> {
    //by default, .post sends a form, which firebase doesn't like. We used json.stringify to make it work. ONE OPTION: 
    //$.post(API_URL, JSON.stringify({"task": "I was posted!"}))
    //ANOTHER OPTION:  
    $.ajax({ //settings object
      url: API_URL, 
      method: 'POST',
      data: JSON.stringify({task: "WUT"})
    })
    //TODO: make this not refresh the page. 
    //TODO: grab the form text. 
  })
});//end of jquery ready function at top.


//READ: GET data from firebase and display in table.

//EDIT: click event on complete to send PUT/PATCH to firebase

//DELETE: click event on delete to send  DELETE to firebase

function addItemToTable (item) {
  const row =`<tr>
    <td>${item.task}</td>
    <td>
      <button class = "btn btn-success">Complete</button>
      <button class="btn btn-danger">Delete</button>
    </td>
  </tr>`
  $('tbody').append(row)
}
