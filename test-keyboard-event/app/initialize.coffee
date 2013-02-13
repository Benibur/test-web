
# Initialize the application on DOM ready event.
$(document).on 'ready', ->
    $('body').html( require('body')() )
    txtArea = document.getElementById("txtArea")

    addCell = (row, text) ->
        cell = row.insertCell(-1)
        cell.appendChild(document.createTextNode(text))

    table     = document.createElement('table')
    thead     = table.createTHead()
    row       = thead.insertRow(-1)
    lableList = ['#', 'type', 'which', 'keyCode', 'charCode']
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
        for i in [5..(lableList.length - 1)] by 1
            addCell(row, e[ lableList[i] ])
        rowIndex += 1

    txtArea.addEventListener "keyup", (e)->
        addRowForEvent(e)
        console.log('keyup, value="' + this.value + '"')

    txtArea.addEventListener "keydown", (e)->
        addRowForEvent(e)
        console.log('keydown, value="' + this.value + '"')
        # showEventProperties(e)

    txtArea.addEventListener "keypress", (e)->
        addRowForEvent(e)
        console.log('keypress, value="' + this.value + '"')

