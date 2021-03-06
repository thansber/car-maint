define( /* Cars */
["jquery", "dialogs", "storage", "util"],
function($, Dialog, Storage, Util) {
    
  var $cars = null;
  var $carList = null;
  
  var append = function(carId) {
    var desc = getDesc(carId);
    var car = [], i = 0;
    car[i++] = '<li class="car" data-car-id="' + carId + '">';
    car[i++] = getDesc(carId);
    car[i++] = "</li>";
    $carList.prepend($(car.join("")));
  };
  var chopCarId = function(id) { return id.split("|"); };
  var getColor = function(id) { return chopCarId(id)[3]; };
  var getDesc = function(id) { return chopCarId(id).slice(0, 3).join(" "); };
  var getSelected = function() { return $carList.find(".car.selected"); };
  var hasAny = function() { return Storage.getNumCars() > 0; };
  
  return {
    add: function($dialog) {
      var year = $dialog.find(".year.row input").val();
      var make = $dialog.find(".make.row input").val();
      var model = $dialog.find(".model.row input").val();
      var color = $("#selectedColor").val();
      var colorInitialHexMarker = /^\#/;
      if (color && colorInitialHexMarker.test(color)) {
        color = color.replace(colorInitialHexMarker, "");
      }
      
      var errors = [];
      if (!year) {
        errors.push({type:"year", message:"Please enter the year"});
      }
      if (!make) {
        errors.push({type:"make", message:"Please enter the make"});
      }
      if (!model) {
        errors.push({type:"model", message:"Please enter the model"});
      }
      
      if (errors.length > 0) {
        return {errors:errors};
      }
      var carId = [year, make, model, color].join("|");
      Storage.addCar(carId);
      
      append(carId);
      return {carId:carId};
    },
    getColor: getColor,
    getDesc: getDesc,
    getSelected: getSelected,
    getSelectedCarId: function() { return getSelected().data("car-id"); },
    hasAny: hasAny,
    init: function() {
      
      $cars = $("#cars");
      $carList = $cars.find(".car-list");
      
      Dialog.addShowCallback("cars", function($dialog, opt) {
        $dialog.find("input").eq(0).focus().select();
      });
      
      if (!hasAny()) {
        Dialog.show("cars");
        Dialog.getColorPicker().setHex("FFFFFF");
      } else {
        Storage.getCarIds().forEach(function(carId) {
          append(carId);
        });
      }
    },
    updateColor: function($car, $target) {
      var hexColor = getColor($car.data("car-id"));
      $target.css({backgroundColor:"#" + hexColor})
             .removeClass("light dark")
             .addClass(Util.textColorFromBackground(hexColor));
    }
  };    
});	