const config = require('../config');
const Link = require('../models/Links');

async function savelink(credentials){
  if (credentials.name == undefined || credentials.title == undefined || credentials.description == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.image == undefined || credentials.detail_result == undefined || credentials.contain_result == undefined) {
    throw new Error( 'Please provide all fields');{code: 'MISSING_FIELDS'}
  }
  else{
    const link = await Link.findOne({name: credentials.name});

    if(link){
      throw new Error( 'There is already a link with that name');{code: 'INVALID_DATA'}
    }
    else{
      if(credentials.visibility == undefined || credentials.status == undefined){
        credentials.visibility = 'visible';
        credentials.status = 'disable';
      }

      const newLink = new Link(credentials);
      if(!['visible', 'hidden'].includes(newLink.visibility)) {
        throw new Error( 'Specified visibility is not valid');{code: 'INVALID_VISIBILITY'}
      }
      else if(!['active', 'disable'].includes(newLink.status)){
        throw new Error( 'Specified status is not valid');{code: 'INVALID_STATUS'}
      }
      await newLink.save();
      return newLink;
    }
  }
}

async function findLinksbyName(linkName){
  const links = await Link.paginate({ $and: [ {name: {$regex: linkName, $options: 'i'}}, {visibility: 'visible'}  ]});

  return links;
}

async function findLink(){
  const links = await Link.findOne({ $and: [ {status: 'active'}, {visibility: 'visible'} ] });

    return links;
}

async function findLinks(){
  const links = await Link.paginate({ $and: [ {visibility: 'visible'}, { $or: [{status: 'active'}, {status: 'disable'}]} ]});
  return links;
}

async function updateLink(linkData){
  if(!['active', 'disable'].includes(linkData.status)){
    throw new Error( 'Specified status is not valid');{code: 'INVALID_STATUS'}
  }
  else if(!['visible', 'hidden'].includes(linkData.visibility)){
    throw new Error( `Specified visibility is not valid for: ${linkData.visibility}`);{code: 'INVALID_VISIBILITY'}
  }

  const linkActive = await Link.findOne({ status: 'active' });
  if(linkData.status == 'active'){
    if(linkActive){
      if(linkActive._id != linkData.id){
        throw new Error( 'There is already a link active');{code: 'INVALID_DATA'}
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

async function deleteLink(req) {
    const linkStatus = {
      status: 'removed',
      visibility: 'hidden',
    };

    const link = await Link.findByIdAndUpdate(
      req.params.id,
      linkStatus,
      {
        new: true,
      },
    );

    return link;
}

module.exports = { savelink, findLinks, updateLink, findLink, findLinksbyName, deleteLink};
