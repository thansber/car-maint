define( /* Work */
["jquery", "cars", "storage", "util"],
function($, Cars, Storage, Util) {

  var $cars = null;
  var $items = null;
  var $newWork = null;
  
  var workValueFormatters = {
    date: function(value) { return value; },
    price: function(value) { return Util.formatNumber(value, {includeDollar:true}); },
    who: function(value) { return value; },
    mileage: function(value) { return Util.formatNumber(value) + " miles"; },
    desc: function(value) { return value; }
  };
  
  var editableFieldMarkup = function(cssClass, value, editableValue) {
    var markup = [], m = 0;
    markup[m++] =   '<p class="' + cssClass + ' editable" data-field="' + cssClass + '">';
    markup[m++] =     '<span class="value view">' + value + '</span>';
    markup[m++] =     '<input type="text" value="' + (editableValue === undefined ? value : editableValue) + '" class="edit" />';
    markup[m++] =   '</p>';
    return markup.join("");
  };

  var itemMarkup = function(item) {
    var markup = [], m = 0;
    
    markup[m++] = '<li class="item">';
    markup[m++] = editableFieldMarkup("date", item.date);
    markup[m++] = editableFieldMarkup("price", Util.formatNumber(item.price, {includeDollar:true}), item.price);
    markup[m++] = editableFieldMarkup("who", item.who);
    markup[m++] = editableFieldMarkup("mileage", Util.formatNumber(item.mileage) + " miles", item.mileage);
    
    markup[m++] = '<p class="desc editable" data-field="desc">';
    markup[m++] =   '<span class="value view">' + item.desc + '</span>';
    markup[m++] =   '<textarea class="edit">' + item.desc + '</textarea>';
    markup[m++] = '</p>';
    markup[m++] = '<p class="delete" title="Delete this work item"></p>';
    markup[m++] = '</li>';
    
    return $(markup.join(""));
  };
  
  var fromInput = function() {
    return {
      date: $newWork.find(".date").val(),
      price: $newWork.find(".price").val(),
      who: $newWork.find(".who").val(),
      mileage: $newWork.find(".mileage").val(),
      desc: $newWork.find(".desc").val()
    };
  };
  
  var showForSelectedCar = function(opt) {
    opt = opt || {};
    if (opt.clear) {
      $items.find(".item").remove();
    }
    var car = Storage.getCar(Cars.getSelectedCarId());
    if (!car.work) {
      return;
    }
    
    car.work.forEach(function(item) {
      var $item = itemMarkup(item);
      $items.append($item);
      $item.find(".date input").mask("99/99/9999");
    });
  };
  
  var updateWorkValue = function(field, value) {
    
  };
  
  return {
    add: function() {
      Storage.addWork(Cars.getSelectedCarId(), fromInput());
      showForSelectedCar({clear:true});
    },
   	init: function() {
      $cars = $("#cars");
      $items = $cars.find(".items");
      
      $newWork = $cars.find(".items .add .new");
      $newWork.find(".date").mask("99/99/9999");
   	},
   	remove: function($deleteButton) {
   	  var index = $items.find(".item").index($deleteButton.closest(".item"));
      var car = Storage.getCar(Cars.getSelectedCarId());
      car.work.splice(index, 1);
      Storage.updateCar(Cars.getSelectedCarId(), car);
      showForSelectedCar({clear:true});
   	},
    showForSelectedCar: showForSelectedCar,
    update: function($input) {
      var field = $input.parent().data("field");
      var index = $items.find(".item").index($input.closest(".item"));
      var car = Storage.getCar(Cars.getSelectedCarId());
      // update view mode text
      $input.siblings(".value").html(workValueFormatters[field]($input.val()));
      car.work[index][field] = $input.val();
      Storage.updateCar(Cars.getSelectedCarId(), car);
    },
    updateColor: function($car) {
      Cars.updateColor($car, $items);
    }
  };    
});	