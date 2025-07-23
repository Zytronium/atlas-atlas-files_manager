# Files Manager Express

Files Manager Express is a Node.js backend project that demonstrates key
backend development concepts, including token-based user authentication,
file management, database integration, background processing, and API design.

The platform provides a simple API for uploading, managing, and
viewing files, with features such as:

* Token-based user authentication
* File listing with pagination support
* File upload functionality
* Permission management for files (public/private)
* Viewing and accessing file content
* Automatic thumbnail generation for image files

This project was designed as a learning exercise to bring together core
backend technologies like Node.js, MongoDB, Redis, and background workers
into a cohesive application.

---

## Usage
Install Redis and MongoDB and have them both running for this to work.
If the host fo the Mongo DB is specified as something other than localhost,
MongoDB does not need to be running locally.

Installing and running Redis and MongoDB may vary depending on your OS.

### Installing (On Linux Fedora 42):

Install redis:
```bash
sudo dnf install redis
```
*Note: Fedora 42 actually uses Valkey instead of Redis, but it works the same.

Install MongoDB:
```bash
sudo dnf install mongodb
```
*Note: you may need to set up the MongoDB repository to install. You can find
the latest instructions on the official MongoDB website or documentation for Fedora.


### Running (On Linux Fedora 42):
Run Redis:
```bash
sudo systemctl start redis
```
Stop Redis:
```bash
sudo systemctl stop redis
```

Run MongoDB:
```bash
sudo systemctl start mongod
```
Stop MongoDB:
```bash
sudo systemctl stop mongod
```

### Running the API server:
In the root directory `atlas-atlas-files_manager/`:
```bash
npm run start-server
```

---

## Environment Variables

If you wish to use a `.env` file for environment variables, you can create
the file at the root of this repository. The server will automatically use
the environment variables from this file if present. Make sure `.env` is
git-ignored before you commit these changes if there is sensitive info in it.

If you need to set environment variables temporarily, you can inline the
variables in your command to run the server like this:
```bash
PORT=5000 DB_HOST=localhost DB_PORT=27017 DB_DATABASE=files_manager npm run start-server
```
Any environment variables set with this method will override the same ones from
the `.env` file (but doesn't overwrite them).

You can also leave out some or all environment variables, and it will default
those to:
```dotenv
PORT=5000
DB_HOST=localhost
DB_PORT=27017
DB_DATABASE=files_manager
FOLDER_PATH=/tmp/files_manager
```

`PORT` is the port to run the server on.  
`DB_HOST` is the host address MongoDB is running on.  
`DB_PORT` is the port MongoDB is running on.  
`DB_DATABASE` is the name of the MongoDB database.  
`FOLDER_PATH` is the folder path for storing files locally.  

---

## Authors
[Daniel Stelljes](https://github.com/Zytronium)  
[Tsimmuaj Yang](https://github.com/Jimwall0)

---

[//]: # (Note: Points here are based on progress on the task and how much of that task is working; not how many points it gets when graded, since there is no checker for this project.)

### ✅ Tasks checklist:
Tasks marked with a `D` are assigned to Daniel and tasks marked with a `T` are
assigned to Tsim. Tasks marked with ` ` are assigned to whoever feels like doing
them.

- [X] ​0. Redis Utils (12/12 pts) `D`
- [X] ​1. MongoDB Utils (11/11 pts) `D`
- [X] ​2. First API (11/11 pts) `D`
- [X] ​3. Create a new user (11/11 pts) `D`
- [X] ​4. Authenticate a user (11/11 pts) `D`
- [X] ​5. First file (11/11 pts) `T`
- [X] ​6. Get and list file (11/11 pts) `T`
- [X] ​7. File publish/unpublish (11/11 pts) `T`
- [X] ​8. File data (11/11 pts) `T`
- [ ] ​9. Image Thumbnails (0/11 pts) ` `


- [X] Readme
- [ ] **Everything Done ✓** (100/111 pts) - 90%  

---

>### Progress Goals:
>Monday, July 14: 5% (6 pts) ✓  
Tuesday, July 15: 15% (17 pts) ✓  
Wednesday, July 16: 30% (33 pts) ✓  
Thursday, July 17: 40% (44 pts) ✓  
Friday, July 18: 60% (67 pts) ✓  
Saturday/Sunday, July 19-20: 75% (83 pts) ✓  
Monday, July 21: 90% (100 pts) ✓  
Tuesday, July 22: 100% (111 pts)  

---
