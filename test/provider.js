const { json } = require("body-parser");

function login(dataLogin){
  if(dataLogin.username === undefined){
    return('Please provide a username');
  }
  if(dataLogin.password === undefined){
    return('Please provide a password');
  }
  if(dataLogin.username === "" || dataLogin.password ===  ""){
    return('Thats fields must be completed');
  }
  return 'Login Successfully';
}

function validateLink(dataLink){
  if(dataLink.name === undefined || dataLink.title === undefined || dataLink.description === undefined || dataLink.btn_name === undefined || dataLink.url === undefined || dataLink.detail_result === undefined
    || dataLink.contain_result === undefined|| dataLink.image === undefined || dataLink.visibility === undefined || dataLink.status === undefined){
    return 'Please provide all fields';
  }
  if(dataLink.name === "" || dataLink.title === "" || dataLink.description === "" || dataLink.btn_name === "" || dataLink.url === "" || dataLink.detail_result === ""
    || dataLink.contain_result === "" || dataLink.image === "" || dataLink.visibility === "" || dataLink.status === ""){
    return 'Please complete all fields';
  }
  if(!['active', 'disable'].includes(dataLink.status)){
    return 'Wrong data for status field';
  }
  if(!['visible', 'hidden'].includes(dataLink.visibility)){
    return 'Wrong data for visibility field';
  }
  return 'pass';
}

function updateLink(data, chanceData){
  if(data.id === undefined){
    return 'Please provide an id';
  }
  if(!['active', 'disable'].includes(data.status)){
    return 'Wrong data for status field';
  }
  if(!['visible', 'hidden'].includes(data.visibility)){
    return 'Wrong data for visibility field';
  }
  if(data.id !== chanceData.id){
    return 'Wrong id provider';
  }
  return 'successfully update';
}

function changePassword(data, newPassword){
  if(data.username === undefined || data.password === undefined){
    return 'Please provide all fields';
  }
  if(data.username === "" || data.password === ""){
    return 'This field must be completed';
  }
  if(newPassword === undefined){
    return 'Please provide a new password';
  }
  if(newPassword === ""){
    return 'Please complete a new password';
  }
  return 'Update password successfully';
}

function deleteLink(data){
  if(data.id === undefined){
    return 'Please provide an id';
  }

  return 'Deleted sucessfully link';
}


function createLogo(data){
  if(data.image === undefined || data.image === ""){
    return 'Please provide an image';
  }
  if(!['active', 'disable'].includes(data.status)){
    return 'Wrong data for status field';
  }
  return 'Created sucessfully link';
}


module.exports = { login, createLogo, validateLink, updateLink, deleteLink, changePassword};
