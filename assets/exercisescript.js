const exerciseCalorieOutput = document.querySelector("#exerciseCalories");
const exerciseNameInput = document.querySelector("#exerciseItem");
const exerciseDateformInput = document.querySelector("#eDatepicker");
const totalCalorieBurned = document.getElementById("totalCalorieBurned");
const submitExerciseButton = document.querySelector("#submit-new-exercise");
const emsgDiv = document.getElementById("eMsg");
const exerciseRecordContainer = document.getElementById("erecord-container");

//start date selected - saved from local storage
function savedDate() {
  while (exerciseRecordContainer.firstChild) {
    exerciseRecordContainer.removeChild(exerciseRecordContainer.firstChild);
  }
  const dateSelector = window.localStorage.getItem("dateSelector");
  document.getElementById("date-select").value = dateSelector;

  console.log(`dateSelected: ${dateSelector}`);
  const lastExercise = JSON.parse(localStorage.getItem("parentExercise")) || [];
  const dateExFilter = lastExercise.filter((lastExerciseDate) => {
    const exerciseDate = dayjs(
      lastExerciseDate.exerciseDateForm,
      "MMM DD,YYYY"
    );
    const dateExFormatChange = dayjs(exerciseDate).format("YYYY-MM-DD");
    console.log(`dateExformatchange ${dateExFormatChange}`);
    console.log(`exerciseformdateformat ${exerciseDate}`);
    console.log(
      `lastExerciseDate ${lastExerciseDate.exerciseDateForm}`,
      `dateSelector ${dateSelector}`
    );
    localStorage.setItem("dateSelected", dateSelector);
    return dateExFormatChange === dateSelector;
  });

  // Sort reverse chronological order
  const sortResult = dateExFilter.sort(
    (a, b) => new Date(b.dttm) - new Date(a.dttm)
  );

  console.log(`dateFilter`, dateExFilter);

  for (const singleExercise of sortResult) {
    const eDateGroup = document.createElement("div");
    const exerciseLine = document.createElement("div");
    const exerciseRow = document.createElement("div");
    const exerciseRecord = document.createElement("div");
    const calorieRecord = document.createElement("div");
    const deleteExercise = document.createElement("a");

    exerciseRecord.textContent = singleExercise.exerciseNameForm;
    calorieRecord.textContent = singleExercise.exerciseCaloriesValue;
    deleteExercise.textContent = "×";

    exerciseRecordContainer.appendChild(eDateGroup);
    eDateGroup.appendChild(exerciseLine);
    exerciseLine.appendChild(exerciseRow);
    exerciseRow.appendChild(exerciseRecord);
    exerciseRow.appendChild(calorieRecord);
    exerciseRow.appendChild(deleteExercise);

    exerciseRow.setAttribute("class", "row exercise-row");
    exerciseRecord.setAttribute("class", "col s6 exercise-record");
    calorieRecord.setAttribute("class", "col s5 calorie-record");
    deleteExercise.setAttribute("class", "col s1 delete-record");
    deleteExercise.setAttribute("id", `delete-${singleExercise.exerciseId}`);
    deleteExercise.setAttribute("onclick", "handleDeleteExercise(event)");
  }

  updateTotalExerciseCalorie();
}
// End Saved Date Selection (on page load) from local storageEnd

