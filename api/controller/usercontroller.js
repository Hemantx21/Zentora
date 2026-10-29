
import mongoose from "mongoose"
import { masterPlanModel, projectModel, subscriptionModel, userModel, bidsModel } from "../model/model.js"
export const UserProfileUpdate = async (req, res) => {
    try {
        const { _id, name, email, phone, location, bio, rate, skill, headline, password, npassword } = req.body;
        const isExist = await userModel.findOne({ _id, password, type: "user" })
        if (isExist) {
            const updateData = { name, email, phone, location, bio, rate, skill, headline }
            if (npassword) updateData.password = npassword
            const result = await userModel.updateOne({ _id }, { $set: updateData })
            res.json({
                code: 200,
                success: true,
                message: "Profile updated successfully",
                result: result,
                error: false
            })
        } else {
            res.json({
                code: 400,
                success: false,
                message: "Current password is incorrect",
                result: "",
                error: true
            })
        }
    } catch (err) {
        console.log(err)
        res.json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            result: "",
            error: true
        })
    }
}
export const UserStats = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await userModel.findOne({ _id: userId })
        const bids = await bidsModel.countDocuments({ userId })
        const raw = await bidsModel.find({ userId, status: "accept" });
        const earning = raw?.reduce((t, item) => {
            return t += parseInt(item?.amount)
        }, 0)
        const result = {
            credits: user?.credit,
            totalBids: bids,
            Earning: earning
        }
        res.json({
            code: 200,
            success: true,
            message: "Data found",
            result: result,
            error: false
        })
    } catch (err) {
        console.log(err);
        res.json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            result: "",
            error: true
        })
    }
}

export const getUserBids = async (req, res) => {
    try {
        const { userId } = req.query;
        const raw = await bidsModel.find({ userId });//user ko apna filter
        const finalData = await Promise.all(
            raw?.map(async (item) => {
                const projectData = await projectModel.findOne({ _id: item?.projectId })
                return {
                    title: projectData?.title,
                    budget: projectData?.budget,
                    amount: item?.amount,
                    status: item?.status
                }
            })
        )
        res.json({
            code: 200,
            success: true,
            message: "Data fetched successfully",
            result: finalData,
            error: false
        })
    } catch (err) {
        console.log(err)
        res.json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            result: "",
            error: true
        })
    }
}
export const createUserBids = async (req, res) => {
    try {
        const { userId, projectId, amount } = req.body;
        const numericAmount = Number(amount);
        if (
            !mongoose.isValidObjectId(userId) ||
            !mongoose.isValidObjectId(projectId) ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "A valid user, project, and positive bid amount are required.",
                result: "",
                error: true
            })
        }
        const user = await userModel.findOne({ _id: userId, type: "user" });
        const project = await projectModel.findById(projectId);
        if (!user || !project) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "Freelancer or project not found.",
                result: "",
                error: true
            })
        }
        const isExist = await bidsModel.findOne({ userId, projectId });
        if (isExist) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "You have already placed the bids.",
                result: "",
                error: true
            })
        } else {
            const debit = await userModel.updateOne(
                {
                    _id: userId,
                    type: "user",
                    $expr: {
                        $gt: [
                            { $convert: { input: "$credit", to: "int", onError: 0, onNull: 0 } },
                            0
                        ]
                    }
                },
                [{
                    $set: {
                        credit: {
                            $subtract: [
                                { $convert: { input: "$credit", to: "int", onError: 0, onNull: 0 } },
                                1
                            ]
                        }
                    }
                }],
                { updatePipeline: true }
            )
            if (debit.matchedCount === 0) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: "You have no bidding credits. Please choose a plan first.",
                    result: "",
                    error: true
                })
            }
            try {
                const result = await new bidsModel({ userId, projectId, amount: String(numericAmount) }).save();
                return res.json({
                    code: 200,
                    success: true,
                    message: "Bid placed successfully.",
                    result,
                    error: false
                })
            } catch (err) {
                await userModel.updateOne(
                    { _id: userId },
                    [{ $set: { credit: { $add: ["$credit", 1] } } }],
                    { updatePipeline: true }
                )
                throw err
            }
        }
    } catch (err) {
        console.log(err)
        res.json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            result: "",
            error: true
        })
    }
}
export const userPurchasePlan = async (req, res) => {
    try {
        const { planId, userId } = req.body;
        if (!mongoose.isValidObjectId(planId) || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "A plan and freelancer account are required.",
                result: "",
                error: true
            })
        }
        const [plan, user] = await Promise.all([
            masterPlanModel.findById(planId),
            userModel.findOne({ _id: userId, type: "user" })
        ])
        const planCredit = Number(plan?.credits);
        if (!plan || plan.status === false || !user || !Number.isInteger(planCredit) || planCredit <= 0) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "The selected plan or freelancer account is not valid.",
                result: "",
                error: true
            })
        }
        let subscription;
        try {
            subscription = await new subscriptionModel({ userId, planId }).save();
            const creditUpdate = await userModel.updateOne(
                { _id: userId, type: "user" },
                [{
                    $set: {
                        credit: {
                            $add: [
                                { $convert: { input: "$credit", to: "int", onError: 0, onNull: 0 } },
                                planCredit
                            ]
                        }
                    }
                }],
                { updatePipeline: true }
            )
            if (creditUpdate.matchedCount === 0) {
                await subscriptionModel.deleteOne({ _id: subscription._id })
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: "Freelancer account not found.",
                    result: "",
                    error: true
                })
            }
            return res.json({
                code: 200,
                success: true,
                message: `${planCredit} credits added successfully. No payment was processed.`,
                result: subscription,
                error: false
            })
        } catch (err) {
            if (subscription) {
                await subscriptionModel.deleteOne({ _id: subscription._id })
            }
            throw err
        }
    } catch (err) {
        console.log(err)
        res.json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            result: "",
            error: true
        })
    }
}
export const userProjectList = async (req, res) => {
    try {
        const result = await projectModel.find().sort({ createdAt: -1 })
        res.json({
            code: 200,
            success: true,
            message: "Data fetched",
            result: result,
            error: false
        })
    } catch (err) {
        console.log(err)
        res.json({
            code: 500,
            success: false,
            message: "Internal Server Error",
            result: "",
            error: true
        })
    }
}
