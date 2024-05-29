const foodCaloriesInput = document.querySelector("#foodCalories");
const foodNameInput = document.querySelector("#foodItem");
const foodDateformInput = document.querySelector("#datepicker");
const submitFood = document.querySelector("#myModal .btn");

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems);
  });
  
  $(function() {
    $("#datepicker").datepicker();
  });
  

  
  function generateFoodId() {
    let myuuid = crypto.randomUUID();
    console.log(myuuid);
    return myuuid;
  }
  
  submitFood.addEventListener("click", function(event) {
    event.preventDefault();
  
    const foodCaloriesForm = foodCaloriesInput.value;
    const foodNameForm = foodNameInput.value;
    const foodDateForm = foodDateformInput.value;
    const singleFood = {
      foodCaloriesForm: foodCaloriesForm,
      foodNameForm: foodNameForm,
      foodDateForm: foodDateForm,
      dttm: new Date(),
      foodId: generateFoodId()
    }
    let parentFood = [];
    const existingFood = JSON.parse(localStorage.getItem("parentFood"));
  
    if (existingFood !== null) {
      parentFood = existingFood;
    }
  
    parentFood.push(singleFood);
    localStorage.setItem("parentFood", JSON.stringify(parentFood));
  
    const formModal = document.getElementById("myModal");
    formModal.reset();
    const instance = M.Modal.getInstance(document.getElementById('foodModal'));
    instance.close();
    window.location.reload();
  });


  // old code

const lastFood = JSON.parse(localStorage.getItem("parentFood"));

// sort reverse chronological order
const sortResult = lastFood.sort(function (a, b) {
  return new Date(b.dttm) - new Date(a.dttm);
});

const foodrecordContainer = document.getElementById ("record-container");
// const dateGroup = document.querySelector(".date-group");
// const foodLine = document.querySelector(".foodLines");

for (const singleFood of lastFood) {
  const dateGroup = document.createElement("div");
  const foodLine = document.createElement("div");
  const foodRow = document.createElement("div");
  const foodRecord = document.createElement("div");
  const calorieRecord = document.createElement("div");
  // const foodDate = document.createElement("div");
  const deleteFood = document.createElement("a");
  foodRecord.textContent = singleFood.foodNameForm;
  calorieRecord.textContent = singleFood.foodCaloriesForm;
  // foodDateForm.textContent = singleFood.foodDateForm;
  // deleteFood.textContent = `Delete`;


  foodrecordContainer.appendChild(dateGroup);
  dateGroup.appendChild(foodLine);
  foodLine.appendChild(foodRow);
  foodRow.appendChild(foodRecord);
  foodRow.appendChild(calorieRecord);
  // foodRow.appendChild(deleteFood);

  food 
  foodRow.setAttribute("class", "row food-row");
  foodRecord.setAttribute("class", "col s6 m6 l6 food-record");
  calorieRecord.setAttribute("class", "col s6 m6 l6 calorie-record");


// Todo: create a function to handle deleting a food row
function handleDeleteFood(event) {
  const deleteId = event.target.id.substring(7);
  const existingFood = JSON.parse(localStorage.getItem("parentFood"));
  const index = existingFood.findIndex(function (task) {
    return task.taskId === deleteId;
  });

  existingFood.splice(index, 1);

  localStorage.setItem("parentFood", JSON.stringify(existingFood));
  window.location.reload();
}};