var Doc = require('../models/doctor.js');
var Pat = require('../models/patient.js');
var Rep = require('../models/report.js');

module.exports = function(router,passport,io){
var j=0;var i=0;

    router.get('/req_blood',function(req,res){
         res.render('ackg/acknowledgement.ejs');
    });

    router.post('/conv_to_pdf',function(req,res){
    	console.log(req.body);

                var pdf= require('pdfkit');
                var fs= require('fs');

                var myDoc =new pdf;
                myDoc.pipe(fs.createWriteStream(__dirname+'report'+req.body.rid+'.pdf'));
                myDoc.text('Doctor Id: '+req.body.doct_id+ 'Disease: '+req.body.dise+ 'Symptoms: '+req.body.symp+'Medicines: '+req.body.med, 100,100);
                myDoc.font('Times-Roman')
                myDoc.fontSize(48); 
                myDoc.end(); 
                var file = __dirname+'report'+req.body.rid+'.pdf';
                res.download(file); // Set disposition and send it.     
    });

    router.get('/profile/:id',function(req,res){
    	Doc.findOne({'uid': req.params.id},function(err,doc){
    		if(err){
    			throw err;
    		}
    		if(doc){
    			// He is a Doctor
    			res.render('profiles/doctor_profile.ejs',{'doctor': doc});
    		}
    		else{
    			Pat.findOne({'uid': req.params.id},function(err,pat){
    				if(err){
    					throw err;
    				}
    				if(pat){
                        // He is a patient
                        res.render('patient_profile.ejs',{'patient': pat});

    				}else{ 
    					// He is neither doctor or patient
    				}
    			})
    		}
    	})
    })

	router.get('/dashboard/:id',function(req,res){
		 if(j<1){
          io.on('connection',function(socket){
              console.log('connected');
              socket.on('get_pat_details',function(data){
              	console.log(data.did);
                  Pat.findOne({'uid': data.id},function(err,user){
                  	  if(err){
                  	  	throw err;
                  	  }
                  	  if(user){
                  	  	 console.log(data.wght);
                  	  	     rep = new Rep();
                  	  	     rep.doctor_id = data.did; 
                             rep.patient_id = data.id;
                             user.Weight = data.wght;
                             user.Height = data.hght;
                             user.BMI = data.bmi;
                             user.Blood_Pressure = data.bp;
                             rep.Pulse_Rate= data.pulse;
                             rep.Disease = data.desc;
                             rep.symptoms = data.sympt;
                             rep.Medicines = data.med;
    

                             user.save(function(err){
                             	if(err){
                             		throw err;
                             	}else{
                             		console.log('user personal report updated');
                             		//res.redirect("/dashboard/"+data.did);
                             	}
                             })

                             rep.save(function(err){
                             	if(err){
                             		throw err;
                             	}else{
                             		console.log('report saved');
                             		io.sockets.emit('show_details',{'uid': data.id,'wght': data.wght,'hght': data.hght, 'bmi': data.bmi, 'bp': data.bp });
                             		//res.redirect("/dashboard/"+data.did);
                             	}
                             })
                  	  	 
                  	  }
                  })
                  
              });
              socket.on('get_history',function(data){
                 Rep.find({'patient_id': data.id},function(err,report){
                 	if(err){
                 		throw err;
                 	}else{
                 		for(i=0;i<report.length;i++)
                 		{
                            io.sockets.emit('reports',{'_id': report[i]._id, 'Date': report[i].Date, 'p_id': report[i].patient_id,'d_id': report[i].doctor_id,'desc': report[i].Disease,'sym': report[i].symptoms,'med': report[i].Medicines });
                 		}
                 	}
                 })
              });
          });
           j = j+1;		 	
		 }
           

           Doc.findOne({'uid': req.params.id },function(err,user){
               if(err){
                 throw err;
               }
               if(user){
                 // He is a doctor
                 console.log(user);
                 res.render('doctor_view.ejs',{'doctor': user});
                 io.sockets.emit('doc_details',{'user': user});
               }
               else{
                   Pat.findOne({'uid':  req.params.id },function(err,user){
                       if(err){
                         throw err;
                       }
                       if(user){
                       	console.log(user);
                         // He is a patient
                         res.render('patient_view.ejs',{'patient': user});
                         io.sockets.emit('pat_details',{'user': user});
                       }
                   });
               }
           });
	});

	router.get('/mem_present',function(req,res){
		res.render('mem_not_pre.ejs');
	})

	router.get('/aadhar_conf',function(req,res){
		console.log('reaching');
		res.render('aadhar_conf.ejs');
	})

   	router.get('/*', function(req, res){
		res.redirect('/auth/login');
	}); 
}