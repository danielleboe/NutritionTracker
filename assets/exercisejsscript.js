const exerciseCalorieOutput = document.querySelector("#exerciseCalories");
const exerciseNameInput = document.querySelector("#exerciseItem");
const exerciseDateformInput = document.querySelector("#datepicker");
const submitexerciseButton = document.querySelector("#submit-new-exercise");
const totalCalorieexercise = document.getElementById("totalCalorieexercise");

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".modal");
  M.Modal.init(elems);
});

$(function () {
  $("#datepicker").datepicker();
});

async function logExercise() {
  try {
    const response = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${exerciseNameInput.value}`,
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
    console.error("Error fetching exercise data:", error);
    exerciseCalorieOutput.value = "Error fetching data"; // Display error message in the field
  }
}

function generateExerciseId() {
  return crypto.randomUUID();
}

submitExerciseButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await logExercise();

  const exerciseCaloriesForm = exerciseCalorieOutput.value;
  const exerciseNameForm = exerciseNameInput.value;
  const exerciseDateForm = exerciseDateformInput.value;
  const singleExercise = {
    exerciseDateForm: exerciseDateForm,
    exerciseNameForm: exerciseNameForm,
    exerciseCaloriesForm: exerciseCaloriesForm,
    dttm: new Date(),
    exerciseId: generateExerciseId(),
  };

  let parentExercise = JSON.parse(localStorage.getItem("parentExercise")) || [];
  parentExercise.push(singleExercise);
  localStorage.setItem("parentExercise", JSON.stringify(parentExercise));

  updateTotalCalories();

  const formModal = document.getElementById("myModal");
  formModal.reset();
  const instance = M.Modal.getInstance(document.getElementById("exerciseModal"));
  instance.close();
  window.location.reload();s
});

function updateTotalCalories() {
  const existingExercise = JSON.parse(localStorage.getItem("parentExercise")) || [];
  let totalCalories = 0;

  if (existingExercise.length > 0) {
    for (let i = 0; i < existingExercise.length; i++) {
      totalCalories += parseInt(existingExercise[i].exerciseCaloriesForm, 10);
    }
  }

  console.log(`Total calories: ${totalCalories}`);
  totalCalorieexercise.innerHTML = ''; // Clear previous total

  const totalCaloriesDiv = document.createElement("div");
  const totalCalorieLine = document.createElement("p");
  totalCalorieLine.innerText = `Total Calories: ${totalCalories}`;
  totalCaloriesDiv.appendChild(totalCalorieLine);
  totalCaloriesDiv.setAttribute("class", "row");
  totalCalorieexercise.appendChild(totalCaloriesDiv);
}

// Initial call to display total calories when the page loads
updateTotalCalories();

// Existing code to display exercise records
const lastExercise = JSON.parse(localStorage.getItem("parentExercise")) || [];

// Sort reverse chronological order
const sortResult = lastExercise.sort((a, b) => new Date(b.dttm) - new Date(a.dttm));

const exerciserecordContainer = document.getElementById("record-container");

for (const singleexercise of lastExercise) {
  const dateGroup = document.createElement("div");
  const exerciseLine = document.createElement("div");
  const exerciseRow = document.createElement("div");
  const exerciseRecord = document.createElement("div");
  const calorieRecord = document.createElement("div");
  const deleteExercise = document.createElement("div");

  exerciseRecord.textContent = singleexercise.exerciseNameForm;
  calorieRecord.textContent = singleexercise.exerciseCaloriesForm;
  deleteExercise.textContent = '×';

  exerciserecordContainer.appendChild(dateGroup);
  dateGroup.appendChild(exerciseLine);
  exerciseLine.appendChild(exerciseRow);
  exerciseRow.appendChild(exerciseRecord);
  exerciseRow.appendChild(calorieRecord);
  exerciseRow.appendChild(deleteExercise);

  exerciseRow.setAttribute("class", "row exercise-row");
  exerciseRecord.setAttribute("class", "col s6 exercise-record");
  calorieRecord.setAttribute("class", "col s5 calorie-record");
  deleteExercise.setAttribute("class", "col s1 delete-record");
  deleteExercise.setAttribute("id", `delete-${singleexercise.exerciseId}`);
  deleteExercise.setAttribute("onclick", "handledeleteExercise(event)");
}

function handledeleteExercise(event) {
  const deleteId = event.target.id.substring(7);
  let existingexercise = JSON.parse(localStorage.getItem("parentExercise"));
  const index = existingexercise.findIndex((task) => task.exerciseId === deleteId);

  existingexercise.splice(index, 1);

  localStorage.setItem("parentExercise", JSON.stringify(existingexercise));
  updateTotalCalories(); // Update total calories after deletion
  window.location.reload();
}
