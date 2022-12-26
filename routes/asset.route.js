const Router = require('express');
const expressFileUpload = require('express-fileupload');
const { check,body } = require('express-validator');
const { createAsset, getAllAssets, getAssetById, updateAssetById, deleteAssetById, getAssetsByIds, importAssets } = require('../controllers/asset.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validatedJWT } = require('../middlewares/validate-jwt');

const router = Router();
router.use( expressFileUpload() );

router.post('/create-asset',
    [
        validatedJWT,
        check('article','Article can not be empty').not().isEmpty().trim(),
        validateFields
    ],
createAsset);

router.get('/assets',
    [
        validatedJWT,
    ],
getAllAssets);

router.get('/asset/:id',
    [
        validatedJWT
    ],
getAssetById);

router.put('/:id',
    [
        validatedJWT,
        check('article','Article field cat not be empty').not().isEmpty().trim(),
        validateFields
    ],
updateAssetById);

router.delete('/asset/:id',
    [
        validatedJWT
    ],
deleteAssetById);

router.get('/assetsByIds',
    [
        validatedJWT
    ],
getAssetsByIds);

router.post('/import-assets',
    [
        validatedJWT
    ],
importAssets);

module.exports = router;