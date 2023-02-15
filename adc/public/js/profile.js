function posts1() {
    var b = document.getElementsByClassName('csa')[0].value;
    var v = document.getElementsByClassName('add')[0].value;
    var cdiv = document.createElement('p')
    cdiv.innerHTML = b;
    document.getElementById("adds").appendChild(cdiv);
    var adiv = document.createElement('p')
    adiv.innerHTML = v;
    document.getElementById("adds").appendChild(adiv);
}