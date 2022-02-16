const { savelink, findLinks, findLink, updateLink, findLinksbyName, deleteLink} = require('../services/Linkservice');

async function saveCredentialsLinks(req, res, next) {
    try{
      const credentials = { ...req.body };
      if(!req.body.title){
        credentials.title = "";
      }
      if(!req.body.description){
        credentials.description = "";
      }
      if(!req.body.image){
        credentials.image = "";
      }
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

async function deleteLinkFromDatabase(req, res, next){
  try {
    const link = await deleteLink(req);
    return res.json({ link });
  } catch (err) {
    next(err);
  }
}

module.exports = { saveCredentialsLinks, loadLinkFromDatabase, updateLinkFields, deleteLinkFromDatabase, loadAllLinksFromDataBase};
