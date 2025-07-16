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

Note: if you wish to use a `.env` file for environment variables, you should
include the following line at the top of any file that uses `process.env`:
```javascript
require('dotenv').config();
```
Then, make sure to install dotenv with npm:
```bash
npm install dotenv
```
Finally, remember to gitignore `.env` if you commit these changes.

---

## Authors
[Daniel Stelljes](https://github.com/Zytronium)  
[Tsimmuaj Yang](https://github.com/Jimwall0)

---

[//]: # (Note: Points here are based on progress on the task and how much of that task is working; not how many points it gets when graded, since there is no checker for this project.)

### ✅ Tasks checklist:
Tasks marked with a `D` are assigned to Daniel and tasks marked with a `T` are assigned to Tsim.

- [X] ​0. Redis Utils (12/12 pts) `D`
- [X] ​1. MongoDB Utils (11/11 pts) `D`
- [X] ​2. First API (11/11 pts) `D`
- [ ] ​3. Create a new user (0/11 pts) `D`
- [ ] ​4. Authenticate a user (0/11 pts) `D`
- [ ] ​5. First file (0/11 pts) `T`
- [ ] ​6. Get and list file (0/11 pts) `T`
- [ ] ​7. File publish/unpublish (0/11 pts) `T`
- [ ] ​8. File data (0/11 pts) `T`
- [ ] ​9. Image Thumbnails (0/11 pts) ` `


- [X] Readme
- [ ] **Everything Done ✓** (34/111 pts) - 31%

---

>### Progress Goals:
>Monday, July 14: 5% (6 pts) ✓  
Tuesday, July 15: 15% (17 pts) ✓  
<strong>Wednesday, July 16: 30% (33 pts)</strong> ✓  
<em style="color: gray">Thursday, July 17: 50% (55 pts)</em>  
<em style="color: gray">Friday, July 18: 65% (72 pts)</em>  
<em style="color: gray">Saturday/Sunday, July 19-20: 75% (83 pts)</em>  
<em style="color: gray">Monday, July 21: 90% (100 pts)</em>  
<em style="color: gray">Tuesday, July 22: 100% (111 pts)</em>  

---
