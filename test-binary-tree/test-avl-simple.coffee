avlt = new (require('binary-search-tree').AVLTree)()

avlt.insert(0,'m0')
avlt.insert(5,'m5')
avlt.insert(10,'m10')
avlt.insert(15,'m15')

console.log 'search(10) :'
console.log avlt.search(10)

console.log 'search(11) :'
console.log avlt.search(11)