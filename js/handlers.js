define(
/* Handlers */ 
["jquery", "cars", "dialogs", "work", "lib/colorpicker"], 
function($, Cars, Dialog, Work) {
  
  var dialogButtons = {
    ".cars": {
      handlers: {
        save: function($dialog, $button) {
          var result = Cars.add($dialog);
          if (result.errors) {
            result.errors.forEach(function(error, i) {
              $dialog.find(".row." + error.type).addClass("error")
                     .find(" .error").text(error.message);
            });
            return false;
          }
          
          var carDesc = Cars.getDesc(result.carId);
          var $message = $button.siblings(".message");
          $message.text(carDesc + " was saved");
          // TODO: add a delayed fade out
          return true;
        },
        done: function($dialog, $button) {
          Dialog.hide();
        }
      }
    }
  };
  
  var choiceChanged = function($choice) {
    $choice.siblings().removeClass("selected").end().addClass("selected");
  };
    
  return {
    init: function() {
      
      $("#cars .car-list").on("click", function(e) {
        var $target = $(e.target);
        if ($target.hasClass("car")) {
          choiceChanged($target);
          $target.siblings(".add-work").addClass("displayed");
          $target.siblings(".car").css({backgroundColor:""}).removeClass("light dark");
          Cars.updateColor($target, $target);
          Work.updateColor($target);
          Work.showForSelectedCar({clear:true});
        } else if ($target.parent().hasClass("add-work")) {
          $(this).siblings(".items")
                 .find(".add .new").addClass("displayed").end()
                 .find(".add .close").show();
        } else if ($target.parent().hasClass("add-car")) {
          Dialog.show("cars");
          Dialog.getColorPicker().setHex("FFFFFF");
        }
      });
      
      $("#cars .items .close").on("click", function() {
        $(this).closest(".new").removeClass("displayed").end().hide();
      });
      
      $("#cars .items .new .save").on("click", function() {
        Work.add();
      });
      
      // =====================================
      // -------------- DIALOGS --------------
      // =====================================
      $("#dialogs .close").click(function() {
        Dialog.hide();
        return false;
      });
      
      $("#dialogs button").click(function(e) {
        var $target = $(e.target);
        var $dialog = $target.closest("section");
        
        for (var cssClass in dialogButtons) {
          var handlers = dialogButtons[cssClass] && (dialogButtons[cssClass].handlers || {});
          if ($dialog.is(cssClass)) {
            for (var buttonHandler in handlers) {
              if ($target.hasClass(buttonHandler)) {
                handlers[buttonHandler].call(this, $dialog, $target);
              }
            }
          }
        };
        
        return false;
      });
      
      $("#dialogs .dialog").on("transitionend webkitTransitionEnd", function() {
        if ($(this).is(":not(.displayed)")) {
          $("#dialogs").addClass("hidden");
        }
      });
      
      $("#dialogs .cars.dialog input").on("focus", function() {
        $(this).closest(".row").removeClass("error");
      });
      
    }
  };
});
  