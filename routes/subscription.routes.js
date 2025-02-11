import e, { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getSubscription } from "../controllers/subscription.controllers.js";
import { get } from "mongoose";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => { 
    res.send({ title: "GET all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
    res.send({ title: "GET subscription by id" });
}); 

subscriptionRouter.post("/", authorize, createSubscription); 

subscriptionRouter.put("/:id", (req, res) => {    
    res.send({ title: "Update subscription by id" });
}); 

subscriptionRouter.delete("/:id", (req, res) => {    
    res.send({ title: "Delete subscription by id" });
});

subscriptionRouter.get("/user/:id",authorize,getSubscription);

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({ title: "Cancel subscription by id" });
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {    
    res.send({ title: "GET all subscriptions with upcoming renewals" });
});

export default subscriptionRouter;