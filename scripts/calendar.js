// Calendar
const today = new Date();

const lastDates = [28, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const calendar = document.querySelector(".calendar");
const currMonthEl = calendar.querySelector(".month");
const prevMonthBtn = calendar.querySelector(".prev-month");
const nextMonthBtn = calendar.querySelector(".next-month");
const todayBtn = calendar.querySelector(".to-today");
const calendarDates = calendar.querySelector("#calendar-table");

let currYear = 0;
let currMonth = 0;
let selectedDate = 0;

function showCalendar(year, month) {
  removeCalendar();

  const firstDate = new Date(year, month - 1, 1);
  year = firstDate.getFullYear();
  month = firstDate.getMonth() + 1;
  const firstDay = firstDate.getDay();
  currMonthEl.textContent = `${year}년 ${String(month).padStart(2, "0")}월`;
  let currDate = 1;
  let isCompleted = false;

  const dates = document.createElement("tbody");
  dates.classList.add("dates");
  // week
  for (let i = 1; i <= 6; i++) {
    const week = document.createElement("tr");
    week.classList.add("week");
    week.setAttribute("id", `w${i}`);
    // day
    for (let j = 0; j < 7; j++) {
      const date = document.createElement("td");
      date.classList.add("date");
      if (i == 1) {
        if (j == firstDay) {
          currDate = 1;
        } else if (j < firstDay) {
          date.classList.add("prev");
          date.addEventListener("click", () => showCalendar(currYear, currMonth - 1));
          currDate = lastDates[month - 1] - firstDay + j + 1;
        }
      } else if (currDate > lastDates[month]) {
        isCompleted = true;
        currDate = 1;
      }
      if (isCompleted) {
        date.classList.add("next");
        date.addEventListener("click", () => showCalendar(currYear, currMonth + 1));
      }
      if (!date.classList.contains("prev") && !date.classList.contains("next")) {
        date.setAttribute("id", `d${currDate}`);
        date.addEventListener("click", selectDate);
      }
      date.textContent = String(currDate).padStart(2, "0");
      week.appendChild(date);
      currDate++;
    }
    dates.appendChild(week);
  }
  calendarDates.appendChild(dates);
  getCurrMonth();
  if (currYear == today.getFullYear() && currMonth == today.getMonth() + 1) {
    showToday();
  }
  showTasks();
}

function removeCalendar() {
  const dates = calendarDates.querySelector(".dates");
  if (dates) {
    dates.remove();
  }
}

function getCurrMonth() {
  monthStr = currMonthEl.textContent;
  currYear = Number(monthStr.substring(0, 4));
  currMonth = Number(monthStr.substring(6, 8));
}

function showToday() {
  const todayEl = calendarDates.querySelector(`#d${today.getDate()}`);
  todayEl.classList.add("today");
}

// Modal
const modal = document.querySelector(".modal");
const background = modal.querySelector(".modal-background");
const closeBtn = modal.querySelector(".close-btn");
const addBtn = modal.querySelector(".add-btn");
const changeBtn = modal.querySelector(".change-btn");
const deleteBtn = modal.querySelector(".delete-btn");

changeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addBtn.classList.remove("hidden");
  changeBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");
  const tasks = taskList.querySelectorAll("li");
  if (tasks) {
    tasks.forEach((task) => {
      if (task.classList.contains("selected")) {
        task.classList.remove("selected");
      }
    });
  }
  changeTask();
  savedTasks = JSON.parse(localStorage.getItem("tasks"));
  selectedTaskID = -1;
});

deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addBtn.classList.remove("hidden");
  changeBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");
  const tasks = taskList.querySelectorAll("li");
  if (tasks) {
    tasks.forEach((task) => {
      if (task.classList.contains("selected")) {
        task.classList.remove("selected");
      }
    });
  }
  deleteTask();
  savedTasks = JSON.parse(localStorage.getItem("tasks"));
  selectedTaskID = -1;
});

function openModal(year, month, date) {
  presetPicker(year, month, date);
  showDateTasks(new Date(year, month - 1, Number(date)));
  taskTitleInput.focus();
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  addBtn.classList.remove("hidden");
  changeBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");
  taskForm.reset();
  presetPicker();
}
closeBtn.addEventListener("click", closeModal);
background.addEventListener("click", closeModal);

function selectDate(e) {
  date = e.currentTarget;
  selectedDate = date.textContent.substring(0, 2);
  openModal(currYear, currMonth, selectedDate);
}

// Modal - Form
const taskForm = document.querySelector("#task-form");
const taskTitleInput = taskForm.querySelector("#task-title");
const taskStartPicker = taskForm.querySelector("#task-start");
const taskEndPicker = taskForm.querySelector("#task-end");
const taskList = taskForm.querySelector("#tasks");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

