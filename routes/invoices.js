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

router.post('/', async function(req, res, next) {
    try {
        const {comp_code, amt} = req.body
        if(req.body.paid && req.body.paid_date) {
            let paid = req.body.paid
            let paid_date = req.body.paid_date
            let newInvoice = await db.query(
                `INSERT INTO invoices (comp_Code, amt, paid, paid_date)
                VALUES ($1, $2, $3, $4)
                RETURNING id, comp_code, amt, paid, add_date, paid_date;`, [comp_code, amt, paid, paid_date]
            );
            res.json({"invoice": newInvoice.rows})
        }
        else {
            let newInvoice = await db.query(
                `INSERT INTO invoices (comp_Code, amt)
                VALUES ($1, $2)
                RETURNING id, comp_code, amt, paid, add_date, paid_date;`, [comp_code, amt]
            );
            res.json({"invoice": newInvoice.rows})
        }
        // console.log(newInvoice)

        // res.json({"invoice": newInvoice.rows})
    }
    catch {
        const err = new ExpressError("Error with adding to database", 400);
        return next({    
            error: err.message,
            status: err.status});
    }   
});




module.exports = router;