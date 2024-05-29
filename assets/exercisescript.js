const exerciseCalorieOutput = document.querySelector("#exerciseCalories");
const exerciseNameInput = document.querySelector("#exerciseItem");
// const exerciseDuratonInput = document.querySelector("#exerciseDuration");
const exerciseDateformInput = document.querySelector("#eDatepicker");
const totalCalorieBurned = document.getElementById("totalCalorieBurned");
const submitExerciseButton = document.querySelector("#submit-new-exercise");
const emsgDiv = document.getElementById("eMsg");

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".modal");
  M.Modal.init(elems);
});

$(function () {
  $("#eDatepicker").datepicker();
});

async function logExercise() {
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/caloriesburned?activity=${exerciseNameInput.value}&limit=1`,
      {
        headers: {
          "X-Api-Key": "9ePZmGAr8Wxnfhl6F0/QLA==Zz94qcLvKzE7uHK0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    if (data && data.length > 0) {
      const calories = data[0].total_calories; // Assuming calories are in the first item
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

function edisplayMessage(type, emessage) {
  emsgDiv.textContent = emessage;
  emsgDiv.setAttribute("class", type);
}

submitExerciseButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await logExercise();
  const exerciseDateForm = exerciseDateformInput.value;
  const exerciseNameForm = exerciseNameInput.value;
  // const exerciseDurationForm = exerciseDuratonInput.value;
  const exerciseCaloriesForm = exerciseCalorieOutput.value;

  let isError = false;

  if (exerciseNameForm.trim() === "" || !exerciseNameForm) {
    console.log("exerciseNameForm+++++", exerciseNameForm);
    edisplayMessage("error", "Exercise cannot be blank");
    isError = true;
  } else if (exerciseDateForm.trim() === "" || !exerciseDateForm) {
    edisplayMessage("error", "Date cannot be blank");
    isError = true;
  } else {
    edisplayMessage("success", "Submitted successfully");
  }
  if (!isError) {
    const singleExercise = {
      exerciseCaloriesForm: exerciseCaloriesForm,
      // exerciseDurationForm: exerciseDurationForm,
      exerciseNameForm: exerciseNameForm,
      exerciseDateForm: exerciseDateForm,
      dttm: new Date(),
      exerciseId: generateExerciseId(),
    };

    //new code start
    let parentExercise =
      JSON.parse(localStorage.getItem("parentExercise")) || [];
    parentExercise.push(singleExercise);
    localStorage.setItem("parentExercise", JSON.stringify(parentExercise));

    updateTotalExerciseCalories();

    const formModal = document.getElementById("workoutModal");
    formModal.reset();
    const instance = M.Modal.getInstance(
      document.getElementById("exerciseModal")
    );
    instance.close();
    window.location.reload();
  }
});

function updateTotalExerciseCalories() {
  const existingExercise =
    JSON.parse(localStorage.getItem("parentExercise")) || [];
  let totalExerciseCalories = 0;

  if (existingExercise.length > 0) {
    for (let i = 0; i < existingExercise.length; i++) {
      totalExerciseCalories += parseInt(
        existingExercise[i].exerciseCaloriesForm,
        10
      );
    }
  }

  console.log(`Total calories: ${totalExerciseCalories}`);
  totalCalorieBurned.innerHTML = ""; // Clear previous total
  const totalCaloriesDiv = document.createElement("div");
  const totalCalorieLine = document.createElement("h6");
  totalCalorieLine.innerText = `Total Calories Burned: ${totalExerciseCalories}`;
  totalCaloriesDiv.appendChild(totalCalorieLine);
  totalCaloriesDiv.setAttribute("class", "row");
  totalCalorieBurned.appendChild(totalCaloriesDiv);
}

// Initial call to display total calories when the page loads
updateTotalExerciseCalories();

const lastExercise = JSON.parse(localStorage.getItem("parentExercise")) || [];

// sort reverse chronological order
const sortResults = lastExercise.sort(
  (a, b) => new Date(b.dttm) - new Date(a.dttm)
);

const exerciseRecordContainer = document.getElementById("erecord-container");

for (const singleExercise of lastExercise) {
  const eDateGroup = document.createElement("div");
  const exerciseLine = document.createElement("div");
  const exerciseRow = document.createElement("div");
  const exerciseRecord = document.createElement("div");
  // const exerciseDuration = document.createElement("div");
  const exerciseCalorieRecord = document.createElement("div");
  const deleteExercise = document.createElement("a");
  const exerciseTotalRow = document.createElement("div");

  exerciseRecord.textContent = singleExercise.exerciseNameForm;
  exerciseCalorieRecord.textContent = singleExercise.exerciseCaloriesForm;
  // exerciseDuration.textContent = singleExercise.exerciseDurationForm;
  deleteExercise.textContent = `×`;

  exerciseRecordContainer.appendChild(eDateGroup);
  eDateGroup.appendChild(exerciseLine);
  exerciseLine.appendChild(exerciseRow);
  exerciseRow.appendChild(exerciseRecord);
  // exerciseRow.appendChild(exerciseDuration);
  exerciseRow.appendChild(exerciseCalorieRecord);
  exerciseRow.appendChild(deleteExercise);

  exerciseRow.setAttribute("class", "row exercise-row");
  exerciseTotalRow.setAttribute("class", "row exerciseTotalRow");
  exerciseRecord.setAttribute("class", "col s6 exercise-record");
  // exerciseDuration.setAttribute("class", "col s3 section");
  exerciseCalorieRecord.setAttribute("class", "col s5 calorie-record");
  deleteExercise.setAttribute("class", "col s1 edelete-record");
  deleteExercise.setAttribute("id", `delete-${singleExercise.exerciseId}`);
  deleteExercise.setAttribute("onclick", "handleDeleteExercise(event)");
}

// Todo: create a function to handle deleting a exercise row
function handleDeleteExercise(event) {
  const deleteId = event.target.id.substring(7);
  const existingExercise = JSON.parse(localStorage.getItem("parentExercise"));
  const index = existingExercise.findIndex(
    (task) => task.exerciseId === deleteId
  );

  existingExercise.splice(index, 1);

  localStorage.setItem("parentExercise", JSON.stringify(existingExercise));
  updateTotalExerciseCalories(); // Update total calories after deletion
  window.location.reload();
}
