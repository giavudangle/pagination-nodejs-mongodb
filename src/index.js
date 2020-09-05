require('dotenv').config();
const express = require('express');
const mongooose = require('mongoose');
const Post = require('./models/Post');


const app = express();


mongooose.connection.once('open', async () => {
  if (await Post.countDocuments().exec()>0) return;
  Promise.all([
    Post.create({name:'Post #1'}),
    Post.create({name:'Post #2'}),
    Post.create({name:'Post #3'}),
    Post.create({name:'Post #4'}),
    Post.create({name:'Post #5'}),
    Post.create({name:'Post #6'}),
    Post.create({name:'Post #7'}),
    Post.create({name:'Post #8'}), 
    Post.create({name:'Post #9'}),
    Post.create({name:'Post #10'}),
    Post.create({name:'Post #11'}),
    Post.create({name:'Post #12'}),
    Post.create({name:'Post #13'}),
    Post.create({name:'Post #14'}),
    Post.create({name:'Post #15'}),
    Post.create({name:'Post #16'}),
  ]).then(() => console.log('Added mock posts'));
})

const mock= {}

mongooose.connect(process.env.MONGO_CONNECTION_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongooose.connection.on('connected',() => console.log('Connect DB Success'))

app.listen(process.env.SERVER_PORT,() =>{
  console.log('server connected')
})



const pagination = (model) => {
  return async (req,res,next) => {
    const page =parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    /**
     * When request send 2 params : page && limit
     * We can understand user want to view : 
     * How many products will be display (limit) ?
     * And page is pagination a tons of data  into part
     * Example : Page 1 , limit = 5 => Each page have 5 products
     * So we want to view products between them
     * Such as : page = 1 , limit = 8
     * -> start = (page - 1) * limit = 0
     * -> end = page * limit = 8
     * => Slice to new array with all of elements between [0,8];
     * Page 2 : limit 8
     * -> start = (page - 1) * limit = 8
     * -> end = page * limit = 16
     * => Slice to new array with all of elements between [8,16];
     */
    
    const start =  (page - 1) * limit
    const end = page * limit;
    const result  = {}
  
    if (end < await model.countDocuments().exec())
     result.next={
      page:page+1,
      limit:limit
    }
  
    if ( start > 0){
      result.previous={
        page:page-1,
        limit:limit
      }
    }
    try {
      result.results = await model.find().limit(limit).skip(start).exec();
      res.paginated = result;
      next();
    }catch (err) {
      console.log(err);
    }

  }
}

app.get('/posts',pagination(Post),(req,res) => {

  res.json(res.paginated)
})