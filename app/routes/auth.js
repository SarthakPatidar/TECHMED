var Doc = require('../models/doctor.js');
var Pat = require('../models/patient.js');
var Rep = require('../models/report.js');
var val = Math.floor(1000 + Math.random() * 9000);
var OTP;

  function buildResultSet(docs){
    var result = [];
    for(var object in docs){
      result.push(docs[object]);
    }
    return result;
   }

module.exports = function(router, passport,io){
  //localhost:8080/auth/

  router.get('/error_404',function(req,res){
    res.send('Error 404 page');
  });
  
  router.get('/login', function(req, res){

      res.render('auth_files/login.ejs', { message: req.flash('loginMessage') });
  });

  router.post('/login', function(req,res){
     console.log(req.body.uid);
     console.log(req.body.otp);
     OTP = val;
     if(req.body.otp){
        if(req.body.otp == OTP){
           // Find if he is a doctor or patient
           Doc.findOne({'uid': req.body.uid },function(err,user){
               if(err){
                 throw err;
               }
               if(user){
                 // He is a doctor
                 res.redirect('/dashboard/'+req.body.uid);
               }
               else{
                   Pat.findOne({'uid': req.body.uid },function(err,user){
                       if(err){
                         throw err;
                       }
                       if(user){
                        console.log(req.body.uid);
                        console.log(OTP);
                        console.log('reaching')
                         // He is a patient
                         io.sockets.emit('show_pc_detail',{'user': user});
                         res.redirect('/dashboard/'+req.body.uid);
                       }
                   });
               }
           })
              // res.send('Adhar No.: '+req.body.uid+' Otp:'+ req.body.otp);
        }else{
            // The user with this aadhar does not exist
               res.send('dont make fool');
        }
     }else{
        // This is just to send otp also works when req.body.otp is null
        console.log(req.body.phno);
        var client = require('twilio')(
          'ACc5a3228883866d4142e93f27f13fe7e2',
          '4c68b2104333d707520c386a799fe520'
        );

        client.messages.create({
          from: '+12052877912',
          to: '+91'+req.body.phno,
          body: "Your OTP (one time password) is "+val
        }, function(err, message) {
            if(err) {
                console.error(err.message);
            }else{
              console.log('message sent');
              console.log('Aadhar id: '+req.body.uid)
            Doc.findOne({'uid': req.body.uid },function(err,user){
               if(err){
                 throw err;
               }
               if(user){
                  OTP = val;
                  user.otp = val;
                  user.save(function(err){
                     if(err){
                       throw err;
                     }
                     else{
                       console.log('otp saved');
                     }
                  });
               }
               else{
                   Pat.findOne({'uid': req.body.uid },function(err,user){
                      if(err){
                        throw err;
                      }
                      if(user){
                          user.otp = val;
                          user.save(function(err){
                             if(err){
                               throw err;
                             }
                             else{
                               console.log('otp saved');
                             }
                          });
                      }
                      else{
                         res.send('no person found');
                      }
                   })
               }
            });
            }
        });       
     }
     
  });

 //localhost:8080/auth/signup
  router.get('/signup_doc', function(req, res){
    var j=0;
    if(j<1){
      io.on('connection',function(socket){
        console.log('connection established');
      });
      res.render('auth_files/doctor.ejs',{ message: req.flash('signupMessage')} );
      j= j+1;      
    }
  });

  router.get('/signup_pat',function(req,res){
    var j=0;
    if(j<1){
      io.on('connection',function(socket){
        console.log('connection established');
      });
      res.render('auth_files/patient.ejs',{ message: req.flash('signupMessage')} );
      j= j+1;      
    }

  });


  router.post('/signup_pat',function(req,res){
      // He is a Patient
// Search if the member is already present
      Doc.findOne({'uid': req.body.Aadh },function(err,user){
         if(err){
           throw err;
         }
         if(user){
            res.redirect('/mem_present');
         }
         else{
             Pat.findOne({'uid': req.body.Aadh },function(err,user){
                if(err){
                  throw err;
                }
                if(user){
                   res.redirect('/mem_present');
                }
                else{

                    var newUser = new Pat();

                    console.log(req.body);
                    newUser.uid = req.body.Aadh;
                    newUser.Name = req.body.username_pat;
                    newUser.Blood = req.body.blood_group;
                    newUser.Gender = req.body.gender;
                    newUser.Location = req.body.Address+' '+req.body.city;
                    newUser.Dob = req.body.dob; 

                    newUser.save(function(err){
                      if(err){
                        throw err
                      }else{
                        console.log('patient saved');
                      }
                    });  

                    res.redirect('/dashboard');                  
                }
             })
         }
      });    
  });

  router.post('/signup_doc',function(req,res){
      // He is a Doctor
      console.log(req.body.Aadh);
      Doc.findOne({'uid': req.body.Aadh },function(err,user){
         if(err){
           throw err;
         }
         if(user){
            res.redirect('/mem_present');
         }
         else{
             Pat.findOne({'uid': req.body.Aadh },function(err,user){
                if(err){
                  throw err;
                }
                if(user){
                   res.redirect('/mem_present');
                }
                else{
                    var newUser = new Doc();
                    
                    console.log(req.body);
                    newUser.uid = req.body.Aadh;
                    newUser.Gender = req.body.gender;
                    newUser.Name = req.body.usename;
                    newUser.Location = req.body.clc_add;
                    newUser.Pos = req.body.position;
                    newUser.Spcl = req.body.spcl;
                    newUser.Deg = req.body.deg;
                    newUser.Exp = req.body.exp;
                    newUser.Fee = req.body.clc_fee;
                    newUser.Contact = req.body.contact;

                    newUser.save(function(err){
                      if(err){
                        throw err
                      }else{
                        console.log('doctor saved');
                      }
                    }); 

                    res.redirect('/dashboard');

                }
             })
         }
      });      
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/auth/login');
  });

    router.get('/search_member', function(req, res) {
     var regex = new RegExp(req.query["term"], 'i');
     var stud_query = Stud.find({'local.firstname': regex},{ 'local.firstname': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).select({ local: 1, s_Id: 1 }).limit(20);
     var prof_query = Prof.find({'local.firstname': regex},{ 'local.firstname': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).select({ local: 1, p_Id: 1 }).limit(20);    

    // Execute query in a callback and return users list
    stud_query.exec(function(err, studs) {
        if (!err) {
             prof_query.exec(function(err,profs){
             if(!err){
                  console.log(profs);
                  var proflist = buildResultSet(profs);
                   
                   // Method to construct the json result set
                   var studlist = buildResultSet(studs);
                   var result = studlist.concat(proflist);
                   res.send(result, {
                      'Content-Type': 'application/json'
                   }, 200);                  
                }
            });
        } 
        else {
           res.send(JSON.stringify(err), {
              'Content-Type': 'application/json'
           }, 404);
        }
     });

  }); 
};