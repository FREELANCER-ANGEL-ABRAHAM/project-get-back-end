const Link = require('../models/Links');

async function statusEqualsRemoved(elementId, model) {
  let element;
  console.log('modelo:', model);

  if(model !== 'Link'){
    throw {
      code: 'INVALID_MODEL_NAME',
      message: 'Specified model is not valid',
    };
  }else{
    const links = await Link.findById(elementId);
    element = links;
  }

  if (element.status === 'removed') {
    return true;
  }else{
    return false;
  }

}

module.exports = { statusEqualsRemoved };
