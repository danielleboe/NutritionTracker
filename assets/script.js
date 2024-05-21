// Retrieve food record and nextId from localStorage

const foodCaloriesInput = document.querySelector("#foodCalories");
const foodNameInput = document.querySelector("#foodItem");
const foodDateformInput = document.querySelector("#datepicker");
const foodList = JSON.parse(localStorage.getItem("food"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const submitFood = document.querySelector("#submit-new-food");
// const foodDateForm = foodDateformInput.value;

// Todo: create a function to generate a unique task id
function generateFoodId() {
  let myuuid = crypto.randomUUID();
  console.log(myuuid);
  return myuuid;
}

// Todo: create a function to create a task card - (popup modal)
// function createTaskCard(task) {

// Get the modal
const newFood = document.getElementById("foodModal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const closeButton = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  newFood.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function () {
  newFood.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == newFood) {
    newFood.style.display = "none";
  }
};

$(function () {
  $("#datepicker").datepicker();
});

submitFood.addEventListener("click", function (event) {
  event.preventDefault();

  const foodCaloriesForm = foodCaloriesInput.value;
  const foodNameForm = foodNameInput.value;
  const foodDateForm = foodDateformInput.value;
  const singleFood = {
    foodCaloriesForm: foodCaloriesForm,
    foodNameForm: foodNameForm,
    foodDateForm: foodDateForm,
    dttm: new Date(),
    foodId: generateFoodId(),
  };

  // declare variable for parent array
  // add to single post to existing json array
  let parentFood = [];
  const existingFood = JSON.parse(localStorage.getItem("parentFood"));

  //if the parent post exists then add to existing last post
  if (existingFood !== null) {
    parentFood = existingFood;
  }

  parentFood.push(singleFood);

  //localStorage set item json.stringify()
  localStorage.setItem("parentFood", JSON.stringify(parentFood));
  const formModal = document.getElementById("myModal");
  formModal.reset();
  newFood.style.display = "none";
  window.location.reload();
});

// //Drag and Drop

// //ondragstart - dragstart event is fired when the user starts dragging an element or text selection /draggable = true
// function drag(event) {
//   event.dataTransfer.dropEffect = "move";
//   event.dataTransfer.setData("text", event.target.id);
// }

// //ondragover - dragover event is fired when an element or text selection is being dragged over a valid drop target
// function allowDrop(event) {
//   event.preventDefault();
// }

// //dragenter event is fired when a dragged element or text selection enters a valid drop target
// function dragEnter(event) {
//   event.preventDefault();
// }

// //ondrop - event is fired when an element or text selection is dropped on a valid drop target
// function drop(event) {
//   event.preventDefault();
//   const taskId = event.dataTransfer.getData("text");
//   const card = document.getElementById(taskId);
//   event.target.appendChild(card);
//   updateTask(taskId, event.target.id);
// }

// ///Update Task after drag & drop
// function updateTask(taskId, targetId) {
//   //find task that was moved
//   const existingTasks = JSON.parse(localStorage.getItem("parentFood"));

//   for (const task of existingTasks) {
//     //change state
//     if (task.taskId === taskId) {
//       if (targetId === "inprogress-body") {
//         task.state = "inProgress";
//       } else if (targetId === "done-body") {
//         task.state = "done";
//       } else {
//         task.state = "todo";
//       }
//     }

//     //save update to local storage
//     localStorage.setItem("parentFood", JSON.stringify(existingTasks));
//   }
// }

// Todo: create a function to handle adding a new task

const lastFood = JSON.parse(localStorage.getItem("parentFood"));

// sort reverse chronological order
const sortResult = lastFood.sort(function (a, b) {
  return new Date(b.dttm) - new Date(a.dttm);
});

for (const singleFood of lastFood) {
  //   const todoCards = document.getElementById("todo-cards");
  //   const inProgress = document.getElementById("in-progress-cards");
  //   const done = document.getElementById("done-cards");
  //   const taskCard = document.createElement("div");
  //   const taskName = document.createElement("div");
  //   const taskBody = document.createElement("div");
  //   const taskDescription = document.createElement("p");
  //   const taskDueDate = document.createElement("p");

  const foodRow = document.createElement("div");
  const foodRecord = document.createElement("div");
  const calorieRecord = document.createElement("div");
  // const foodDate = document.createElement()
  const deleteFood = document.createElement("a");
  foodRecord.textContent = singleFood.foodNameForm;
  calorieRecord.textContent = singleFood.foodCaloriesForm;
  foodDateForm.textContent = singleFood.foodDateForm;
  deleteFood.textContent = `Delete`;

  // if (singleFood.state === "inProgress") {
  //     inProgress.appendChild(taskCard);
  //   } else if (singleFood.state === "done") {
  //     done.appendChild(taskCard);
  //   } else {
  //     todoCards.appendChild(taskCard);
  //   }

  foodRow.appendChild(foodRecord);
  foodRow.appendChild(calorieRecord);
  foodRow.appendChild(deleteFood);
  //   taskBody.appendChild(taskDueDate);
  foodRow.appendChild(deleteFood);

  foodRow.setAttribute("class", "row food-row");
  foodRecord.setAttribute("class", "col s6 m6 l6");
  calorieRecord.setAttribute("class", "col s6 m6 l6");

  //   taskBody.setAttribute("class", "card-body task");
  //   taskCard.setAttribute("class", "card");
  //   taskCard.setAttribute("draggable", "true");
  //   taskCard.setAttribute("ondragstart", "drag(event)");
  //   taskCard.setAttribute("id", singleFood.taskId);
  //   taskName.setAttribute("class", "card-header");
  //   taskDescription.setAttribute("class", "card-text taskDescription");
  //   deleteTask.setAttribute("class", "btn btn-primary delete");
  //   deleteTask.setAttribute("id", `delete-${singleFood.taskId}`);
  //   deleteTask.setAttribute("onclick", "handleDeleteTask(event)");
  //   taskDueDate.setAttribute("class", "card-text due-date");

  //   setStatus(taskCard, singleFood);
}

// Todo: create a function to handle deleting a task
function handleDeleteFood(event) {
  const deleteId = event.target.id.substring(7);
  const existingFood = JSON.parse(localStorage.getItem("parentFood"));
  const index = existingFood.findIndex(function (task) {
    return task.taskId === deleteId;
  });

  existingFood.splice(index, 1);
  // delete existingTasks[index];

  localStorage.setItem("parentFood", JSON.stringify(existingFood));
  window.location.reload();
}

// Todo: create a function to handle dropping a task into a new status lane

// //   ///Update Task after drag & drop
// //   function updateFood(taskId, targetId) {
// //     //find task that was moved
// //     const existingFood = JSON.parse(localStorage.getItem("parentFood"));

// //     for (const task of existingFood) {
// //       //change state
// //       if (task.taskId === taskId) {
// //         console.log(targetId);
// //         if (targetId === "inprogress-body") {
// //           task.state = "inProgress";
// //         } else if (targetId === "done-body") {
// //       s    task.state = "done";
// //         } else {
// //           task.state = "todo";
// //         }
// //       }
// //       //save update to local storage
//       localStorage.setItem("parentFood", JSON.stringify(existingFood));
//     }
//   }
// }
