import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subscription name is required '],
      trim: true,
      minLength: [3, 'Subscription name must be at least 3 characters long'],
      maxLength: [20, 'Subscription name must be at most 20 characters long'],
    },

    price: {
      type: Number,
      required: [true, 'Subscription price is required '],
    },

    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY'],
      default: 'USD',
    },

    frequency: {
      type: String,
      enum: ['monthly', 'yearly', 'weekly', 'daily'],
      default: 'monthly',
    },

    category: {
      type: String,
      enum: [
        'sports',
        'news',
        'entertainment',
        'music',
        'technology',
        'health',
        'education',
        'fashion',
      ],
      required: [true, 'Subscription category is required '],
    },

    paymentMethod: {
      type: String,
      enum: ['credit card', 'paypal', 'bank transfer'],
      default: 'credit card',
      required: [true, 'Payment method is required '],
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },

    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= Date.now()
        },
        message: 'Start date must be in the past',
      },
    },

    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value >= this.startDate
        },
        message: 'Renewal date must be in the future',
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
)

// Auto-calculate renewal date before saving
subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    const renewalPeriod = {
      monthly: 30,
      yearly: 365,
      weekly: 7,
      daily: 1,
    }

    this.renewalDate = new Date(this.startDate)
    this.renewalDate.setDate(
      this.startDate.getDate() + renewalPeriod[this.frequency]
    )
  }

  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = 'expired'
  }

  next()
})

export default mongoose.model('Subscription', subscriptionSchema)

// this.startDate.getDate() gets the day of the month from startDate.
// renewalPeriod[this.frequency] looks up a number of days from the renewalPeriod object based on this.frequency.
// Example: If this.frequency = "monthly", it might return 30 days.
// The .setDate() method adds these days to renewalDate, effectively calculating when the next renewal will happen.

// In Simple Terms
// It takes the startDate.
// Copies it to renewalDate.
// Adds a number of days based on how often the renewal happens (monthly, yearly, etc.).
// Now renewalDate stores the correct future date.
