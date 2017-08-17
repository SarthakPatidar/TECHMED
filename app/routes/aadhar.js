var parseString = require('xml2js').parseString;
var user;

module.exports = function(router,passport,io){
   
   router.post('/',function(req,res){

      console.log(req.body);
      /*io.on('connection',function(socket){
      	//console.log('connection established');
      	io.sockets.emit('doc_det',{hi: 'hello'});
      })*/

     var xml = req.body.data;
	  parseString(xml, function (err, result) {
	      console.log('Result is printed');
	  	  if(result.PrintLetterBarcodeData.$){
		    console.log(result);
		    user = result.PrintLetterBarcodeData.$;
		    console.log(user.loc);
		    io.sockets.emit('doc_det',{'dob':user.dob,'uid':user.uid,'nme': user.name,'add': user.loc,'cty': user.vtc,'gnd': user.gender});
		    
	  	  } 
	  }); 
         res.redirect('/auth/signup_pat');

   });
}