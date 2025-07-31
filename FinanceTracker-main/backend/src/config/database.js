const mongoose = require('mongoose')

const MongoDB_URI = 'mongodb://localhost:27017/finance_management'

const dbConnect = async () => {
  try {
    await mongoose.connect(MongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ MongoDB connection successful!')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

module.exports = dbConnect