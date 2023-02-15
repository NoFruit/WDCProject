
function getNickname()
{
    //create new AJAX request
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            resStr = this.responseText;
            res = JSON.parse(resStr);
            nickname = res.nickname;
            document.getElementById("nickname").innerText = "Welcome, " + nickname;
        }
    };

    xhttp.open("GET", "/getprofile", true);
    xhttp.send();
}

function getProfile()
{
    //create new AJAX request
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            resStr = this.responseText;
            res = JSON.parse(resStr);
            document.getElementById("nickname").innerText = "Welcome, " + res.nickname;
            document.getElementById("userid").value = res.user_id;
            document.getElementById("usergroup").innerText = res.usergroup;
            document.getElementById("nicknameText").value = res.nickname;
            document.getElementById("E_mail").value = res.E_mail;
        }
    };

    xhttp.open("GET", "/getprofile", true);
    xhttp.send();
}
