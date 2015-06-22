###

head  node
         A
prev  |  |  next
      V
tail  node

###

module.exports = class DoublyLinkedListCircular


  ###
  # Constructor. Takes no arguments.
  ###
  constructor : ->
    # pointer to first item
    @_head = null
    # pointer to the last item
    @_tail = null
    # length of list
    @_length = 0
    # counter for nodes' ids
    @_counter = 0
    return


  # Wraps data in a node object.
  _createNewNode : (data) ->
    node =
      data: data
      next: null
      next: null
      id  : @_counter
    @_counter++
    return node


  ###
  # Appends a node to the end of the list.
  ###
  append : (data) ->
    node = @_createNewNode(data)
    if @_length == 0
      # first node, so all pointers to this
      @_head = node
      @_tail = node
      @_tail.next = node
      @_tail.prev = node
      @_head.next = node
      @_head.prev = node
    else
      # put on the tail
      @_tail.prev = node
      node.next   = @_tail
      node.prev   = @_head
      @_head.next = node
      @_tail      = node
    # update count
    @_length++
    return node



  ###
  # Prepends a node to the start of the list.
  ###
  prepend : (data) ->
    node = @_createNewNode(data)
    if @_length == 0
      # we are empty, so this is the first node
      # use the same logic as append
      return @append data
    else
      # place before head
      @_head.next = node
      node.prev   = @_head
      @_tail.prev = node
      node.next   = @_tail
      @_head      = node
    # update count
    @_length++
    return node



  ###
  # Insert one node at rank.
  # if rank = length => will be inserted as tail
  # Returns null if rank out of range.
  ###
  insert : (rank, data) ->

    if @_length == 0
      return @append(data)

    if rank == 0
      return @prepend(data)

    if rank == @_length
      return @append(data)

    if @_length < rank or rank < 0
      return null

    nodeToAdd = @_createNewNode(data)
    target = @at(rank)
    if target == undefined
      return null
    next           = target.next
    target.next    = nodeToAdd
    nodeToAdd.prev = target
    nodeToAdd.next = next
    next.prev      = nodeToAdd
    @_length++
    return nodeToAdd



  ###
  # Returns the node at the specified index. The index starts at 0.
  # Undefined if index out of range.
  ###
  at : (index) ->
    if index >= 0 and index < @_length
      node = @_head
      while index--
        node = node.prev
      return node
    return undefined


  ###
  # Returns the node with the specified id, undefined if wrong id.
  ###
  id : (id) ->
    id = parseInt(id)
    index = @_length
    node = @_head
    _head = @_head
    while index--
      if node.id == id
        return node
      node = node.prev
    return undefined


  ###
  # Returns the rank of a node, undefined if node not found
  ###
  rank : (node) ->
    rank = 0
    id = parseInt(id)
    index = @_length
    currentNode = @_head
    while index--
      if currentNode == node
        return @_length - index
      currentNode = currentNode.prev
    return undefined


  ###
  # Returns the node at the head of the list.
  ###
  head : ->
    @_head


  ###
  # Returns the node at the tail of the list.
  ###
  tail : ->
    @_tail


  ###
  # Returns the size of the list.
  ###
  size : ->
    @_length


  ###
  # Removes the item at the index.
  ###
  remove : (index) ->
    node = @at(index)
    if node == undefined
      return false
    return @_removeNode(node)


  ###
  # Removes the item with this id
  ###
  removeID : (id) ->
    node = @id(parseInt(id))
    if node == undefined
      return false
    return @_removeNode(node)


  _removeNode : (node) ->

    if @_length == 0
      return null

    if @_length == 1
      @_head    = null
      @_tail    = null
      @_length  = 0
      return node

    if node == @_head     # head
      @_head       = node.prev
      @_head.next  = @_tail
      @_tail.prev  = @_head
      node.prev    = null
      node.next    = null
      @_length    -= 1
      return node

    if node == @_tail     # tail
      @_tail       = node.next
      @_tail.prev  = @_head
      @_head.next  = @_tail
      node.next    = null
      node.prev    = null
      @_length    -= 1
      return node

    prev = node.prev
    next = node.next
    prev.next  = next
    next.prev  = prev
    node.prev  = null
    node.next  = null
    @_length  -= 1
    return node


  printIdChain : () ->
    node = @_head
    if node == null
      console.log 'empty chain'
      return
    txt = []
    index = @_length
    while index--
      txt.push(node.id)
      node = node.prev
    return txt.join('-')



  printDataChain : () ->
    node = @_head
    if node == null
      console.log 'empty chain'
      return
    txt = []
    index = @_length
    while index--
      txt.push(node.data)
      node = node.prev
    return txt.join('-')




