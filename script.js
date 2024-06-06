const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter === 'completed' && todo.status !== 'completed') return '';
  if (filter === 'pending' && todo.status !== 'pending') return '';
  if (filter === 'priority' && !todo.priority) return '';

  let checked = todo.status === "completed" ? "checked" : "";
  let priorityIcon = todo.priority ? 
    '<button class="priority-btn" data-index="' + index + '" onclick="markPriority(this)"><i class="fas fa-star"></i></button>' : 
    '<button class="priority-btn" data-index="' + index + '" onclick="markPriority(this)"><i class="far fa-star"></i></button>';

  return `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <div>
        <button class="edit-btn" data-index="${index}" onclick="edit(this)"><i class="fas fa-edit"></i></button>
        ${priorityIcon}
        <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="far fa-trash-alt"></i></button>
      </div>
    </li>
  `;
}

function showTodos() {
  let todos = "";
  todosJson.forEach((todo, index) => {
    todos += getTodoHtml(todo, index);
  });
  todosHtml.innerHTML = todos;
  emptyImage.style.display = todosJson.length > 0 ? "none" : "block";
}

function addOrSearchTodo() {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  // Check if the input matches an existing task for search
  const existingTaskIndex = todosJson.findIndex(t => t.name.toLowerCase() === todo.toLowerCase());
  if (existingTaskIndex !== -1) {
    searchTodos(todo);
    return;
  }
  // If not a search, add the task
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending", priority: false });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    addOrSearchTodo();
  }
});

addButton.addEventListener("click", () => {
  addOrSearchTodo();
});

function searchTodos(searchText) {
  const filteredTasks = todosJson.filter(todo => todo.name.toLowerCase().includes(searchText.toLowerCase()));
  let todos = "";
  filteredTasks.forEach((todo, index) => {
    todos += getTodoHtml(todo, index);
  });
  todosHtml.innerHTML = todos;
}

function updateStatus(todo) {
  let todoName = todo.parentElement.querySelector('span');
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function markPriority(todo) {
  const index = todo.dataset.index;
  todosJson[index].priority = !todosJson[index].priority;
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function edit(todo) {
  const index = todo.dataset.index;
  const newName = prompt("Edit task name:", todosJson[index].name);
  if (newName && newName.trim() && newName !== todosJson[index].name) {
    if (todosJson.some((t, i) => t.name.toLowerCase() === newName.toLowerCase() && i !== index)) {
      alert("Given name already exists. Please enter a different name.");
      return;
    }
    todosJson[index].name = newName.trim();
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  }
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = el.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

