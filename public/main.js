
const deleteButton = document.querySelector('#deleteBtn');

let id = deleteButton.dataset.id;

deleteButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Är du säker på att du vill ta bort den här medlemmen? Åtgärden kan inte ångras.')) {
    window.location.href =`/member/${id}/delete`;
  } 
});