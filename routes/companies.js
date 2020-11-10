const db = require("../db");
const ExpressError = require("../expressError")
const express = require("express");
const router = new express.Router();

router.get('/', async function(req, res, next) {
    try {
        let companies = await db.query(
            `SELECT code, name FROM companies`
        );
        res.json({"companies": companies.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database", 400);
        return next(err);
    }   
});

router.get('/:code', async function(req, res, next) {
    try {
        let company = await db.query(
            `SELECT code, name, description FROM companies WHERE code=$1`, [req.params.code]
        );
        if (company.rows.length === 0) {
            const err = new ExpressError("Company not Found", 404);
            return next(err);
        }
        res.json({"company": company.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database", 400);
        return next(err);
    }   
});

router.post('/', async function(req, res, next) {
    try {
        const {code, name, description} = req.body
        res.json(code)
        console.log(req.body)
    //     let companies = await db.query(
    //         `SELECT code, name FROM companies`
    //     );
    //     res.json({"companies": companies.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database", 400);
        return next(err);
    }   
});

module.exports = router;