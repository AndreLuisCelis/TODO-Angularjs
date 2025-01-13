
app.controller('MainController', function ($scope) {
    $scope.message = "AngularJS";
  
    $scope.items = [];
  
    $scope.indexEditItem = null;

    $scope.newItem = null;
    
  
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
      }
    };
  
    $scope.removeItem = function (item) {
      if (item) {
        let index = $scope.items.indexOf(item);
        $scope.items.splice(index, 1);
      }
    };
  
    $scope.editItem = function (item) {
      let input = document.getElementById('new');
      input.value = item;
      console.log(item);
      if (item) {
        let index = $scope.items.indexOf(item);
        $scope.indexEditItem = index;
        $scope.newItem = item;
      }
    };
  });