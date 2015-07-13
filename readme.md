#react-infinite-list

React компонент для списка с автоподгрузкой данных при скоролле. Включает кастомный скроллбар и фиксирующийся элемент.

[Примеры](https://kocmozzz.github.io/react-infinite-list).

**Доступные свойства**
```js
{
    list: React.PropTypes.array.isRequired,             // массив элементов
    itemPosition: React.PropTypes.object,               // объект с данными текущего пользователя
    showWinner: React.PropTypes.bool,                   // показывать победителя в списке или нет
    isEnd: React.PropTypes.bool,                        // достигли конца списка или можно подгрузить еще?
    onScroll: React.PropTypes.func,                     // on scroll callback, определяет как подгрузить еще данные
    onBottomPinned: React.PropTypes.func,               // callback, когда текущий пользователь прилип снизу
    onTopPinned: React.PropTypes.func,                  // callback, когда пользователь прилип сверху
    onTopUnpinned: React.PropTypes.func,                // callback, когда пользователь отлип сверху
    classes: React.PropTypes.object.isRequired,         // css классы
    showWinner: React.PropTypes.bool.isRequired,        // показывать победителя или нет
    userUrl: React.PropTypes.string.isRequired,         
    userAvatarUrl: React.PropTypes.string.isRequired,
    userName: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired,
    position: React.PropTypes.number.isRequired,
    description: React.PropTypes.string,
    winnersDescription: React.PropTypes.string,
    positionSuffix: React.PropTypes.string,              // суффикс позиции текущего пользователя (для стилизации маркеров)                  
    loaderIcon: React.PropTypes.string                   // path to loader svg icon
}
```

**Структура json**

Список

```js
[{
    userId: "kUOQLy",
    userName: "John Doe",
    userAvatarUrl: "http://lorempixel.com/100/100/people/",
    userUrl: "http://vk.com/john_doe",
    score: 996,
    description: "Some description&nbsp;&laquo;html&raquo;",
    winnersDescription: "&laquo;Winners description&raquo;"
}]
```
description и winnersDescription - необязательны.

Текущий пользователь

```js
{
    position: 50,
    score: 900,
    userAvatarUrl: "http://lorempixel.com/100/100/people/",
    userId: "0000111122223333",
    userName: "John Doe",
    description: "Some description&nbsp;&laquo;html&raquo;",
    winnersDescription: "&laquo;Winners description&raquo;"
}
```
description и winnersDescription - необязательны. Позиция текущего пользователя в рейтинге считается с 1, а не с 0.

**Пример инициализации**
```js
<InfiniteList
  list={ this.state.list }
  itemPosition={ this.state.itemPosition }
  showWinner={ this.props.showWinner }
  isEnd={ this.state.isEnd }
  onScroll={ this._scrollCallback }
  loaderIcon="oval.svg"
/>
```