 fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
    });

     fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });


    function changeImage() {
      let img = document.getElementById("myImage");
      img.src = img.src.includes("images/icons/menu_icon.png") ? "images/icons/menu-remove-icon.png" : "images/icons/menu_icon.png";
    }
 