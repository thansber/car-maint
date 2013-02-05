require(
["jquery", "cars", "dialogs", "handlers", "io", "storage", "work", "lib/jquery.maskedinput"], 
function($, Cars, Dialog, Handlers, IO, Storage, Work) {
  $(document).ready(function() {
    IO.init();
    Dialog.init();
    Handlers.init();
    Storage.init();
    
    Cars.init();
    Work.init();
  });
});