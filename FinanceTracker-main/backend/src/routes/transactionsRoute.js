const express = require('express')
var moment = require('moment');
const Transaction = require('../models/Transaction')
const router = express.Router()

router.post('/add-transaction', async (req, res) => {
    try {
        const newtransaction = new Transaction(req.body);
        await newtransaction.save();
        res.json({
            success: true,
            message: 'Transaction added successfully',
            data: newtransaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

router.post('/edit-transaction', async (req, res) => {
    try {
        const { transactionId, payload } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            { _id: transactionId },
            payload,
            { new: true, runValidators: true }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

router.post('/delete-transaction', async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await Transaction.findOneAndDelete({ _id: transactionId });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

router.post('/get-all-transactions', async (req, res) => {
    try {
        const { frequency, selectedRange, type, userid } = req.body;

        if (!userid) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const query = { userid };

        // Add type filter
        if (type && type !== 'all') {
            query.type = type;
        }

        // Add date filter
        if (frequency !== 'custom') {
            query.date = {
                $gt: moment().subtract(Number(frequency), 'd').toDate(),
            };
        } else if (selectedRange && selectedRange.length === 2) {
            query.date = {
                $gte: new Date(selectedRange[0]),
                $lte: new Date(selectedRange[1]),
            };
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });

        res.json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

module.exports = router