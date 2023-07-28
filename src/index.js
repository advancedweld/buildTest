import add from './add.js';
import minus from './minus.js';

function myFn() {
  console.log('@@@@@@@@@@@@@@myFn===', 123);
}
const sum = add(1, 2);
const division = minus(2, 1);

console.log('@@@@@@@@@@@@@@add===', sum);
console.log('@@@@@@@@@@@@@@minus===', division);
