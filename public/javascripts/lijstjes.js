//Download /lists, update multiselect

function cleanName (filename) {
  return filename.replace('.json', '')
}

function updateLists (target) {
  return $.get('lists/')
}
function rmLijst(name){
  return $.ajax({
    url:'/lists/'+name,
    type:"DELETE"
  })
}

function upload(name,list){
  return $.ajax({
    url:'/lists/'+name,
    type:"POST",
    data:JSON.stringify(list),
    contentType:"application/json; charset=utf-8",
    dataType:"json",
  })
}

function getListContents (lists) {
  if (lists.length === 0) {
    return Promise.reject(new Error('Selecteer een lijstje van de server.'))
  } else {
    return Promise.all(lists.map(x => {
      return $.get('lijstjes/' + x)
    }))
  }
}