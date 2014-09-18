// Sample Schema
function Sample(mongoose) {
var Schema = mongoose.Schema

var sampleSchema = new Schema({
  text: String
});

return mongoose.model('Sample', sampleSchema);
}

module.exports = Sample;