function addTask(task) {
  const taskEl = document.createElement("li");
  let taskTitle = taskTitleInput.value;
  let taskStart = dateifyPicker(taskStartPicker);
  let taskEnd = dateifyPicker(taskEndPicker);

  if (task) {
    taskTitle = task.title;
  }

  if (taskTitle && taskStart && taskEnd) {
    lastTaskID++;
    const newTask = {
      id: lastTaskID,
      title: taskTitle,
      startDate: taskStart,
      endDate: taskEnd,
    };

    taskEl.innerText = taskTitle;
    taskForm.reset();
    presetPicker();
    taskList.appendChild(taskEl);

    saveTasks(newTask);
    showTasks();
    showDateTasks(new Date(currYear, Number(currMonth) - 1, selectedDate));
  }
}

let selectedTaskID = -1;

function changeTask() {
  const taskTitle = taskTitleInput.value;
  const taskStart = dateifyPicker(taskStartPicker);
  const taskEnd = dateifyPicker(taskEndPicker);

  if (taskTitle && taskStart && taskEnd) {
    savedTasks.forEach((savedTask) => {
      if (savedTask.id == selectedTaskID) {
        savedTask.title = taskTitle;
        savedTask.startDate = taskStart;
        savedTask.endDate = taskEnd;
      }
    });
    taskForm.reset();
    presetPicker();
    saveTasks();
    showTasks();
    showDateTasks(new Date(currYear, Number(currMonth) - 1, selectedDate));
  }
}

function deleteTask() {
  savedTasks.forEach((savedTask, i) => {
    if (savedTask.id == selectedTaskID) {
      savedTasks.splice(i, 1);
    }
  });
  taskForm.reset();
  presetPicker();
  saveTasks();
  showTasks();
  showDateTasks(new Date(currYear, Number(currMonth) - 1, selectedDate));
}

function dateifyPicker(picker) {
  const year = picker.querySelector(".year-picker");
  const month = picker.querySelector(".month-picker");
  const date = picker.querySelector(".date-picker");

  return new Date(year.value, month.value - 1, date.value);
}

let savedTasks = JSON.parse(localStorage.getItem("tasks"));
let lastTaskID = JSON.parse(localStorage.getItem("lastTaskID"));
lastTaskID ||= -1;
let dateTasks = [];

function saveTasks(newTask) {
  let tasks = [];

  if (savedTasks) {
    tasks = savedTasks;
  }
  if (newTask) {
    tasks.push(newTask);
    localStorage.setItem("lastTaskID", lastTaskID);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
  removeTasks();
  savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) {
    savedTasks.forEach((task) => {
      const taskTitle = task.title;
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      const currDate = startDate;
      while (currDate <= endDate) {
        if (currDate.getFullYear() == currYear && currDate.getMonth() + 1 == currMonth) {
          const dateEl = document.querySelector(`#d${currDate.getDate()}`);
          const task = document.createElement("div");
          task.classList.add("task");
          const tTitle = document.createElement("div");
          tTitle.classList.add("tTitle");
          tTitle.textContent = taskTitle;
          const tDot = document.createElement("div");
          tDot.classList.add("tDot");
          task.appendChild(tTitle);
          task.appendChild(tDot);
          dateEl.appendChild(task);
        }
        currDate.setDate(currDate.getDate() + 1);
      }
    });
  }
}

function removeTasks() {
  const tasks = calendarDates.querySelectorAll(".task");
  if (tasks) {
    tasks.forEach((task) => {
      task.remove();
    });
  }
}

function showDateTasks(currDate) {
  removeDateTasks();
  dateTasks = [];
  let dateTaskID = -1;
  if (savedTasks) {
    savedTasks.forEach((task) => {
      const newTask = {
        id: task.id,
        title: task.title,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
      };
      if (newTask.startDate <= currDate && currDate <= newTask.endDate) {
        dateTasks.push(newTask);
        dateTaskID++;
        const taskEl = document.createElement("li");
        taskEl.setAttribute("id", `t${dateTaskID}`);
        taskEl.innerText = newTask.title;
        taskEl.addEventListener("click", selectDateTasks);
        taskList.appendChild(taskEl);
      }
    });
  }
}

function removeDateTasks() {
  const tasks = taskList.querySelectorAll("li");
  if (tasks) {
    tasks.forEach((task) => {
      task.remove();
    });
  }
}

function selectDateTasks(e) {
  const dateTask = e.currentTarget;
  const id = Number(dateTask.getAttribute("id").substring(1));
  const loadedDateTask = dateTasks[id];
  const tasks = taskList.querySelectorAll("li");
  if (tasks) {
    tasks.forEach((task) => {
      if (task.classList.contains("selected")) {
        task.classList.remove("selected");
      }
    });
  }
  dateTask.classList.add("selected");
  changeBtn.classList.remove("hidden");
  deleteBtn.classList.remove("hidden");
  addBtn.classList.add("hidden");
  selectedTaskID = loadedDateTask.id;

  // Update Input Values
  taskTitleInput.value = loadedDateTask.title;
  pickers[0].value = loadedDateTask.startDate.getFullYear();
  pickers[1].value = String(loadedDateTask.startDate.getMonth() + 1).padStart(2, "0");
  pickers[2].value = String(loadedDateTask.startDate.getDate()).padStart(2, "0");
  pickers[3].value = loadedDateTask.endDate.getFullYear();
  pickers[4].value = String(loadedDateTask.endDate.getMonth() + 1).padStart(2, "0");
  pickers[5].value = String(loadedDateTask.endDate.getDate()).padStart(2, "0");
}

