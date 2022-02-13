const config = require('../config');
const Link = require('../models/Links');

async function savelink(credentials){
  if (credentials.name == undefined || credentials.title == undefined || credentials.description == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.image == undefined || credentials.detail_result == undefined || credentials.contain_result == undefined) {
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
      if(credentials.visibility == undefined || credentials.status == undefined){
        credentials.visibility = 'visible';
        credentials.status = 'disable';
      }

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
      await newLink.save();
      return newLink;
    }
  }
}

async function findLinks(){
  const links = await Link.paginate({ visibility: 'visible'});

  return links;
}

async function findLink(){
  const links = await Link.findOne({ $and: [ {status: 'active'}, {visibility: 'visible'} ] });

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
      code: 'INVALID_VISIBILITY',
      message: `Specified visibility is not valid for: ${linkData.visibility}`,
    };
  }

  const linkActive = await Link.findOne({ status: 'active' });
  if(linkData.status == 'active'){
    if(linkActive){
      if(linkActive._id != linkData.id){
        throw {
          code: 'INVALID_DATA',
          message: 'There is already a link active',
        };
      }
    }
  }

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

module.exports = { savelink, findLinks, updateLink, findLink };
