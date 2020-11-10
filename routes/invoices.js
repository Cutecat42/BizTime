const db = require("../db");
const ExpressError = require("../expressError")
const express = require("express");
const router = new express.Router();

router.get('/', async function(req, res, next) {
    try {
        let invoices = await db.query(
            `SELECT id, comp_code 
            FROM invoices`
        );
        res.json({"invoices": invoices.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database", 400);
        return next({    
            error: err.message,
            status: err.status});
    }   
});

router.get('/:id', async function(req, res, next) {
    try {
        let invoice = await db.query(
            `SELECT id, comp_code, amt, paid, add_date, paid_date 
            FROM invoices 
            WHERE id=$1`, [req.params.id]
        );
        if (invoice.rows.length === 0) {
            const err = new ExpressError("Invoice not Found", 404);
            return next({    
                error: err.message,
                status: err.status});
        };
        res.json({"invoice": invoice.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database", 400);
        return next({    
            error: err.message,
            status: err.status});
    }    
});




module.exports = router;