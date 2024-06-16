import express from 'express';
const app = express();
const router = express.Router();
const port = 5001;

app.use(express.json());

//1st way use application middleware to reach custom error middleware handler
/* app.use('/', (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} - ${req.url}`);

    //intentionally feeding the error so that we can navigate to custom error handler
    if(!req.body.error){
        req.body.error = 'Intentional Error Feeding';
    }

    if(req.body.error) {
        const error = new Error(req.body.error);
         return next(error);
    }
    next();
}); */

//2nd way is to create another custom middleware to reach custom error middleware handler
// Because unless and until there is an error it wont go to custom error handler, so we have to implicitly create and error for testing purpose

const insertionErrorMiddleware = (req,res,next) => {
    if(!req.body.error) {
        req.body.error = "Intentionally Feeding error";
    }

    if(req.body.error) {
        const error = new Error(req.body.error);
        return next(error);
    }
    next();
}

app.use('/', insertionErrorMiddleware);
router.post('/users', (req,res) => {
    res.json({message: req.body});
});

app.use((err,req,res,next) => {
    console.error(`Printing Error Stack :: ${err}`);
    res.status(500).send('Error Encountered!');
});
app.use('/api', router);

app.listen(port, () => {
    console.log(`Listening to PORT :: ${port}`);
    process
    .on('unhandledRejection', (err) => {
        console.error(`UnhandledRejection error :: ${err}`);
    })
    .on('uncaughtException', (err) => {
        console.error(`Uncaught Exception :: ${err}`);
    });
})