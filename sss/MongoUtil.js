/*
	Mongodb的数据库工具类
*/
var client = require('mongodb').MongoClient;

function MongoUtil() {
	this.url="mongodb://localhost:27017/library";	//在本地新建数据库igeek，此后插入的数据都在igeek中
}

MongoUtil.prototype.connect=function(callback){
	var that = this;
	client.connect(this.url,function(err,db){
		if(err){
			console.dir(err);
		}else{
			that.db = db;
			callback();
		}
	});
}

MongoUtil.prototype.close = function(){
	this.db.close();
}

MongoUtil.prototype.insertDocuments = function(collectionName,docs,callback) {
	var that = this;
  this.connect(function(){
	  var collection = that.db.collection(collectionName);
	  collection.insertMany(docs, function(err,result){
	  	if(err){
	  		console.dir(err);
	  	}else{
	  		callback(result);
	  	}
	  	that.close();
	  });

  });
}

MongoUtil.prototype.insertDocument = function(collectionName,doc,callback) {
	var that = this;
    this.connect(function(){
	    var collection = that.db.collection(collectionName);
	    collection.insertOne(doc, function(err,result){
	  		if(err){
	  			console.dir(err);
	  		}else{
	  			callback(result.insertedCount);
	  		}
	  		that.close();
	    });
    });
}

MongoUtil.prototype.findAllDocuments = function(collectionName, callback) {
  var that = this;
  this.connect(function(){
  	var collection = that.db.collection(collectionName);  
	  collection.find({}).toArray(function(err,result){
		  	if(err){
		  		console.dir(err);
		  	}else{
		  		callback(result);//返回插入的行数
		  	}
		  	that.close();
		  });
  })
}

MongoUtil.prototype.update = function(collectionName,filter,update,callback){
	var that = this;
	this.connect(function(){
		var collection = that.db.collection(collectionName);
		collection.updateOne(filter,update,function(err,result){
			if(err){
		  		console.dir(err);
		  	}else{
		  		callback(result.insertedCount);//返回插入的行数
		  	}
		});
	});
}

MongoUtil.prototype.findOne = function(collectionName,query,options,callback){
	var that = this;
	this.connect(function(){
		var collection = that.db.collection(collectionName);
		collection.findOne(query,options).then(function(doc){
			callback(doc);
		});
	});
}

MongoUtil.prototype.findPartDocument = function(collectionName,query,options,callback){
	var that=this;
	this.connect(function(){
		var collection = that.db.collection(collectionName);
		collection.find(query)
				  .project(options)
				  .toArray(function(err,result){
				  	callback(result);
				  });
	});
}

module.exports=new MongoUtil();