const RangeList = require('../src/range-list')
const expect    = require('chai').expect
art             = require('ascii-art')

list = new RangeList()

// helper to test the coherence of a list (lenght, head, tail...)
_testCoherence = (l) => {
  const ranges = l.ranges()
  var previousUpperBound = Number.NEGATIVE_INFINITY
  for (rg of ranges) {
    expect(rg[0]).to.be.lessThan(rg[1]) // a < b
    expect(previousUpperBound).to.be.lessThan(rg[0]) // previous_b < a
    previousUpperBound = rg[1]
  }
}


var rgToAdd // the range to add
try {

  // add first range
  rgToAdd = [10,20]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [10, 20] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a range at the beginning
  rgToAdd = [1,5]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [1, 5], [10, 20] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // lower the lower bound of last range
  rgToAdd = [8,15]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [1, 5], [8, 20] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // increase the upper bound of last range
  rgToAdd = [19,25]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [1, 5], [8, 25] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a range at the end
  rgToAdd = [30,40]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [1, 5], [8, 25], [30, 40] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // increase last range upper bound with a range starting at b
  rgToAdd = [40, 50]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [1, 5], [8, 25], [30, 50] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // decrease last range lower boudn with a range ending at a
  rgToAdd = [28, 30]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [1, 5], [8, 25], [28, 50] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a range at the end
  rgToAdd = [60, 70]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [1, 5], [8, 25], [28, 50], [60, 70] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a range at the beginning
  rgToAdd = [-1, 0]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-1, 0], [1, 5], [8, 25], [28, 50], [60, 70] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a range in the middle
  rgToAdd = [6, 7]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-1, 0], [1, 5], [6, 7], [8, 25], [28, 50], [60, 70] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a range in the middle
  rgToAdd = [26, 27]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-1, 0], [1, 5], [6, 7], [8, 25], [26, 27], [28, 50], [60, 70] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // decrease the lower bound of first range witt a range ending at a
  rgToAdd = [-5, -1]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-5, 0], [1, 5], [6, 7], [8, 25], [26, 27], [28, 50], [60, 70] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // increase the upper bound of first range witt a range starting at b
  rgToAdd = [0, 0.5]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-5, 0.5], [1, 5], [6, 7], [8, 25], [26, 27], [28, 50], [60, 70] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // fusion of all ranges
  rgToAdd = [-5, 70]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-5, 70] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // fusion of all ranges
  rgToAdd = [-10, 100]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-10, 100] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a lot of ranges
  rangesForInsertion = [[200,250],[300,350],[400,450],[500,550],[600,650],[700,750],[800,850],[900,950],[1000,1050],[1100,1150],[1200,1250],[1300,1350]]
  console.log('ranges:',JSON.stringify(list.ranges()),`add:[${rangesForInsertion}]`);
  for (rg of rangesForInsertion) {
    list.addRange(rg[0],rg[1])
  }
  console.log('result:',JSON.stringify(list.ranges()));
  _testCoherence(list)
  expect(list.ranges()).to.deep.equal([ [-10, 100],[200,250],[300,350],[400,450],[500,550],[600,650],[700,750],[800,850],[900,950],[1000,1050],[1100,1150],[1200,1250],[1300,1350] ])

  // add ranges in the middle
  rgToAdd = [-100, -10]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,450],[500,550],[600,650],[700,750],[800,850],[900,950],[1000,1050],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add ranges in the middle
  rgToAdd = [950, 1000]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,450],[500,550],[600,650],[700,750],[800,850],[900,1050],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add ranges in the middle
  rgToAdd = [650, 800]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,450],[500,550],[600,850],[900,1050],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add ranges in the middle, with several ranges to merge and bounds not in existing ranges.
  rgToAdd = [570, 1060]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,450],[500,550],[570,1060],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add ranges in the middle, with several range to merge and bounds equal to existing bounds
  rgToAdd = [450, 570]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,1060],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add an existing range
  rgToAdd = [400, 1060]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,1060],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add an existing range (first range)
  rgToAdd = [-100, 100]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,1060],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add an existing range (last range)
  rgToAdd = [1300, 1350]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,1060],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))

  // add a range included in an existing range
  rgToAdd = [210, 220]
  console.log('\nranges:', JSON.stringify(list.ranges()),`add:[${rgToAdd}]`);
  list.addRange(rgToAdd)
  expect(list.ranges()).to.deep.equal([ [-100, 100],[200,250],[300,350],[400,1060],[1100,1150],[1200,1250],[1300,1350] ])
  _testCoherence(list)
  console.log('result:',JSON.stringify(list.ranges()))


  art.font('ALL     TESTS     OK  !', 'Doom', function(rendered){
      console.log(art.style(rendered, 'green'));
  });

} catch (e) {
  console.log(e)
  console.log('\n==> Tests failed !')
  art.font('TESTS     NOK     :-(', 'Doom', function(rendered){
      console.log(art.style(rendered, 'red'));
  });
}
