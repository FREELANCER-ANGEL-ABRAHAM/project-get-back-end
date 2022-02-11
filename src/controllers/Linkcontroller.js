const { savelink, findLinks, findLink, updateLink, statusEqualsEnable, findLinksbyName } = require('../services/Linkservice');

async function saveCredentialsLinks(req, res, next) {
    try{
      if (!req.file) {
        throw {
          code: 'NO_FILE_PROVIDED',
          message: 'Please provide an image file',
        };
      }
      const credentials = {
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        btn_name: req.body.btn_name,
        url: req.body.url,
        image: req.file.location,
        visibility: req.body.visibility,
        status: req.body.status
      };
      const link = await savelink(credentials);
      return res.json({ link });
    }catch(err){
        next(err);
    }
}

async function loadLinkFromDatabase(req, res) {
  try {
    const links = await findLink();
    return res.json({ links });
  } catch (err) {
    return res
      .json({
        error: { ...err, message: err.message },
      })
      .status(err.status_code || 500);
  }
}

async function loadAllLinksFromDataBase(req, res) {
  try{
    if (req.query.name) {
      const name = req.query.name;
      const links = await findLinksbyName(name);
      return res.json({ links });
    }else {
      const links = await findLinks();
      return res.json({ links });
    }
  }catch(err){
    return res
      .json({
        error: { ...err, message: err.message },
      })
      .status(err.status_code || 500);
  }
}

async function updateLinkFields(req, res, next){
  try{
    if(!req.body.id){
        throw {
          code: 'NO_ID_PROVIDED',
          message: 'Please provide an ID',
        };
    }

    const linkData = {
      id: req.body.id,
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      btn_name: req.body.btn_name,
      url: req.body.url,
      image: req.file.image,
      visibility: req.body.visibility,
      status: req.body.status
    }
    const link = await updateLink(linkData);
    return res.json({ link });
  }catch(err){
    next(err);
  }
}

async function statusLinksEnable(req, res, next){
  try{
    if(!req.body.id){
        throw {
          code: 'NO_ID_PROVIDED',
          message: 'Please provide an ID',
        };
    }
     const linkData = {
      id: req.body.id,
      visibility: req.body.visibility,
      status: req.body.status
    }
    const link = await statusEqualsEnable(linkData);
    return res.json({ link });
  }catch(err){
    next(err);
  }
}

module.exports = { saveCredentialsLinks, loadLinkFromDatabase, updateLinkFields, statusLinksEnable, loadAllLinksFromDataBase};
