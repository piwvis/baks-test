window.onerror = function (message, file, line) {
  ga("send", "event", "JS Error", file + ":" + line + "\n\n" + message);
};

(function (i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");

ga("send", "pageview");
var outerPadding = 0;

$(function () {
  init();
  // $( "canvas" ).on( "gameEnd", function(e) {
  //     console.log('game over')
  // });
  $("canvas").trigger("gameEnd");
});
