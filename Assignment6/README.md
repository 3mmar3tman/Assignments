# Assignment 7 - Solution

## Requirements
- Install Node.js and run MongoDB locally, or use MongoDB Atlas.
- Copy `.env.example` to `.env` and set `MONGODB_URI`.
- From this folder run `npm install`, then `npm run dev`.

## Test order
1. `POST /collection/books`
2. `POST /collection/authors`
3. `POST /collection/logs/capped`
4. `POST /collection/books/index`
5. Insert books with `POST /books` and/or `POST /books/batch`
6. `POST /logs`
7. Test the query and aggregation endpoints.

Use `http://localhost:3000` as the base URL. The API uses the native MongoDB collection API through Mongoose's connection, so the operations correspond closely to mongosh.

## Postman examples
- `POST http://localhost:3000/collection/books` — no body needed.
- `POST http://localhost:3000/collection/authors` — JSON body such as `{"name":"George Orwell","country":"United Kingdom"}`.
- `POST http://localhost:3000/collection/logs/capped` — no body.
- `POST http://localhost:3000/collection/books/index` — no body.
- `POST http://localhost:3000/books` — JSON: `{"title":"Future","author":"Sample Author","year":2020,"genres":["Science Fiction"]}`
- `POST http://localhost:3000/books/batch` — JSON: `{"books":[{"title":"Brave New World","author":"Aldous Huxley","year":1932,"genres":["Science Fiction","Dystopian"]},{"title":"The Road","author":"Cormac McCarthy","year":2006,"genres":["Drama"]},{"title":"The Hunger Games","author":"Suzanne Collins","year":2008,"genres":["Science Fiction","Adventure"]}]}`
- `POST http://localhost:3000/logs` — JSON: `{"bookTitle":"Future","message":"Book record created","level":"info"}`
- `PATCH http://localhost:3000/books/Future` — no body.
- `GET http://localhost:3000/books/title?title=Brave%20New%20World`
- `GET http://localhost:3000/books/year?from=1990&to=2010`
- `GET http://localhost:3000/books/genre?genre=Science%20Fiction`
- `GET http://localhost:3000/books/skip-limit`
- `GET http://localhost:3000/books/year-integer`
- `GET http://localhost:3000/books/exclude-genres`
- `DELETE http://localhost:3000/books/before-year?year=2000`
- `GET http://localhost:3000/books/aggregate1`
- `GET http://localhost:3000/books/aggregate2`
- `GET http://localhost:3000/books/aggregate3`
- `GET http://localhost:3000/books/aggregate4`

## Notes
- MongoDB collection names are case-sensitive.
- Tasks 1 and 3 return a friendly message if the collection already exists. For a clean demonstration of validation/capped settings, use a fresh database or drop the existing collection first.
- Task 13 uses `$type: "int"` exactly as requested. In BSON, numeric values inserted by different tools may be stored as `int`, `long`, or `double`; inspect with `db.books.find()` if no documents match.
- Task 19 joins logs through `logs.bookTitle` and `books.title`; create logs with a matching `bookTitle`.
- Task 15 is destructive. Test it after other endpoints, or use a disposable database.
- The assignment PDF's task 15 line says “DELETE: GET”; use HTTP DELETE because the task says delete.
- The PDF doesn't define a required document schema or exact log/book relationship, so this solution uses title, author, year, genres, and `bookTitle` for the join.
