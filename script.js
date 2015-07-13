(function() {
  var JsxComponent = React.createFactory(ListWrap);


  React.render(new JsxComponent(), document.getElementById('infinite_list_1'));
  React.render(new JsxComponent({ infinite: false, showWinner: true }), document.getElementById('infinite_list_2'));
  React.render(new JsxComponent({ infinite: false, showWinner: true, currentUser: false }), document.getElementById('infinite_list_3'));
})();