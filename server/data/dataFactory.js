var jsf = require('json-schema-faker'),
    userSchema = require('./schemas/user'),
    Student = require('../models/student.model'),
    profileSchema = require('./schemas/profile'),
    courseSchema = require('./schemas/course'),
    _ = require('lodash'),
    STUDENT_AMOUNT = 200,
    COURSES_AMOUNT = 20,
    TEACHERS_AMOUNT = 4;

module.exports = function(storage) {
    var openCoursesIds;

    _.times(STUDENT_AMOUNT, () => {
        let student = new Student(jsf(userSchema).user),
            profile = jsf(profileSchema).profile;

        storage.profiles.push(profile);
        student.profile_id = profile.id;

        storage.students.push(student);
    });

    _.times(TEACHERS_AMOUNT, () => {
        let teacher = jsf(userSchema).user,
            profile = jsf(profileSchema).profile;

        storage.profiles.push(profile);
        teacher.profile_id = profile.id;

        storage.teachers.push(teacher);
    });

    _.times(COURSES_AMOUNT, () => {
        let course = jsf(courseSchema).course;

        if (course.active) {
            course.teacher = storage.teachers[_.random(0, storage.teachers.length - 1)].id;
        }

        storage.courses.push(course);
    });

    openCoursesIds = _.reduce(storage.courses, (accum, course) => {
        if (course.active) {
            accum.push(course.id);
        }
        return accum;
    }, []);

    _.each(storage.students, (student) => {
        if (!!_.random(0, 4)) {
            let amount = _.random(1, 3);
            let from = !!_.random(0, 1) ? 'take' : 'takeRight';
            let assignments = _[from](openCoursesIds, amount);

            student.courses = assignments;

            _.each(assignments, courseId => {
                let course = _.find(storage.courses, ['id', courseId]);
                course.students = course.students || [];
                course.students.push(student.id);
            });
        }
    });

    return storage;
};