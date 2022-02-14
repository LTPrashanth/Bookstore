const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const upload = multer({storage: storage});

const express = require('express');

const adminController = require('../controllers/admin');

const checkAuth = require('../middleware/authentication');
const checkAdmin = require('../middleware/admin');

const router = express.Router();

router.get('/',adminController.getBooks);

router.get('/orders', checkAuth, checkAdmin, adminController.getOrders);

router.patch('/orders/:orderId', checkAuth, checkAdmin, adminController.patchCompleteOrder);

router.post('/add-book', checkAuth, checkAdmin, upload.single('imageUrl'), adminController.postAddBook);

router.get('/:bookId', adminController.getBookById);

router.patch('/:bookId', checkAuth, checkAdmin, adminController.patchBookById);

router.delete('/:bookId', checkAuth, checkAdmin, adminController.deleteBookById);



module.exports = router;