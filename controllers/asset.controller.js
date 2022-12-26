const { Asset } = require('../models/asset.model');
const { User } = require('../models/user.model');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const createAsset = async(req,res) => {
    const  uuid = req.uuid;
    
    try {
        const asset = new Asset({
            UserId: uuid,
            ...req.body
        });

        await asset.save();

        return res.json({
            ok: true,
            asset
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something wrong happen when was try to register asset'
        })
    }
}
const getAllAssets = async(req,res) => {
    const offset = Number(req.query.offset) || 0;

    try {
        const assets = await Asset.findAll({offset,limit: 10,order: [ ['id','ASC'] ],include: [ { model: User, attributes: ['username','name'] } ]});
        const totalAssets = await Asset.count();

        return res.json({
            ok: true,
            totalAssets,
            assets,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something wrong happen when was try to get asset'
        })
    }
}
const getAssetById = async(req,res) => {
    const id = req.params.id;

    try {
        const asset = await Asset.findByPk(id,{include: [ { model: User, attributes: ['username','name'] } ]});

        if(!asset) {
            return res.status(404).json({
                ok: false,
                msg: 'Asset can not found'
            });
        }

        return res.status(200).json({
            ok: true,
            asset
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Something wrong happen when was try to get asset'
        })
    }
}
const getAssetByCurrentUser = async(req,res) => {
    const  UserId = req.uuid;

    try {
        const assets = await Asset.findAll({ where: { UserId },include: [ { model: User, attributes: ['username','name'] } ]});

        if(!assets) {
            return res.status(404).json({
                ok: false,
                msg: 'Asset can not found'
            });
        }

        return res.status(200).json({
            ok: true,
            totalFound: assets.length,
            assets
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Something wrong happen when was try to get asset'
        })
    }
}
const getAssetByUserId = async(req,res) => {
    const  UserId = req.params.UserId;

    try {
        const assets = await Asset.findAll({ where: { UserId },include: [ { model: User, attributes: ['username','name'] } ]});

        if(!assets) {
            return res.status(404).json({
                ok: false,
                msg: 'Asset can not found'
            });
        }

        return res.status(200).json({
            ok: true,
            totalFound: assets.length,
            assets
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Something wrong happen when was try to get asset'
        })
    }
}
const updateAssetById = async(req,res) => {
    let id = req.params.id;
    const UserId = req.uuid;

    try {
        id = Math.floor(+id);

        if(typeof id !== 'number' || typeof UserId !== 'number') { 
            return res.status(404).json({
                ok: false,
                msg: 'argument not valid'
            });
        }
        const asset = await Asset.findOne({ where: { id, UserId } });

        if(!asset) {
            return res.status(404).json({
                ok: false,
                msg: 'Asset not found'
            });
        }

        const assetUpdated = await Asset.update(req.body, { where: { id, UserId }, returning: true});

        return res.status(200).json({
            ok: true,
            assetUpdated
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something wrong happen when was try to get asset'
        })
    }
}
const deleteAssetById = async(req,res) => {
    const id = req.params.id;
    const UserId = req.uuid;

    try{
        const asset = await Asset.findOne({ where: { id, UserId } });
        
        if(!asset) {
            return res.status(404).json({
                ok: false,
                msg: 'Asset not found'
            });
        }

        await Asset.destroy({ where: {id, UserId } });

        return res.status(200).json({
            ok: true,
            msg: 'Asset deleted'
        });
    }catch(error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error, something wrong happend in delete action'
        });
    }
}
const getAssetsByIds = async(req,res) => {
    const { ids } = req.query;

    let arrIds = ids.split(",");
    let result = arrIds.map(i => Number(i));
    
    try {
        const assets = await Asset.findAll({
             where: { id:  result  },
             include: [ { model: User, attributes: ['username','name'] } ],
             order: [
                ['id','ASC'] 
             ]
        });

        return res.status(200).json({
            ok: true,
            totalAssetsFound: assets.length,
            assets,
        });
        
    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}
const importAssets = async(req = request,res) => {
    const  uuid = req.uuid;
    
    try {
        const user = await User.findByPk(uuid);
        if(!user) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });   
        }
        const file = req.files.file;
        const pathFile = `./uploads/${ file.name }`;

        file.mv( pathFile ,async (err) => {
            if (err){
                console.log(err)
                return res.status(500).json({
                    ok: false,
                    msg: 'Error to save file'
                });
            }
            const pathFileUploaded = path.join( __dirname, `../uploads/${ file.name }` );
            await importData(uuid,pathFileUploaded);

            fs.unlinkSync(pathFile);

            return res.status(200).json({
                ok: true,
                msg: 'Import file succesfully',
            });
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error importing file'
        });
    }

}
const importData = (UserId,pathImg) => {
    
    return new Promise((resolve,reject) => {
        fs.createReadStream(pathImg)
                .pipe(csv())
                .on('data', async (row) => {
                    try {
                        await Asset.create({id: row.id, article: row.articulo, description: row.descripcion, UserId });
                    } catch (error) {
                        return error;
                    }
                })
                .on('end', () => {
                    resolve(true);
                })
                .on("error", function (error) {
                    reject(new Error(error));
                });
    });
}

module.exports = {
    createAsset,
    getAllAssets,
    getAssetById,
    updateAssetById,
    deleteAssetById,
    getAssetsByIds,
    importAssets,
    getAssetByCurrentUser,
    getAssetByUserId
}