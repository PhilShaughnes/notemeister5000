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

// URL functions

  function tag_url(tag) {
    return api_root + "notes/tag/"+tag
  }


// display functions
  function note_display(note) {
    return `<div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 panel btn-default">
        <div class="media">
          <div class="media-left">
          </div>
          <div class="media-body">
            <h4 class="media-heading">${note.title}<a class="text-right"> by ${note.user.username},   ${moment(note.created_at).fromNow()}</a></h4>
            ${note.body}
            <p>${tag_list_display(note.tags)}</p>
          </div>
        </div>
      </div>`
  }

  function tag_list_display(tags) {
    var disp = ""
    tags.forEach(
      tag => {disp +=`<a href=""><span class="badge tag">${tag.name}</span></a>`}
    )
    return disp
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

//initial load
  fetch(api_root+"notes")
  .then( response => response.json()) //convert from json
  .then( data => {
    load_notes(data.notes)
    })



}) // close of the 'document ready' thing
