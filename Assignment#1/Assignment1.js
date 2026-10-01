//Part 1: Coding Questions (7.5 Grade): 

// Question 1:
/*
const value = "123";

const result = Number(value) + 7;

console.log(result);

 */

// Question 2

/* let value = 0;

 if (!value) {
    console.log("Invalid");
} else {
    console.log("Valid");
}

  */


// Question 3
/* 
for(i=0 ; i<=10 ; i++ ){
    if(i%2 == 0){
        continue;
    }else{
        console.log(i);
    }
} */


// Question 4
/* 
let array =[1,2,3,4,5];

reslut= array.filter(num => num%2 ===0)

console.log(reslut) */


// Question 5
/* 
arr1 = [1,2,3];
arr2 = [4,5,6];

arr3 =[...arr1, ...arr2];

console.log(arr3)
 */


// Question 6
/* 
let day = 2;

switch (day) {
    case 1:
        console.log("Sunday");
        break;

    case 2:
        console.log("Monday");
        break;

    case 3:
        console.log("Tuesday");
        break;

    case 4:
        console.log("Wednesday");
        break;

    case 5:
        console.log("Thursday");
        break;

    case 6:
        console.log("Friday");
        break;

    case 7:
        console.log("Saturday");
        break;

    default:
        console.log("Invalid day");
} */


// Question 7
/* 
let array = ["a", "ab", "abc"];

let result = array.map(str => str.length);

console.log(result);      
 */


// Question 8
/* 
let num = 13;

function divisibly(){
    if(num % 3 ===0 && num % 5 === 0 ){
        console.log('Divisible by both')
    }
    else
    {
        console.log("not divisble")

    }
}

divisibly();
 */


// Question 9
/* 
 let num = 5; 

const squar = num => num * num;

console.log(squar(num));  
*/


// Question 10
/* 
const person ={
    name:'john',
    age:25
}
function getPersonInf({name,age}){
    return `${name} is ${age} years old`
}
console.log(getPersonInf(person));
 */


// Question 11
/* 
function sum(...numbers){
    return numbers.reduce((acc,num)=> acc+num,0);

}
console.log(sum(1,2,3,4,5,6)); 
*/


//Question 12
/* 
function returnMessage(){
    return new Promise(resolve=>
        setTimeout(()=>resolve("success"),3000)
    );
}
async function test(){
    const message = await returnMessage();
    console.log(message);

}
test(); */
    

//Question 13
/* 
function largestNumber(...numbers){
    return Math.max(...numbers);
}
console.log(largestNumber(1,2,19,9,3,4,6))
 */


//Question 14
/* 
const person = {
    name: "John",
    age: 30
};

function getKeys(obj) {
    return Object.keys(obj);
}

console.log(getKeys(person)); 
*/


//Question 15
/* 
const text = "The quick brown fox";

function splitWords(str) { return str.split(" "); } 

console.log(splitWords(text)); */


//B. Part 2: Essay Questions (2.5 Grade): 


//Q1.Difference between forEach and for...of:

/* Both are used to iterate over arrays, but they work differently.

forEach() is an array method that executes a callback function for each element.
 It does not support break or continue, and it does not work well with await.

 for...of is a loop that iterates directly over the values of an iterable such as an array.
  It supports break, continue, and await inside an async function.
*/

//Q2. What is hoisting and what is the Temporal Dead Zone (TDZ)? Explain with examples.

/* 
Hoisting: JavaScript processes variable and function declarations before executing the code.

TDZ: The Temporal Dead Zone is the period between entering a scope and initializing a let or const variable,
      during which accessing the variable causes a ReferenceError.
 */

//Q3.What are the main differences between == and ===?
/* 
== is called the loose equality operator.
 It compares values after performing type conversion when necessary.

 === is called the strict equality operator.
  It compares both the value and the data type without performing type conversion.
 */

//Q4.Explain how try-catch works and why it is important in async operations.
/* 
try-catch بنستخدمه في JavaScript للتعامل مع الأخطاء (Errors) بدون ما البرنامج يتوقف بشكل مفاجئ.
 */

//Q5.. What’s the difference between type conversion and coercion? Provide examples of each.
/* 
Conversion = إنت بتحول النوع يدوي وبوضوح (زي Number("5"))
Coercion = JS بتحول النوع تلقائي من غير ما تطلب منها (زي "5" + 5 بترجع "55").
 */