const exerciseCalorieOutput = document.querySelector("#foodCalories");
const foodNameInput = document.querySelector("#foodItem");
const foodDateformInput = document.querySelector("#datepicker");
const submitFoodButton = document.querySelector("#submit-new-food");
const totalCalorieFood = document.getElementById("totalCalorieFood");

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".modal");
  const instances = M.Modal.init(elems);
});

$(function () {
  $("#datepicker").datepicker();
});

async function logFood() {
  try {
    const response = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${foodNameInput.value}`,
      {
        headers: {
          "X-Api-Key": "9ePZmGAr8Wxnfhl6F0/QLA==2j6IlOhiwEg4GjEk",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    if (data.items && data.items.length > 0) {
      const calories = data.items[0].calories; // Assuming calories are in the first item
      exerciseCalorieOutput.value = calories; // Display the calorie value in the field
    } else {
      exerciseCalorieOutput.value = "No data found"; // Handle case where no items are found
    }
  } catch (error) {
    console.error("Error fetching food data:", error);
    exerciseCalorieOutput.value = "Error fetching data"; // Display error message in the field
  }
}

function generateFoodId() {
  let myuuid = crypto.randomUUID();
  console.log(myuuid);
  return myuuid;
}

submitFoodButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await logFood();
  // });

  // submitFoodButton.addEventListener("click", function(event) {
  //   event.preventDefault();

  const foodCaloriesForm = exerciseCalorieOutput.value;
  const foodNameForm = foodNameInput.value;
  const foodDateForm = foodDateformInput.value;
  const singleFood = {
    foodDateForm: foodDateForm,
    foodNameForm: foodNameForm,
    foodCaloriesForm: foodCaloriesForm,
    dttm: new Date(),
    foodId: generateFoodId(),
  };
  let parentFood = [];
  let existingFood = JSON.parse(localStorage.getItem("parentFood"));
  console.log(`existingFood1: ${existingFood}`);

  if (existingFood !== null) {
    parentFood = existingFood;
  }

  parentFood.push(singleFood);
  localStorage.setItem("parentFood", JSON.stringify(parentFood));

  // total calories

  existingFood = JSON.parse(localStorage.getItem("parentFood"));
  console.log(`parentfood: ${parentFood}`);
  console.log(
    `existingFood: ${
      existingFood ? existingFood[0].foodDateForm : "No existing food"
    }`
  );
  let totalCalories = 0;

  if (existingFood && existingFood.length > 0) {
    for (let i = 0; i < existingFood.length; i++) {
      totalCalories += parseInt(existingFood[i].foodCaloriesForm, 10);
    }
    // console.log(`existingfood+caloriesform ${typeof parseInt(existingFood[i].foodCaloriesForm)}`);
  }
  console.log(`total calories ${totalCalories}`);
  const totalCaloriesDiv = document.createElement("div");
  const totalCalorieLine = document.createElement("p");
  totalCalorieLine.innerText = totalCalories;
  totalCaloriesDiv.appendChild(totalCalorieLine);
  totalCalorieFood.appendChild(totalCaloriesDiv);
  totalCaloriesDiv.setAttribute("class", "row");

  const formModal = document.getElementById("myModal");
  formModal.reset();
  const instance = M.Modal.getInstance(document.getElementById("foodModal"));
  instance.close();
  window.location.reload();
});

const lastFood = JSON.parse(localStorage.getItem("parentFood")) || [];

// sort reverse chronological order
const sortResult = lastFood.sort(function (a, b) {
  return new Date(b.dttm) - new Date(a.dttm);
});

// const totalCalorieFood = document.getElementById("totalCalorieFood");
const foodrecordContainer = document.getElementById("record-container");
const foodLineRow = document.getElementById("food-container");
// const dateGroup = document.querySelector(".date-group");
// const foodLine = document.querySelector(".foodLines");

for (const singleFood of lastFood) {
  const dateGroup = document.createElement("div");
  const foodLine = document.createElement("div");
  const foodRow = document.createElement("div");
  const foodRecord = document.createElement("div");
  const calorieRecord = document.createElement("div");
  // const foodDate = document.createElement("div");
  const deleteFood = document.createElement("div");
  const foodTotalRow = document.createElement("div");
  foodRecord.textContent = singleFood.foodNameForm;
  calorieRecord.textContent = singleFood.foodCaloriesForm;
  // foodDateForm.textContent = singleFood.foodDateForm;
  deleteFood.textContent = `×`;

  // totalCalorieFood.appendChild(foodTotalRow);
  foodrecordContainer.appendChild(dateGroup);
  dateGroup.appendChild(foodLine);
  foodLine.appendChild(foodRow);
  foodRow.appendChild(foodRecord);
  foodRow.appendChild(calorieRecord);
  foodRow.appendChild(deleteFood);

  foodRow.setAttribute("class", "row food-row");
  foodRecord.setAttribute("class", "col s6 food-record");
  calorieRecord.setAttribute("class", "col s5 calorie-record");
  foodTotalRow.setAttribute("class", "row foodTotalRow");
  deleteFood.setAttribute("class", "col s1 delete-record");
  deleteFood.setAttribute("id", `delete-${singleFood.foodId}`);
  deleteFood.setAttribute("onclick", "handleDeleteFood(event)");
}
// Todo: create a function to handle deleting a food row
function handleDeleteFood(event) {
  const deleteId = event.target.id.substring(7);
  const existingFood = JSON.parse(localStorage.getItem("parentFood"));
  const index = existingFood.findIndex(function (task) {
    return task.foodId === deleteId;
  });

  existingFood.splice(index, 1);

  localStorage.setItem("parentFood", JSON.stringify(existingFood));
  window.location.reload();
}
