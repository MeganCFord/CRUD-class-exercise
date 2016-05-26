$(() =>{ //jquery ready function.
  console.log("DOM READY!");
//the same as: $.ready(function() {
// console.log("DOM READY!");
// })

//ok so first I went onto firebase and made a new project. then I can add the name of the super-object (in this case task) to the end of the URL. took the .json out, since I needed to add ID's to the end of this URL for the individual complete/delete buttons. 

const API_URL = "https://crud-nss-5-26-class-exercise.firebaseio.com/task"



//READ: GET data from firebase and display in table.
   $.get(`${API_URL}.json`)
      .done((data) => {
        console.log("data gotten from getter", data);
        //if the object doesn't exist, firebase will return null. ONE WAY:
        //if (data===null) {
          //return //get out of the function and stop. 
        //}
        //ANOTHER WAY: 
        if (data) {
          //append the data to the page. 
          Object.keys(data).forEach((id)=>{
            addItemToTable(data[id], id); //note I'm passing in the ID here so I can grab the individual message later. 
          //other option: for (key in data) {
          //  addItemToTable(data[key])
          //  }
          })
        };
      //TODO: handle completed tasks. 
   })


 //CREATE: form submit event to POST data to firebase. 
  $("form").submit(()=> {
    //by default, .post sends a form, which firebase doesn't like. We used json.stringify to make it work. ONE OPTION: 
    //$.post(`${API_URL}.json`, JSON.stringify({"task": "I was posted!"}))
    
    //ANOTHER OPTION:  
    $.ajax({ //settings object
      url: `${API_URL}.json`, 
      method: 'POST',
      data: JSON.stringify({task: "WUT"})
    })
    //TODO: make this not refresh the page but still update the dom?  
    //TODO: grab the form text. 
  })



//DELETE: click event on delete to send  DELETE to firebase
$('tbody').on('click', ".delete", (e) =>{
  const row = $(e.target).closest('tr'); 
  const id = row.data('id')
  //debugger //we put a debugger here to check what the ID is. 
  $.ajax({
    url: `${API_URL}/${id}.json`,
    method: 'DELETE'
  }).done(() => {
    row.remove();
  })
})



//EDIT: click event on complete to send PUT/PATCH to firebase


function addItemToTable (item, id) {
    //best way to store the individual ID of the object from firebase (so you can edit or delete it later) will be in the HTML. use 'data' in the HTML to store the ID. start with data- . note that the ID is one level up from the main data object. make it second so if it doesn't have one (for some insane reason), the item will still show up. 
  const row =`<tr data-id= ${id}>
    <td>${item.task}</td>
    <td>
      <button class = "btn btn-success complete">Complete</button>
      <button class="btn btn-danger delete">Delete</button>
    </td>
  </tr>`
  $('tbody').append(row)
}

});//end of jquery ready function at top.
