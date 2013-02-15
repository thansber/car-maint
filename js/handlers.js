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
      
      $("#cars").on("click", ".car-list .car", function() {
        var $this = $(this);
        choiceChanged($this);
        $this.siblings(".add-work").addClass("displayed");
        $this.siblings(".car").css({backgroundColor:""}).removeClass("light dark");
        Cars.updateColor($this, $this);
        Work.updateColor($this);
        Work.showForSelectedCar({clear:true});
      }).on("click", ".car-list .add-work .add", function() {
        $(this).closest(".car-list")
            .siblings(".items")
            .find(".add .new").addClass("displayed").end()
            .find(".add .close").show();
      }).on("click", ".car-list .add-car .add", function() {
        Dialog.show("cars");
        Dialog.getColorPicker().setHex("FFFFFF");
      }).on("click", ".items .close", function() {
        $(this).closest(".new").removeClass("displayed").end().hide();
      }).on("click", ".items .value", function() {
        $(this).parent().toggleClass("editable editing").find(".edit").focus().select();
      }).on("click", ".items .new .save", function() {
        Work.add();
      }).on("click", ".items .delete", function() {
        Work.remove($(this));
      }).on("focusout", ".items .edit", function() {
        var $this = $(this);
        Work.update($this);
        $this.parent().toggleClass("editable editing");
      });
      
      // =====================================
      // -------------- DIALOGS --------------
      // =====================================
      $("#dialogs").on("click", ".close", function() {
        Dialog.hide();
        return false;
      }).on("click", "button", function() {
        var $this =  $(this);
        var $dialog = $this.closest("section");
        for (var cssClass in dialogButtons) {
          var handlers = dialogButtons[cssClass] && (dialogButtons[cssClass].handlers || {});
          if ($dialog.is(cssClass)) {
            for (var buttonHandler in handlers) {
              if ($this.hasClass(buttonHandler)) {
                handlers[buttonHandler].call(this, $dialog, $this);
              }
            }
          }
        }
        return false;
      }).on("transitionend webkitTransitionEnd", ".dialog", function() {
        if ($(this).is(":not(.displayed)")) {
          $("#dialogs").addClass("hidden");
        }
      }).on("focus", ".cars.dialog input", function() {
        $(this).closest(".row").removeClass("error");
      });
      
    }
  };
});
  