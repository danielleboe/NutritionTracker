const foodCalorieOutput = document.querySelector("#foodCalories");
const foodNameInput = document.querySelector("#foodItem");
const foodDateformInput = document.querySelector("#datepicker");
const submitFoodButton = document.querySelector("#submit-new-food");
const totalCalorieFood = document.getElementById("totalCalorieFood");

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".modal");
  M.Modal.init(elems);
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
      foodCalorieOutput.value = calories; // Display the calorie value in the field
    } else {
      foodCalorieOutput.value = "No data found"; // Handle case where no items are found
    }
  } catch (error) {
    console.error("Error fetching food data:", error);
    foodCalorieOutput.value = "Error fetching data"; // Display error message in the field
  }
}

function generateFoodId() {
  return crypto.randomUUID();
}

submitFoodButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await logFood();

  const foodCaloriesForm = foodCalorieOutput.value;
  const foodNameForm = foodNameInput.value;
  const foodDateForm = foodDateformInput.value;
  const singleFood = {
    foodDateForm: foodDateForm,
    foodNameForm: foodNameForm,
    foodCaloriesForm: foodCaloriesForm,
    dttm: new Date(),
    foodId: generateFoodId(),
  };

  let parentFood = JSON.parse(localStorage.getItem("parentFood")) || [];
  parentFood.push(singleFood);
  localStorage.setItem("parentFood", JSON.stringify(parentFood));

  updateTotalExerciseCalories();

  const formModal = document.getElementById("myModal");
  formModal.reset();
  const instance = M.Modal.getInstance(document.getElementById("foodModal"));
  instance.close();
  window.location.reload();
});

function updateTotalExerciseCalories() {
  const existingFood = JSON.parse(localStorage.getItem("parentFood")) || [];
  let totalCalories = 0;

  if (existingFood.length > 0) {
    for (let i = 0; i < existingFood.length; i++) {
      totalCalories += parseInt(existingFood[i].foodCaloriesForm, 10);
    }
  }

  console.log(`Total calories: ${totalCalories}`);
  totalCalorieFood.innerHTML = ""; // Clear previous total
  const totalCaloriesDiv = document.createElement("div");
  const totalCalorieLine = document.createElement("p");
  totalCalorieLine.innerText = `Total Calories Eaten: ${totalCalories}`;
  totalCaloriesDiv.appendChild(totalCalorieLine);
  totalCaloriesDiv.setAttribute("class", "row");
  totalCalorieFood.appendChild(totalCaloriesDiv);
}

// Initial call to display total calories when the page loads
updateTotalExerciseCalories();

// Existing code to display food records
const lastFood = JSON.parse(localStorage.getItem("parentFood")) || [];

// Sort reverse chronological order
const sortResult = lastFood.sort((a, b) => new Date(b.dttm) - new Date(a.dttm));

const foodrecordContainer = document.getElementById("record-container");

for (const singleFood of lastFood) {
  const dateGroup = document.createElement("div");
  const foodLine = document.createElement("div");
  const foodRow = document.createElement("div");
  const foodRecord = document.createElement("div");
  const calorieRecord = document.createElement("div");
  const deleteFood = document.createElement("div");

  foodRecord.textContent = singleFood.foodNameForm;
  calorieRecord.textContent = singleFood.foodCaloriesForm;
  deleteFood.textContent = "×";

  foodrecordContainer.appendChild(dateGroup);
  dateGroup.appendChild(foodLine);
  foodLine.appendChild(foodRow);
  foodRow.appendChild(foodRecord);
  foodRow.appendChild(calorieRecord);
  foodRow.appendChild(deleteFood);

  foodRow.setAttribute("class", "row food-row");
  foodRecord.setAttribute("class", "col s6 food-record");
  calorieRecord.setAttribute("class", "col s5 calorie-record");
  deleteFood.setAttribute("class", "col s1 delete-record");
  deleteFood.setAttribute("id", `delete-${singleFood.foodId}`);
  deleteFood.setAttribute("onclick", "handleDeleteFood(event)");
}

function handleDeleteFood(event) {
  const deleteId = event.target.id.substring(7);
  let existingFood = JSON.parse(localStorage.getItem("parentFood"));
  const index = existingFood.findIndex((task) => task.foodId === deleteId);

  existingFood.splice(index, 1);

  localStorage.setItem("parentFood", JSON.stringify(existingFood));
  updateTotalExerciseCalories(); // Update total calories after deletion
  window.location.reload();
}
