const LinkedList = require('./linked-list')

module.exports = class RangeList{
  constructor(){
    this._list = new LinkedList()

  }

  // add a range [a,b] to the list. Can overlap an existing range, will unifomize so that in the end there is no overlaping.
  addRange(a,b){
    if (!b) {
      b = a[1]
      a = a[0]
    }
    // let's find r1, the range with a inside
    var r1 = this._getRangeAtOrRangeBefore(a)
    if (r1 === null) {
      // a is before the first range
      r1 = this._list.prepend({a,b})
      if (r1.prev == null) {
        // there was no range before insertion
        return
      }
    }else if (r1.data.b < a) {
      // a is after r1, lets create a new range
      r1 = this._list.insertAfterNode(r1, {a:a,b:b})
    }else if (b <= r1.data.b) {
      // a is in r1, and b is also in r1 : nothing to do
      return
    }
    // r1 is now the first range with a inside and b is not in r1
    // let's find r2, the range with b inside
    // find the first range with upper bound higher than b
    var r2 = r1.prev
    while (r2) {
      if (b <= r2.data.b){
        break
      }
      // b if after r2, remove r2 and go to next range
      let previousr2 = r2
      r2 = r2.prev
      this._list.removeNode(previousr2)
    }
    if (r2 == null) {
      // we reach the end of the chain without finding b
      // r2 = r1
      r1.data.b = b
      return
    }
    if (r2.data.a <= b) {
      // b is in r2 => extend r1 to r2 and remove r2
      r1.data.b = r2.data.b
      this._list.removeNode(r2)
      return
    }else {
      // otherwise b is before r2 => extend r1 to b
      r1.data.b = b
      return
    }
  }

  // returns an array of all ranges [[a,b], ... , [c,d]]
  ranges(){
    var range = this._list.at(0)
    const ranges = []
    while (range) {
      ranges.push([range.data.a,range.data.b])
      range = range.prev
    }
    return ranges
  }

  _getRangeAtOrRangeBefore(a){
    var range = this._list.at(0)
    if (range && a < range.data.a) {
      return null
    }
    // find the first range with upper bound higher than a
    while (range) {
      if (a <= range.data.b){
        break
      }
      range = range.prev
    }
    if (range == null) {
      // we reach the end of the chain : return tail
      return this._list.tail()
    }
    if (range.data.a <= a) {
      // a is in range => range
      return range
    }else {
      // otherwise a is before
      return range.next
    }
  }
}
