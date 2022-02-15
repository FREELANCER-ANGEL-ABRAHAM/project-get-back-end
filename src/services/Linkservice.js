const config = require('../config');
const Link = require('../models/Links');

async function savelink(credentials){
  if (credentials.name == undefined || credentials.title == undefined || credentials.description == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.image == undefined || credentials.detail_result == undefined || credentials.contain_result == undefined) {
    throw new Error( 'Please provide all fields');
  }
  else{
    const link = await Link.findOne({name: credentials.name});

    if(link){
      throw new Error( 'There is already a link with that name' );
    }
    else{
      if(credentials.visibility == undefined || credentials.status == undefined){
        credentials.visibility = 'visible';
        credentials.status = 'disable';
      }

      const newLink = new Link(credentials);
      if(!['visible', 'hidden'].includes(newLink.visibility)) {
        throw new Error( 'Specified visibility is not valid' );
      }
      else if(!['active', 'disable'].includes(newLink.status)){
        throw new Error( 'Specified status is not valid' );
      }
      await newLink.save();
      return newLink;
    }
  }
}

async function findLinksbyName(linkName){
  return await Link.paginate({ $and: [ {name: {$regex: linkName, $options: 'i'}}, {visibility: 'visible'}  ]});
}

async function findLink(){
  return await Link.findOne({ $and: [ {status: 'active'}, {visibility: 'visible'} ] });
}

async function findLinks(){
  return await Link.paginate({ $and: [ {visibility: 'visible'}, { $or: [{status: 'active'}, {status: 'disable'}]} ]});
}

async function updateLink(linkData){
  if(!['active', 'disable'].includes(linkData.status)){
    throw new Error( 'Specified status is not valid' );
  }
  else if(!['visible', 'hidden'].includes(linkData.visibility)){
    throw new Error( `Specified visibility is not valid for: ${linkData.visibility}` );
  }

  const linkActive = await Link.findOne({ status: 'active' });
  if(linkData.status == 'active'){
    if(linkActive){
      if(linkActive._id != linkData.id){
        throw new Error( 'There is already a link active' );
      }
    }
  }

  return await Link.findByIdAndUpdate(
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

}

async function deleteLink(req) {
    const linkStatus = {
      status: 'removed',
      visibility: 'hidden',
    };

    return await Link.findByIdAndUpdate(
      req.params.id,
      linkStatus,
      {
        new: true,
      },
    );
}

module.exports = { savelink, findLinks, updateLink, findLink, findLinksbyName, deleteLink};
