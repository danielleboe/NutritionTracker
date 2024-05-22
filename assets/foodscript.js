const calorieOutput = document.querySelector("#foodCalories");
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
  

  // async function logFood() {
  //  const foodData = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${foodNameInput.value}`, {
  //   headers: {
  //       "X-Api-Key": "9ePZmGAr8Wxnfhl6F0/QLA==2j6IlOhiwEg4GjEk"
  //  }

  // });
  //   const json = await foodData.json();
  //   console.log(json);
  // };


  async function logFood() {
    try {
      const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${foodNameInput.value}`, {
        headers: {
          "X-Api-Key": "9ePZmGAr8Wxnfhl6F0/QLA==2j6IlOhiwEg4GjEk"
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
  
      if (data.items && data.items.length > 0) {
        const calories = data.items[0].calories; // Assuming calories are in the first item
        calorieOutput.value = calories; // Display the calorie value in the field
      } else {
        calorieOutput.value = "No data found"; // Handle case where no items are found
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
      calorieOutput.value = "Error fetching data"; // Display error message in the field
    }
  }
  
  // Example usage: call logFood function when form is submitted or a button is clicked
  const submitFoodButton = document.querySelector("#submit-new-food");
  submitFoodButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await logFood();
  });

  
  // foodCaloriesInput


  // items.calories

  function generateFoodId() {
    let myuuid = crypto.randomUUID();
    console.log(myuuid);
    return myuuid;
  }
  
  submitFood.addEventListener("click", function(event) {
    event.preventDefault();
  
    const foodCaloriesForm = calorieOutput.value;
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
const totalCalorieFood = document.getElementById("totalCalorieFood");
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
  const foodTotalRow = document.createElement ("div");
  foodRecord.textContent = singleFood.foodNameForm;
  calorieRecord.textContent = singleFood.foodCaloriesForm;
  // foodDateForm.textContent = singleFood.foodDateForm;
  // deleteFood.textContent = `Delete`;

  // totalCalorieFood.appendChild(foodTotalRow);
  foodrecordContainer.appendChild(dateGroup);
  dateGroup.appendChild(foodLine);
  foodLine.appendChild(foodRow);
  foodRow.appendChild(foodRecord);
  foodRow.appendChild(calorieRecord);
  // foodRow.appendChild(deleteFood);

  foodRow.setAttribute("class", "row food-row");
  foodRecord.setAttribute("class", "col s6 m6 l6 food-record");
  calorieRecord.setAttribute("class", "col s6 m6 l6 calorie-record");
  foodTotalRow.setAttribute ("class","row foodTotalRow");


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





