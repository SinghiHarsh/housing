const mongoose = require('mongoose');
const universityListSchema = mongoose.Schema({
    uniList: {
        type: Array
    }
});

const UniversityList = mongoose.model("UniversityList", universityListSchema);

module.exports = UniversityList;