'use strict';

var ListWrap = React.createClass({

  getDefaultProps: function() {
    return {
      infinite: true,
      showWinner: false,
      currentUser: true
    }
  },

  getInitialState: function() {
    /* Each word in name start with new line */
    for(var i = 0, length = list.length; i < length; i++) {
      list[i].userName = list[i].userName.replace(/\s/, '\n');

      if(i === 49) {
        list[i].userName = 'John\nDoe';
        list[i].score = 900;
      }
    }

    return {
      list: list,
      itemPosition: (this.props.currentUser) ? userPosition : null,
      isEnd: false
    }
  },

  _scrollCallback: function() {
    if(this.props.infinite) {
      this.setState({
        list: this.state.list.concat(list)
      });
    } else {
      this.setState({
        list: list.concat(list),
        isEnd: true
      });
    }

  },

  render: function() {


    return (
      <div>
        <InfiniteList
          list={ this.state.list }
          itemPosition={ this.state.itemPosition }
          showWinner={ this.props.showWinner }
          isEnd={ this.state.isEnd }
          onScroll={ this._scrollCallback }
          loaderIcon="oval.svg"
        />
      </div>
    );
  }
});