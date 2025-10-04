document.addEventListener("DOMContentLoaded", () => {
  function loadItems() {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    renderItems(habits, "habit-list", "habit");
    renderItems(tasks, "task-list", "task");
    updateProgress();
  }

  function renderItems(items, listId, type) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = "";

    items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("item", `${type}-item`);
      if (item.completed) {
        itemElement.classList.add("completed");
      }
      itemElement.dataset.id = item.id;

      itemElement.innerHTML = `
                <input type="checkbox" id="${type}-${item.id}" ${
        item.completed ? "checked" : ""
      } onchange="toggleItemDone(${item.id}, '${type}')">
                <label for="${type}-${item.id}">${item.name}</label>
                <div class="item-actions">
                    <button onclick="editItem(${
                      item.id
                    }, '${type}')"><i class="fas fa-edit"></i></button>
                    <button onclick="removeItem(${
                      item.id
                    }, '${type}')"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
      listElement.appendChild(itemElement);
    });
  }

  function updateProgress() {
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const totalItems = habits.length + tasks.length;
    const completedItems =
      habits.filter((h) => h.completed).length +
      tasks.filter((t) => t.completed).length;

    document.getElementById(
      "daily-progress-count"
    ).textContent = `${completedItems}/${totalItems}`;
    document.getElementById("completed-items-count").textContent =
      completedItems;
    document.getElementById("total-items-count").textContent = totalItems;

    const progressCircle = document.querySelector(".progress-circle");
    if (totalItems > 0) {
      const percentage = (completedItems / totalItems) * 100;
    } else {
    }

    const lastResetDate = localStorage.getItem("lastResetDate");
    const today = new Date().toDateString();

    if (lastResetDate !== today) {
      habits.forEach((habit) => (habit.completed = false));
      localStorage.setItem("habits", JSON.stringify(habits));
      localStorage.setItem("lastResetDate", today);

      renderItems(habits, "habit-list", "habit");
    }
  }

  window.openModal = function (modalId) {
    document.getElementById(modalId).style.display = "flex";
  };

  window.closeModal = function (modalId) {
    document.getElementById(modalId).style.display = "none";
  };

  window.addHabit = function () {
    const name = document.getElementById("newHabitName").value.trim();
    if (name) {
      const habits = JSON.parse(localStorage.getItem("habits")) || [];
      const newId = habits.length
        ? Math.max(...habits.map((h) => h.id)) + 1
        : 1;
      habits.push({ id: newId, name: name, completed: false });
      localStorage.setItem("habits", JSON.stringify(habits));
      document.getElementById("newHabitName").value = "";
      closeModal("addHabitModal");
      loadItems();
    }
  };

  window.addTask = function () {
    const name = document.getElementById("newTaskName").value.trim();
    if (name) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const newId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
      tasks.push({ id: newId, name: name, completed: false });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      document.getElementById("newTaskName").value = "";
      closeModal("addTaskModal");
      loadItems();
    }
  };

  window.toggleItemDone = function (id, type) {
    let items = JSON.parse(localStorage.getItem(`${type}s`)) || [];
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      items[itemIndex].completed = !items[itemIndex].completed;
      localStorage.setItem(`${type}s`, JSON.stringify(items));
      loadItems();
    }
  };

  let itemToEdit = null;

  window.editItem = function (id, type) {
    let items = JSON.parse(localStorage.getItem(`${type}s`)) || [];
    itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      document.getElementById("editItemName").value = itemToEdit.name;
      document.getElementById("editModal").dataset.type = type;
      openModal("editModal");
    }
  };

  window.saveEdit = function () {
    if (itemToEdit) {
      const newName = document.getElementById("editItemName").value.trim();
      const type = document.getElementById("editModal").dataset.type;

      if (newName) {
        let items = JSON.parse(localStorage.getItem(`${type}s`)) || [];
        const itemIndex = items.findIndex((item) => item.id === itemToEdit.id);
        if (itemIndex > -1) {
          items[itemIndex].name = newName;
          localStorage.setItem(`${type}s`, JSON.stringify(items));
          closeModal("editModal");
          itemToEdit = null;
          loadItems();
        }
      }
    }
  };

  window.removeItem = function (id, type) {
    if (confirm(`Tem certeza que deseja remover este ${type}?`)) {
      let items = JSON.parse(localStorage.getItem(`${type}s`)) || [];
      items = items.filter((item) => item.id !== id);
      localStorage.setItem(`${type}s`, JSON.stringify(items));
      loadItems();
    }
  };

  loadItems();
});
