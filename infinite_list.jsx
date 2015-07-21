'use strict';

if(typeof require === 'function') {
  var React = require('react'),
      _ = require('lodash'),
      classNames = require('classnames');
}

/**
 * List Item React class
 */
var ListItem= React.createClass({

  propTypes: {
    classes: React.PropTypes.object.isRequired,
    i: React.PropTypes.number.isRequired,
    showWinner: React.PropTypes.bool.isRequired,
    userUrl: React.PropTypes.string.isRequired,
    userAvatarUrl: React.PropTypes.string.isRequired,
    userName: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired,
    description: React.PropTypes.string,
    winnersDescription: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      description: '',
      winnersDescription: ''
    };
  },

  render: function() {
    var isWinner = false,
      description = this.props.description;

    /* if is winner and showWinner === true, replace description */
    if(this.props.i == 0 && this.props.showWinner) {
      isWinner = true;
      description = this.props.winnersDescription;
    }

    var winner = (isWinner) ? this.props.classes.listItemHighlighted : '',
      prizeWinner = (isWinner) ? this.props.classes.listItemScorePrizeHighlighted : '',
      scoreWinner = (isWinner) ? this.props.classes.listItemScoreHighlighted : '',
      linkWinner = (isWinner) ? this.props.classes.listItemLinkHighlighted : '',

      itemClasses = classNames([this.props.classes.listItem, winner]),
      prizeClasses = classNames([this.props.classes.listItemScorePrize, prizeWinner]),
      scoreClasses = classNames([this.props.classes.listItemScore, scoreWinner]),
      linkClasses = classNames([this.props.classes.listItemLink, linkWinner]);

    return (
      <li className={ itemClasses }>
        <a href={ this.props.userUrl } className={ linkClasses } target="_blank">
          <img src={ this.props.userAvatarUrl } alt={ this.props.userName } className={ this.props.classes.listItemAvatar }/>
          <span className={ this.props.classes.listItemName }>{ this.props.userName }</span>
          <span className={ scoreClasses }>
            <span className={ prizeClasses } dangerouslySetInnerHTML={{ __html: description }}></span>
            <span className={ this.props.classes.listItemScoreNums }>{ this.props.score }</span>
          </span>
        </a>
      </li>
    );
  }

});

/**
 * Pinned List Item React class
 */
var PinnedListItem = React.createClass({

  propTypes: {
    onMount: React.PropTypes.func.isRequired,
    classes: React.PropTypes.object.isRequired,
    i: React.PropTypes.number.isRequired,
    showWinner: React.PropTypes.bool.isRequired,
    userUrl: React.PropTypes.string.isRequired,
    userAvatarUrl: React.PropTypes.string.isRequired,
    userName: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired,
    position: React.PropTypes.number.isRequired,
    description: React.PropTypes.string,
    winnersDescription: React.PropTypes.string,
    isInvisible: React.PropTypes.bool,
    positionSuffix: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      description: '',
      winnersDescription: '',
      isInvisible: false,
      positionSuffix: ''
    };
  },

  componentDidMount: function() {
    this.props.onMount(this);
  },

  render: function() {
    var isWinner = false,
      description = this.props.description;

    /* if is winner and showWinner === true, replace description
     *  winners position should be 1, not 0
     * */
    if(this.props.position == 1 && this.props.showWinner) {
      isWinner = true;
      description = this.props.winnersDescription;
    }

    var winner = (isWinner) ? this.props.classes.listItemHighlighted : '',
      prizeWinner = (isWinner) ? this.props.classes.listItemScorePrizeHighlighted : '',
      scoreWinner = (isWinner) ? this.props.classes.listItemScoreHighlighted : '',
      linkWinner = (isWinner) ? this.props.classes.listItemLinkHighlighted : '',
      linkInvisible = (this.props.isInvisible) ? this.props.classes.listItemLinkInvisible : '',

      itemClasses = classNames([this.props.classes.listItem, this.props.classes.listItemCurrent, winner]),
      prizeClasses = classNames([this.props.classes.listItemScorePrize, prizeWinner]),
      scoreClasses = classNames([this.props.classes.listItemScore, scoreWinner]),
      linkClasses = classNames([this.props.classes.listItemLink, linkWinner, linkInvisible]);

    return (
      <div className={ itemClasses }>
        <a href={ this.props.userUrl } className={ linkClasses } target="_blank">
          <span className={ this.props.classes.listItemCounter }>{ this.props.position + this.props.positionSuffix }</span>
          <img src={ this.props.userAvatarUrl } alt={ this.props.userName } className={ this.props.classes.listItemAvatar }/>
          <span className={ this.props.classes.listItemName }>{ this.props.userName }</span>
          <span className={ scoreClasses }>
            <span className={ prizeClasses } dangerouslySetInnerHTML={{ __html: description }}></span>
            <span className={ this.props.classes.listItemScoreNums }>{ this.props.score }</span>
          </span>
        </a>
      </div>
    );
  }

});

