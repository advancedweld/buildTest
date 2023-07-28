const p = new Promise(() => {});
console.log('@@@@@@@@@@@@@@add===', p);

// const p1 = Promise.resolve(1).then();
const p1 = Promise.resolve(1);
// const p1 = Promise.reject('oops');
console.log('@@@@@@@@@@@@@@p1===', p1);

const p2 = Promise.resolve(1).then(() => {});
console.log('@@@@@@@@@@@@@@p2===', p2);

console.log(p1 === p2);

const p3 = Promise.resolve(1).then((res) => {
  console.log('@@@@@@@@@@@@@@res===', res);
  // return 777;
});
console.log('@@@@@@@@@@@@@@p3===', p3);

p.then((res) => {
  console.log('@@@@@@@@@@@@@@p then===', res);
});

p1.then((res) => {
  console.log('@@@@@@@@@@@@@@p1 then===', res);
});

p2.then((res) => {
  console.log('@@@@@@@@@@@@@@p2 then===', res);
});
p3.then((res) => {
  console.log('@@@@@@@@@@@@@@p3 then===', res);
});

import add from './add.js';
import minus from './minus.js';

const sum = add(1, 2);
const division = minus(2, 1);

console.log('@@@@@@@@@@@@@@add===', sum);
console.log('@@@@@@@@@@@@@@minus===', division);

/*  ast */
/* 
 Node {
  type: 'File',
  start: 0,
  end: 218,
  loc: SourceLocation {
    start: Position { line: 1, column: 0, index: 0 },
    end: Position { line: 9, column: 0, index: 218 },
    filename: undefined,
    identifierName: undefined
  },
  errors: [],
  program: Node {
    type: 'Program',
    start: 0,
    end: 218,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      filename: undefined,
      identifierName: undefined
    },
    sourceType: 'module',
    interpreter: null,
    body: [ [Node], [Node], [Node], [Node], [Node], [Node] ],
    directives: []
  },
  comments: []
}


*/
