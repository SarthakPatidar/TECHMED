$(function() {

  $.validator.setDefaults({
    errorClass: 'help-block',
    highlight: function(element) {
      $(element)
        .closest('.form-group')
        .addClass('has-error');
    },
    unhighlight: function(element) {
      $(element)
        .closest('.form-group')
        .removeClass('has-error');
    }
});

  $.validator.addMethod("customemail", 
    function(value, element) {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    }, 
    "Please enter a valid email address"
  );

  $.validator.addMethod("alphanumeric", 
    function(value, element) {
        return /^[A-Za-z0-9, ]+$/.test(value);
    }, 
    "Only letters and numbers are allowed"
  );     

    $.validator.addMethod("select_option", function (value) {
        return (value != '0');
    },"Select any one of the above");

  $("#setupform").validate({
    rules: {
      Dept: {
        required: true,
        maxlength: 20,
        alphanumeric: true
      },
      position: {
        required: true,
        maxlength: 20
      },
      research: {
        maxlength: 20,
        alphanumeric: true
      },
      subjects: {
        required: true,
        maxlength: 40,
        alphanumeric: true
      },
      gender: {
        required: true
      },
      contact: {
        required: true,
        phoneUS: true
      },
      info: {
        required: true,
        maxlength: 30
      }   
    },
    messages: {
      Dept: {
        required: 'Please enter your Department e.g: Computer Science'
      },
      position: {
        required: 'Enter your position e.g: HOD ,Professor, Asisstant Professor etc.'
      },
      subjects: {
        required: 'Enter subjects you teach e.g: electrical ,java, fluid mechanics etc.'
      },
      gender: {
        required: 'Select your Gender'
      },
      contact: {
        required: 'Please provide your phone number so that students can reach you'
      },
      info: {
        required: 'Try to express yourself'
      }  
    }
  });

  $("#setup_stud_form").validate({
    rules: {
      Dept: {
        required: true,
        maxlength: 20,
        alphanumeric: true
      },
      regno: {
        required: true,
        maxlength: 15,
        nowhitespace: true
      },
      research: {
        maxlength: 20,
        alphanumeric: true
      },
      subjects: {
        required: true,
        maxlength: 40,
        alphanumeric: true
      },
      gender: {
        required: true
      },
      contact: {
        required: true,
        phoneUS: true
      },
      info: {
        required: true,
        maxlength: 30
      },
      course: {
        select_option: true
      },
      batch: {
        select_option: true
      },
      year: {
        select_option: true
      } 
    },
    messages: {
      Dept: {
        required: 'Please enter your Department e.g: Computer Science'
      },
      regno: {
        required: 'Enter your registration number e.g: RA1511*******',
        maxlength:'Enter a valid registration number'
      },
      subjects: {
        required: 'Enter subjects you teach e.g: electrical ,java, fluid mechanics etc.'
      },
      gender: {
        required: 'Select your Gender'
      },
      contact: {
        required: 'Please provide your phone number so that students can reach you'
      },
      info: {
        required: 'Try to express yourself'
      }    
    }
  });


});