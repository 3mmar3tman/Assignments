# Assignment 3

## Part 1: Node Internals

### 1. What is the Node.js Event Loop?

The Node.js Event Loop is a mechanism that allows Node.js to perform asynchronous and non-blocking operations. It continuously checks for completed asynchronous tasks and executes their callbacks when the Call Stack is available.

### 2. What is Libuv and What Role Does It Play in Node.js?

Libuv is a C library used by Node.js to handle asynchronous I/O operations. It provides the Event Loop and Thread Pool, allowing Node.js to perform operations such as file system operations and other asynchronous tasks.

### 3. How Does Node.js Handle Asynchronous Operations Under the Hood?

Node.js starts an asynchronous operation without blocking the main JavaScript thread. The operation is handled by the operating system or Libuv's Thread Pool when necessary. After the operation is completed, its callback is placed in a queue, and the Event Loop eventually executes it when the Call Stack is available.

### 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop?

The Call Stack is responsible for executing JavaScript functions.

The Event Queue stores callbacks that are ready to be executed after asynchronous operations are completed.

The Event Loop continuously checks whether the Call Stack is empty and moves ready callbacks to the Call Stack for execution.

### 5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?

The Node.js Thread Pool is provided by Libuv and is used to execute certain expensive asynchronous operations without blocking the main JavaScript thread.

The default Thread Pool size is 4 threads.

The Thread Pool size can be changed using the UV_THREADPOOL_SIZE environment variable.

For example:

UV_THREADPOOL_SIZE=8

### 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?

Blocking code stops the main thread until the operation is completed. For example, fs.readFileSync() is a blocking operation.

Non-blocking code allows Node.js to continue executing other code while an asynchronous operation is being completed. For example, fs.readFile() is non-blocking.
