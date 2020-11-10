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
        return next({    
            error: err.message,
            status: err.status});
    }   
});

router.get('/:code', async function(req, res, next) {
    try {
        let company = await db.query(
            `SELECT code, name, description 
            FROM companies 
            WHERE code=$1`, [req.params.code]
        );
        if (company.rows.length === 0) {
            const err = new ExpressError("Company not Found", 404);
            return next({    
                error: err.message,
                status: err.status});
        };
        res.json({"company": company.rows})
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
        const {code, name, description} = req.body
        let newCompany = await db.query(
            `INSERT INTO companies 
            VALUES ($1, $2, $3)
            RETURNING code, name, description;`, [code, name, description]
        );
        res.json({"company": newCompany.rows})
    }
    catch {
        const err = new ExpressError("Error with adding to database", 400);
        return next({    
            error: err.message,
            status: err.status});
    }   
});

router.put('/:code', async function(req, res, next) {
    try {
        const {name, description} = req.body
        let editCompany = await db.query(
            `UPDATE companies 
            SET name=$1, description=$2
            WHERE code=$3
            RETURNING code, name, description;`, [name, description, req.params.code]
        );
        if (editCompany.rows.length === 0) {
            const err = new ExpressError("Company not Found", 404);
            return next({    
                error: err.message,
                status: err.status});
        };
        res.json({"company": editCompany.rows})
    }
    catch {
        const err = new ExpressError("Error with retrieving from database", 400);
        return next(err);
    }  
});

module.exports = router;