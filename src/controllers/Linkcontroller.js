const { saveLink, findLinks, findLink, updateLink, updateActive_AtkLink, findLogo, saveLogo, updateClickLink, findLinksbyName, deleteLink, findLinkById} = require('../services/Linkservice');

async function saveCredentialsLinks(req, res, next) {
    try{
      const credentials = { ...req.body };
      if(!req.body.name || !req.body.btn_name || !req.body.url || !req.body.detail_result || !req.body.contain_result){
        throw new Error( 'These fields must be completed (name, name of button, url, detail of result and contain of result)');
      }
      if(!req.file){
        credentials.image = "";
      }
      if(req.body.image){
        credentials.image = req.body.image;
      }
      if(!req.body.title){
        credentials.title = "";
      }
      if(!req.body.description){
        credentials.description = "";
      }
      if(req.file){
        credentials.image = req.file.location;
      }
      const link = await saveLink(credentials);
      return res.json({ link });
    }catch(err){
        next(err);
    }
}

async function saveCredentialsLogo(req, res, next){
  try {
    const credentials = {image: req.file.location};
    credentials.status = req.body.status;
    if(credentials.status == undefined){
      credentials.status = 'active';
    }
    const logo = await saveLogo(credentials);
    return res.json({ logo });
  } catch (error) {
    next(error);
  }
}

async function loadLogoFromDatabase(req, res) {
  try {
    const logo = await findLogo();
    return res.json({ logo });
  } catch (err) {
    return res
      .json({
        error: { ...err, message: err.message },
      })
      .status(err.status_code || 500);
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

async function loadLinkById(req, res) {
  try {
    const id = req.params.id;
    const links = await findLinkById(id);
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
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 9);
      const name = req.query.name;
      const links = await findLinksbyName(name, page, limit);
      return res.json({ links });
    }else {
      const page = Number(req.query.page || 1);
      const links = await findLinks(page);
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
        throw new Error( 'Please provide an ID');
    }
    const linkData = { ...req.body, };

    if(req.file){
      linkData.image = req.file.location;
    }

    const link = await updateLink(linkData);

    return res.json({ link });

  }catch(err){
    next(err);
  }
}

async function updateLinkFieldActiveAt(req, res, next){
  try{
    if(!req.body.id){
        throw new Error( 'Please provide an ID');
    }
    const linkData = { ...req.body, };

    const link = await updateActive_AtkLink(linkData);

    return res.json({ link });

  }catch(err){
    next(err);
  }
}

async function updateClickLinkField(req, res, next){
  try{
    if(!req.body.id){
      throw new Error( 'Please provide an ID');
    }
    const linkData = { ...req.body, };

    const link = await updateClickLink(linkData);

    return res.json({ link });

  }catch(err){
    next(err);
  }
}

async function deleteLinkFromDatabase(req, res, next){
  try {
    const link = await deleteLink(req);
    return res.json({ link });
  } catch (err) {
    next(err);
  }
}

module.exports = { saveCredentialsLinks, loadLogoFromDatabase, updateLinkFieldActiveAt, updateClickLinkField, loadLinkFromDatabase, saveCredentialsLogo, updateLinkFields, deleteLinkFromDatabase, loadAllLinksFromDataBase, loadLinkById};
