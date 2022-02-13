const config = require('../config');
const Link = require('../models/Links');
<<<<<<< HEAD

async function savelink(credentials){
  if (credentials.name == undefined || credentials.title == undefined || credentials.description == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.image == undefined || credentials.detail_result == undefined || credentials.contain_result == undefined) {
=======
const mongoose = require('mongoose');

const modelName = 'Link';

async function savelink(credentials){
  if (credentials.name == undefined || credentials.title == undefined || credentials.description == undefined || credentials.btn_name== undefined || credentials.url == undefined || credentials.url == undefined || credentials.image == undefined) {
>>>>>>> feature/G-2/delete_and_search_links
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
      if(newLink.visibility == undefined || newLink.status == undefined){
        newLink.visibility = 'visible';
        newLink.status = 'disable';
      }
<<<<<<< HEAD
=======
      else{
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
      }
>>>>>>> feature/G-2/delete_and_search_links
      await newLink.save();
      return newLink;
    }
  }
}

<<<<<<< HEAD
async function findLinks(){
  const links = await Link.paginate({ visibility: 'visible'});

  return links;
}

async function findLink(){
  const links = await Link.findOne({ $and: [ {status: 'active'}, {visibility: 'visible'} ] });
=======
async function findLinksbyName(linksName){
    const links = await Link.paginate({ $and: [{ name: new RegExp(linksName, 'i')}, {status: 'active'}] });
>>>>>>> feature/G-2/delete_and_search_links

    return links;
}

async function findLink(){
  const links = await Link.paginate({ $and: [{ status: 'active' }, {visibility: 'visible'}] });
  return links;
}

async function findLinks(){
  const links = await Link.paginate({ visibility: 'visible' });
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
<<<<<<< HEAD

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
=======
  else{
    const verifyStatus = await Link.findOne({status: 'active'});

    if(verifyStatus){
      throw {
        code: 'INVALID_DATA',
        message: 'There is already a link with that status',
      };
    }

    if(linkData.status == 'active'){
      linkData.visibility = 'visible';
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
        status: linkData.status
      },{new: true}
    );
    return link;
>>>>>>> feature/G-2/delete_and_search_links
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

<<<<<<< HEAD
module.exports = { savelink, findLinks, updateLink, findLink };
=======
async function deleteLink(req) {
  if (req.params.id == undefined) {
    throw {
      code: 'NO_ID_PROVIDED',
      message: 'Please provide an ID',
    };
  }

  const linkStatus = { status: 'removed' };

  const link = await Link.findByIdAndUpdate(
    req.params.id,
    linkStatus,
    {
      new: true,
    },
  );

  return link;
}

module.exports = { savelink, findLinks, updateLink, deleteLink, findLinksbyName, findLink };
>>>>>>> feature/G-2/delete_and_search_links
