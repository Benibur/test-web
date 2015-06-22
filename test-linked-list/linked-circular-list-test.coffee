CircularLinkedList   = require('./doubly-linked-list-circular')

mocha = require('../vendor/scripts/mocha')

l = new CircularLinkedList()
l.insert(0,'a')
l.insert(0,'b')
l.insert(0,'c')
l.insert(0,'d')
res = l.printDataChain()
console.log res
'd-c-b-a'


l.append('e')
l.append('f')
l.append('g')
l.append('h')
l.printDataChain()
'd-c-b-a-e-f-g-h'

l.prepend('i')
l.printDataChain()
'i-d-c-b-a-e-f-g-h'

l.insert(1,'i1')
l.printDataChain()
'i-i1-d-c-b-a-e-f-g-h'

l.insert(9,'i2')
l.printDataChain()
'i-i1-d-c-b-a-e-f-g-i2-h'

l.remove(8)
l.printDataChain()
'i-i1-d-c-b-a-e-f-i2-h'

l.remove(0)
l.printDataChain()
'i1-d-c-b-a-e-f-i2-h'

l.remove(l.size()-1)
l.printDataChain()
'i1-d-c-b-a-e-f-i2'
