const state = {
  taskList: [],
};

// DOM manipulations
const taskModal = document.querySelector(".task__modal__body");
const taskContents = document.querySelector(".task__contents");

// Create a card on the home page
const htmlTaskContent = ({ id, title, description, type, url }) => `
  <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
      <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
        <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
          <i class='bx bxs-pencil' name=${id}></i>
        </button>
        <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
          <i class='bx bx-trash' name=${id}></i>
        </button>
      </div>
      <div class='card-body'>
        ${
          url
            ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
            : `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
        }
        <h4 class='task__card__title'>${title}</h4>
        <p class='description trim-3-lines text-muted' data-gram_editor='false'>${description}</p>
        <div class='tags text-white d-flex flex-wrap'>
          <span class='badge bg-primary m-1'>${type}</span>
        </div>
      </div>
      <div class='card-footer'>
        <button 
          type='button' 
          class='btn btn-outline-primary float-right' 
          data-bs-toggle='modal'
          data-bs-target='#taskDetailsModal'
          id=${id}
          onclick='openTask.apply(this, arguments)'>
          Open Task
        </button>
      </div>
    </div>
  </div>
`;

// Dynamic modals (cards) on our home page/ui
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
      ${
        url
          ? `<img width='100%' src=${url} alt='card image here' class='img-fluid place__holder__image mb-3' />`
          : `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
      }
      <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
      <h2 class="my-3">${title}</h2>
      <p class='lead'>${description}</p>
    </div>`;
};

// Update local storage
const updateLocalStorage = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

// Load initial data from local storage
const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.getItem("task"));

  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};

// Handle form submission
const handleSubmit = (event) => {
  event.preventDefault(); // Prevent form submission behavior

  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("exampleInputimg").value,
    title: document.getElementById("exampleInputtitle").value,
    type: document.getElementById("exampleInputtype").value,
    description: document.getElementById("exampleInputdescription").value,
  };

  if (input.title === "" || input.type === "" || input.description === "") {
    return alert("Please Fill All The Fields");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input,
      id,
    })
  );

  // Update task list and local storage
  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

// Open task details in modal
const openTask = (event) => {
  const taskId = event.target.id;
  const task = state.taskList.find(({ id }) => id === taskId);

  taskModal.innerHTML = htmlModalContent(task);
};

// Add event listener to the "Save changes" button
document.getElementById("saveTaskButton").addEventListener("click", handleSubmit);

// Load initial data when the page loads
window.addEventListener("load", loadInitialData);


// Delete task
const deleteTask = (event) => {
  const taskId = event.target.getAttribute("name");
  const taskIndex = state.taskList.findIndex(({ id }) => id === taskId);

  if (taskIndex === -1) return;

  // Remove task from state
  state.taskList.splice(taskIndex, 1);

  // Update local storage
  updateLocalStorage();

  // Remove task card from DOM
  document.getElementById(taskId).remove();
};

// Add event listener to the "Save changes" button
document.getElementById("saveTaskButton").addEventListener("click", handleSubmit);

// Load initial data when the page loads
window.addEventListener("load", loadInitialData);


// edit operation
const editTask = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskList;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];
  // console.log(taskTitle);

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  // needs to be implemented
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};


// save the edited contents
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updatedData.taskTitle,
          description: updatedData.taskDescription,
          type: updatedData.taskType,
          url: task.url,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};


// Search tasks
const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  resultData.map((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
  );
};

// Add event listener to the "Save changes" button
document.getElementById("saveTaskButton").addEventListener("click", handleSubmit);

// Add event listener to the search input
document.getElementById("searchTaskInput").addEventListener("input", searchTask);

// Load initial data when the page loads
window.addEventListener("load", loadInitialData);


