const config = require('../config');
const Link = require('../models/Links');
const Logo = require('../models/Logo');

function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

async function savelink(credentials){
  if (credentials.name == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.detail_result == undefined || credentials.contain_result == undefined || credentials.count_click == undefined) {
    throw new Error( 'Please provide all fields');
  }
  else{
    const name = credentials.name.toString();
    if(name.length > 52){
      throw new Error( 'Max length name is 52 character' );
    }

    if(!isValidURL(credentials.url)){
      throw new Error( 'The url provider is not a correct url' );
    }

    const link = await Link.findOne({ $and: [{name: credentials.name}, {visibility: 'visible'}] }).then();
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

  const logo = await Logo.findOne({ status: 'active' }).then();
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

async function updateClickLink(linkData){
  if(linkData.count_click === "" || linkData.count_click === undefined){
    throw new Error( 'Please provide a data count link' );
  }
  return Link.findByIdAndUpdate(
    linkData.id,
    {
      count_click: linkData.count_click
    }, {new: true}
  );

}

async function updateActive_AtkLink(linkData){
  if(linkData.active_at === undefined){
    throw new Error( 'Please provide a data active at link' );
  }
  return Link.findByIdAndUpdate(
    linkData.id,
    {
      active_at: linkData.active_at
    }, {new: true}
  );

}

async function updateLink(linkData){
  if(linkData.name){
    const name = linkData.name.toString();
    if(name.length > 52){
      throw new Error( 'Max length name is 52 character' );
    }
  }
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

module.exports = { savelink, updateActive_AtkLink, findLinks, updateLink, findLink, findLogo, findLinksbyName, deleteLink, findLinkById, saveLogo, updateClickLink};
