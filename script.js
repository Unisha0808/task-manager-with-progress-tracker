const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");
const progressFill = document.getElementById("progressFill");
const progressCount = document.getElementById("progressCount");
const searchTask = document.getElementById("searchTask");
const filterCategory = document.getElementById("filterCategory");
const sortTasks = document.getElementById("sortTasks");
const themeToggle = document.getElementById("themeToggle");

let tasks = [];
const colors = ["note-yellow", "note-pink", "note-blue", "note-green"];

function renderTasks() {
  taskList.innerHTML = "";
  completedList.innerHTML = "";

  let filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchTask.value.toLowerCase())
  );

  if (filterCategory.value !== "all") {
    filteredTasks = filteredTasks.filter(
      (t) => t.category === filterCategory.value
    );
  }

  if (sortTasks.value === "date") {
    filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortTasks.value === "category") {
    filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add(task.color);

    li.innerHTML = `
      <div>${task.title}</div>
      <div style="position:absolute; bottom:10px; font-size:0.8rem;">
        <small>${task.category} | ${task.date}</small>
        <br>
        <button onclick="completeTask(${index})">✅</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    if (task.completed) {
      li.classList.add("completed");
      completedList.appendChild(li);
    } else {
      taskList.appendChild(li);
    }
  });

  updateProgress();
}

function addTask() {
  const title = taskInput.value.trim();
  const date = taskDate.value;
  const category = taskCategory.value;

  if (!title || !date) return alert("Enter task and due date!");

  const color = colors[Math.floor(Math.random() * colors.length)];
  tasks.push({ title, date, category, completed: false, color });

  scheduleNotification(title, date);
  taskInput.value = "";
  renderTasks();
}

function completeTask(index) {
  tasks[index].completed = true;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function updateProgress() {
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressFill.style.width = percent + "%";
  progressCount.innerText = percent;
}

// Notifications
function scheduleNotification(title, date) {
  if (!("Notification" in window)) return;
  Notification.requestPermission();

  const taskTime = new Date(date).getTime();
  const reminderTime = taskTime - 5 * 60 * 1000;

  const now = Date.now();
  const delay = reminderTime - now;

  if (delay > 0) {
    setTimeout(() => {
      new Notification("⏰ Task Reminder", { body: `${title} is due soon!` });
    }, delay);
  }
}

addTaskBtn.addEventListener("click", addTask);
searchTask.addEventListener("input", renderTasks);
filterCategory.addEventListener("change", renderTasks);
sortTasks.addEventListener("change", renderTasks);

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

renderTasks();
