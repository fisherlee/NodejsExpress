var mongodb = require('./db');

function PhoneLocation(location) {
	this.phone = location.phone;
	this.area = location.area;
	this.city = location.city;
	this.idx = location.idx;
	this.code = location.code;
	this.number = location.number;
	this.com = location.com;
};

module.exports = PhoneLocation;

//读取信息
PhoneLocation.get = function(mobile, callback) {
  
  mongodb.open(function(err, db) {
    
    if (err) {
      console.log('mongodb error = ', err);
      return callback(err);//错误，返回 err 信息
    }

    db.collection('phonelocation', function(err, collection){

      if (err) {
      	mongodb.close();
        console.log('collection error = ', err);        
        return callback(err);
      };
      //console.log('collection=', collection);
      
      //按条件查找
      collection.findOne({phone: mobile}, function(err, docs){
			  mongodb.close();
        if (err) {
          console.log("find phone error = ", err);
            	return callback(err);
        };

        console.log("Found the one record");
        if (docs != null) {
          console.log("Found record = ", docs);
        }else {
          console.log("Found the null record");
        }
          	
        callback(null, docs);

      });
     
    });
    
  });
};

PhoneLocation.getallone = function(mobiles, callback) {
  mongodb.open(function(err, db) {
    
    if (err) {
      console.log('mongodb error = ', err);
      return callback(err);//错误，返回 err 信息
    }

    db.collection('phonelocation', function(err, collection){

      if (err) {
        mongodb.close();
        console.log('collection error = ', err);        
        return callback(err);
      };
      //console.log('collection=', collection);
      
      //按条件查找
      var resultArray = new Array();
      var sum = 0;
      for (var i = mobiles.length - 1; i >= 0; i--) {
        var mobile = mobiles[i];
        var subString = mobile.substring(0,7);
        
        console.log("mobile record = ", i, sum);
        collection.findOne({phone: Number(subString)}, function(err, docs){
          sum = sum+1;
          mongodb.close();
          if (err) {
            console.log("find phone error = ", err);
            return callback(err);
          };

          console.log("Found the one record = ", i, sum);
          if (docs != null) {
            console.log("Found record = ", docs.length);

            var addr = docs.area+', '+docs.city;
            resultArray.push([mobile, docs.com, addr]);

            if (sum == mobiles.length) {
              console.log("callback", resultArray.length);
              callback(null, resultArray);
            }

          }else {
            console.log("Found the null record");
          }
        
        });

      };

    });

  });

};

PhoneLocation.getall = function(callback) {
  mongodb.open(function(err, db) {
    
    if (err) {
      console.log('mongodb error = ', err);
      return callback(err);//错误，返回 err 信息
    }

    db.collection('phonelocation', function(err, collection){

      if (err) {
        mongodb.close();
        console.log('collection error = ', err);        
        return callback(err);
      };
      //console.log('collection=', collection);
      
      //查找所有
      collection.find({}).toArray(function(err, docs) {

        mongodb.close();

        if (err) {
          console.log("find error = ", err);
          return callback(err);
        };

        console.log("Found the following records");
        console.log(docs.length);
        
        callback(null, docs);

      });

    });

  });

};
