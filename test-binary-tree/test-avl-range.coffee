AVLT = require('binary-search-tree').AVLTree
BST  = require('binary-search-tree').BinarySearchTree


# hack of the search fonction so that it looks for a key with "the highest value
# of all the lower than the searched value"
BST.prototype.search = (key, prevLower, prevHigher) ->
    # console.log 'myseach', key
    if !@hasOwnProperty('key')
        return []

    if @compareKeys(@key, key) == 0
        return @data

    if @compareKeys(key, @key) < 0
        if @left
            return @left.search key, prevLower, this
        else
            if prevLower
                return prevLower.data
            else
                return []
    else
        if @right
            return @right.search key, this, prevHigher
        else
            return @data


tree = new AVLT()

tree.insert(0,'m0')
tree.insert(5,'m5')
tree.insert(10,'m10')
tree.insert(15,'m15')
tree.insert(20,'m20')
tree.insert(25,'m25')
tree.insert(30,'m30')
tree.insert(35,'m35')
tree.insert(40,'m40')

console.log "search(0) :", tree.search(0) # expected : m0
for i in [2..37] by 5
    console.log "search(#{i}) :", tree.search(i)

console.log "search(40) :", tree.search(40) # expected : m40
console.log "search(100) :", tree.search(100) # expected : m40
console.log "search(-100) :", tree.search(-100) # expected : []
