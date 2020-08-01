const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/route');

const db = require('./db');
const userOrderDetailsModel = require('./db-util/model');

app.locals.getOrderStatus =  (orderDate, id) => {
  let diffDate = Math.abs((new Date()).getTime() - orderDate.getTime());
  let diffInDays = Math.ceil(diffDate/ (1000 * 3600 * 24));
  if(diffInDays > 2){
    userOrderDetailsModel.updateOne({_id : id}, {orderStatus: 'Delivered'});
    return 'Delivered';
  }else if(diffInDays == 2){
    userOrderDetailsModel.updateOne({_id : id}, {orderStatus: 'Dispatched'});
    return 'Dispatched';
  }else{
    userOrderDetailsModel.updateOne({_id : id}, {orderStatus: 'In Progress'});
    return 'In Progress';
  }
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use('/', routes);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connection successful!!!');
  app.listen(3000, () => console.log('Server Started on port 3000'));
});