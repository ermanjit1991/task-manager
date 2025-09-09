const pendingTasksList = document.getElementById("pendingTasksList");
const completedTasksList = document.getElementById("completedTasksList");
let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) tasks = savedTasks;
  renderTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (taskText === "") return;

  const task = { text: taskText, completed: false, priority };
  tasks.push(task);
  taskInput.value = "";
  prioritySelect.value = "Medium";
  saveTasks();
  renderTasks();
}

function renderTasks(filterType = "all", priorityFilter = "All") {
  pendingTasksList.innerHTML = "<h3>Pending Tasks</h3>";
  completedTasksList.innerHTML = "<h3>Completed Tasks</h3>";

  let total = tasks.length, completed = 0, pending = 0;

  tasks.forEach((task, index) => {
    if ((filterType === "pending" && task.completed) ||
        (filterType === "completed" && !task.completed)) return;
    if (priorityFilter !== "All" && task.priority !== priorityFilter) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked disabled" : ""} onchange="toggleComplete(${index})">
        <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
        <span class="task-priority priority-${task.priority}">${task.priority}</span>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${index})" ${task.completed ? "disabled" : ""}>Edit</button>
        <button onclick="deleteTask(${index})" ${task.completed ? "disabled" : ""}>❌</button>
      </div>
    `;
    if (task.completed) {
      completed++;
      completedTasksList.appendChild(li);
    } else {
      pending++;
      pendingTasksList.appendChild(li);
    }
  });

  document.getElementById("totalCount").textContent = `Total: ${total}`;
  document.getElementById("pendingCount").textContent = `Pending: ${pending}`;
  document.getElementById("completedCount").textContent = `Completed: ${completed}`;
}

function toggleComplete(index) {
  tasks[index].completed = true;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newTask = prompt("Edit your task:", tasks[index].text);
  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  renderTasks(type, document.getElementById("priorityFilter").value);
}

function filterByPriority() {
  filterTasks("all");
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
