const client = require('../db/db_config');

// GET all courses
const getCourses = async (req, res) => {
    const allCourses = await client.query('SELECT * FROM myappdb.courses');

    res.send({ allCourses })
};
// Add a new course
const addCourse = async (req, res) => {
    const allProperties = Object.keys(req.body).length;

    if (allProperties !== 4){
        res.code(400).send({
            error: 'Some properties are missing! Add name, description, author and link!'
        });
        return;
    }
    try{
        const newCourse = await  client.insert({
            table: 'courses',
            records: [
                {
                    name: req.body.name,
                    description: req.body.description,
                    author: req.body.author,
                    link: req.body.link
                }
            ]
        });
        res.send({ newCourse });
    } catch (error){
        res.send({ error });
    }
};
// Specific course
const getSpecificCourse = async (req, res) => {
    const course = await client.query(`SELECT * from myappdb.courses where id=${req.params.id}`);
    res.send({ course });
};
const editCourse = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'author', 'link'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation){
        res.code(400).send({ error: 'Not a valid operation! '});

        return;
    }
    try{
        const updatedCourse = await client.update({
            table: 'courses',
            records: [
                {
                    id: req.params.id,
                    name: req.body.name,
                    description: req.body.description,
                    author: req.body.author,
                    link: req.body.link
            }
            ]
        });
    } catch (error) {
        res.send({ error});
    }
}
// delete course
const deleteCourse = async (req, res) => {
    const course = await client.query(`DELETE from myappdb.courses where id=${req.params.id}`);
    res.send({
        message: 'Course deleted',
        deleteCourse: course
    });
};
module.exports = {
    getCourses,
    addCourse,
    getSpecificCourse,
    deleteCourse,
    editCourse,
}