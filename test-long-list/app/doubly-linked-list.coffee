###

head  node
         A
next  |  |  prev
      V
tail  node

###

module.exports = class DoublyLinkedList


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
      prev: null
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
    else
      # put on the tail
      @_tail.next = node
      node.prev = @_tail
      @_tail = node
    # update count
    @_length++
    return node


  ###
  # Prepends a node to the start of the list.
  ###
  prepend : (data) ->
    node = @_createNewNode(data)
    if @first == null
      # we are empty, so this is the first node
      # use the same logic as append
      return @append data
    else
      # place before head
      @_head.prev = node
      node.next = @_head
      @_head = node
    # update count
    @_length++
    return node


  ###
  # Returns the node at the specified index. The index starts at 0.
  # Undefined if index out of range.
  ###
  at : (index) ->
    if index >= 0 and index < @_length
      node = @_head
      while index--
        node = node.next
      return node
    return undefined


  ###
  # Returns the node with the specified id, undefined if wrong id.
  ###
  id : (id) ->
    id = parseInt(id)
    index = @_length
    node = @_head
    while node and node.id != id
      node = node.next
    if node
      return node
    else
      return undefined


  ###
  # Returns the rank of a node, undefined if node not found
  ###
  rank : (node) ->
    rank = 0
    id = parseInt(id)
    index = @_length
    currentNode = @_head
    loop
      if node == currentNode
        return rank
      rank++
      currentNode = currentNode.next
      break if currentNode == null
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
    prev = node.prev
    next = node.next
    if prev == null     # head
      if next == null   # and tail (only one node)
        @_head    = null
        @_tail    = null
        @_length  = 0
        return node
      @_head       = next
      @_head.prev  = null
      node.next    = null
      @_length    -= 1
      return node
    if next == null     # tail
      @_tail       = prev
      @_tail.next  = null
      @_length    -= 1
      node.prev    = null
      return node
    next.prev  = prev
    prev.next  = next
    node.next  = null
    node.prev  = null
    @_length  -= 1
    return node


  printIdChain : () ->
    node = @_head
    if node == null
      console.log 'empty chain'
      return
    txt = ''
    loop
      txt += node.id
      node = node.next
      break if node == null
      txt += '<=>'
    console.log txt




