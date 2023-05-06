import mongoose from 'mongoose'
const { Schema } = mongoose

const tournamentSchema = new Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  battleType: {
    type: String,
    required: true,
    enum: ['random', 'assault', 'meeting']
  },
  minFight: {
    type: Number,
    required: true,
    min: 5,
    max: 100
  },
  tankType: {
    type: String,
    required: true,
    enum: ['light', 'middle', 'heavy', 'PT', 'PT-ACS', 'any']
  }
})