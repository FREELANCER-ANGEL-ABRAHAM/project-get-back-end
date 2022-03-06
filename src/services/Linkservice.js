const config = require('../config');
const Link = require('../models/Links');
const Logo = require('../models/Logo');

async function savelink(credentials){
  if (credentials.name == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.detail_result == undefined || credentials.contain_result == undefined) {
    throw new Error( 'Please provide all fields');
  }
  else{
    const link = Link.findOne({ $and: [{name: credentials.name}, {visibility: 'visible'}] });

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
      newLink.save();
      return newLink;
    }
  }
}

async function saveLogo(credentials){
  if(!credentials.image){
    throw new Error( 'Please provide an image');
  }
  if(!credentials.status){
    throw new Error( 'Please provide an status');
  }
  else if(!['active', 'disable'].includes(credentials.status)){
    throw new Error( 'Specified status is not valid' );
  }

  const logo = Logo.findOne({ status: 'active' });
  if(logo){
    updateLogo();
  }
  const newLogo = new Logo(credentials);
  newLogo.save();
  return newLogo;
}



async function findLinksbyName(linkName, page, limit){
  return Link.paginate({ $and: [ {name: {$regex: linkName, $options: 'i'}}, {visibility: 'visible'}  ]}, {page, limit});
}

async function findLink(){
  return Link.findOne({ $and: [ {status: 'active'}, {visibility: 'visible'} ] });
}

async function findLogo(){
  return Logo.findOne({status: 'active'});
}

async function findLinkById(id){
  return Link.findOne({ _id: id});
}

async function findLinks(page){
  return Link.paginate({ $and: [ {visibility: 'visible'}, { $or: [{status: 'active'}, {status: 'disable'}]} ]}, {page, limit: 9, sort: {status: 'asc'}});
}

async function updateLogo(){
  return Logo.updateOne({status: 'active'},{ status: 'disable'});
}
async function updateLink(linkData){
  if(linkData.status && linkData.visibility){
    if(!['active', 'disable'].includes(linkData.status)){
      throw new Error( 'Specified status is not valid' );
    }
    else if(!['visible', 'hidden'].includes(linkData.visibility)){
      throw new Error( `Specified visibility is not valid for: ${linkData.visibility}` );
    }
  }
  else{
    return Link.findByIdAndUpdate(
      linkData.id,
      {
        name: linkData.name,
        title: linkData.title,
        description: linkData.description,
        btn_name: linkData.btn_name,
        url: linkData.url,
        image: linkData.image,
        detail_result: linkData.detail_result,
        contain_result: linkData.contain_result
      },{new: true}
    );
  }

  const linkActive = Link.findOne({ status: 'active' });
  if(linkData.status == 'active'){
    if(linkActive){
      if(linkActive._id != linkData.id){
        throw new Error( 'There is already a link active' );
      }
    }
  }

  return Link.findByIdAndUpdate(
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

  return Link.findByIdAndUpdate(
    req.params.id,
    linkStatus,
    {
      new: true,
    },
  );
}

module.exports = { savelink, findLinks, updateLink, findLink, findLogo, findLinksbyName, deleteLink, findLinkById, saveLogo};
