testvar = ""
$(document).ready(function(){

  api_root = "https://enigmatic-plateau-14785.herokuapp.com/api/"

  // Utility Methods
  function set_token(token) {
    localStorage.setItem('token', token);
  }

  function get_token() {
    return localStorage.getItem('token')
  }

  function log_out(){
    localStorage.removeItem('token')
  }

  function signed_in() {
    localStorage.getItem('token')
    // if(localStorage.getItem('token') === null) {
    //   return false
    // } else {
    //   return true
    // }
  }

  function reset_form(form_id){
    $(form_id)[0].reset()
  }


// URL functions

  function tag_url(tag) {
    return api_root + "notes/tag/"+tag
  }

// display functions
  function note_display(note) {
    return `<div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 panel">
        <div class="media" id="${note.id}">
          <div class="media-left">
          </div>
          <div class="media-body">
            <h4 class="media-heading">${note.title}<a class="text-right noteLink" href="#${note.id}"> by ${note.user? note.user.username : "anonymous"},   ${moment(note.created_at).fromNow()}</a></h4>
            ${note.body}
            <p>${tag_list_display(note.tags)}</p>
          </div>
        </div>
      </div>`
  }

  function tag_list_display(tags) {
    var disp = ""
    tags.forEach(
      tag => {disp +=`<a href="#${tag.name}"><span class="badge tag">${tag.name}</span></a>`}
    )
    return disp
  }

  function create_note_display() {
    return `<h4>Add a note:</h4>
    <form action="#" id="postNote">
      <div class="form-group">
        <input name="title" class="form-control" type="text" placeholder="title"></input>
      </div>
      <div class="form-group">
        <textarea name="body" class="form-control" placeholder="What's up?"></textarea>
      </div>
      <div class="form-group">
        <input name="tags" class="form-control" type="text" placeholder="tag, tag..."></input>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">Notate!</button>
      </div>
    </form>`
  }

  function noteModalDisplay(id) {
    $('#mrModal .modal-body').html($(id).html())
    $('#mrModal').modal('show')
  }

// load functions

  function load_notes(notes) {
    notes.forEach( note => {
      $('#notes').append(
        note_display(note)
      )
    })
  }


  function load_tag_notes(tag) {
    $('div.header h1').html(`NOTEmeister 5000: <p>${tag}</p>`)
    $('#notes').empty()
    fetch(tag_url(tag))
    .then( response => response.json())
    .then( data => {
      load_notes(data.tag.notes)
    })
  }

//listeners

  $(document).on('click', 'span.tag',ev => {
    ev.preventDefault()
    tag = ev.target.textContent
    load_tag_notes(tag)
  })

  // click add a note button
  $('#add').on('click', ev => {
    ev.preventDefault()
    $('#mrModal .modal-body').html(create_note_display())
    $('#mrModal').modal('show')
  })


  // submit create a note form
  $(document).on('submit','#postNote' ,ev => {
     ev.preventDefault()
     $.post(api_root+"notes?token=" + get_token(), $('#postNote').serialize())
      .done( note => {
        $('#notes').prepend(note_display(note.note))
        reset_form('#postNote')
        $('#mrModal').modal('hide')
      })
  })

  //modal of a note
  $(document).on('click', '.noteLink', ev => {
    ev.preventDefault()
    testvar = ev
    noteModalDisplay(ev.target.hash)
  })



//initial load
  fetch(api_root+"notes")
  .then( response => response.json()) //convert from json
  .then( data => {
    load_notes(data.notes)
    if(window.location.hash){
      noteModalDisplay(location.hash)
    }
  })



}) // close of the 'document ready' thing
