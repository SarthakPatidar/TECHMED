var pdf= require('pdfkit');
var fs= require('fs');

var myDoc =new PDFKit('file', 'pdf_format.html');
myDoc.pipe(fs.createWriteStream('/node.pdf'));

myDoc.font('Times-Roman');
myDoc.fontSize(48);

myDoc.end();
