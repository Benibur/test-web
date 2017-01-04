Template d'un projet webpack avec coffee, stylus & jade


Prérequis :
    . node avec une version récente
    . sudo npm install webpack -g
    . sudo npm install webpack-dev-server -g

Utilisation :
    . npm install
    . puis :
        . npm run w      : lance le serveur en watch sur http://localhost:8080/webpack-dev-server

Organisation :
    . les sources sont dans src
    . l'output dans bin
    . npm run w : lance le webpack-dev-server sert les fichiers de bin




# LongListRows
Need to display a very long list of rows in HTML ? Hundreds of thousands ?
LongListRows is made for you !

## Philosophy
If you want to display a very long list, your browser will suffer. Especially if each row is a complex element with buttons, inputs, icons, complex layout...

## How it works
 - Only the rows around the visible part of the list are really instantiated in the DOM.
 - Whenever you scroll in the list, the rows that are getting too far from the visible area (viewport) are re-used by being moved to the bottom or top of the instantiated rows.
 - A call back is then called on re-used rows so that you can re-decorate the row with the correct state.

## Other interesting components for this purpose

 - **infinity.js** by Airbnb : http://airbnb.github.io/infinity/docs/infinity.html
 - **clusterize.js** : https://github.com/NeXTs/Clusterize.js

## Strengths and weaknesses
**Strengths :**

- **Cell reuse and re-decoration** : being able to move an existing one and to change only what differs (text, color, button state...) is cheaper than having to build a brand new one.
- the **rows are reused by blocks** : the viewport can scroll into the "safe zone" without triggering the move of rows. It is only when the viewport gets outside this safe zone that a block of rows are moved. Moving a block limits the number of reflows and repaints.
- **complete separation of control of the long list and of the content of the row**. LongList.js only controls the list and you are in charge of dealing the data and applying the decoration in the row.
- **Data can be retrieve asynchronously** : fetch the data of your rows only when you need to decorate them.
- **Handles resize of the viewport**
- You can **dynamically insert and delete rows** in the list.

**Limits :**

- The number of rows is mainly limited by the limits of javascript and of RAM, but you must be aware that **the height is limited by browsers** (information from clusterize.js documentation)  :
  - Webkit/Blink 134,217,726 px
  - Gecko 10,737,418 px
  - Trident 17,895,697 px
- **you have to find the correct parameters to optimize the fluidity for your context** (throttle, size of the buffer, of the safe zone and max speed).
- **all rows must have the same height**

## Exemples

## Usage

**Creation of the longList :**

       # the viewport element wich will contain the longList
       viewportElement = $('.longListViewport')[0]

       # Options of the longList
       options = {

            # unit used for the dimensions (px,em or rem)
            DIMENSIONS_UNIT   : 'em'

            # Height reserved for each row (unit defined by DIMENSIONS_UNIT)
            ROW_HEIGHT        : 2

            # number of "screens" before and after the viewport in the buffer.
            # (ex : 1.5 => 1+2*1.5=4 screens always ready)
            BUFFER_COEF       : 3

            # number of "screens" before and after the viewport corresponding to
            # the safe zone. The Safe Zone is the rows where viewport can go
            # without trigering the movement of the buffer.
            # Must be smaller than BUFFER_COEF
            SAFE_ZONE_COEF    : 2

            # minimum duration between two refresh after scroll (ms)
            THROTTLE          : 450

            # max number of viewport height by seconds : beyond this speed the
            # refresh is delayed to the next throttle
            MAX_SPEED         : 1.5

            # call back in charge of the creation of the content of a row.
            # You can keep some references on the element to some of its
            # children in order to have a direct access to them when onRowsMovedCB
            # will be called on the element.
            onRowsCreatedCB   : function(rowsToCreate){...}


            # Call back when a row of the buffer is moved and must be completly
            # redecorated
            # @param : rowsToDecorate  : [ {rank:Integer, el:Element} , ... ]
            #     Array of objects giving the rank and a reference to the
            #     element of the moved row.
            #     The array is sorted in order to optimize refresh (the most
            #     usefull to refresh is the first one)
            onRowsMovedCB     : function(rowsToDecorate){ ...}

        longList = new LongListRows(viewportElement, options)

**When viewportElement is not initialy in the DOM**
If the the viewportElement is not initialy attached in the DOM, then call
resizeHandler when the viewportElement is attached :

    longList.resizeHandler()

**To add initial new rows**
if some are already in, they will be removed

    longList.initRows(nToAdd)

**When the height of the viewportElement changes :**

    longList.resizeHandler()

**To add a row**

    longList.addRow(fromRank)

**To remove a block of rows**

    longList.removeRows(rankOrElement, nToRemove)

**To remove one row**

    longList.removeRow(rankOrElement)

**To remove all rows**

    longList.removeAllRows()

**To get the element corresponding to a rank (null if the rank is not in the DOM)**

    longList.getRowElementAt(rank)

**To get elements of rows of the buffer after a certain rank.**
Returns an empty array if the rank is after the buffer.

    getRowsAfter(rank)
