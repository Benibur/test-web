
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    $('body').html( require('body')() )
    txtArea = document.getElementById("txtArea")
    editableDiv = document.getElementById("editableDiv")

    addCell = (row, text) ->
        cell = row.insertCell(-1)
        cell.appendChild(document.createTextNode(text))

    table     = document.createElement('table')
    thead     = table.createTHead()
    row       = thead.insertRow(-1)
    lableList = ['#', 'type', 'which', 'keyCode', 'charCode', 'line value', 'e.altKey', 'e.ctrlKey', 'e.shiftKey', 'e.meta']
    addCell(row, lable) for lable in lableList
    document.getElementById('tableContainer').appendChild(table)
    tbody = document.createElement('tbody')
    table.appendChild(tbody)
    rowIndex = 1

    addRowForEvent = (e) ->
        console.log 'ttot'
        row = tbody.insertRow(0)
        row.className = if (rowIndex % 2) == 0 then 'odd' else 'even'
        addCell(row, rowIndex)
        addCell(row, e.type)
        addCell(row, e.which    + ' (' + String.fromCharCode(e.which   ) + ')' )
        addCell(row, e.keyCode  + ' (' + String.fromCharCode(e.keyCode ) + ')' )
        addCell(row, e.charCode + ' (' + String.fromCharCode(e.charCode) + ')' )
        addCell(row, txtArea.value )
        addCell(row, e.altKey )
        addCell(row, e.ctrlKey )
        addCell(row, e.shiftKey )
        addCell(row, e.metaKey )
        rowIndex += 1


    # TXTAREA EVENTS
    txtArea.addEventListener "keydown", (e)->
        addRowForEvent(e)
        console.log('keydown, value="' + this.value + '"')

    txtArea.addEventListener "keypress", (e)->
        addRowForEvent(e)
        console.log('keypress, value="' + this.value + '"')

    txtArea.addEventListener "keyup", (e)->
        addRowForEvent(e)
        console.log('keyup, value="' + this.value + '"')


    # EDITABLEDIV EVENTS
    editableDiv.addEventListener "keydown", (e)->
        addRowForEvent(e)
        console.log('keydown, value="' + this.value + '"')

    editableDiv.addEventListener "keypress", (e)->
        addRowForEvent(e)
        console.log('keypress, value="' + this.value + '"')

    editableDiv.addEventListener "keyup", (e)->
        addRowForEvent(e)
        console.log('keyup, value="' + this.value + '"')


    # MOUSE EVENTS
    editableDiv.addEventListener "mousedown", (e)->
        console.log('mousedown')

    editableDiv.addEventListener "mouseup", (e)->
        console.log('mouseup')

    editableDiv.addEventListener "click", (e)->
        console.log('click')

    editableDiv.addEventListener "drop", (e)->
        e.preventDefault()
        console.log('drop')

