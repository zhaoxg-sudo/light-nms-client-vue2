// import Vue  from 'vue'
function menu() {
  $(".span_large").click(function () {
    $(this).toggleClass("span_largeSelected")
    $(".deviceStatus").slideToggle()
  })
}
