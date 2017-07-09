CircularList = require('../src/linked-circular-list')
List         = require('../src/linked-list')
expect       = require('chai').expect


###*
 * helper to test the coherence of a list (lenght, head, tail...)
###
_testCircularCoherence = (l) ->
    head = l.head()
    tail = l.tail()
    length = l.size()
    expect(length).to.be.at.least(0)

    # test case empty list
    if length == 0
        expect(head).to.be.null
        expect(tail).to.be.null
        return

    # test the prev chain
    node = head
    rk   = 0
    ids  = {}
    loop
        expect(ids[node.id]).to.be.undefined
        ids[node.id] = true
        node = node.prev
        rk++
        break if node == head or length < rk
    expect(rk).to.eql(length)

    # test the next chain
    node = tail
    rk   = 0
    loop
        expect(ids[node.id]).to.be.true
        ids[node.id] = true
        node = node.next
        rk++
        break if node == tail or length < rk
    expect(rk).to.eql(length)

    # test circularity
    expect(head.next).to.eql(tail)
    expect(tail.prev).to.eql(head)


_testCoherence = (l) ->
    head = l.head()
    tail = l.tail()
    length = l.size()
    expect(length).to.be.at.least(0)

    # test case empty list
    if length == 0
        expect(head).to.be.null
        expect(tail).to.be.null
        return

    # test the prev chain
    node = head
    rk   = 0
    ids  = {}
    loop
        expect(ids[node.id]).to.be.undefined
        ids[node.id] = true
        node = node.prev
        rk++
        break if node == null or length < rk
    expect(rk).to.eql(length)

    # test the next chain
    node = tail
    rk   = 0
    loop
        expect(ids[node.id]).to.be.true
        ids[node.id] = true
        node = node.next
        rk++
        break if node == null or length < rk
    expect(rk).to.eql(length)

    # test non circularity
    expect(head.next).to.be.null
    expect(tail.prev).to.be.null



###*
 * TESTS
###
test = (listType, ListClass, _testCoherence) ->

    l = new ListClass()

    describe "#{listType}.insert(rk,data)", ->
        before () ->
            l.insert(0,'b') # insert in empty list
            l.insert(1,'d') # insert at end
            l.insert(1,'c') # insert in the middle
            l.insert(3,'e') # insert at end
            l.insert(0,'a') # insert at the beginning
            l.insert(2,'m') # insert at the beginning
            # console.log l.printAllChain()
        it 'should pass test', () ->
            res  = l.printDataChain()
            expect(res).to.eql('a-b-m-c-d-e')
            res1 = l.insert(-1,'Z') # insert out of scope
            res2 = l.insert(7,'X')  # insert out of scope
            expect(res1).to.be.undefined
            expect(res2).to.be.undefined
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.append(data)", ->
        before () ->
            l = new ListClass()
            l.append('b')   # append in empty list
            l.append('c')   # append
            l.append('d')   # append
            l.insert(3,'e') # insert at the end
            l.insert(0,'a') # insert at the beginning
            l.append('f')   # append at end
        it 'should pass test', () ->
            res = l.printDataChain()
            expect(res).to.eql('a-b-c-d-e-f')
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.prepend(data)", ->
        before () ->
            l = new ListClass()
            l.prepend('f')   # prepend in empty list
            l.prepend('e')   # prepend
            l.prepend('c')   # prepend
            l.prepend('b')   # prepend
            l.insert(2,'d')  # insert in the middle
            l.append('g')    # insert at the end
            l.prepend('a')   # prepend at end
        it 'should pass test', () ->
            res = l.printDataChain()
            expect(res).to.eql('a-b-c-d-e-f-g')
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.at(rank)", ->
        it 'should pass tests', () ->
            node0 = l.at(0)
            expect(node0).to.eql(l.head())
            node6 = l.at(6)
            expect(node6).to.eql(l.tail())
            node3 = l.at(3)
            expect(node3.data).to.eql('d')
            node7 = l.at(7)
            expect(node7).to.be.undefined
            node00 = l.at(-1)
            expect(node00).to.be.undefined
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.id(id)", ->
        it 'should pass tests', () ->
            # console.log l.printIdChain()
            # console.log l.printDataChain()
            node0 = l.id(0)
            expect(node0.data).to.eql('f')
            node2 = l.id(2)
            expect(node2.data).to.eql('c')
            node6 = l.id(6)
            expect(node6.data).to.eql('a')
            expect(node6).to.eql(l.head())
            node5 = l.id(5)
            expect(node5.data).to.eql('g')
            expect(node5).to.eql(l.tail())
            nodeWrong = l.id(100)
            expect(nodeWrong).to.be.undefined
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.rank(node)", ->
        it 'should pass tests', () ->
            # console.log l.printAllChain()
            node0 = l.id(0)
            expect(l.rank(node0)).to.eql(5)
            node6 = l.id(6)
            expect(l.rank(node6)).to.eql(0)
            node5 = l.id(5)
            expect(l.rank(node5)).to.eql(l.size()-1)
            nodeWrong = l.id(100)
            expect(l.rank({})).to.be.undefined
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.remove(rank)", ->
        before () ->
            # console.log l.printAllChain()
            l.remove(0)
            l.remove(5)
            l.remove(2)
        it 'should pass tests', () ->
            res = l.printDataChain()
            expect(res).to.eql('b-c-e-f')
            res1 = l.remove(4)
            expect(res1).to.undefined
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.removeID(id)", ->
        before () ->
            # reconstruct the chain
            l.prepend('a')
            l.insert(3,'d')
            l.append('g')
            # console.log l.printAllChain()
            l.removeID(7)
            l.removeID(9)
            l.removeID(2)
        it 'should pass tests', () ->
            res = l.printDataChain()
            expect(res).to.eql('b-d-e-f')
            res1 = l.removeID(100)
            expect(res1).to.undefined
        it 'should be coherent', () ->
            _testCoherence(l)

    describe "#{listType}.remove(rank) - remove all nodes", ->
        before () ->
            l = new ListClass()
            l.append('c')
            l.prepend('a')
            l.insert(1,'b')
            l.remove(0)
            l.remove(1)
            l.remove(0)
        it 'should pass tests', () ->
            res = l.printDataChain()
            expect(res).to.eql('empty chain')
            res1 = l.remove(0)
            expect(res1).to.be.undefined
        it 'should be coherent', () ->
            _testCoherence(l)

test('list', List, _testCoherence)

test('circularList', CircularList, _testCircularCoherence)
