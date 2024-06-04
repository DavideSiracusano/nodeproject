# nodeproject
this is a Node.js - Education backend project for s2i university

# how it works
the project has several rooutes for CRUD operations, the database is mongoDB atlas.
Basically you can create courses and universities and associate, modify or delete them.

# courses routes
/create-course?name=name&type=type to create a course <br>
/modify-course/:id to modify a course by id <br>
/delete-course/:id to delete a course by id <br>
/filter-courses to filter a course by name and type <br>

# universities
/create-university?name=name&phone=phone to create a university
/university/:universityName/courses to see a university and the courses it offers
/university/:universityName/courses/:courseName to associate a course to a university by name
/modify-university/:id to modify a university by id
/delete-university/:id to delete a university by id
