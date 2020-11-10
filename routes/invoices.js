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
        const err = new ExpressError("Error with retrieving from database.", 400);
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
            const err = new ExpressError("Invoice not Found.", 404);
            return next({    
                error: err.message,
                status: err.status});
        };
        res.json({"invoice": invoice.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database.", 400);
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
    }
    catch {
        const err = new ExpressError("Error with adding to database.", 400);
        return next({    
            error: err.message,
            status: err.status});
    }   
});

router.put('/:id', async function(req, res, next) {
    try {
        const {paid, paid_date} = req.body
        let editCompany = await db.query(
            `UPDATE invoices 
            SET paid=$1, paid_date=$2
            WHERE id=$3
            RETURNING id, comp_code, amt, paid, add_date, paid_date;`, [paid, paid_date, req.params.id]
        );
        if (editCompany.rows.length === 0) {
            const err = new ExpressError("Invoice not Found.", 404);
            return next({    
                error: err.message,
                status: err.status});
        };
        res.json({"company": editCompany.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database. Make sure to include 'paid' and 'paid_date'.", 400);
        return next({    
            error: err.message,
            status: err.status});
    }  
});

router.delete('/:id', async function(req, res, next) {
    try {
        let deleteInvoice = await db.query(
            `DELETE FROM invoices 
            WHERE id=$1
            RETURNING id`, [req.params.id]
        );
        if (deleteInvoice.rows.length === 0) {
            const err = new ExpressError("Invoice not Found.", 404);
            return next({    
                error: err.message,
                status: err.status});
        };
        res.json({status: "deleted"})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database.", 400);
        return next({    
            error: err.message,
            status: err.status});
    }  
});




module.exports = router;