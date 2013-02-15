define( /* Storage */
["jquery", "io", "util"],
function($, IO, Util) {

  var cars = null;
  var MAIN_KEY = "CAR_MAINT";
  
  var getCar = function(id) { return cars[id]; };
  var getCars = function() { return IO.readObject(MAIN_KEY) || {}; };
  var getCarIds = function() { return Object.keys(cars); };
  var saveCars = function() { IO.writeObject(MAIN_KEY, cars); };
  
  return {
    addCar: function(id) { 
      cars[id] = {};
      saveCars();
    },
    addWork: function(id, newWork) {
      var car = getCar(id);
      car.work = car.work || [];
      car.work.push(newWork);
      car.work.sort(Util.sortByDate);
      saveCars();
    },
    getCar: getCar,
    getCarIds: getCarIds,
    getNumCars: function() { return getCarIds().length; },
    init: function() {
    	  cars = getCars();
    },
    updateCar: function(id, updatedCar) {
      cars[id] = updatedCar;
      saveCars();
    }
  };
});	