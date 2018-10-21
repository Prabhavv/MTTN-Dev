$(document).ready(function(){
  $('.delete-message').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/messages/'+id,
      success: function(response){
        alert ('Message Deleted');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