// Total calories burned on page load start
function updateTotalExerciseCalorie() {
  const existingExercise =
    JSON.parse(localStorage.getItem("parentExercise")) || [];
  const dateSelector = window.localStorage.getItem("dateSelector");
  console.log(`dateSelector2: ${dateSelector}`);
  const dateFilter = existingExercise.filter((lastExerciseDate) => {
    const exerciseDate = dayjs(
      lastExerciseDate.exerciseDateForm,
      "MMM DD,YYYY"
    );
    const dateExFormatChange = dayjs(exerciseDate).format("YYYY-MM-DD");
    console.log(`dateformatchange2 ${dateExFormatChange}`);
    console.log(`exerciseformdateformat2 ${exerciseDate}`);
    console.log(
      `lastexercisedate2 ${lastExerciseDate.exerciseDateForm}`,
      `dateselector2 ${dateSelector}`
    );
    return dateExFormatChange === dateSelector;
  });

  let totalExerciseCalories = 0;

  if (dateFilter.length > 0) {
    for (let i = 0; i < dateFilter.length; i++) {
      totalExerciseCalories += parseInt(
        dateFilter[i].exerciseCaloriesValue,
        10
      );
    }
  }

  console.log(`Total calories: ${totalExerciseCalories}`);
  totalCalorieBurned.innerHTML = ""; // Clear previous total
  const totalCalorieLine = document.createElement("h5");
  totalCalorieLine.innerText = `Total Calories Burned: ${totalExerciseCalories}`;
  totalCalorieBurned.appendChild(totalCalorieLine);

  const totalExCalories = JSON.parse(localStorage.getItem("dateEx")) || {};
  totalExCalories.totalExerciseCalories = totalExerciseCalories;
  console.log(`totalExCalories ${totalExCalories}`);
  localStorage.setItem("dateEx", JSON.stringify(totalExCalories));

  const totalNetCalories =
    totalExCalories.totalCalories - totalExCalories.totalExerciseCalories;
  console.log(`total net calories: ${totalNetCalories}`);

  const totalNetCaloriesId = document.getElementById("total-net-calories");
  while (totalNetCaloriesId.firstChild) {
    totalNetCaloriesId.removeChild(totalNetCaloriesId.firstChild);
  }

  const totalNetCalorieLine = document.createElement("h5");
  totalNetCalorieLine.setAttribute("id", "net-calorie-line");
  totalNetCaloriesId.appendChild(totalNetCalorieLine);
  totalNetCalorieLine.innerText = `Total Net Calories: ${totalNetCalories}`;
}
// Total calories burned on page load end

//Modal Materialize styling load
document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".modal");
  M.Modal.init(elems);
});

// datepicker function
$(function () {
  $("#eDatepicker").datepicker();
});

