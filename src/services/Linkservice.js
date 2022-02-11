const config = require('../config');
const Link = require('../models/Links');


const modelName = 'Link';

async function savelink(credentials){
  if (credentials.name == undefined || credentials.title == undefined || credentials.description == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.url == undefined || credentials.image == undefined || credentials.visibility == undefined || credentials.status == undefined || credentials.detail_result == undefined || credentials.contain_result == undefined) {
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

async function findLink(){
  const links = await Link.paginate({ $and: [ {status: 'active'}, {visibility: 'visible'} ] });

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
        status: linkData.status,
        detail_result: linkData.detail_result,
        contain_result: linkData.contain_result
      },{new: true}
    );
    return link;
  }
}

module.exports = { savelink, findLinks, updateLink, findLink };
