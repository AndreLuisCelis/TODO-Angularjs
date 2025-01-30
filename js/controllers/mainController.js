
app.controller('MainController', function ($scope) {
  $scope.message = "AngularJS";

  $scope.items = JSON.parse(localStorage.getItem("todos")) || [];

  $scope.checkedTodos = JSON.parse(localStorage.getItem("feito")) || [];

  $scope.indexEditItem = null;

  $scope.newItem = null;

  const updateTodos = () => {
    localStorage.setItem("todos", JSON.stringify($scope.items));
  };

  const saveCheckedTodos = () => {
    localStorage.setItem("feito", JSON.stringify($scope.checkedTodos));
  }

  const getCheckedTodos = () => {
    $scope.checkedTodos.map(todo => {
      let todoChecked = document.getElementById(todo);
      let btnTodoChecked = document.getElementById('btn-' + todo);
      if (todoChecked) { // Verifica se o elemento existe
        todoChecked.style.textDecoration = "line-through";
        btnTodoChecked.innerText = "Refazer";
      }
    });
  };

  setTimeout(() => {
    getCheckedTodos();
    startSortable();
  }, 200);

  const startSortable = () => {
    const list = document.getElementById("sortable-list");

    let draggingElement = null;

    list.addEventListener("dragstart", (event) => {
      draggingElement = event.target;
      event.target.classList.add("dragging");
    });

    list.addEventListener("dragend", (event) => {
      event.target.classList.remove("dragging");
      draggingElement = null;
      saveOrder();
      updateTodos();
    });

    list.addEventListener("dragover", (event) => {
      event.preventDefault(); // Necessário para permitir o drop
      const afterElement = getDragAfterElement(list, event.clientY);
      if (afterElement == null) {
        list.appendChild(draggingElement);
      } else {
        list.insertBefore(draggingElement, afterElement);
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [
        ...container.querySelectorAll("li:not(.dragging)"),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }

    const saveOrder = () => {
      const items = document.querySelectorAll("#sortable-list li");
      const newOrderItems = Array.from(items).map((item) =>
        item.children.item(0).innerText
      );
      $scope.items = newOrderItems;
    };
  }

  $scope.addItem = function () {
    let input = document.getElementById('new');
    let inputValue = input.value;
    $scope.newItem = inputValue;
    if ($scope.newItem) {
      if ($scope.indexEditItem || $scope.indexEditItem == 0) {
        $scope.items[$scope.indexEditItem] = $scope.newItem;
        $scope.indexEditItem = null;
      } else {
        $scope.items.push($scope.newItem);
      }
      $scope.items = [...new Set($scope.items)];
      $scope.newItem = ''; // Limpa o campo de entrada
      input.value = $scope.newItem;
      updateTodos();
    }
  };

  $scope.removeItem = function (item) {
    if (item) {
      let index = $scope.items.indexOf(item);
      $scope.items.splice(index, 1);
      updateTodos();
    }
  };

  $scope.editItem = function (item) {
    let input = document.getElementById('new');
    input.value = item;
    if (item) {
      let index = $scope.items.indexOf(item);
      $scope.indexEditItem = index;
      $scope.newItem = item;
    }
  };

  $scope.checkItem = function (item, btn) {
    let todo = document.getElementById(item);
    if (todo.style.textDecoration === "line-through") {
      todo.style.textDecoration = "none";
      btn.innerText = "Feito";
      let index = $scope.checkedTodos?.indexOf(item);
      $scope.checkedTodos?.splice(index, 1);
      saveCheckedTodos();
    } else {
      todo.style.textDecoration = "line-through";
      btn.innerText = "Refazer";
      $scope.checkedTodos.push(item);
      $scope.checkedTodos = [...new Set($scope.checkedTodos)];
      saveCheckedTodos();
    }
  };
});