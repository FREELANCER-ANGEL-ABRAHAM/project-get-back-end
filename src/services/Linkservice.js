const config = require('../config');
const Link = require('../models/Links');


const modelName = 'Link';

async function savelink(credentials){
  if (credentials.name == undefined || credentials.title == undefined || credentials.description == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.url == undefined || credentials.image == undefined || credentials.visibility == undefined || credentials.status == undefined) {
    throw {
      code: 'MISSING_FIELDS',
      message: 'Please provide all fields',
    };
  }
  else{
    const link = await Link.findOne({name: credentials.name});

    if(link){
      throw {
        code: 'INVALID_DATA',
        message: 'There is already a link with that name',
      };
    }
    else{
      const newLink = new Link(credentials);
      if(!['visible', 'hidden'].includes(newLink.visibility)) {
        throw {
          code: 'INVALID_VISIBILITY',
          message: 'Specified visibility is not valid',
        };
      }
      else if(!['active', 'disable'].includes(newLink.status)){
        throw {
          code: 'INVALID_STATUS',
          message: 'Specified status is not valid',
        };
      }
      else{
        await newLink.save();
        return newLink;
      }
    }

  }
}

async function findLinks(linksVisibility){
  if(linksVisibility == undefined){
    linksVisibility = 'visible';
  }
  else if (!['visible', 'hidden'].includes(linksVisibility)) {
    throw {
      code: 'NO_ITEMS_FOUND',
      message: `No items found for visibility: ${linksVisibility}`,
    };
  }
  const links = await Link.paginate({ visibility: linksVisibility});

  return links;
}

async function updateLink(linkData){
  if(!['active', 'disable'].includes(linkData.status)){
    throw {
      code: 'INVALID_STATUS',
      message: 'Specified status is not valid',
    };
  }
  else if(!['visible', 'hidden'].includes(linkData.visibility)){
    throw {
      code: 'NO_ITEMS_FOUND',
      message: `No items found for visibility: ${linkData.visibility}`,
    };
  }
  else{
    const link = await Link.findByIdAndUpdate(
      linkData.id,
      {
        name: linkData.name,
        title: linkData.title,
        description: linkData.description,
        btn_name: linkData.btn_name,
        url: linkData.url,
        image: linkData.image,
        visibility: linkData.visibility,
        status: linkData.status
      },{new: true}
    );
    return link;
  }
}

async function statusEqualsEnable(linkData) {
  if (linkData.name == undefined || linkData.title == undefined || linkData.description == undefined || linkData.btn_name== undefined || linkData.url == undefined || linkData.image == undefined || linkData.visibility == undefined || linkData.status == undefined) {
    throw {
      code: 'MISSING_FIELDS',
      message: 'Please provide all fields',
    };
  }

  let links = await Link.findById(linkData.id);

  if (links) {
    if(!['active', 'disable'].includes(linkData.status)){
      throw {
        code: 'INVALID_STATUS',
        message: 'Specified status is not valid',
      };
    }
    else if(!['visible', 'hidden'].includes(linkData.visibility)){
      throw {
        code: 'NO_ITEMS_FOUND',
        message: `No items found for visibility: ${linkData.visibility}`,
      };
    }
    if(linkData.status == 'disable'){
      linkData.visibility = 'hidden';
    }
    links = await Link.findByIdAndUpdate(
      linkData.id,
      {
        name: linkData.name,
        title: linkData.title,
        description: linkData.description,
        btn_name: linkData.btn_name,
        url: linkData.url,
        image: linkData.image,
        visibility: linkData.visibility,
        status: linkData.status
      }, {new: true}
    );
  }else{
    throw {
      code: 'INVALID_DATA',
      message: 'invalid values for fields provided',
    };
  }

  return links;
}

module.exports = { savelink, findLinks, updateLink, statusEqualsEnable };
