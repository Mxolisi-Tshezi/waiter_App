const assert = require("assert");
const Waitersfunc = require("../waitersfac")
const pgp = require("pg-promise")();
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://matestani:matestani123@localhost:5432/databsetesta";
const config = {
    connectionString: DATABASE_URL
};

const db = pgp(config);

describe('tests', async function () {
    this.beforeEach(async function () {
        await db.none('DELETE FROM workers')
    });
    it('It must retrieve name and authentication code', async function () {
        let waiterOutput = Waitersfunc(db);
        await waiterOutput.setUsername("Langa", "MJr4y");
        assert.deepEqual({ code: 'MJr4y', username: 'Langa' }, await waiterOutput.theWorkers());
    });

    // it('It must save a day and show people select that day', async function () {
    //     let waiterOutput = Waitersfunc(db);
    //     await waiterOutput.setUsername("Abongile", "MJr4y");
    //     await waiterOutput.setWeek(["Tuesday", 'Tuesday'], "Abongile");
    //     assert.deepEqual([
    //         {
    //             username: 'Abongile',
    //             workday: 'Tuesday'
    //         }
    //     ], await waiterOutput.JoinTables('Tuesday')
    //     );
    // });

    // it('It must save a day and show people select that day', async function () {
    //     let waiterOutput = Waitersfunc(db);
    //     await waiterOutput.setUsername("Anelisa", "tRL4y");
    //     await waiterOutput.setUsername("Abongile", "tRL4y");
    //     await waiterOutput.setWeek(["Tuesday", 'Tuesday'], "Abongile");
    //     assert.deepEqual([
    //         {
    //             username: 'Walingo',
    //             workday: 'Tuesday'
    //         }

    //     ], await waiterOutput.JoinTables('Tuesday'));
    // });

    it('It must be able to delete all names', async function () {
        let waiterOutput = Waitersfunc(db);
        await waiterOutput.setUsername("Walingo")

        await waiterOutput.deleteWaiters()
        let results= await db.any('SELECT * FROM admins')
        assert.deepEqual([], results);


    });
});