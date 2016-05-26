$(() =>{
  console.log("DOM READY!");
})
//ok so first I went onto 
const API_URL = "https://crud-nss-5-26-class-exercise.firebaseio.com/task.json"

//the same as: $.ready(function() {
// console.log("DOM READY!");
// })


//CREATE: form submit event to POST data to firebase. 
 $.get(API_URL)
    .done((data) => {
      console.log(data);
      //append the data to the page. 
      Object.keys(data).forEach((key)=>{
        addItemToTable(data[key]);
      //other option: for (key in data) {
      //  addItemToTable(data[key])
      //  }
  })
 })


    
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