//logging exercise records
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
// start submit button functions
submitExerciseButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await logExercise();
  const exerciseDateValue = exerciseDateformInput.value;
  const exerciseNameValue = exerciseNameInput.value;
  const exerciseCaloriesValue = exerciseCalorieOutput.value;

  let isError = false;

  if (exerciseNameValue.trim() === "" || !exerciseNameValue) {
    console.log("exerciseNameForm+++++", exerciseNameValue);
    edisplayMessage("error", "Exercise cannot be blank");
    isError = true;
  } else if (exerciseDateValue.trim() === "" || !exerciseDateValue) {
    edisplayMessage("error", "Date cannot be blank");
    isError = true;
  } else {
    edisplayMessage("success", "Submitted successfully");
  }
  if (!isError) {
    const singleExercise = {
      exerciseDateForm: exerciseDateValue,
      exerciseNameForm: exerciseNameValue,
      exerciseCaloriesValue: exerciseCaloriesValue,
      dttm: new Date(),
      exerciseId: generateExerciseId(),
    };

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
// end submit button functions

// Date Selection Start - on date change
document.getElementById("date-select").addEventListener("change", dateSelect);
function dateSelect() {
  while (exerciseRecordContainer.firstChild) {
    exerciseRecordContainer.removeChild(exerciseRecordContainer.firstChild);
  }
  const dateSelector = dateSelectorInput.value;
  console.log(`dateSelector: ${dateSelector}`);
  const lastExercise = JSON.parse(localStorage.getItem("parentExercise")) || [];
  const dateExFilter = lastExercise.filter((lastExerciseDate) => {
    const exerciseDate = dayjs(
      lastExerciseDate.exerciseDateForm,
      "MMM DD,YYYY"
    );
    const dateExFormatChange = dayjs(exerciseDate).format("YYYY-MM-DD");
    console.log(`dateExformatchange ${dateExFormatChange}`);
    console.log(`exerciseformdateformat ${exerciseDate}`);
    console.log(
      `lastExerciseDate ${lastExerciseDate.exerciseDateForm}`,
      `dateselector ${dateSelector}`
    );
    localStorage.setItem("dateSelector", dateSelector);
    return dateExFormatChange === dateSelector;
  });

  // Sort reverse chronological order
  const sortResult = dateExFilter.sort(
    (a, b) => new Date(b.dttm) - new Date(a.dttm)
  );

  console.log(`dateFilter`, dateExFilter);

  for (const singleExercise of sortResult) {
    const eDateGroup = document.createElement("div");
    const exerciseLine = document.createElement("div");
    const exerciseRow = document.createElement("div");
    const exerciseRecord = document.createElement("div");
    const calorieRecord = document.createElement("div");
    const deleteExercise = document.createElement("a");

    exerciseRecord.textContent = singleExercise.exerciseNameForm;
    calorieRecord.textContent = singleExercise.exerciseCaloriesValue;
    deleteExercise.textContent = "×";

    exerciseRecordContainer.appendChild(eDateGroup);
    eDateGroup.appendChild(exerciseLine);
    exerciseLine.appendChild(exerciseRow);
    exerciseRow.appendChild(exerciseRecord);
    exerciseRow.appendChild(calorieRecord);
    exerciseRow.appendChild(deleteExercise);

    exerciseRow.setAttribute("class", "row exercise-row");
    exerciseRecord.setAttribute("class", "col s6 exercise-record");
    calorieRecord.setAttribute("class", "col s5 calorie-record");
    deleteExercise.setAttribute("class", "col s1 delete-record");
    deleteExercise.setAttribute("id", `delete-${singleExercise.exerciseId}`);
    deleteExercise.setAttribute("onclick", "handleDeleteExercise(event)");
  }

  updateTotalExerciseCalories();
}
// Date Selection End -on date change

// Total calories burned start - populate on change
function updateTotalExerciseCalories() {
  const existingExercise =
    JSON.parse(localStorage.getItem("parentExercise")) || [];
  const dateSelector = dateSelectorInput.value;
  console.log(`dateSelector2: ${dateSelector}`);
  const dateFilter = existingExercise.filter((lastExerciseDate) => {
    const exerciseDate = dayjs(
      lastExerciseDate.exerciseDateForm,
      "MMM DD,YYYY"
    );
    const dateExFormatChange = dayjs(exerciseDate).format("YYYY-MM-DD");
    console.log(`dateformatchange2 ${dateExFormatChange}`);
    console.log(`exerciseformdateformat2 ${exerciseDate}`);
    console.log(
      `lastexercisedate2 ${lastExerciseDate.exerciseDateForm}`,
      `dateselector2 ${dateSelector}`
    );
    return dateExFormatChange === dateSelector;
  });

  let totalExerciseCalories = 0;

  if (dateFilter.length > 0) {
    for (let i = 0; i < dateFilter.length; i++) {
      totalExerciseCalories += parseInt(
        dateFilter[i].exerciseCaloriesValue,
        10
      );
    }
  }

  console.log(`Total calories: ${totalExerciseCalories}`);
  totalCalorieBurned.innerHTML = ""; // Clear previous total
  const totalCalorieLine = document.createElement("h5");
  totalCalorieLine.innerText = `Total Calories Burned: ${totalExerciseCalories}`;
  totalCalorieBurned.appendChild(totalCalorieLine);

  const totalExCalories = JSON.parse(localStorage.getItem("dateEx")) || {};
  totalExCalories.totalExerciseCalories = totalExerciseCalories;
  console.log(`totalExCalories ${totalExCalories}`);
  localStorage.setItem("dateEx", JSON.stringify(totalExCalories));

  const totalNetCalories =
    totalExCalories.totalCalories - totalExCalories.totalExerciseCalories;
  console.log(`total net calories: ${totalNetCalories}`);

  const totalNetCaloriesId = document.getElementById("total-net-calories");
  while (totalNetCaloriesId.firstChild) {
    totalNetCaloriesId.removeChild(totalNetCaloriesId.firstChild);
  }

  const totalNetCalorieLine = document.createElement("h5");
  totalNetCalorieLine.setAttribute("id", "net-calorie-line");
  totalNetCaloriesId.appendChild(totalNetCalorieLine);
  totalNetCalorieLine.innerText = `Total Net Calories: ${totalNetCalories}`;
}
//End total calories calculation - on date change

// Initial call to display total calories when the page loads
updateTotalExerciseCalories();

const lastExercise = JSON.parse(localStorage.getItem("parentExercise")) || [];

//function to handle deleting a exercise row
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

savedDate();

///////