/**
 * Infinite List React class
 */
var InfiniteList = React.createClass({

  /**
   * Private fields
   */
  _pinnedItem: null,
  _isPinned: false,
  _listCount: 0,

  _positionInList: false,
  _positionDOMNode: null,
  _positionDOMNodeHeight: 0,

  _scrollView: null,
  _scrollViewContainer: null,
  _scrollViewScroller: null,
  _scrollBar: null,
  _thumb: null,
  _cache: {},

  _listVisibleHeight: 0,

  _cursorDown: false,
  _prevPageY: 0,

  _scrollTop: 0,
  _direction: 'down',

  propTypes: {
    list: React.PropTypes.array.isRequired, // items list
    itemPosition: React.PropTypes.object,   // current user position object
    showWinner: React.PropTypes.bool,       // show winners or not
    isEnd: React.PropTypes.bool,            // did we reach end of list or should we load more
    onScroll: React.PropTypes.func,         // on scroll callback function, here you specify how to load more data
    onBottomPinned: React.PropTypes.func,   // current user item pinned to bottom callback
    onTopPinned: React.PropTypes.func,      // current user item pinned to top callback
    onTopUnpinned: React.PropTypes.func,    // current user item unpinned from top callback
    loaderIcon: React.PropTypes.string      // path to loader svg icon
  },

  getDefaultProps: function() {
    return {
      showWinner: true,
      isEnd: false,
      itemPosition: null,
      /**
       * Scroll threshold function. Defines when trigger onScroll prop function.
       * @param e - Event
       * @returns {boolean}
       */
      scrollThresholdFunc: function(e) {
        return e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight * 2;
      },
      /**
       * Callback function, which triggers when Current user element pinned to top of the list.
       * @param element
       * @param scrollView
       */
      onTopPinned: function(element, scrollView) {
        element.firstChild.classList.add('pinnedToTop');
      },
      /**
       * Callback function, which triggers when Current user element uppinned from top of the list.
       * @param element
       * @param scrollView
       */
      onTopUnpinned: function(element, scrollView) {
        element.firstChild.classList.remove('pinnedToTop');
      },
      /**
       * Callback function, which triggers when Current user element pinned to bottom of the list.
       * @param element
       * @param scrollView
       */
      onBottomPinned: function(element, scrollView) {},
      /**
       * Default css classes.
       */
      classes: {
        listItem: 'listItem',
        listItemCurrent: 'listItem-current',
        listItemHighlighted: 'listItem-highlighted',
        listItemScore: 'listItem__score',
        listItemScoreHighlighted: 'listItem__score-highlighted',
        listItemScorePrize: 'listItem__score__prize',
        listItemScorePrizeHighlighted: 'listItem__score__prize-highlighted',
        listItemLink: 'listItem__link',
        listItemLinkInvisible: 'listItem__link-invisible',
        listItemLinkHighlighted: 'listItem__link-highlighted',
        listItemAvatar: 'listItem__avatar',
        listItemName: 'listItem__name',
        listItemScoreNums: 'listItem__score__nums',
        listItemCounter: 'listItem__counter',
        listWrap: 'listWrap',
        list: 'list',
        loader: 'listItem-loader',
        scrollBar: 'list__scrollBar',
        scrollThumb: 'list__scrollBar__thumb',
        scrollTest: 'list__scrollTest',
        hidden: 'hidden'
      },
      /**
       * Loader svg icon path.
       */
      loaderIcon: '/oval.svg'
    }
  },

  getInitialState: function() {
    return {
      isPinnedItemInvisible: false // pinned item initially or not
    }
  },

  componentDidMount: function() {
    this.__onScroll = _.throttle(this._onScroll, 500); // save throttled copy of scroll handler
    this._listCount = this.props.list.length;

    this._scrollView = this.refs.scrollView.getDOMNode();
    this._listVisibleHeight = this._scrollView.offsetHeight;

    this._scrollViewContainer = this._scrollView.parentElement;
    this._scrollViewScroller = this._scrollView.firstChild;
    this._scrollBar = this._scrollViewContainer.querySelector('.' + this.props.classes.scrollBar);
    this._thumb = this._scrollBar.querySelector('.' + this.props.classes.scrollThumb);

    this._isPositionInList();

    if(this._positionInList) {
      this._setPositionElement();
    }

    this._getScrollbarWidth();

    this._cache.onTopPinned = _.once(this.props.onTopPinned);
    this._cache.onBottomPinned = _.once(this.props.onBottomPinned);
    this._cache.onTopUnpinned = _.once(this.props.onTopUnpinned);

    this._update()._bindEvents();
  },

  componentWillUnmount: function() {
    this._scrollView.removeEventListener('scroll', this.__onScroll);
    this._scrollView.removeEventListener('scroll', this.__animateScroll);
    this._scrollBar.removeEventListener('mousedown', this._clickTrackHandler);
    this._thumb.removeEventListener('mousedown', this._clickThumbHandler);
    document.removeEventListener('mouseup', this._mouseUpDocumentHandler);
    window.removeEventListener('resize', this._update);
    this._cache = {};
  },

  componentWillReceiveProps: function(nextProps) {
    this._listCount = nextProps.list.length;

    this._isPositionInList();
  },

  componentDidUpdate: function() {
    if(this._positionInList && !this._positionDOMNode) {
      this._setPositionElement();
    }

    this._update();
  },

  /**
   * Get browser default scroll width.
   * @private
   */
  _getScrollbarWidth: function() {
    var scrollDiv = document.createElement("div");
    scrollDiv.className = this.props.classes.scrollTest;
    document.body.appendChild(scrollDiv);

    var scrollbarWidth = (scrollDiv.offsetWidth - scrollDiv.clientWidth);
    document.body.removeChild(scrollDiv);

    this._scrollbarWidth = scrollbarWidth;
  },

  _bindEvents: function() {
    this._scrollView.addEventListener('scroll', this.__onScroll);
    this._scrollView.addEventListener('scroll', this.__animateScroll);
    this._scrollBar.addEventListener('mousedown', this._clickTrackHandler);
    this._thumb.addEventListener('mousedown', this._clickThumbHandler);
    document.addEventListener('mouseup', this._mouseUpDocumentHandler);
    window.addEventListener('resize', this._update);

    return this;
  },

  /**
   * Update scrollbar thumb, scroll view and pinned item.
   * @returns {InfiniteList}
   * @private
   */
  _update: function() {
    var height = (this._listVisibleHeight * 100 / this._scrollView.scrollHeight);

    this._thumb.style.height = (height < 100) ? (height + '%') : '';

    this._scrollView.style.width = ((this._scrollViewContainer.offsetWidth + this._scrollbarWidth).toString() + 'px');

    if(this._pinnedItem) {
      this._pinnedItem.style.width = ((this._scrollViewScroller.offsetWidth).toString() + 'px');
    }

    return this;
  },

  /**
   * Define if current user position loaded in list.
   * @private
   */
  _isPositionInList: function() {
    if(this.props.itemPosition) {
      this._positionInList = this.props.itemPosition.position <= this._listCount;
    }
  },

  /**
   * Set position DOM element, it's height and visibility
   * @private
   */
  _setPositionElement: function() {
    this._positionDOMNode = this._scrollView.firstChild.childNodes[this.props.itemPosition.position - 1];
    this._positionDOMNodeHeight = this._positionDOMNode.offsetHeight;

    this.setState({
      isPinnedItemInvisible: this._isPositionVisible()
    });
  },

  /**
   * Define if current user position in list is visible in scrollView.
   * @returns {boolean}
   * @private
   */
  _isPositionVisible: function() {
    return this._listVisibleHeight > this._positionDOMNode.offsetTop || this.props.itemPosition.position === 1;
  },

  /**
   * On scroll handler, defines whether to load data or not.
   * @param e - Event
   * @private
   */
  _onScroll: function(e) {
    if(this.props.scrollThresholdFunc(e)) {
      if(!this.props.isEnd && this._direction === 'down') {
        this.props.onScroll();
      }
    }
  },

  /**
   * General scroll animation function. Handles custom scroll animation and current user pinnig/unpinnig
   * @param e - Event
   * @private
   */
  __animateScroll: function(e) {
    /* define scroll direction */
    if(e.target.scrollTop > this._scrollTop) {
      this._direction = 'down';
    } else {
      this._direction = 'up';
    }

    this._scrollTop = e.target.scrollTop;

    /* animate scroll thumb */
    var y = (e.target.scrollTop * 100) / this._listVisibleHeight;
    this._thumb.style.msTransform = 'translateY(' + y + '%)';
    this._thumb.style.webkitTransform = 'translateY(' + y + '%)';
    this._thumb.style.transform = 'translateY(' + y + '%)';

    if(this._positionDOMNode) {
      var delta = this._positionDOMNode.offsetTop - e.target.scrollTop - this._listVisibleHeight;

      /* scroll down, unpin from bottom */
      if(e.target.scrollTop + this._listVisibleHeight >= this._positionDOMNode.offsetTop && this._direction === 'down') {
        this._pinnedItem.firstChild.style.top = delta + 'px';

        if(Math.abs(delta) >= this._positionDOMNodeHeight) {
          this._pinnedItem.firstChild.style.visibility = 'hidden';

          this._isPinned = false;
        }
      }

      /* scroll down, pin to top */
      if(e.target.scrollTop >= this._positionDOMNode.offsetTop && this._direction === 'down') {
        this._pinnedItem.firstChild.style.top = -this._listVisibleHeight + 'px';
        this._pinnedItem.firstChild.style.visibility = 'visible';

        if(!this._isPinned) {
          this._cache.onTopPinned(this._pinnedItem, this._scrollView);
          this._cache.onBottomPinned = _.once(this.props.onBottomPinned);
          this._cache.onTopUnpinned = _.once(this.props.onTopUnpinned);

          this._isPinned = true;
        }
      }

      /* scroll up, unpin from top */
      if(e.target.scrollTop < this._positionDOMNode.offsetTop && this._direction === 'up') {
        this._pinnedItem.firstChild.style.top = delta + 'px';
        this._pinnedItem.firstChild.style.visibility = 'hidden';

        this._cache.onTopUnpinned(this._pinnedItem, this._scrollView);
        this._cache.onTopPinned = _.once(this.props.onTopPinned);
        this._isPinned = false;
      }

      /* scroll down, pin to bottom */
      if(e.target.scrollTop + this._listVisibleHeight - this._positionDOMNodeHeight < this._positionDOMNode.offsetTop && this._direction === 'up') {
        this._pinnedItem.firstChild.style.top = delta + 'px';
        this._pinnedItem.firstChild.style.visibility = 'visible';

        if(parseInt(this._pinnedItem.firstChild.style.top, 10) >= 0) {
          this._pinnedItem.firstChild.style.top = 0;

          if(!this._isPinned) {
            this._cache.onBottomPinned(this._pinnedItem, this._scrollView);
            this._cache.onTopPinned = _.once(this.props.onTopPinned);

            this._isPinned = true;
          }

        }
      }
    }
  },

  /**
   * Scrollbar track click handler.
   * @param e - Event
   * @private
   */
  _clickTrackHandler: function(e) {
    var offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY),
      thumbHalf = (this._thumb.offsetHeight / 2),
      thumbPositionPercentage = ((offset - thumbHalf) * 100 / this._scrollBar.offsetHeight);

    this._scrollView.scrollTop = (thumbPositionPercentage * this._scrollView.scrollHeight / 100);
  },

  /**
   * Scrollbar thumb click handler.
   * @param e - Event
   * @private
   */
  _clickThumbHandler: function(e) {
    this._startDrag(e);
    this._prevPageY = (e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top));
  },

  /**
   * Scrollbar thumb drag handler
   * @param e - Event
   * @private
   */
  _startDrag: function(e) {
    e.stopImmediatePropagation();
    this._cursorDown = true;
    document.addEventListener('mousemove', this._mouseMoveDocumentHandler);
    document.onselectstart = function() {return false;};
  },

  /**
   * Document mouse up handler.
   * @private
   */
  _mouseUpDocumentHandler: function() {
    this._cursorDown = false;
    this._prevPageY = 0;
    document.removeEventListener('mousemove', this._mouseMoveDocumentHandler);
    document.onselectstart = null;
  },

  /**
   * Document mouse move handler.
   * @param e
   * @private
   */
  _mouseMoveDocumentHandler: function(e) {
    if (this._cursorDown === false) return;

    if (this._prevPageY) {
      var offset = ((this._scrollBar.getBoundingClientRect().top - e.clientY) * -1),
        thumbClickPosition = (this._thumb.offsetHeight - this._prevPageY),
        thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this._scrollBar.offsetHeight);

      this._scrollView.scrollTop = (thumbPositionPercentage * this._scrollView.scrollHeight / 100);
      return;
    }
  },

  /**
   * Set current user DOM node callback.
   * @param currentUser
   * @private
   */
  _setCurrentUser: function(currentUser) {
    this._pinnedItem = currentUser.getDOMNode();
  },

  render: function() {
    var isLoaderHidden = (this.props.isEnd) ? this.props.classes.hidden : '',
      loaderClasses = classNames([this.props.classes.listItem, this.props.classes.loader, isLoaderHidden]);

    var pinnedItemNode = null;

    if(this.props.itemPosition) {
      pinnedItemNode = (
        <PinnedListItem
          {...this.props.itemPosition}
          key={ this.props.itemPosition.position }
          i={ this.props.itemPosition.position }
          showWinner={ this.props.showWinner }
          onMount={ this._setCurrentUser }
          isInvisible={ this.state.isPinnedItemInvisible }
          classes={ this.props.classes }
        />
      );
    }

    return (
      <div className={ this.props.classes.listWrap }>
        <div className={ this.props.classes.scrollBar }>
          <div className={ this.props.classes.scrollThumb }></div>
        </div>
        <div className={ this.props.classes.list } ref="scrollView">
          <ol>
            { this.props.list.map(function(user, i) {
              return (
                <ListItem
                  {...user}
                  key={ i }
                  i={ i }
                  showWinner={ this.props.showWinner }
                  classes={ this.props.classes }
                  />
              );
            }, this) }
            <li className={ loaderClasses }><img src={ this.props.loaderIcon } /></li>
          </ol>
        </div>
        { pinnedItemNode }
      </div>
    );
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = InfiniteList;
} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd){
  // AMD. Register as an anonymous module.
  define(function () {
    return InfiniteList;
  });
} else {
  window.InfiniteList = InfiniteList;
}
