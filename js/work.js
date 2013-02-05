define( /* Work */
["jquery", "cars", "storage", "util"],
function($, Cars, Storage, Util) {

  var $cars = null;
  var $items = null;
  var $newWork = null;
  
  var editableFieldMarkup = function(cssClass, value) {
    var markup = [], m = 0;
    markup[m++] =   '<p class="' + cssClass + ' editable">';
    markup[m++] =     '<span class="value view">' + value + '</span>';
    markup[m++] =     '<input value="' + value + '" class="edit" />';
    markup[m++] =   '</p>';
    return markup.join("");
  };

  var itemMarkup = function(item) {
    var markup = [], m = 0;
    
    markup[m++] = '<li class="item">';
    markup[m++] = editableFieldMarkup("date", item.date);
    markup[m++] = editableFieldMarkup("price", Util.formatNumber(item.price, {includeDollar:true}));
    markup[m++] = editableFieldMarkup("who", item.who);
    markup[m++] = editableFieldMarkup("mileage", Util.formatNumber(item.mileage) + " miles");
    markup[m++] = editableFieldMarkup("desc", item.desc);
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
    
    car.work.sort(sortByWorkDate);
    car.work.forEach(function(item) {
      $items.append(itemMarkup(item));
    });
  };
  
  var sortByWorkDate = function(a, b) {
    var dateA = +new Date(a.date);
    var dateB = +new Date(b.date);
    return dateB - dateA;
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
    showForSelectedCar: showForSelectedCar,
    updateColor: function($car) {
      Cars.updateColor($car, $items);
    }
  };    
});	