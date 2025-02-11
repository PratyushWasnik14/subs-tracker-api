import Subscription from '../models/subscriptions.models.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user.id
        })
        res.status(201).json({
            success: true,
            data: subscription
        })
}
catch (error) {
    next(error)
}
}

export const getSubscription = async (req, res, next) => {

    try {
        if(req.user.id!==req.params.id){
            return res.status(401).json({
                success: false,
                message: 'You are not owner of this subscription'
            })
        }
        const subscription = await Subscription.find({user:req.params.id})
        if(!subscription){
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            })
        }
        res.status(200).json({
            success: true,
            data: subscription
        })
        
    } catch (error) {
        next(error)
    }
}