import Student from "../models/student.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getStudents = async (req, res) => {
  const students = await Student.find().populate("classId").populate("cityId");
  res.json(students);
};

// 🔥 Aggregation: Join students → classes → cities
// export const getStudentDetails = async (req, res) => {
//   try {
//     const result = await Student.aggregate([
//       {
//         $lookup: {
//           from: "classes",
//           localField: "classId",
//           foreignField: "_id",
//           as: "classDetails",
//         },
//       },
//       { $unwind: "$classDetails" },
//       {
//         $lookup: {
//           from: "cities",
//           localField: "cityId",
//           foreignField: "_id",
//           as: "cityDetails",
//         },
//       },
//       { $unwind: "$cityDetails" },
//       {
//         $project: {
//           name: 1,
//           age: 1,
//           "classDetails.className": 1,
//           "classDetails.teacher": 1,
//           "cityDetails.cityName": 1,
//         },
//       },
//     ]);

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getStudentDetails = async (req, res) => {
  try {
    const result = await Student.aggregate([
      // 1️⃣ Group all students to calculate stats
      {
        $group: {
          _id: null,
          maxAge: { $max: "$age" },
          minAge: { $min: "$age" },
          avgAge: { $avg: "$age" },
          totalStudents: { $sum: 1 },
        },
      },

      // 2️⃣ Lookup top (maxAge) student(s)
      {
        $lookup: {
          from: "students",
          let: { maxAge: "$maxAge" },
          pipeline: [
            { $match: { $expr: { $eq: ["$age", "$$maxAge"] } } },

            {
              $lookup: {
                from: "classes",
                localField: "classId",
                foreignField: "_id",
                as: "classDetails",
              },
            },
            { $unwind: "$classDetails" },

            // Join city details
            {
              $lookup: {
                from: "cities",
                localField: "cityId",
                foreignField: "_id",
                as: "cityDetails",
              },
            },
            { $unwind: "$cityDetails" },

            // Show meaningful info
            {
              $project: {
                _id: 1,
                name: 1,
                age: 1,
                "classDetails.className": 1,
                "classDetails.teacher": 1,
                "cityDetails.cityName": 1,
              },
            },
          ],
          as: "topStudents",
        },
      },

      // 3️⃣ Lookup class-based stats (avg, count)
      {
        $lookup: {
          from: "students",
          pipeline: [
            {
              $group: {
                _id: "$classId",
                totalStudents: { $sum: 1 },
                avgAge: { $avg: "$age" },
                maxAge: { $max: "$age" },
                minAge: { $min: "$age" },
              },
            },
            {
              $lookup: {
                from: "classes",
                localField: "_id",
                foreignField: "_id",
                as: "classInfo",
              },
            },
            { $unwind: "$classInfo" },
            {
              $project: {
                className: "$classInfo.className",
                teacher: "$classInfo.teacher",
                totalStudents: 1,
                avgAge: 1,
                maxAge: 1,
                minAge: 1,
              },
            },
          ],
          as: "classStats",
        },
      },

      // 4️⃣ Prepare final clean structure
      {
        $project: {
          _id: 0,
          totalStudents: 1,
          avgAge: { $round: ["$avgAge", 1] },
          maxAge: 1,
          minAge: 1,
          topStudents: 1,
          classStats: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
