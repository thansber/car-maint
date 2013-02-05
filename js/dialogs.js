define( /* Dialog */
["jquery"],
function($) {
  
  var $dialogs = null;
  var colorPicker = null;
  
  var showCallbacks = {};
  
  var findDialog = function(dialogClass) {
    return $dialogs.find(".dialog." + dialogClass);
  };
  
  var hide = function() {
    $dialogs.find(".dialog").removeClass("displayed");
  };

  return {
    addShowCallback: function(key, f) { showCallbacks[key] = f; },
    find: findDialog,
    getColorPicker: function() { return colorPicker; },
    hide: hide,
    init: function() {
      $dialogs = $("#dialogs");
      
      colorPicker = ColorPicker($("#slide").get(0), $("#picker").get(0), function(hex, rgb, rsv, mousePicker, mouseSlide) {
        ColorPicker.positionIndicators(
           $("#slide-indicator").get(0), 
           $("#picker-indicator").get(0), 
           mouseSlide, 
           mousePicker);
        findDialog("cars").find(".color.row .swatch").css("backgroundColor", hex);
        $("#selectedColor").val(hex);
      });
    },
    
    show: function(dialogClass, opt) {
      $dialogs.removeClass("hidden");
      var $dialog = findDialog(dialogClass);
      var displayDialog = function() { 
        $dialog.addClass("displayed"); 
        $("html, body").animate({scrollTop: 0}, "fast");
      };
      
      if (showCallbacks[dialogClass]) {
        showCallbacks[dialogClass].call(this, $dialog, opt);
      }
      setTimeout(displayDialog, 20);
    }
  };
});