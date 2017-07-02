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
      @_tail.prev = node
      node.next = @_tail
      @_tail = node
    # update count
    @_length++
    return node



  ###
  # Prepends a node to the start of the list.
  ###
  prepend : (data) ->
    if @_head == null
      # list is empty, so this is the first node
      # use the same logic as append
      return @append data
    else
      node = @_createNewNode(data)
      # place before head
      @_head.next = node
      node.prev = @_head
      @_head = node
    # update count
    @_length++
    return node


  ###
  # Insert one node at rank.
  # Returns the new node, undefined if rank out of range.
  ###
  insert : (rank, data) ->

    if @_length == 0
      if rank != 0
        return undefined
      return @append(data)

    if rank == 0
      return @prepend(data)

    if rank == @_length
      return @append(data)

    if @_length < rank or rank < 0
      return undefined

    nodeToAdd = @_createNewNode(data)
    target = @at(rank)
    if target == undefined
      return undefined
    next           = target.next
    target.next    = nodeToAdd
    nodeToAdd.prev = target
    nodeToAdd.next = next
    next.prev      = nodeToAdd
    @_length++
    return nodeToAdd

  ###
  # Insert a new node after one
  # Returns the new node
  ###
  insertAfterNode : (prevNode, data) ->
    if prevNode.next == null
      return @append(data)
    nodeToAdd = @_createNewNode(data)
    target = prevNode
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
    while node and node.id != id
      node = node.prev
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
      if currentNode == node
        return rank
      rank++
      currentNode = currentNode.prev
      break if currentNode == null
    return undefined


  ###
  # Returns the node at the head of the list.
  ###
  head : ->
    return @_head


  ###
  # Returns the node at the tail of the list.
  ###
  tail : ->
    return @_tail


  ###
  # Returns the size of the list.
  ###
  size : ->
    return @_length


  ###
  # Removes the item at the index.
  # returns undefined if index out of range
  ###
  remove : (index) ->
    node = @at(index)
    if node == undefined
      return undefined
    return @removeNode(node)


  ###
  # Removes the item with this id
  # Returns undefined if id not in the chain
  ###
  removeID : (id) ->
    node = @id(id)
    if node == undefined
      return undefined
    return @removeNode(node)



  removeNode : (node) ->
    if @_length == 0
      return undefined

    if @_length == 1
      if node != @_head
        return undefined
      @_head    = null
      @_tail    = null
      @_length  = 0
      return node

    # head and length > 1
    if node == @_head
      @_head       = node.prev
      @_head.next  = null
      node.prev    = null
      @_length    -= 1
      return node

    # tail and length > 1
    if node == @_tail
      @_tail       = node.next
      @_tail.prev  = null
      node.next    = null
      @_length    -= 1
      return node

    # node is in the middle of the list
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
      return 'empty chain'
    txt = []
    index = @_length
    while index--
      txt.push(node.id)
      node = node.prev
    return txt.join('-')

  printAllChain : () ->
    node = @_head
    if node == null
      return 'empty chain'
    txt = []
    index = @_length
    length = @_length - 1
    while index--
      rk = length - index
      txt.push("#{rk} - id:#{node.id} - data:#{node.data}")
      node = node.prev
    return txt.join('\n')

  printDataChain : () ->
    node = @_head
    if node == null
      return 'empty chain'
    txt = []
    index = @_length
    while index--
      # console.log index, node
      txt.push(node.data)
      node = node.prev
    return txt.join('-')
