import mongoose from 'mongoose'

export default async () => {
  try {
    return await mongoose.connect(process.env.MONGODB_URL)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}