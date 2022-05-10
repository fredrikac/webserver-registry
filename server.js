import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const port = 3000;
const app = express();

//kolla efter views i mappen views
app.set('views', './views');
//använd engine ejs
app.set('view engine', 'ejs');
//middleware för att kunna läsa post-data
app.use(express.urlencoded({ extended: true }));
//för att kunna använda statiska filer
app.use(express.static('public'));


//skapa client som kopplar upp sig mot db
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('registry'); //sparar referens till databasen "registry"
const registeredMembers = db.collection('members'); //sparar referens till collectionen "members"


//skapa en ny route: members
app.get('/members', async (req, res) => {
  const members = await registeredMembers.find({}).toArray();
  res.render('members', { members });
});


//sortera a-ö 
app.get('/members/a-z', async (req, res) => {
  const ascMembers = await registeredMembers.find({}).sort({ name: 1}).toArray();
  res.render('a-z', {
    ascMembers
  });
});


//sortera ö-a
app.get('/members/z-a', async (req, res) => {
  const descMembers = await registeredMembers.find({}).sort({ name: -1}).toArray();
  res.render('z-a', {
    descMembers
  });
});


//GET-route till enskild member
app.get('/member/:id', async (req, res) => {
  const member = await registeredMembers.findOne({ _id: ObjectId(req.params.id) });
  res.render('member', {
    ...member
  });
});


//GET-route till create-sidan
app.get('/members/create', (req, res) => {
  res.render('create');
});


//POST-route for att posta formuläret på create
app.post('/members/create', async (req, res) => {
  await registeredMembers.insertOne(req.body);
  res.redirect('/members');
});

//GET-route till start
app.get('/start', (req, res) => {
  res.render('start');
});

//GET-route till update när anv klickar på Ändra
app.get('/member/:id/update', async (req, res) => {
  const dismember = await registeredMembers.findOne({ _id: ObjectId(req.params.id) });
  res.render('update', {
    ...dismember
  });
});

//POST för att uppdatera medlemsuppgifter
app.post('/member/:id/update', async (req, res) => {

  await registeredMembers.updateOne({ _id: ObjectId(req.params.id) }, {$set: { ...req.body }});
  res.redirect(`/member/${req.params.id}`);
});

//DELETE - mha GET
app.get('/member/:id/delete', async (req, res) => {
  await registeredMembers.deleteOne({ _id: ObjectId(req.params.id) });
   res.redirect('/members');
});


//lyssna på port 3000
app.listen(port, () => console.log(`Listening to port ${port}`));