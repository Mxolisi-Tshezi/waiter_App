const assert = require("assert");
const waitersfac = require("../waitersfac");
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
        await waiterOutput.setUsername("Mjita", "MJr4yl");
        assert.deepEqual({ code: 'MJr4yl', username: 'Mjita' }, await waiterOutput.theWorkers());
    });

    it('It must save a day and show people select that day', async function () {
        let waiterOutput = Waitersfunc(db);

        await waiterOutput.setUsername("Abongile", "MJr4yl");
        await waiterOutput.setWeek(["Monday", 'Friday'], "Abongile");
        
        assert.deepEqual([
            {
                username: 'Abongile',
                workday: 'Monday'
            }

        ], await waiterOutput.JoinTables('Monday')
        );
    });

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



    it('Must return authentication code', async function () {
        let waiterOutput = Waitersfunc(db);
        await waiterOutput.setUsername("Mjita", "MJr4yl");

        assert.equal('Mjita', await waiterOutput.getUsername('MJr4yl')
        );
    });
     
    it('It must be able to return the colors', async function () {
        let waiterOutput = waitersfac(db);
        await waiterOutput.setUsername("landani", "MJr4yl");
        await waiterOutput.setUsername("Unalo", "MJrt4");
        await waiterOutput.setUsername("Mark", "MJrt4");
        await waiterOutput.setUsername("Zack", "MJrt4");
        await waiterOutput.setUsername("Welele", "MJrt4");


        await waiterOutput.setWeek(["Monday", "Friday", "Sunday"], "landani");
        await waiterOutput.setWeek(["Monday", "Tuesday", "Friday"], "Unalo");
        await waiterOutput.setWeek(["Monday", "Tuesday", "Sunday"], "Mark");
        await waiterOutput.setWeek(["Monday", "Sunday", "Wednesday"], "Zack");
        assert.deepEqual(
            [{

                state: "overwaiters",
                weekday: "Tuesday"
            },

            {
                state: "enough-waiters",
                weekday: "Tuesday"
            }
            ], await waiterOutput.getColors())
    });

    it('It must be able to delete all names', async function () {
        let waiterOutput = Waitersfunc(db);
        await waiterOutput.setUsername("landani")
        await waiterOutput.setUsername("Unalo")
        await waiterOutput.setUsername("Mark")

        await waiterOutput.deleteWaiters()
        let results= await db.any('SELECT * FROM admins')
        assert.deepEqual([], results);

    });

});