const STORAGE_KEY = "tasks";

const taskForm = document.querySelector("#task-form");
const taskNameInput = document.querySelector("#task-name");
const taskCategorySelect = document.querySelector("#task-category");
const taskDeadlineInput = document.querySelector("#task-deadline");
const taskStatusSelect = document.querySelector("#task-status");

const filterStatusSelect = document.querySelector("#filter-status");
const filterCategorySelect = document.querySelector("#filter-category");
const resetFiltersBtn = document.querySelector("#reset-filters-btn");

const taskList = document.querySelector("#task-list");
const taskSummary = document.querySelector("#task-summary");
const feedbackMsg = document.querySelector("#feedback-msg");

// Load saved tasks from local storage or start with an empty array
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// Mark non-completed tasks with a past deadline as "Overdue"
function checkOverdueTasks() {
  const todayString = getTodayString();

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].deadline < todayString && tasks[i].status !== "Completed") {
      tasks[i].status = "Overdue";
    }
  }
}

function addTask(name, category, deadline, status) {
  const newTask = {
    id: Date.now() + Math.random(),
    name: name,
    category: category,
    deadline: deadline,
    status: status
  };

  tasks.push(newTask);
  checkOverdueTasks();
  saveTasks();
  renderTasks();
  feedbackMsg.textContent = 'Added task "' + newTask.name + '".';
}

function updateTaskStatus(id, newStatus) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].status = newStatus;
      feedbackMsg.textContent = 'Updated "' + tasks[i].name + '" to ' + newStatus + ".";
    }
  }

  checkOverdueTasks();
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  const selectedStatus = filterStatusSelect.value;
  const selectedCategory = filterCategorySelect.value;
  const filtered = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const matchesStatus = selectedStatus === "All" || task.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;

    if (matchesStatus && matchesCategory) {
      filtered.push(task);
    }
  }

  return filtered;
}

function renderTasks() {
  checkOverdueTasks();
  saveTasks();

  const visibleTasks = getFilteredTasks();
  taskList.innerHTML = "";

  if (taskSummary) {
    taskSummary.textContent = visibleTasks.length + " tasks shown";
  }

  if (visibleTasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No tasks to display.";
    taskList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < visibleTasks.length; i++) {
    const task = visibleTasks[i];
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent =
      task.name +
      " | Category: " +
      task.category +
      " | Deadline: " +
      task.deadline +
      " | Status: " +
      task.status +
      " ";

    const statusSelect = document.createElement("select");
    const statuses = ["In Progress", "Completed", "Overdue"];

    for (let j = 0; j < statuses.length; j++) {
      const option = document.createElement("option");
      option.value = statuses[j];
      option.textContent = statuses[j];
      if (task.status === statuses[j]) {
        option.selected = true;
      }
      statusSelect.appendChild(option);
    }

    statusSelect.addEventListener("change", function () {
      updateTaskStatus(task.id, statusSelect.value);
    });

    li.appendChild(text);
    li.appendChild(statusSelect);
    taskList.appendChild(li);
  }
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = taskNameInput.value.trim();
  const category = taskCategorySelect.value;
  const deadline = taskDeadlineInput.value;
  const status = taskStatusSelect.value;

  if (name === "" || deadline === "") {
    feedbackMsg.textContent = "Please enter both a task name and a deadline.";
    return;
  }

  addTask(name, category, deadline, status);
  taskForm.reset();
});

filterStatusSelect.addEventListener("change", function () {
  renderTasks();
  feedbackMsg.textContent = "Showing status: " + filterStatusSelect.value + ".";
});

filterCategorySelect.addEventListener("change", function () {
  renderTasks();
  feedbackMsg.textContent = "Showing category: " + filterCategorySelect.value + ".";
});

resetFiltersBtn.addEventListener("click", function () {
  filterStatusSelect.value = "All";
  filterCategorySelect.value = "All";
  renderTasks();
  feedbackMsg.textContent = "Filters reset.";
});

renderTasks();