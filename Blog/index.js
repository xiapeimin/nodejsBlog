const express = require('express');
const fs = require("fs");
const qs = require('querystring');

const app = express();

var users=[];

//读取文件
function readFiles(filepath,filetype,res){  
  fs.readFile(filepath, function(err, data) {
      res.writeHead(200, {'Content-Type': filetype});
      res.write(data);
      res.end();
  });
}
//读取图片
function readImg(filepath,res){
  fs.readFile(filepath,'binary',function(err,filedata){
      if(err){
          console.log(err);
          return;
      }else{
          res.write(filedata,'binary');
          res.end();
      }
  });
}

app.get('/', function(req, res) {
  readFiles("./blogexpress-master/login.html",'text/html; charset=utf8',res);
});
app.get('/login_bg.jpg',function(req,res) {
  readImg('./blogexpress-master/login_bg.jpg',res);
});
app.get('/list',function(req,res) {
  readFiles("./blogexpress-master/list.html",'text/html; charset=utf8',res);
});
app.get('/bg.jpg',function(req,res) {
  readImg('./blogexpress-master/bg.jpg',res);
});

//登录验证
app.post('/check',function(req,res) {
  var file = './blogexpress-master/data.json';
  fs.readFile(file,'utf-8',function(err, data) {//读取json文件
    if(err){
      console.log(err);
      return;
    }else{
      var data = JSON.parse(data);
      users = data.users;    
    }
  });

  var str='';
  var username = '';
  var pwd = '';
  req.on('data',function(data){
    str += data;
  });            
  req.on("end",function(){
    var json = qs.parse(str);
    username = json.username;
    pwd = json.pwd;
    
    for(var i = 0;i < users.length;i++){
      if(username == users[i].username && pwd == users[i].password){    
        res.write('ok');
        res.end();
        i = users.length;
      }else if(i == users.length-1 && username != users[i].username && pwd != users[i].password){
        res.write('no');
        res.end();
      }
    }
    
  });
});

//get文章列表数据
app.get('/search',function(req,res) {
  var file = './blogexpress-master/data.json';
  fs.readFile(file,'utf-8',function(err, data) {
    if(err){
      console.log(err);
      return;
    }else{
      res.write(data);
      res.end();
    }
  });
});

app.listen('8080');
