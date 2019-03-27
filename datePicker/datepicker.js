$(document).ready(function() {
    $("#dp").datepicker({
        showOtherMonths: true,
        selectOtherMonths:true,
        showButtonPanel:true,
        showAnim:'clip',
        onSelect: function(dateText) {
            alert(dateText);
        }
    });
    $("#datePickerLink").on('click', function() {
        $("#dp").datepicker("show");
    });
});