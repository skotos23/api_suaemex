const router = require('express').Router();
const documents_model = require('../models/Documents');
const {isAuthenticated} = require('../helpers/aouth');
router.get('/documents/add',isAuthenticated, (req, res)=>{
    res.render('documents/add-documents');
});
router.post('/documents/add',isAuthenticated,async (req, res)=>{
    const {title}=req.body;
    const errors=[];
    if(!title){
        errors.push({text: 'Inserte un titulo'});
    }
    if(errors.length>0){
        res.render('documents/add-documents',{
            errors,
            title,
        });
    }else{ 
        const docu = new documents_model({title});
        docu.user = req.user.id;
         await docu.save();
        req.flash('success_msg', 'Documento guardado correctamente');
        res.redirect('/documents');

    }
});
router.get('/documents',isAuthenticated, async(req, res)=>{
    const allDocumentsModels = await documents_model.find({user: req.user.id}).sort({date: 'desc'});
    res.render('documents/allDocuments', {allDocumentsModels});
});
router.get('/documents/edit/:id',isAuthenticated, async(req, res)=>{
    const document=  await documents_model.findById(req.params.id);
   res.render('documents/editDocuments',{document});
});

router.put('/documents/edit-document/:id',isAuthenticated,async(req, res)=>{
    const title = req.body;
      await documents_model.findByIdAndUpdate(req.params.id, title);
    req.flash('success_msg', 'Documento editado correctamente');

    res.redirect('/documents');
});
router.delete('/documents/delete/:id',isAuthenticated, async(req, res)=>{
    const id = req.params.id;
    await documents_model.findByIdAndDelete(id);
    req.flash('success_msg','Documento eliminado');
    res.redirect('/documents');
});
module.exports= router;