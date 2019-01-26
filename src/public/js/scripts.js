/* eslint-disable func-names */
// eslint-disable-next-line func-names

$('#post-comment').hide();
$('#btn-toggle-comment').click(e => {
  e.preventDefault;
  $('#post-comment').slideToggle();
});

$('#btn-like').click(function(e) {
  e.preventDefault();
  const imgId = $(this).data('id');
  $.post(`/images/${imgId}/like`).done(data => {
    $('.likes-count').text(data.likes);
  });
});

$('#btn-delete').click(function(e) {
  e.preventDefault();
  const $this = $(this);
  const response = confirm('Are you sure you want to delete this image ?');
  if (response) {
    const imgId = $this.data('id');
    // Usamos el método ajax porque es una petición delete
    $.ajax({
      url: `/images/${imgId}`,
      type: 'DELETE',
    }).done(result => {
      console.log(result);
      $this.removeClass('btn-danger').addClass('btn-success');
      $this
        .find('i')
        .removeClass('fa-times')
        .addClass('fa-check');
      $this.html('<span>Deleted !</span>');
    });
  }
});
