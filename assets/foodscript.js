const foodCalorieOutput = document.querySelector("#foodCalories");
const foodNameInput = document.querySelector("#foodItem");
const foodDateformInput = document.querySelector("#datepicker");
const submitFoodButton = document.querySelector("#submit-new-food");
const totalCalorieFood = document.getElementById("totalCalorieFood");
const dailyFoodRecords = document.getElementById("daily-food-records");
const msgDiv = document.querySelector("#msg");
const dateSelectorInput = document.getElementById("date-select");

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

function displayMessage(type, message) {
  msgDiv.textContent = message;
  msgDiv.setAttribute("class", type);
}

submitFoodButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await logFood();
  const foodNameForm = foodNameInput.value;
  const foodDateForm = foodDateformInput.value;
  const foodCaloriesForm = foodCalorieOutput.value;

  let isError = false;

  if (foodNameForm.trim() === "" || !foodNameForm) {
    console.log("foodNameForm+++++", foodNameForm);
    displayMessage("error", "Food cannot be blank");
    isError = true;
  } else if (foodDateForm.trim() === "" || !foodDateForm) {
    displayMessage("error", "Date cannot be blank");
    isError = true;
  } else {
    displayMessage("success", "Submitted successfully");
  }
  if (!isError) {
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

    updateTotalFoodCalories();

    const formModal = document.getElementById("myModal");
    formModal.reset();
    const instance = M.Modal.getInstance(document.getElementById("foodModal"));
    instance.close();
    window.location.reload();
  }
});

// Date Selection Start
document.getElementById("date-select").addEventListener("change", dateSelect);
function dateSelect() {
  while (foodRecordContainer.firstChild) {
    foodRecordContainer.removeChild(foodRecordContainer.firstChild);
  }
  const dateSelector = dateSelectorInput.value;
  console.log(`dateSelector: ${dateSelector}`);
  const lastFood = JSON.parse(localStorage.getItem("parentFood")) || [];
  const dateFilter = lastFood.filter((lastFoodDate) => {
    const foodDate = dayjs(lastFoodDate.foodDateForm, "MMM DD,YYYY");
    const dateFormatChange = dayjs(foodDate).format("YYYY-MM-DD");
    console.log(`dateformatchange ${dateFormatChange}`);
    console.log(`foodformdateformat ${foodDate}`);
    console.log(
      `lastfooddate ${lastFoodDate.foodDateForm}`,
      `dateselector ${dateSelector}`
    );
    return dateFormatChange === dateSelector;
  });

  // Sort reverse chronological order
  const sortResult = dateFilter.sort(
    (a, b) => new Date(b.dttm) - new Date(a.dttm)
  );

  console.log(`datefilter`, dateFilter);

  for (const singleFood of sortResult) {
    const dateGroup = document.createElement("div");
    const foodLine = document.createElement("div");
    const foodRow = document.createElement("div");
    const foodRecord = document.createElement("div");
    const calorieRecord = document.createElement("div");
    const deleteFood = document.createElement("a");

    foodRecord.textContent = singleFood.foodNameForm;
    calorieRecord.textContent = singleFood.foodCaloriesForm;
    deleteFood.textContent = "×";

    foodRecordContainer.appendChild(dateGroup);
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
  
  updateTotalFoodCalories();
};
// Date Selection End


function updateTotalFoodCalories() {
  const existingFood = JSON.parse(localStorage.getItem("parentFood")) || [];
  const dateSelector = dateSelectorInput.value;
  console.log(`dateSelector2: ${dateSelector}`);
  const dateFilter = existingFood.filter((lastFoodDate) => {
    const foodDate = dayjs(lastFoodDate.foodDateForm, "MMM DD,YYYY");
    const dateFormatChange = dayjs(foodDate).format("YYYY-MM-DD");
    console.log(`dateformatchange2 ${dateFormatChange}`);
    console.log(`foodformdateformat2 ${foodDate}`);
    console.log(
      `lastfooddate2 ${lastFoodDate.foodDateForm}`,
      `dateselector2 ${dateSelector}`
    );
    return dateFormatChange === dateSelector;
  });


  let totalCalories = 0;

  if (dateFilter.length > 0) {
    for (let i = 0; i < dateFilter.length; i++) {
      totalCalories += parseInt(dateFilter[i].foodCaloriesForm, 10);
    }
  }

  console.log(`Total food calories: ${totalCalories}`);
  totalCalorieFood.innerHTML = ""; // Clear previous total
  const totalCaloriesDiv = document.createElement("div");
  const totalCalorieLine = document.createElement("h6");
  totalCalorieLine.innerText = `Total Calories Eaten: ${totalCalories}`;
  totalCaloriesDiv.appendChild(totalCalorieLine);
  totalCaloriesDiv.setAttribute("class", "row");
  totalCalorieFood.appendChild(totalCaloriesDiv);

  const totalFoodCalories =
    JSON.parse(localStorage.getItem("05/29/2024")) || {};
  totalFoodCalories.totalCalories = totalCalories;
  console.log(`totalfoodcalories ${totalFoodCalories}`);
  localStorage.setItem("05/29/2024", JSON.stringify(totalFoodCalories));

  const totalNetCalories =
    totalFoodCalories.totalCalories - totalFoodCalories.totalExerciseCalories;
  console.log(`total net calories: ${totalNetCalories}`);
};

// Call updateTotalFoodCalories to update total calories and get the value
updateTotalFoodCalories();

// Existing code to display food records
const lastFood = JSON.parse(localStorage.getItem("parentFood")) || [];

const foodRecordContainer = document.getElementById("daily-food-records");

function handleDeleteFood(event) {
  const deleteId = event.target.id.substring(7);
  let existingFood = JSON.parse(localStorage.getItem("parentFood"));
  const index = existingFood.findIndex((task) => task.foodId === deleteId);

  existingFood.splice(index, 1);

  localStorage.setItem("parentFood", JSON.stringify(existingFood));
  updateTotalFoodCalories(); // Update total calories after deletion
  window.location.reload();
}
