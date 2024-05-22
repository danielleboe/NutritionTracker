const calorieOutput = document.querySelector("#exerciseCalories");
const exerciseNameInput = document.querySelector("#exerciseItem");
const exerciseDuratonInput = document.querySelector("#exerciseDuration");
const exerciseDateformInput = document.querySelector("#eDatepicker");
const submitexerciseButton = document.querySelector("#submit-new-exercise");

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems);
  });
  
  $(function() {
    $("#eDatepicker").datepicker();
  });

  async function logExercise() {
    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/caloriesburned=${excerciseNameInput.value}&duration_minutes=${exerciseDuratonInput.value}`, {
        headers: {
          "X-Api-Key": "9ePZmGAr8Wxnfhl6F0/QLA==Zz94qcLvKzE7uHK0"
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
  
      if (data.items && data.length > 0) {
        const calories = data[0].total_calories; // Assuming calories are in the first item
        exerciseCalorieOutput.value = total_calories; // Display the calorie value in the field
      } else {
        exerciseCalorieOutput.value = "No data found"; // Handle case where no items are found
      }
    } catch (error) {
      console.error("Error fetching exercise data:", error);
      exerciseCalorieOutput.value = "Error fetching data"; // Display error message in the field
    }
  }

  function generateExerciseId() {
    let myuuid = crypto.randomUUID();
    console.log(myuuid);
    return myuuid;
  }
  
  submitexerciseButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await logExercise();
  
    const exerciseCaloriesForm = exerciseCalorieOutput.value;
    const exerciseNameForm = exerciseNameInput.value;
    const exerciseDateForm = exerciseDateformInput.value;
    const exerciseDurationForm = exerciseDuratonInput.value;
    const singleExercise = {
      exerciseCaloriesForm: exerciseCaloriesForm,
      exerciseDurationForm: exerciseDurationForm,
      exerciseNameForm: exerciseNameForm,
      exerciseDateForm: exerciseDateForm,
      dttm: new Date(),
      exerciseId: generateExerciseId()
    }
    let parentExercise = [];
    const existingExercise = JSON.parse(localStorage.getItem("parentExercise"));
  
    if (existingExercise !== null) {
      parentExercise = existingExercise;
    }
  
    parentExercise.push(singleExercise);
    localStorage.setItem("parentExercise", JSON.stringify(parentExercise));
  
    const formModal = document.getElementById("workoutModal");
    formModal.reset();
    const instance = M.Modal.getInstance(document.getElementById('exerciseModal'));
    instance.close();
    window.location.reload();
  });


  // old code

const lastExercise = JSON.parse(localStorage.getItem("parentExercise"));

// sort reverse chronological order
const exerciseSortResult = lastExercise.sort(function (a, b) {
  return new Date(b.dttm) - new Date(a.dttm);
});

const exerciseRecordContainer = document.getElementById ("erecord-container");
const totalCaloriesExercise = document.getElementById("totalCalorieexercise");
// const dateGroup = document.querySelector(".date-group");
// const exerciseLine = document.querySelector(".exerciseLines");

for (const singleExercise of lastExercise) {
  const eDateGroup = document.createElement("div");
  const exerciseLine = document.createElement("div");
  const exerciseRow = document.createElement("div");
  const exerciseRecord = document.createElement("div");
  const exerciseDuration = document.createElement('div');
  const calorieRecord = document.createElement("div");
  // const exerciseDate = document.createElement("div");
//   const deleteExercise = document.createElement("a");
  const exerciseTotalRow = document.createElement ("div");
  exerciseRecord.textContent = singleExercise.exerciseNameForm;
  exerciseDuration.textContent = singleExercise.exerciseDurationForm;
  calorieRecord.textContent = singleExercise.exerciseCaloriesForm;
  // exerciseDateForm.textContent = singleExercise.exerciseDateForm;
  // deleteexercise.textContent = `Delete`;

  // totalCalorieexercise.appendChild(exerciseTotalRow);
  exerciseRecordContainer.appendChild(eDateGroup);
  eDateGroup.appendChild(exerciseLine);
  exerciseLine.appendChild(exerciseRow);
  exerciseRow.appendChild(exerciseRecord);
  exerciseRow.appendChild(exerciseDuration);
  exerciseRow.appendChild(calorieRecord);
  // exerciseRow.appendChild(deleteexercise);

  exerciseRow.setAttribute("class", "row exercise-row");
  exerciseRecord.setAttribute("class", "col s4 exercise-record");
  calorieRecord.setAttribute("class", "col s4 ecalorie-record");
  exerciseTotalRow.setAttribute ("class","row exerciseTotalRow");

// Todo: create a function to handle deleting a exercise row
function handleDeleteExercise(event) {
  const deleteId = event.target.id.substring(7);
  const existingExercise = JSON.parse(localStorage.getItem("parentExercise"));
  const index = existingExercise.findIndex(function (task) {
    return task.taskId === deleteId;
  });

  existingExercise.splice(index, 1);

  localStorage.setItem("parentExercise", JSON.stringify(existingexercise));
  window.location.reload();
}};