// Form - Time Picker
const pickers = document.querySelectorAll(".picker");
pickers.forEach((picker) => {
  picker.addEventListener("focus", () => picker.select());
  picker.addEventListener("wheel", scrollPicker);
  picker.addEventListener("keydown", (e) => {
    onlyNum(e);
    arrowPicker(e);
  });
  picker.addEventListener("change", (e) => checkPicker(e, picker));
});

function scrollPicker(e) {
  e.preventDefault();
  const picker = e.currentTarget;
  if (e.wheelDeltaY > 0) {
    increasePickerNum(picker);
  } else if (e.wheelDeltaY < 0) {
    decreasePickerNum(picker);
  }
}

function onlyNum(e) {
  const key = e.key;
  if (!((0 <= key && key <= 9) || key == "Backspace" || key == "Delete" || key == "Tab")) {
    e.preventDefault();
  }
}

function arrowPicker(e) {
  const picker = e.currentTarget;
  const key = e.key;
  if (key == "ArrowUp") {
    increasePickerNum(picker);
  } else if (key == "ArrowDown") {
    decreasePickerNum(picker);
  }
}

function increasePickerNum(picker) {
  const curr = picker.value;
  const min = picker.getAttribute("min");
  const max = picker.getAttribute("max");

  if (curr == max) {
    picker.value = String(min).padStart(2, "0");
  } else {
    picker.value = String(Number(curr) + 1).padStart(2, "0");
  }
}

function decreasePickerNum(picker) {
  const curr = picker.value;
  const min = picker.getAttribute("min");
  const max = picker.getAttribute("max");

  if (curr == min) {
    picker.value = String(max).padStart(2, "0");
  } else {
    picker.value = String(Number(curr) - 1).padStart(2, "0");
  }
}

function checkPicker(e) {
  e.preventDefault();
  const picker = e.currentTarget;
  picker.value = String(picker.value).padStart(2, "0");
  if (!picker.value || picker.value < picker.min) {
    picker.value = picker.min;
  }
  if (picker.value > picker.max) {
    picker.value = picker.max;
  }
}

function presetPicker() {
  for (i = 0; i <= 3; i += 3) {
    const year = pickers[i + 0];
    const month = pickers[i + 1];
    const date = pickers[i + 2];

    setPickerCurrDate(year, month, date);
    setLastDate(year, month, date);
    year.addEventListener("wheel", () => setLastDate(year, month, date));
    year.addEventListener("keydown", () => setLastDate(year, month, date));
    month.addEventListener("wheel", () => setLastDate(year, month, date));
    month.addEventListener("keydown", () => setLastDate(year, month, date));
    year.addEventListener("wheel", () => setEndDate(pickers[3], pickers[4], pickers[5], pickers[0], pickers[1], pickers[2]));
    year.addEventListener("keydown", () => setEndDate(pickers[3], pickers[4], pickers[5], pickers[0], pickers[1], pickers[2]));
    month.addEventListener("wheel", () => setEndDate(pickers[3], pickers[4], pickers[5], pickers[0], pickers[1], pickers[2]));
    month.addEventListener("keydown", () => setEndDate(pickers[3], pickers[4], pickers[5], pickers[0], pickers[1], pickers[2]));
    date.addEventListener("wheel", () => setEndDate(pickers[3], pickers[4], pickers[5], pickers[0], pickers[1], pickers[2]));
    date.addEventListener("keydown", () => setEndDate(pickers[3], pickers[4], pickers[5], pickers[0], pickers[1], pickers[2]));
  }
}

function setPickerCurrDate(year, month, date) {
  year.value = currYear;
  month.value = String(currMonth).padStart(2, "0");
  date.value = selectedDate;
}

function setLastDate(year, month, date) {
  const lastDates = [28, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  date.max = lastDates[month.value == 2 && isLeapYear(year.value) ? 0 : Number(month.value)];
  if (date.value > date.max) {
    date.value = date.max;
  }
}

function setEndDate(year, month, date, compYear, compMonth, compDate) {
  const taskStart = dateifyPicker(taskStartPicker);
  const taskEnd = dateifyPicker(taskEndPicker);

  if (taskStart > taskEnd) {
    year.value = compYear.value;
    month.value = compMonth.value;
    date.value = compDate.value;
  }
}

function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

// Main
getCurrMonth();
showCalendar(today.getFullYear(), today.getMonth() + 1);
prevMonthBtn.addEventListener("click", () => showCalendar(currYear, currMonth - 1));
nextMonthBtn.addEventListener("click", () => showCalendar(currYear, currMonth + 1));
todayBtn.addEventListener("click", () => showCalendar(today.getFullYear(), today.getMonth() + 1));
