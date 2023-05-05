const { sequelize } = require('./db/db');
const { Band, Musician, Song } = require('./index')

describe('Band, Musician, and Song Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });

        await Band.create({name: "REO Speedwagon", genre: "Rock"});
        await Musician.create({name: "Alan Gratzer", instrument: "drums"});
        await Musician.create({name: "Joe Matt", instrument: "guitar, vocals"});
        await Musician.create({name: "Mike Blair", instrument: "bass, vocals"});
        await Musician.create({name: "Neal Doughty", instrument: "keyboard"});
        await Song.create({title: "Can't Fight This Feeling", year: 1984, length: 297});
        await Song.create({title: "Time for Me to Fly", year: 1978, length: 225});

        await Band.create({name: "Zac Brown Band", genre: "Country"});
        await Musician.create({name: "Zac Brown", instrument: "guitar, vocals"});
        await Musician.create({name: "Marcus Petruska", instrument: "drums"});
        await Musician.create({name: "Jacob Lawson", instrument: "bass"});
        await Song.create({title: "Chicken Fried", year: 2005, length: 272});
        await Song.create({title: "Toes", year: 2009, length: 292});


        const bands = await Band.findAll();
        const musicians = await Musician.findAll();
        const songs = await Song.findAll();

        await bands[0].addMusician([musicians[0], musicians[1], musicians[2], musicians[3]]);
        await bands[1].addMusician([musicians[4], musicians[5], musicians[6]]);

        await bands[0].addSong([songs[0], songs[1]]);
        await bands[1].addSong([songs[2], songs[3]]);
    })



    test('can create a Band', async () => {
        const testBand = await Band.create({ name: 'AC/DC', genre: 'Rock' });
        expect(testBand.name).toBe('AC/DC');
    })

    test('can create a Musician', async () => {
        const testMusician = await Musician.create({ name: 'Will Smith', instrument: 'Vocals' });
        expect(testMusician.instrument).toBe('Vocals');
    })

    test('can create a Song', async () => {
        const testSong = await Song.create({ title: 'Kill Bill', year: 2023, length: 204});
        expect(testSong.year).toBe(2023);
    })

    test('can update a Band', async () => {

        const band = await Band.findByPk(3);
        await band.update({ name: 'AC/DC', genre: 'Country' });
        expect(band.genre).toBe('Country');
    })

   test('can update a Musician', async () => {
        // TODO - test updating a musician
        const musician = await Musician.findByPk(8);
        await musician.update({ name: 'Penelope Huff', instrument: 'Vocals'});
        expect(musician.name).toBe('Penelope Huff');
    })

    test('can update a Song', async () => {
        // TODO - test updating a musician
        const song = await Song.findByPk(5);
        await song.update({  title: 'Vegas', year: 2023, length: 204});
        expect(song.title).toBe('Vegas');
    })

  test('can delete a Band', async () => {
    let foundBand = await Band.findByPk(3);
    let deletedBand = await foundBand.destroy();
    let deletedBand1 = await Band.findByPk(3);
    expect(deletedBand1).toBe(null);
    })

   test('can delete a Musician', async () => {
    let foundMusician = await Musician.findByPk(8);
    let deletedMusician = await foundMusician.destroy();
    let deletedMusician1 = await Musician.findByPk(8);
    expect(deletedMusician1).toBe(null);
    })

    test('can delete a Song', async () => {
        let foundSong = await Song.findByPk(5);
        let deletedSong = await foundSong.destroy();
        let deletedSong1 = await Song.findByPk(5);
        expect(deletedSong1).toBe(null);
        }) 

    test('can add Musicians to a Band', async () => {
        const musicians = await Musician.findAll({include: Band});
        expect(musicians[0].name).toBe("Alan Gratzer");
        expect(musicians[0].BandId).toBe(1);
        expect(musicians[4].name).toBe("Zac Brown");
        expect(musicians[4].BandId).toBe(2);
    })

    test('can add Songs to a Band', async () => {
        const songs = await Song.findAll({include: Band});
        console.log(JSON.stringify(songs, null, 2));
        expect(songs[0].title).toBe("Can't Fight This Feeling");
        cantfight = songs[0];
        expect(cantfight.Bands[0].name).toBe("REO Speedwagon");
        expect(songs[2].title).toBe("Chicken Fried");
        chickenFried = songs[2];
        expect(chickenFried.Bands[0].name).toBe("Zac Brown Band");
    })


})